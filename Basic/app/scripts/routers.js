/**
 * Created by JiYi on 17/7/5.
 */
'use strict';
angular.module('basic.routers', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        let states = [{
                name: 'index',
                url: '/',
                templateUrl: 'views/homeIndex.html',
                controller: 'HomeCtrl'
            },
            {
                name: 'expert',
                url: '/expert/{new}',
                templateUrl: 'views/dataExplore/expertPart.html',
                controller: 'ExpertCtrlTwo'
            }
        ];
        states.forEach(function(state) {
            $stateProvider.state(state);
        });
    });
