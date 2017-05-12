"use strict";
angular.module('basic')
  .controller('SettingsCtrl',['$rootScope', '$scope','$http', function ($rootScope, $scope, $http) {   
    $scope.msg = "SettingsCtrl";
    $http.get('/api/getsmth').success(function(data){
      $scope.msg = data.msg;
      console.log("$scope.msg:", data);
    });
  }]);