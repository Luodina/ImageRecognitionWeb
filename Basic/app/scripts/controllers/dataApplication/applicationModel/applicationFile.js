/**
 * Created by JiYi on 17/6/21.
 */

"use strict";
angular.module('basic')
  .controller('FileCtrl',['createApp','$rootScope','$sce','$filter', '$scope','$http','Upload', 'Notification', '$timeout',
    function (createApp,$rootScope, $sce, $filter, $scope, $http, Upload, Notification, $timeout) {
      $scope.createModel = function () {
        createApp.open()
      }
    }])
  .directive('file', function() {
    return {
      templateUrl: 'views/dataApplication/applicationModel/applicationFile.html'
    }})
