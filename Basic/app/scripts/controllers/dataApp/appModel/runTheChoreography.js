
"use strict";
angular.module('basic')
  .controller('ChoreographyCtrl',['$rootScope','$scope',
  ($rootScope, $scope) => {

  }])
  .directive('choreography', () => {
    return {
      templateUrl: 'views/dataApp/appModel/runTheChoreography.html'
    };
  })

