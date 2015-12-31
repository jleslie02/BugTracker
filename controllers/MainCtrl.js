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
	    	var lastMove = $scope.movesStack.pop(); 
	    	if(!lastMove){
	         	$scope.showUndoAlert=true; 
	         	$scope.notificationType = "warning-alert";
	         	$scope.notificationMessage = "Nothing To Undo";
	         	$timeout(function () { $scope.showUndoAlert = false; $scope.notificationType = ""; $scope.notificationMessage = ""; }, 3000);
         	}else{
         		
         		var data = lastMove.data;
         		var newStatus = lastMove.from_to.substring(0, lastMove.from_to.indexOf("_"));
         		data.status = newStatus;
         		var index = $scope.bugs.map(function(e) { return e.id; }).indexOf(data.id);
            	$scope.saveBug(data, index);
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

		$scope.removeBug = function (bug) {
			store.delete(bug);
			$scope.bugs = store.bugs;
		};


		$scope.saveBug = function (bug, index) {
			store.put(bug, index);
			$scope.bugs = store.bugs;

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
            	var newbugs = $scope.bugs[index];
            	$scope.saveBug(newbugs, index);
            	
            }
        };
       
        $scope.onDropProgress=function(data,evt){
             var index = $scope.bugs.indexOf(data);
             if (index > -1 && $scope.bugs[index].status!="progress"){
             	$scope.movesStack.push({data:data, from_to: $scope.bugs[index].status+ "_progress"});
            	$scope.bugs[index].status = "progress";
            	var newbugs = $scope.bugs[index];
            	$scope.saveBug(newbugs, index);
            	
            }
        };
        $scope.onDropQA=function(data,evt){
            var index = $scope.bugs.indexOf(data);
            if (index > -1 && $scope.bugs[index].status!="qa"){
            	$scope.movesStack.push({data:data, from_to: $scope.bugs[index].status+ "_qa"});
            	$scope.bugs[index].status = "qa";
            	var newbugs = $scope.bugs[index];
            	$scope.saveBug(newbugs, index);
            	
            }
        };

        $scope.onDropComplete=function(data,evt){
             var index = $scope.bugs.indexOf(data);
            if (index > -1 && $scope.bugs[index].status!="complete"){
            	$scope.movesStack.push({data:data, from_to: $scope.bugs[index].status + "_complete"});
            	$scope.bugs[index].status = "complete";
            	var newbugs = $scope.bugs[index];
            	$scope.saveBug(newbugs, index);

            };
          }

      

	}]);
