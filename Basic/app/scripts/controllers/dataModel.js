'use strict';

/**
 * Controller of the dataModel
 */
angular.module('basic')
  .controller('DataModelCtrl',['$rootScope', '$scope','$http', function ($rootScope, $scope, $http) {
    $rootScope.tab = "dataModel";
    $scope.msg = "Hello";
    $http.get('/api/jupyter').success(function(data){
      $scope.msg = data;
      console.log("DataModelCtrl data:", data);
    });

  }]);
