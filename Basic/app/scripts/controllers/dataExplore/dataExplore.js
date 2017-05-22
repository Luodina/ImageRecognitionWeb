'use strict';
/**
 * Created by JiYi on 17/5/8.
 */
angular.module('basic')
  .controller('DataExploreCtrl',['$rootScope', '$scope', '$filter', '$http', function ($rootScope, $scope, $filter, $http) {
    $scope.msg = $filter('translate')('web_common_006');
    $scope.nameall =  $filter('translate')('web_common_007');
    $scope.nameone =  $filter('translate')('web_common_008');
    $scope.listofProject = [
      {header:"Project1", content:"Hey", footer:'End'},
      {header:"Project2", content:"Hey", footer:'End'}
    ]
  }]);
