'use strict';
angular.module('basic')
  .controller('AppFileCtrl', ['appService','deletePage', 'openNotebook', 'createAppModel', '$location', '$scope', '$window', '$http',
    (appService, deletePage, openNotebook, createAppModel, $location, $scope, $window, $http) => {
      $scope.appName = $location.path().split(/[\s/]+/).pop();
      $scope.files = {};

      $scope.allFiles = [];
      $scope.init = function () {
        appService.fetchApp($scope.appName).then( app => {
        $scope.allFiles =   app.FILES.NOTEBOOKS;
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
      $scope.delModel = item => {
        deletePage.open(item);
      };
      $scope.openProject = item => {
        $location.path('app/expert/view/' + item.MODEL_NAME).search({type: 'app', appName: item.APP_ID});
      };
      $scope.delete = () => {
        deletePage.open();
      };
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
      templateUrl: 'views/dataApp/appModel/appFile.html'
    };
  });
