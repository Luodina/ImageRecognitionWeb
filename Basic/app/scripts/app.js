'use strict';

/**
 * @ngdoc overview
 * @name basicApp
 * @description
 * # basicApp
 *
 * Main module of the application.
 */
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
    'chart.js'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      // .when('/', {
      //   templateUrl: 'views/main.html',
      //   controller: 'MainCtrl'
      // })
      .when('/', {
        templateUrl: 'views/dateExpore/dateExpore.html',
        controller: 'DateExporeCtrl'
      })
      .when('/date', {
        templateUrl: 'views/dateExpore/date.html',
        controller: 'DateCtrl'
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
      })
      .when('/source', {
        templateUrl: 'views/dataSource.html',
        controller: 'DataSourceCtrl'
      })
      .when('/report', {
        templateUrl: 'views/dataReport.html',
        controller: 'DataReportCtrl'
      })
      .when('/processing', {
        templateUrl: 'views/dataProcessing.html',
        controller: 'DataProcessingCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(['$translateProvider', '$windowProvider', function($translateProvider, $windowProvider){
    let window = $windowProvider.$get();
    let lang = window.navigator.userLanguage || window.navigator.language;
    console.log("lang",lang);
    if(lang){
      lang = lang.substr(0,2);
      $translateProvider.preferredLanguage(lang);
    }
  }])
  // .config(['NotificationProvider','usSpinnerConfigProvider', '$httpProvider', 'ChartJsProvider', function (NotificationProvider, usSpinnerConfigProvider, $httpProvider, ChartJsProvider) {
  //   NotificationProvider.setOptions({
  //     delay: 10000,
  //     startTop: 20,
  //     startRight: 10,
  //     verticalSpacing: 20,
  //     horizontalSpacing: 20,
  //     positionX: 'right',
  //     positionY: 'bottom'
  //   });
  //   // usSpinnerConfigProvider.setDefaults({color: 'orange', radius: 20});
  //   // $httpProvider.interceptors.push('AuthInterceptor', 'UsInterceptor');
  //   // ChartJsProvider.setOptions({
  //   //   chartColors: ['#4da9ff','#79d2a6','#ff9900','#ff704d','#669999','#4d0000']
  //   // });
  // }])
  ;