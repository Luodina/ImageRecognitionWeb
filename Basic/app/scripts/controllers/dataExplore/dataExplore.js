'use strict';
/**
 * Created by JiYi on 17/5/8.
 */
angular.module('basic')
  .controller('DataExploreCtrl',['$rootScope', '$scope', '$filter', function ($rootScope, $scope, $filter) {
    $scope.msg = $filter('translate')('web_common_006');
    $scope.nameall =  $filter('translate')('web_common_007');
    $scope.nameone =  $filter('translate')('web_common_008');
    
  }]);
