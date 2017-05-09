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
      .when('/dataModel', {
        templateUrl: 'views/dataModel.html',
        controller: 'DataModelCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
