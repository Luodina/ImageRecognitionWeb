'use strict';
angular.module('basic.routers', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    let states = [{
        name: 'index',
        url: '/',
        templateUrl: 'views/homeIndex.html',
        controller: 'HomeCtrl'
      },
      {
        name: 'appList',
        url: '/apps',
        templateUrl: 'views/application/list.html',
        controller: 'ApplicationListCtrl'
      },
      {
        name: 'appInfo',
        url: '/app/{name}',
        templateUrl: 'views/application/info.html',
        controller: 'ApplicationInfoCtrl'
      },
      {
        name: 'expert',
        url: '/expert/{new}',
        templateUrl: 'views/dataExplore/expertPart.html',
        controller: 'ExpertCtrlTwo'
      }
    ];
    states.forEach(function (state) {
      $stateProvider.state(state);
    });
  });
