/**
 * Created by JiYi on 17/7/5.
 */
'use strict';
angular.module('basic.routers', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    var states = [
      { name: 'main', url: '/', templateUrl: "views/main.html", controller: 'MainCtrl'},
      { name: 'home', 
        url: '/home',
        templateUrl: "views/dataApplication/dataApplication.html",
        controller:'DataApplicationCtrl'
      },
      {
        name: 'applicationInfomation',
        url: '/applicationInfo/{mode}/{name}',
        templateUrl: "views/dataApplication/applicationInfo.html",
        controller: 'ApplicationInfoCtrl'
      },
      {
        name: 'dataExplore',
        url: '/explore',
        templateUrl: 'views/dataExplore/dataExplore.html',
        controller: 'DataExploreCtrl'
      },
      { 
        name: 'data',
        url: '/data/{mode}/{name}', 
        templateUrl: 'views/dataExplore/data.html',
        controller: 'DataCtrl'
      },
      {
        name: 'console.taskSchedule',
        url: '/schedule',
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
      },
      {name: 'console.settings', url: '/settings', templateUrl: 'views/settings.html', controller: 'SettingsCtrl'}
    ];
    // Loop over the state definitions and register them
    states.forEach(function (state) {
      $stateProvider.state(state);
    });
  })
