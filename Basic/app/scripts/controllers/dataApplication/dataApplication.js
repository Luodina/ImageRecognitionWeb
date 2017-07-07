/**
 * Created by JiYi on 17/6/21.
 */
'use strict';
angular.module('basic')
  .controller('DataApplicationCtrl',['createModel','$rootScope','$scope','$filter','$http','$timeout', 'dataFactory', function (createModel, $rootScope, $scope, $filter, $http, $timeout, dataFactory) {
    $scope.msg = $filter('translate')('web_common_data_explore_002');
    $scope.projectType=['web_common_data_application_02', 'web_common_data_application_03', 'web_common_data_application_04'];
    $scope.listAllApp=[[]];
    var handleSuccess = function(data, status) {
      let listAllApp  = data.app;
      console.log("$scope.listAllApp", data.app);
      if (listAllApp !== null && listAllApp !== undefined ){

        listAllApp.forEach(function(app) {
          if (app.USER_NAME !== null && app.USER_NAME !== undefined ){
            app.mode = 'view';
            if (app.USER_NAME === $rootScope.getUsername()){
              app.mode = 'update';
              $scope.listAllApp[0].push(app);             
            };
            if ($scope.listAllApp[1]===undefined){
              $scope.listAllApp[1]=[];
            } 
            $scope.listAllApp[1].push(app);
          }
        }, this);
        console.log("$scope.listAllApp", $scope.listAllApp)
      }
    };
    dataFactory.getAppList().success(handleSuccess);
    $scope.newProject = function () {
      createModel.open({'title': 'web_common_data_application_layer_01', 'con':'web_common_data_application_layer_02'}, 'applicationInfomation');
    };
  }]);
