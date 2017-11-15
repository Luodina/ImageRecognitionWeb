'use strict';

angular.module('basic')
  .controller('AppDataCtrl',['$rootScope','appService', '$location','$scope','$http',
  ($rootScope,appService, $location, $scope,$http) => {
    $rootScope.showTitle = true;
    $scope.appName = $location.path().split(/[\s/]+/).pop();
    $scope.DATA_TYPES={'RAW': '原始数据', 'PROCESSED': '处理后数据', 'MODEL_DATA':'建模数据' };

    $scope.appData = null;
    $scope.init = function () {
      appService.fetchApp($scope.appName).then( app => {
        $scope.appData =   app.FILES.DATA;

      });
    };
    $scope.init();

    $scope.preview =(type, item) => {
      //TODO 实现数据预览的功能
      $http.get('/api/app/' + $scope.appName + '/files', {
        params:{'path': 'data/'+ type.toLowerCase() + '/'  + item }
      }).success(function (data) {
        // console.log(data);
        $scope.previewData = data;
      });
    };
  }])
  .directive('result', () => {
    return {
      templateUrl: 'views/application/details/data.html'
    };
  });
