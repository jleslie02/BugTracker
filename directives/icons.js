var myApp = angular.module('bugtracker');

  myApp.directive('icons', function () {
    return {
      restrict: 'E',
      scope: { 
        currentbug: '=bug',
        showCurrentBug: '&onShow',
        editCurrentBug: '&onEdit',
        removeCurrentBug: '&onDelete'
       },
      
       template: '<div class="icons">'+
                      '<div class ="icon-bug view-bug" ng-click="showCurrentBug(currentbug)"></div>'+
                      '<div class ="icon-bug edit-bug" ng-click="editCurrentBug(currentbug)"></div>'+
                      '<div class ="icon-bug delete-bug" ng-click="removeCurrentBug()"></div>'+
                  '</div>',

      transclude: false,
      replace:true,
      link: function postLink(scope, element, attrs) {}
    }
  });