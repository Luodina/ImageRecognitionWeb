'use strict';
angular
  .module('basic', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'pascalprecht.translate',
    'ngFileUpload',
    "isteven-multi-select",
    "dndLists",
    'ui.bootstrap',
    'ui-notification',
    'angularSpinner',
    'ngCookies',
    'ui.select',
    'toggle-switch',
    'cfp.hotkeys',
    'ui.bootstrap.datetimepicker',
    'angularMoment',
    'chart.js',
    'ui.router',
    'basic.routers',
    'basic.resource',
    'basic.services',
     'ui.router.state.events'
  ])
  .constant('GLOBAL', {
    host_jupyter: './api/dataSource',
    host_user: './api/user',
    host_model: './api/model',
    host_app: './api/app',
    host_expert: './api/expert',
    host_makefile: './api/appMakeFile',
  })
  .config(['$translateProvider', '$windowProvider', function ($translateProvider, $windowProvider) {
    let window = $windowProvider.$get();
    let lang = window.navigator.userLanguage || window.navigator.language;
    console.log("lang", lang);
    if (lang) {
      lang = lang.substr(0, 2);
      $translateProvider.preferredLanguage(lang);
    }
  }])
  .config(['NotificationProvider','usSpinnerConfigProvider', '$httpProvider', 'ChartJsProvider', function (NotificationProvider, usSpinnerConfigProvider, $httpProvider, ChartJsProvider) {
    NotificationProvider.setOptions({
      delay: 10000,
      startTop: 20,
      startRight: 10,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'right',
      positionY: 'bottom'
    });
    usSpinnerConfigProvider.setDefaults({color: 'orange', radius: 0});

    ChartJsProvider.setOptions({
      chartColors: ['#4da9ff','#79d2a6','#ff9900','#ff704d','#669999','#4d0000']
    });
  }])
  .run(['$rootScope', '$location', '$state', '$http', '$cookies', function ($rootScope, $location, $state, $http, $cookies) {
    $rootScope.$on('$stateChangeStart', function (event,toState) {
      console.log('toState', toState.name);
      $rootScope.active = toState.name;
    })


    // $rootScope.iflogin=false;
    //   $rootScope.$on('$stateChangeStart', function (event,toState) {
    //     console.log(toState.name);
    //     if(!$rootScope.iflogin){
    //       // console.log('lalallalal')
    //       $location.path("/");
    //     }else{
    //       console.log('ifloginok')
    //     }
    //     if(toState && toState.name === 'main'){
    //       $('#navbar-nav').css('visibility','hidden');
    //     }else{
    //       $('#navbar-nav').css('visibility','visible');
    //     }
    //   })

    $rootScope.login = (username, password) => {
      $http.post("/api/user/login/", {username, password}).success(function (user) {
        if (user.status) {
          console.log("LOGIN SUCCESS!");
          $cookies.put("username", username);
          $location.path("/home");
          $rootScope.iflogin = true;
        } else {
          console.log("LOGIN FAILED!please, use login name:ocai and pass:123456");
        }
      }).error(function (err) {
        $rootScope.message = err;
      });
    };
    $rootScope.getUsername = () => {
      return $cookies.get("username");
    };
  }])
  // .factory('dataFactory', ['$resource', '$http', function ($resource, $http) {
  //   return {
  //     getProjectList: () => {
  //       return $http.get('/api/model/getProjectList').success(function (data) {
  //         console.log("getProjectList", data);
  //       });
  //     },
  //     getAppList: () => {
  //       return $http.get('/api/app/getAppList').success(function (data) {
  //         console.log("getAppList", data);
  //       });
  //     },
  //     getMakeFileList: (appName) => {
  //       return $http.get('/api/appMakeFile/getMakeFileList/' + appName).success(function (data) {
  //         console.log("getAppList", data);
  //       });
  //     }
  //   }
  // }])


