/**
 * Created by JiYi on 17/6/21.
 */

"use strict";
angular.module('basic')
  .controller('FileCtrl',['createApplicationframework','$rootScope','$sce','$filter', '$scope','$http','Upload', 'Notification', '$timeout',
    function (createApplicationframework,$rootScope, $sce, $filter, $scope, $http, Upload, Notification, $timeout) {
      $scope.createModel = function () {
        createApplicationframework.open()
      }
    }])
  .directive('file', function() {
    return {
      templateUrl: 'views/dataApplication/applicationModel/applicationFile.html'
    }})
