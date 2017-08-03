'use strict';

/**
 * Main Controller
 */

angular.module('basic')
  .controller('MainCtrl',['$scope', '$state','$filter','$location', '$rootScope', 'hotkeys', function ($scope,$state,$filter, $location, $rootScope, hotkeys) {

    $scope.username = $filter('translate')('web_common_010');
    $scope.password = $filter('translate')('web_common_011');
    $scope.signin = $filter('translate')('web_common_012');
    $scope.change =()=>{
      document.getElementById('pagOne').style.display='none';
      document.getElementById('login').style.display='block';
    }
    //$scope.register =()=>{
    //  document.getElementById('login').style.display='none';
    //  document.getElementById('register').style.display='block';
    //}
    //$scope.logintwo =()=>{
    //  document.getElementById('login').style.display='block';
    //  document.getElementById('register').style.display='none';
    //}
    $scope.login = () => {
      //$state.go('dataExplore');
      if($scope.user.pass !== undefined) {
        $rootScope.login($scope.user.name, $scope.user.pass);
      }
    };
    //enter 进入页面
    $scope.enterLogin = (e) => {
      if (e.keyCode==13) {
      //$state.go('dataExplore');
      if($scope.user.pass !== undefined) {
        $rootScope.login($scope.user.name, $scope.user.pass);
      }
      }
    };
    //图片预加载
    var images = new Array()
    function preload() {
      for (var i = 0; i < arguments.length; i++) {
        images[i] = new Image()
        images[i].src = arguments[i]
      }
    };

    preload(
      "images/homeBag.png",
      "images/logo.png"
    );

  }]);
