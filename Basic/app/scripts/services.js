/**
 * Created by JiYi on 17/7/5.
 */
'use strict';
angular.module('basic.services', ['ui.bootstrap'])
  .service('createModel', ['$uibModal', function ($uibModal) {
    this.open = function (obj,idx) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/layer/createModel.html',
        size: 'size',
        controller: ['$cookies', '$scope', '$filter', '$uibModalInstance', '$http',
          function ($cookies, $scope, $filter, $uibModalInstance, $http) {
            $scope.title = $filter('translate')(obj.title);
            $scope.content = $filter('translate')(obj.content);
            $scope.url = idx;
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
            $scope.resultPreview = resultPreview;
            $scope.save = function () {
              $http.get('/api/jupyter/save').success(function (data) {
                let date = new Date();
                let savaData = {
                  MODEL_NAME: $location.path().split(/[\s/]+/).pop(),
                  MODEL_INFO: data.modelInfo,
                  USER_ID: $cookies.get("username"),
                  TYPE_MENU_ID: "01",
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
  .service('createApp', ['$uibModal', function ($uibModal) {
    this.open = function (obj,pic,idx) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/layer/createApp.html',
        size: 'size',
        controller: ['$scope', '$uibModalInstance', '$filter', '$state', '$location',
          function ($scope, $uibModalInstance, $filter, $state, $location) {
            $scope.items = [
              {img:'pic1',content:'modelType_01',url:'data',name:'data'},
              {img:'pic2',content:'modelType_02',url:'t1',name:'data2'},
              {img:'pic3',content:'modelType_03',url:'t2',name:'data3'},
              {img:'pic4',content:'modelType_04',url:'t3',name:'data4'},
              {img:'pic5',content:'modelType_05',url:'t4',name:'data5'},
              {img:'pic6',content:'modelType_06',url:'notebook',name:'notebook'}
            ]
            $scope.urlcontent = $scope.items[0];
            $scope.cancel = function () {
              $uibModalInstance.dismiss();
            }
            $scope.changeStyle = function(idx){
              $scope.urlcontent = $scope.items[idx];
              console.log('312312',$scope.urlcontent);
            }
            $scope.create = function () {
              $uibModalInstance.dismiss();
              $location.path("/"+$scope.urlcontent.url+'/new/'+$scope.urlcontent.name);
            }
          }]
      }).result;
    };
  }])
