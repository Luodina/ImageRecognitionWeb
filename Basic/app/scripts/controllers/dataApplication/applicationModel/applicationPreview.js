/**
 * Created by JiYi on 17/6/20.
 */
"use strict";
angular.module('basic')
  .controller('PreviewCtrl',['$rootScope','$sce','$filter', '$scope','$http','Upload', 'Notification', '$timeout',
    function ($rootScope, $sce, $filter, $scope, $http, Upload, Notification, $timeout) {
      $scope.isShow = true;
      $scope.isError = true;
      $scope.isWaring = false;
      $scope.change = function () {
        $scope.isShow = !$scope.isShow;
        $scope.isError = !$scope.isError;
        $scope.isWaring = !$scope.isWaring;
      }
      $scope.save = function () {
        $scope.isShow = !$scope.isShow;
        $scope.isError = !$scope.isError;
        $scope.isWaring = !$scope.isWaring;
      }



    }])
  .directive('preview', function() {
    return {
      templateUrl: 'views/dataApplication/applicationModel/applicationPreview.html'
    }})


