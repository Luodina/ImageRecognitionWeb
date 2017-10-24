'use strict';
angular.module('basic')
  .controller('PreviewCtrl', ['$location', '$scope', '$http', ($location, $scope, $http) => {
    $scope.appName = $location.path().split(/[\s/]+/).pop();
    $scope.markdown = '';

    $scope.init = () => {
      $http.get('/api/app/' + $scope.appName + '/files', {params:  {path: 'README.md'}})
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
      templateUrl: 'views/dataApp/appModel/overview.html'
    };
  });


