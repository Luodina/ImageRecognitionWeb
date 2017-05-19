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
    'chart.js',
    'ui.router'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    // $urlRouterProvider.when('/explore', '/explore/data');
    var states = [
      { name: 'home',           url: '/',  templateUrl: "views/dashboard.html"                        },
      { name: 'dataExplore',    url: '/explore',     templateUrl: 'views/dataExplore/dataExplore.html',  controller: 'DataExploreCtrl'},
      { name: 'data',           url: '/data',        templateUrl: 'views/dataExplore/data.html',         controller: 'DataCtrl',
        abstract: true 
      },
      { name: 'data.report',    url: '/report',      templateUrl: 'views/dataExplore/dataReport.html',   controller: 'DataReportCtrl'},
      { name: 'data.source',    url: '/source',      templateUrl: 'views/dataExplore/dataSource.html',   controller: 'DataSourceCtrl' },
      { name: 'data.processing',url: '/processing',  templateUrl: 'views/dataExplore/dataProcessing.html',controller: 'DataProcessingCtrl' },  
      { name: 'taskSchedule',   url: '/schedule',    templateUrl: 'views/dashboard.html',                controller: 'DashboardCtrl'},
      { name: 'settings',       url: '/settings',    templateUrl: 'views/settings.html',                 controller: 'SettingsCtrl'}
    ];
    // Loop over the state definitions and register them
    states.forEach(function (state) {
      $stateProvider.state(state);
    });
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
    usSpinnerConfigProvider.setDefaults({color: 'orange', radius: 20});
    
    ChartJsProvider.setOptions({
      chartColors: ['#4da9ff','#79d2a6','#ff9900','#ff704d','#669999','#4d0000']
    });
  }]);

