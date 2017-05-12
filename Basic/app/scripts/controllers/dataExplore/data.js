
/**
 * Controller
 */
'use strict';
angular.module('basic')
  .controller('DataCtrl',['$rootScope', '$scope','$http', '$filter',function ($rootScope, $scope, $http, $filter) {
    $scope.processing = $filter('translate')('web_common_data_explore_003');
    $scope.source = $filter('translate')('web_common_data_explore_001');
    $scope.report = $filter('translate')('web_common_data_explore_002');
    $scope.datamation = $filter('translate')('web_common_data_explore_004');
    $scope.defaultData = $filter('translate')('web_common_data_explore_005');
    $scope.datafileimport = $filter('translate')('web_common_data_explore_006');
    $scope.fileimport = $filter('translate')('web_common_data_explore_007');
    $scope.datapreview = $filter('translate')('web_common_data_explore_008');

    $scope.names = {name1:"111"};
    $scope.tab = "source";
    $scope.goReport = function(item){
      console.log("here!!!!", item);
      $scope.tab =item;
    }
  }]);
