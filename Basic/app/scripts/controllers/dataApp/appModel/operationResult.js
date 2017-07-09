
"use strict";
angular.module('basic')
  .controller('ResultCtrl',['$rootScope','$filter','$scope',
  ($rootScope,$filter, $scope) => {

  }])
  .directive('result', () => {
    return {
      templateUrl: 'views/dataApp/appModel/operationResult.html'
    };
  })
