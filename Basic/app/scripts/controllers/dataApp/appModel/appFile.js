/**
 * Created by JiYi on 17/6/21.
 */

"use strict";
angular.module('basic')
  .controller('AppFileCtrl',['createApp','$location','$filter','$scope','projectList',
  (createApp,$location,$filter,$scope,projectList) => {
    $scope.appName = $location.path().split(/[\s/]+/).pop();
    $scope.listAllProject = [];
    let handleSuccess = data => {
      let listAllProject = data.model;
      if (listAllProject !== null && listAllProject !== undefined ){
        listAllProject.forEach(model => {
          if (model.APP_ID !== null && model.APP_ID !== undefined ){
            if (model.TYPE_MENU_ID ==="00" && model.APP_ID === $scope.appName){
              $scope.listAllProject.push(model);      
            }
          }
        });
      }    
    };
    
    projectList.get({}, function (res) {handleSuccess(res);});
    $scope.createModel = () => {
      createApp.open();
    };
  }])
  .directive('file', () => {
    return {
      templateUrl: 'views/dataApp/appModel/appFile.html'
    };
  });
