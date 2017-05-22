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
  'ui.router.state.events'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    var states = [
      {name: 'main', url: '/', templateUrl: "views/main.html", controller: 'MainCtrl'},

      {name: 'home', url: '/home', templateUrl: "views/dashboard.html"},
      {
        name: 'dataExplore',
        url: '/explore',
        templateUrl: 'views/dataExplore/dataExplore.html',
        controller: 'DataExploreCtrl'
      },
      {name: 'data', url: '/data', templateUrl: 'views/dataExplore/data.html', controller: 'DataCtrl', abstract: true},
      {
        name: 'data.report',
        url: '/report',
        templateUrl: 'views/dataExplore/dataReport.html',
        controller: 'DataReportCtrl'
      },
      {
        name: 'data.source',
        url: '/source',
        templateUrl: 'views/dataExplore/dataSource.html',
        controller: 'DataSourceCtrl'
      },
      {
        name: 'data.processing',
        url: '/processing',
        templateUrl: 'views/dataExplore/dataProcessing.html',
        controller: 'DataProcessingCtrl'
      },
      {name: 'console.taskSchedule', url: '/schedule', templateUrl: 'views/dashboard.html', controller: 'DashboardCtrl'},
      {name: 'console.settings', url: '/settings', templateUrl: 'views/settings.html', controller: 'SettingsCtrl'}
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
  }])
  .run(['$rootScope', '$location', '$state', function ($rootScope, $location, $state) {
//监听路由事件

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

      console.log(toState.name);
      if(toState && toState.name === 'main'){
        $('#navbar-nav').css('visibility','hidden');
      }else{
        $('#navbar-nav').css('visibility','visible');
      }
    })

  }])

