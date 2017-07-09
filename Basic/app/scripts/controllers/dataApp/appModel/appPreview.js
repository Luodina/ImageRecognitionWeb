
"use strict";
angular.module('basic')
  .controller('PreviewCtrl',['$rootScope','$filter', '$scope',
  ($rootScope, $filter, $scope) => {
      $scope.isShow = true;
      $scope.isError = true;
      $scope.isWaring = false;
      $scope.change = () => {
        $scope.isShow = !$scope.isShow;
        $scope.isError = !$scope.isError;
        $scope.isWaring = !$scope.isWaring;
      }
      $scope.save = () => {
        $scope.isShow = !$scope.isShow;
        $scope.isError = !$scope.isError;
        $scope.isWaring = !$scope.isWaring;
      }
    }
  ])
  .directive('preview', () => {
    return {
      templateUrl: 'views/dataApp/appModel/applicationPreview.html'
    };
  })


