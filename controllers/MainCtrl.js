var myApp = angular.module('bugtracker');

	myApp.controller('MainCtrl', ['$scope', '$filter', 'bugstorage',  '$timeout', function ($scope, $filter, store, $timeout) {
		'use strict';

	    $scope.showModal = false;
	    $scope.showSlideUpModal = false;
	    $scope.editable = false;
	    $scope.showUndoAlert=false; 

	    var bugs ='';
	    $scope.canShow = false;
	 	store.get().then(function(bugs){
	 		 bugs = bugs;
	 		 $scope.bugs = bugs;
	 		 $scope.canShow = true;
		});


	 		$scope.totalNumber = store._getBugsFromLocalStorage();
	 		console.log($scope.totalNumber);
	 		store.totalNumber = parseInt($scope.totalNumber);

		$scope.newBug = {};
		$scope.emptyObj = {};
		$scope.editedBug = null;
		$scope.movesStack = [];
		$scope.submitButtonLabel ="Want To Edit?";
		$scope.originalBug={}


		$scope.$watch('editable', function (value) {
			 if(value){
			 	$scope.submitButtonLabel = "Save Edits";
			 }else{
			 	$scope.submitButtonLabel = "Want To Edit?";
			 }
		}, true);

		$scope.$watch('store.bugs', function () {
			$scope.bugs = store.bugs;
		}, true);

	   	$scope.toggleModal = function(){

	        $scope.showModal = !$scope.showModal;
	    };

	    $scope.undoMove = function(){
	    	if(!$scope.movesStack.pop()){
	         	$scope.showUndoAlert=false; 
	         	$timeout(function () { $scope.showUndoAlert = true; }, 3000);
         	}else{
         		var lastMove = $scope.movesStack.pop();
         		
         	}
	    };

	    $scope.backlogFilter = function (item) { 
    		return item.status === "backlog";
		};

		$scope.progressFilter = function (item) { 
    		return item.status === 'progress';
		};

		$scope.qaFilter = function (item) { 
    		return item.status === 'qa';
		};
		$scope.completeFilter = function (item) { 
    		return item.status === 'complete';
		};

		$scope.addBug = function (newBug) {

			$scope.newBug = angular.copy(newBug);
			$scope.newBug.status = "backlog";
			$scope.newBug.id = (parseInt($scope.totalNumber)+ 1);
			console.log($scope.totalNumber);
			var nBug = $scope.newBug;

			if (!nBug.bugtitle) {
				return;
			}
			var total = parseInt($scope.totalNumber) + 1;

			$scope.saving = true;
			store.insert(nBug, total)
				.then(function success() {
					$scope.newBug = angular.copy($scope.emptyObj);
					$scope.showModal = false;
					$scope.bugs = store.bugs;
					$scope.totalNumber = store.totalNumber;
				})
				.finally(function () {
					$scope.saving = false;
				});

		};


		$scope.editBug = function (bug) {

			$scope.selectedBug = angular.extend({}, bug);
			$scope.originalBug = angular.copy($scope.selectedBug);
			$scope.showSlideUpModal = true;
			$scope.editable = true;
		};

		$scope.showBug = function (bug) {
			$scope.selectedBug= angular.extend({}, bug);
			$scope.originalBug = angular.copy($scope.selectedBug);
			$scope.showSlideUpModal = true;
			$scope.editable = false;
		};


		$scope.saveEdits = function (bug) {
			console.log(bug);
			console.log($scope.originalBug);
			if(!$scope.editable){
				$scope.editable = true;
			}else{
			if (bug.bugtitle.length==0 || bug.bugtitle === $scope.originalBug.bugtitle && bug.descr === $scope.originalBug.descr ) {
				$scope.selectedBug = angular.copy($scope.emptyObj);
				$scope.showSlideUpModal = false;
				return;
			}
			var index = $scope.bugs.map(function(e) { return e.id; }).indexOf($scope.originalBug.id);
		
			store.put(bug, index )
				.then(function success() {
					$scope.showSlideUpModal = false;
					$scope.bugs = store.bugs;
					console.log($scope.bugs);
				}, function error() {})
				.finally(function () {
					$scope.selectedBug = null;
					$scope.originalBug = null;
					$scope.editable = false;
				});
			}
		};

		// $scope.revertEdits = function (bug) {
		// 	bugs[bugs.indexOf(bug)] = $scope.originalBug;
		// 	$scope.editedBug = null;
		// 	$scope.originalBug = null;
		// 	$scope.reverted = true;
		// };

		$scope.removeBug = function (bug) {
			store.delete(bug);
			$scope.bugs = store.bugs;
		};


		$scope.saveBug = function (bug) {
			store.put(bug);
		};

	
		$scope.clearAll = function () {
			store.clearAll();
		};

	
		$scope.onDropBacklog=function(data,evt){
			console.log("here");
            var index = $scope.bugs.indexOf(data);
            if (index > -1 && $scope.bugs[index].status!="backlog"){
            	$scope.movesStack.push({data:data, from_to: $scope.bugs[index].status+ "_backlog"});
            	$scope.bugs[index].status = "backlog";
            	var newbugs = $scope.bugs;
            	$scope.saveBug(newbugs);
            	
            }
        };
        
        // $scope.onDragProgress=function(data,evt){
        //     var index = $scope.droppedObjects2.indexOf(data);
        //     if (index > -1) {
        //         $scope.droppedObjects2.splice(index, 1);
        //     }
        // };
        $scope.onDropProgress=function(data,evt){
             var index = $scope.bugs.indexOf(data);
             if (index > -1 && $scope.bugs[index].status!="progress"){
             	$scope.movesStack.push({data:data, from_to: $scope.bugs[index].status+ "_progress"});
            	$scope.bugs[index].status = "progress";
            	var newbugs = $scope.bugs;
            	$scope.saveBug(newbugs);
            	
            }
        };
        $scope.onDropQA=function(data,evt){
            var index = $scope.bugs.indexOf(data);
            if (index > -1 && $scope.bugs[index].status!="qa"){
            	$scope.movesStack.push({data:data, from_to: $scope.bugs[index].status+ "_qa"});
            	$scope.bugs[index].status = "qa";
            	var newbugs = $scope.bugs;
            	$scope.saveBug(newbugs);
            	
            }
        };
        // $scope.onDragQA=function(data,evt){
        //     console.log("133","$scope","onDragSuccess1", "", evt);
        //     var index = $scope.droppedObjects1.indexOf(data);
        //     if (index > -1) {
        //         $scope.droppedObjects1.splice(index, 1);
        //     }
        // }
        // $scope.onDragComplete=function(data,evt){
        //     var index = $scope.droppedObjects2.indexOf(data);
        //     if (index > -1) {
        //         $scope.droppedObjects2.splice(index, 1);
        //     }
        // }
        $scope.onDropComplete=function(data,evt){
             var index = $scope.bugs.indexOf(data);
            if (index > -1 && $scope.bugs[index].status!="complete"){
            	$scope.movesStack.push({data:data, from_to: $scope.bugs[index].status + "_complete"});
            	$scope.bugs[index].status = "complete";
            	var newbugs = $scope.bugs;
            	$scope.saveBug(newbugs);

            };
          }

      

	}]);
