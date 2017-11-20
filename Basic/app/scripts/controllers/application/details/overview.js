'use strict';
angular.module('basic')
  .controller('AppOverviewCtrl', ['$rootScope', '$location', '$scope', '$http', ($rootScope, $location, $scope, $http) => {
    $rootScope.showTitle = true;
    $scope.appName = $location.path().split(/[\s/]+/).pop();
    $scope.markdown = '';
    $scope.init = () => {
      $http.get('/api/app/' + $scope.appName + '/files', {params: {path: 'README.md'}})
        .success((data) => {
          console.log('OVERVIEW');
          // console.log(data);
          $scope.isShow = true;
          $scope.isError = true;
          $scope.isWaring = false;
          $scope.markdown = data;
        })
        .catch(err => {
          console.log('err', err);
        });
    };

    $scope.init();
    $scope.change = () => {
      $scope.isShow = !$scope.isShow;
      $scope.isError = !$scope.isError;
      $scope.isWaring = !$scope.isWaring;
    };

    $scope.save = () => {
      $scope.isShow = !$scope.isShow;
      $scope.isError = !$scope.isError;
      $scope.isWaring = !$scope.isWaring;
    };
  }
  ])
  .directive('preview', () => {
    return {
      templateUrl: 'views/application/details/overview.html'
    };
  });


