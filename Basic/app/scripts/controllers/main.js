'use strict';

/**
 * Main Controller
 */

angular.module('basic')
  .controller('MainCtrl',['$scope', '$state','$filter','$location', '$rootScope', 'hotkeys','ipCookie', function ($scope,$state,$filter, $location, $rootScope, hotkeys,ipCookie) {

    $scope.expires = 7;
    $scope.expirationUnit = 'days';

    var setMessage = function (message, messageStyle) {
      $scope.message = message ? message : null;
      $scope.messageStyle = messageStyle ? messageStyle : 'success';
    };
   // var nameset = $cookieStore.get("username");


    $scope.saveCookie = function () {
      setMessage();
      $scope.messageStyle = 'success';
      // key, value, options
      console.log('saving cookie...');
      ipCookie('username', $scope.user.name, { expires: $scope.expires, expirationUnit: $scope.expirationUnit });
      ipCookie('userpass', $scope.user.pass, { expires: $scope.expires, expirationUnit: $scope.expirationUnit });
      //ipCookie('exampleCookie', $scope.cookie, { expires: $scope.expires, expirationUnit: $scope.expirationUnit, path: '/'});
      console.log('new cookie value...');
      //console.log(ipCookie('exampleCookie'));
      console.log(ipCookie('username'));
      console.log(ipCookie('userpass'));
      setMessage("Cookie created. Use your browser cookie display to verify content or expiry.");
    };

    $scope.deleteCookie = function () {
      setMessage();
      console.log('removing cookie...');
      ipCookie.remove('username');
      ipCookie.remove('userpass');
     // ipCookie.remove('exampleCookie', { path: '/' });
      if (ipCookie() === undefined) {
        setMessage('Successfully deleted cookie.');
      } else {
        setMessage('Unable to delete cookie.', 'danger');
      }
    };

    //console.log('getting all cookies...');
    //console.log(ipCookie());
    //console.log('getting cookie with key: exampleCookie');
    //console.log(ipCookie('exampleCookie'));

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
