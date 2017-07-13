'use strict';
angular.module('basic')
  .controller('DataAppCtrl',['createModel','$rootScope','$scope','$filter','dataFactory', 'appList',
    (createModel, $rootScope, $scope, $filter, dataFactory,appList) => {
    $scope.projectType=['web_common_data_app_02', 'web_common_data_app_03', 'web_common_data_app_04'];
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
    //dataFactory.getAppList().success(handleSuccess);
      appList.get({}, function (res) {
        console.log('appList',res);
        handleSuccess(res);

      });
    $scope.newApp = function () {
      createModel.open({'title': 'web_common_data_app_layer_01', 'content':'web_common_data_app_layer_02'}, 'appInfo');
    };
  }]);
