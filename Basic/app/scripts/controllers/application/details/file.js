'use strict';
angular.module('basic')
  .controller('AppFileCtrl', ['$rootScope','appService','deleteFile', 'openNotebook', 'createAppModel', '$location', '$scope', '$window', '$http',
    ($rootScope,appService, deleteFile, openNotebook, createAppModel, $location, $scope, $window, $http) => {
      $rootScope.showTitle = true;
      $scope.appName = $location.path().split(/[\s/]+/).pop();
      $scope.files = {};
      $scope.allFiles = [];
      $scope.init = function () {
        appService.fetchApp($scope.appName).then( app => {
        $scope.allFiles = app.FILES.NOTEBOOKS;
        $scope.appId = app.APP_ID;
        });
      };
      $scope.init();

      $scope.createFile = () => {
        $http.get('/api/user/server',
          {params:{app: $scope.appId}})
          .success(function(data) {
            $window.open(data);
          });
      };

      $scope.createModel = appName => {
        createAppModel.open(appName).then((model) => {
          console.log('model in AppFile: ', model.appName, model.type, model.modelName);
          $http.post('/api/app/' + $scope.appId + '/files', {
            template: model.type,
            name: model.modelName
           })
            .success(function(data) {
              if (data.msg === 'success') {
                $scope.openInNotebook({name: data.result});
              }
            })
            .catch(err => {
              console.log('error', err);
            });
        });
      };

      $scope.delModel = item => {
        deleteFile.open({app:$scope.appId, file:item.name});
      };
      $scope.openProject = item => {
        $location.path('app/expert/view/' + item.MODEL_NAME).search({type: 'app', appName: item.APP_ID});
      };
      // $scope.delete = () => {
      //   deletePage.open();
      // };
      $scope.openInNotebook = (item) => {
        $http.get('/api/user/server',
          {params:{app: $scope.appId, file: item.name}})
          .success(function(data) {
          $window.open(data);
        });

      };
    }])
  .directive('file', () => {
    return {
      templateUrl: 'views/application/details/file.html'
    };
  });
