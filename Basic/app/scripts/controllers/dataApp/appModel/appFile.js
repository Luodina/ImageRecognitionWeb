'use strict';
angular.module('basic')
  .controller('AppFileCtrl',['openNotebook','createAppModel','$location','$scope','projectList',
  (openNotebook,createAppModel,$location,$scope,projectList) => {
    $scope.appName = $location.path().split(/[\s/]+/).pop();

    $scope.listAllProject = [];
    let handleSuccess = data => {
      let listAllProject = data.model;
      if (listAllProject !== null && listAllProject !== undefined ){
        listAllProject.forEach(model => {
          if (model.APP_ID !== null && model.APP_ID !== undefined ){
            if (model.TYPE_MENU_ID ==='00' && model.APP_ID === $scope.appName){
              $scope.listAllProject.push(model);
            }
          }
        });
      }
    };

    projectList.get({}, function (res) {handleSuccess(res);});
    $scope.createModel = appName => {
      createAppModel.open(appName).then((model)=>{
        console.log('model in AppFile: ',model.type, model.modelName, model.appName);
        if (model.type===6) {
          openNotebook.open(null, model.modelName, model.appName).then(() => {
            $scope.listAllProject = [];
            projectList.get({}, function (res) {handleSuccess(res);});
          });
        }
        if (model.type!==6) {
          $location.path('/'+ model.appName +'/0'+ model.type + '/new/' + model.modelName);
        }
      });
    };

    $scope.openProject = (item) => {
      $location.path('app/notebook/'+ item.APP_ID +'/'+item.MODEL_NAME);
    };
  }])
  .directive('file', () => {
    return {
      templateUrl: 'views/dataApp/appModel/appFile.html'
    };
  });
