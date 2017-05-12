/**
 * Controller
 */

"use strict";

angular.module('basic')
  .controller('DataProcessingCtrl',['$rootScope', '$scope','$http', function ($rootScope, $scope, $http) {

    $scope.msg = "DataProcessingCtrl";

    
    $http.get('/api/jupyter').success(function(data){
      $scope.msg = data;
      console.log("DataModelCtrl data:", data);
    });
  }]);
