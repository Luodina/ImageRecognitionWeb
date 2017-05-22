'use strict';
/**
 * Created by JiYi on 17/5/8.
 */
angular.module('basic')
  .controller('DataExploreCtrl',['$rootScope', '$scope', '$filter', '$http', function ($rootScope, $scope, $filter, $http) {
    $scope.msg = $filter('translate')('web_common_006');
    
    $scope.listofProject = [
      {header:"Project1", content:"Hey", footer:'End'},
      {header:"Project2", content:"Heyheyheyhey", footer:'Endend'}
    ]
  }]);
