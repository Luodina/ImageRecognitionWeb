'use strict';
angular.module('basic')
  .controller('DataExploreCtrl',['$http','createModel','$rootScope','$scope','$filter','projectList','createExpertModule',
    ($http, createModel, $rootScope, $scope, $filter, projectList,createExpertModule) => {
    $scope.projectType= ['modelType_00', 'modelType_01', 'modelType_02', 'modelType_03','modelType_04', 'modelType_05','modelType_06'];
    $scope.listAllProject=[[]];
    let handleSuccess = (data, status)=> {
      let listAllProject = data.model;
      if (listAllProject !== null && listAllProject !== undefined ){
        listAllProject.forEach(model => {
          if (model.TYPE_MENU_ID==="01"){
            if (model.USER_ID !== null && model.USER_ID !== undefined ){
              if (model.USER_ID === $rootScope.getUsername()){
                model.mode = 'update'
                $scope.listAllProject[0].push(model);
              };
            }
            if (model.VIEW_MENU_ID !== null && model.VIEW_MENU_ID !== undefined ){
              if ($scope.listAllProject[parseInt(model.VIEW_MENU_ID)] === undefined){
                $scope.listAllProject[parseInt(model.VIEW_MENU_ID)]=[];
              }
              if (model.MODEL_INFO !== null && model.MODEL_INFO !== undefined ){
                let objJSON = eval("(function(){return " + model.MODEL_INFO + ";})()");
                model.MODEL_INFO = Object.values(objJSON);
              }
              if (model.USER_ID === $rootScope.getUsername()){
                model.mode = 'update'
              }else{
                model.mode = 'view'
              };
              $scope.listAllProject[parseInt(model.VIEW_MENU_ID)].push(model);

            }
          }
        }, this);
      }
    };
    projectList.get({}, function (res) {handleSuccess(res);});

    $http.get('/api/cdm/all')
    .success( data => {
      console.log('Here gooooood!');
    })
    .catch( err => {console.log('err:',err);});

    $scope.newProject = (index) => {
      // var arr = [
      //   {'title':'modelType_00','content':'web_common_data_explore_020'},
      //   {'title':'modelType_01','content':'modelType_01'},
      //   {'title':'modelType_02','content':'modelType_02'},
      //   {'title':'modelType_03','content':'modelType_03'},
      //   {'title':'modelType_04','content':'modelType_04'},
      //   {'title':'modelType_05','content':'modelType_05'},
      //   {'title':'modelType_06','content':'modelType_06'}
      // ];
      // var arr2 = ['test','data','test','test','test','test','notebook'];
      // createModel.open(arr[index],arr2[index]).then(function (name) {
      //   createExpertModule.open(name);
      // });
      createModel.open(index).then(function (name) {
       
      });
    };
}]);



