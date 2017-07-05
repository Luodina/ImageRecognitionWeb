/**
 * Created by JiYi on 17/6/21.
 */
"use strict";
angular.module('basic')
  .controller('ChoreographyCtrl',['$rootScope','$sce','$filter', '$scope','$http','Upload', 'Notification', '$timeout',
    function ($rootScope, $sce, $filter, $scope, $http, Upload, Notification, $timeout) {

    }])
  .directive('choreography', function() {
    return {
      templateUrl: 'views/dataApplication/applicationModel/runTheChoreography.html'
    }})

