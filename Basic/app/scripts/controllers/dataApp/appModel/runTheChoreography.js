
"use strict";
angular.module('basic')
  .controller('ChoreographyCtrl',['$rootScope','$scope','createArrange',
  ($rootScope, $scope,createArrange) => {
    $scope.openAddArrange = () => {
      createArrange.open()
    }
  }])
  .directive('choreography', () => {
    return {
      templateUrl: 'views/dataApp/appModel/runTheChoreography.html'
    };
  })

