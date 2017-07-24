
"use strict";
angular.module('basic')
  .controller('ResultCtrl',['appOperResult','$rootScope','$filter','$scope',
  (appOperResult,$rootScope,$filter, $scope) => {
    $scope.projectType=['web_common_data_app_result_00', 'web_common_data_app_result_01'];
    $scope.view =() => {
      appOperResult.open()
    }

  }])
  .directive('result', () => {
    return {
      templateUrl: 'views/dataApp/appModel/operationResult.html'
    };
  })
