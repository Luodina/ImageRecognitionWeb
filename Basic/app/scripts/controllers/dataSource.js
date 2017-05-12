/**
 * Controller
 */
"use strict";
angular.module('basic')
  .controller('DataSourceCtrl',['$rootScope','$filter', '$scope','$http', function ($rootScope, $filter, $scope, $http) {   
    $scope.name = $filter('translate')('web_common_data_explore_001');

    $http.get('/api/jupyter').success(function(data){
      $scope.msg = data;
      console.log("DataModelCtrl data:", data);
    });

  }]);

