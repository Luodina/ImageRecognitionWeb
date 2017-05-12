
/**
 * Controller
 */
'use strict';
angular.module('basic')
  .controller('DataCtrl',['$rootScope', '$scope','$http', '$filter',function ($rootScope, $scope, $http, $filter) {
    $scope.processing = $filter('translate')('web_common_data_explore_003');
    $scope.source = $filter('translate')('web_common_data_explore_001');
    $scope.report = $filter('translate')('web_common_data_explore_002');
    $scope.names = {name1:"111"};
    $scope.tab = "source";
    $scope.goReport = function(item){
      console.log("here!!!!", item);
      $scope.tab =item;
    }
  }]);
