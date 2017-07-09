/**
 * Created by JiYi on 17/6/21.
 */

"use strict";
angular.module('basic')
  .controller('AppFileCtrl',['createApp','$location','$filter','$scope','dataFactory',
  (createApp,$location,$filter,$scope,dataFactory) => {
    let appName = $location.path().split(/[\s/]+/).pop();
    console.log("appName",appName);
    $scope.listAllProject = [];
    let handleSuccess = data => {
      let listAllProject = data.model;
      if (listAllProject !== null && listAllProject !== undefined ){
        listAllProject.forEach(model => {
          if (model.APP_ID !== null && model.APP_ID !== undefined ){
            if (model.TYPE_MENU_ID ==="00" && model.APP_ID === appName){
              $scope.listAllProject.push(model);      
            }
          }
        });
      }
      console.log("$scope.listAllProject in APP", $scope.listAllProject);      
    };
    dataFactory.getProjectList().success(handleSuccess);
    $scope.createModel = () => {
      createApp.open();
    };
  }])
  .directive('file', () => {
    return {
      templateUrl: 'views/dataApp/appModel/appFile.html'
    };
  });
