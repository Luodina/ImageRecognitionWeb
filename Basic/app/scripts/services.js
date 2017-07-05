/**
 * Created by JiYi on 17/7/5.
 */
'use strict';
angular.module('basic.services', ['ui.bootstrap'])
  .service('createModel', ['$uibModal', function ($uibModal) {
    this.open = function (tit, cont) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/layer/createModel.html',
        size: 'size',
        controller: ['$cookies', '$scope', '$filter', '$uibModalInstance', '$http',
          function ($cookies, $scope, $filter, $uibModalInstance, $http) {
            $scope.tit = $filter('translate')('web_common_data_explore_019');
            $scope.cont = $filter('translate')('web_common_data_explore_020');
            $scope.create = $filter('translate')('web_common_015');
            $scope.userName = $cookies.get("username");
            $scope.go = function () {
              //if($scope.model.name !== undefined) {
              // $http.post('/api/model/newModel', {
              //   modelName:$scope.model.name,
              //   userName: $scope.userName,
              //   viewOrCode: "01",
              //   menuID: "02_",
              // }).success(function(data){
              //     console.log("DataProcessingCtrl save:", data.msg);
              // });
              //};
              $uibModalInstance.dismiss();
            };
            $scope.cancel = function () {
              $uibModalInstance.dismiss();
            }
          }]
      }).result;
    };
  }])
  .service('openPreview', ['$uibModal', '$http', function ($uibModal, $http) {
    this.open = function (resultPreview) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/layer/savePreview.html',
        size: 'size',
        //controllerUrl: 'scripts/layer/savePreview.js',
        controller: ['$scope', '$filter', '$uibModalInstance', '$location', '$cookies',
          function ($scope, $filter, $uibModalInstance, $location, $cookies) {
            $scope.preTil = $filter('translate')('web_common_017');
            $scope.savebtn = $filter('translate')('web_common_018');
            $scope.resultPreview = resultPreview;

            $scope.save = function () {
              $http.get('/api/jupyter/save').success(function (data) {

                let date = new Date();
                let savaData = {
                  MODEL_NAME: $location.path().split(/[\s/]+/).pop(),
                  MODEL_INFO: data.modelInfo,
                  USER_ID: $cookies.get("username"),
                  VIEW_MENU_ID: "01",
                  UPDATED_TIME: date.getTime(),
                  FILE_PATH: data.dataFileName,
                  NOTEBOOK_PATH: data.notebookPath,
                  COMMENT: 'Lets try it!',
                }
                console.log("Data to DB savaData:", savaData);
                $http.post('/api/model/new', savaData).success(function (data) {
                  console.log("DataProcessingCtrl save:", data.msg);
                });
                $location.path("/explore");
              });
              $uibModalInstance.dismiss();
            };
            $scope.cancel = function () {
              $uibModalInstance.dismiss();
            };
          }]
      }).result;
    };
  }])
  .service('createApplication', ['$uibModal', function ($uibModal) {
    this.open = function () {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/layer/dataApplication.html',
        // size: 'size',
        controller: ['$scope', '$uibModalInstance', '$filter', '$state', '$location',
          function ($scope, $uibModalInstance, $filter, $state, $location) {
            $scope.applicationTitle = $filter('translate')('web_common_data_application_layer_01');
            $scope.applicationName = $filter('translate')('web_common_data_application_layer_02');
            $scope.btnNew = $filter('translate')('web_common_015');
            $scope.cancel = function () {
              $uibModalInstance.dismiss();
            }
            $scope.create = function () {
              $uibModalInstance.dismiss();
              // $state.go('/dataAppllication');
              $location.path("/applicationInfo");
              // $location.path("/previewPage");
            }
          }]
      }).result;
    };
  }])
