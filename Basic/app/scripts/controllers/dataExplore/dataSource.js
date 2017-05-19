/**
 * Controller
 */
"use strict";
angular.module('basic')
  .controller('DataSourceCtrl',['$rootScope','$filter', '$scope','$http','Upload', 'Notification', '$timeout',
    function ($rootScope, $filter, $scope, $http, Upload, Notification, $timeout) {
    $scope.name = $filter('translate')('web_common_data_explore_001');
    $scope.upload = function(){
      if($scope.file !== undefined && $scope.file !== "") {
        $scope.uploadFile($scope.file);
      }
    };
    $scope.uploadFile = function (file) {
      Upload.upload({
        url:'/api/file/upload',
        data: {file: file, username: 'py'}
      }).then(function (data) {
          $timeout(function(){
            $scope.fileName = data.data.fileName;
            Notification.success($filter('translate')('web_common_explore_013'));
          }, 1000);
        }, function (err) {
           console.log(err);
        });
    };
    $scope.run = function(){
      if($scope.file!== undefined && $scope.file !== "") {
        $scope.runFile($scope.fileName);
      }
    };
    $scope.runFile = function(fileName){
        $http.get('/api/jupyter/'+fileName).success(function(data){
          $scope.result = data.result.content.text;
        });
    };
  }]);

