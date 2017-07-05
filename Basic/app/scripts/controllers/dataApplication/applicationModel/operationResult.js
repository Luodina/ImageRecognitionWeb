/**
 * Created by JiYi on 17/6/21.
 */
"use strict";
angular.module('basic')
  .controller('ResultCtrl',['$rootScope','$sce','$filter', '$scope','$http','Upload', 'Notification', '$timeout',
    function ($rootScope, $sce, $filter, $scope, $http, Upload, Notification, $timeout) {

    }])
  .directive('result', function() {
    return {
      templateUrl: 'views/dataApplication/applicationModel/operationResult.html'
    }})
