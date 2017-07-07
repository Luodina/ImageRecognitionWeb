/**
 * Created by JiYi on 17/6/21.
 */

"use strict";
angular.module('basic')
  .controller('FileCtrl',['createApplicationframework','$location', '$rootScope','$sce','$filter', '$scope','$http','Upload', 'Notification', '$timeout', 'dataFactory',
    function (createApplicationframework, $location, $rootScope, $sce, $filter, $scope, $http, Upload, Notification, $timeout, dataFactory) {
      let appName = $location.path().split(/[\s/]+/).pop();
      $scope.listAllProject = [];
      let handleSuccess = (data, status)=> {
        let listAllProject = data.model;
        if (listAllProject !== null && listAllProject !== undefined ){
          listAllProject.forEach(model => {
            if (model.TYPE_MENU_ID ==="00" && model.APP_ID === appName){
              $scope.listAllProject.push(model);      
            }
          })
        }
        console.log("$scope.listAllProject in APP", $scope.listAllProject)      
      };
      dataFactory.getProjectList().success(handleSuccess);
      $scope.createModel = () => {
        createApplicationframework.open()
      }
    }])
  .directive('file', function() {
    return {
      templateUrl: 'views/dataApplication/applicationModel/applicationFile.html'
    }})
