
"use strict";
angular.module('basic')
  .controller('ChoreographyCtrl',['$rootScope','$scope','addArrange',
  ($rootScope, $scope,addArrange) => {
    $scope.openAddArrange = () => {
      addArrange.open()
    }
  }])
  .directive('choreography', () => {
    return {
      templateUrl: 'views/dataApp/appModel/runTheChoreography.html'
    };
  })

