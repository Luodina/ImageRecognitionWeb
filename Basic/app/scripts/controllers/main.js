'use strict';

/**
 * Main Controller
 */

angular.module('basic')
  .controller('MainCtrl',['$scope', '$state','$filter','$location', '$rootScope', 'hotkeys', function ($scope,$state,$filter, $location, $rootScope, hotkeys) {
    
    $scope.username = $filter('translate')('web_common_010');
    $scope.password = $filter('translate')('web_common_011');
    $scope.signin = $filter('translate')('web_common_012');

    $scope.login = function () {
      $state.go('dataExplore');
    }

  }]);
