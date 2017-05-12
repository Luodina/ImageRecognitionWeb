'use strict';
/**
 * Created by JiYi on 17/5/8.
 */
angular.module('basic')
  .controller('DataExploreCtrl',['$rootScope','$location', '$scope', '$filter', function ($rootScope, $scope, $location, $filter ) {
    $scope.name = $filter('translate')('web_common_006');
    // $scope.go = function ( path ) {
    //   console.log("$location");
    //   $location.path( path );
    // };
  }]);
