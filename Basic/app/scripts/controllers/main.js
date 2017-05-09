'use strict';

/**
 * Main Controller
 */

angular.module('basic')
  .controller('MainCtrl',['$scope', '$location', '$rootScope', 'hotkeys', function ($scope, $location, $rootScope, hotkeys) {
    if($rootScope.getUsername()){
      if($rootScope.isAdmin()) {
        $location.path("/dateExpore");
      }else{
        $location.path("/dashboard");
      }
    }

    $scope.login = function(){
      if($scope.user.pass !== undefined) {
        $rootScope.login($scope.user.name, $scope.user.pass);
      }
    };

    hotkeys.bindTo($scope).add({
      combo: 'enter',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function() {
        $scope.login();
      }
    });

  }]);
