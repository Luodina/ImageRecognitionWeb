/**
 * Controller
 */
'use strict';
angular.module('basic')
  .controller('DataSourceCtrl',['$rootScope', '$scope','$http', function ($rootScope, $scope, $http) {
    $scope.msg = "DataSourceCtrl";
    $scope.names = {name1:"111"}
  }]);
