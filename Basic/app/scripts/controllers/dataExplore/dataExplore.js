'use strict';
/**
 * Created by JiYi on 17/5/8.
 */
angular.module('basic')
  .controller('DataExploreCtrl',['$rootScope', '$scope', '$filter', '$http', function ($rootScope, $scope, $filter, $http) {
    $scope.msg = $filter('translate')('web_common_006');

    $scope.listofProject = [
      {header:"Structural data", content:{key1: "Hey", key2: 'aaa'}, footer:'Add a description'},
      {header:"Project2", content:{key1: "Hey111", key2: 'aa1111a'}, footer:'Add a description'}
    ];
    $scope.listofProjectTwo = [
      {header:"Project3", content:"container", footer:'Add a description'},
      {header:"Project4", content:"container container", footer:'Add a description'}
    ]

  }]);
