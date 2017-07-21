
"use strict";
angular.module('basic')
  .controller('ResultCtrl',['$rootScope','$filter','$scope',
  ($rootScope,$filter, $scope) => {
    $scope.projectType=['web_common_data_app_result_00', 'web_common_data_app_result_01'];

  }])
  .directive('result', () => {
    return {
      templateUrl: 'views/dataApp/appModel/operationResult.html'
    };
  })
