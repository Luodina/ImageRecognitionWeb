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
  .module('basicApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'DateExploreApp'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
        // controllerAs: 'main'
      })
      .when('/dateExplore_management', {
        templateUrl: 'views/dateExplore/management.html',
        controller: 'DateExploreManagementCtrl'
      })
      .when('/a', {
        templateUrl: 'views/a/a.html',
        controller: 'aManagementCtrl'
      })
      .otherwise({
        controller : function(){
          window.location.replace('/404');
        },
        template : "<div></div>"
      });
  });
