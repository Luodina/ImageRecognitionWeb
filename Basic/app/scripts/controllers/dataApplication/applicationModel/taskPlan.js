/**
 * Created by JiYi on 17/6/21.
 */
"use strict";
angular.module('basic')
  .controller('TaskPlanCtrl',['$rootScope','$sce','$filter', '$scope','$http','Upload', 'Notification', '$timeout',
    function ($rootScope, $sce, $filter, $scope, $http, Upload, Notification, $timeout) {

    }])
  .directive('task', function() {
    return {
      templateUrl: 'views/dataApplication/applicationModel/taskPlan.html'
    }})

