'use strict';
/**
 * Controller of the HomeCtrl
 */
angular.module('basic')
  .controller('HomeCtrl', ['$rootScope', '$scope','$state',
    function ($rootScope, $scope,$state) {
      $scope.login = () => {
        $state.go('login');
      };
    }]);









