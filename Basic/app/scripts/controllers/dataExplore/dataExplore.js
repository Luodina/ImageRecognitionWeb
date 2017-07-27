'use strict';
angular.module('basic')
  .controller('DataExploreCtrl',['$location','templateList','openNotebook','$http','createModel','$rootScope','$scope','$filter','projectList','createExpertModule',
    ($location, templateList, openNotebook, $http, createModel, $rootScope, $scope, $filter, projectList,createExpertModule) => {
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
                let objJSON = eval('(function(){return ' + model.MODEL_INFO + ';})()');
                model.MODEL_INFO = Object.values(objJSON);
              }
              if (model.USER_ID === $rootScope.getUsername()){
                model.mode = 'update';
              }else{
                model.mode = 'view';
              };
              $scope.listAllProject[parseInt(model.VIEW_MENU_ID)].push(model);

            }
          }
        }, this);
      }
    };
    $scope.openProject = (item) => {
      console.log('item.VIEW_MENU_ID', item.VIEW_MENU_ID, 'item.mode', item.mode); 
      if (item.VIEW_MENU_ID === '01'){
        
        $location.path('/explore/' + item.VIEW_MENU_ID +'/'+item.mode+'/'+item.MODEL_NAME);
      }  
      if (item.VIEW_MENU_ID === '06'){
        $location.path('/notebook/'+item.mode+'/'+item.MODEL_NAME);
      }     
    };
    projectList.get({}, function (res) {handleSuccess(res);});
    $scope.newProject = (index) => {
       
      let arrItem = [];
      if (index === 1 ) {
        arrItem = [
          {img:'pic1',content:'modelType_01',url:'data',name:'data',isActive:false},
          {img:'pic2',content:'modelType_02',url:'t1',name:'data2',isActive:false},
          {img:'pic3',content:'modelType_03',url:'t2',name:'data3',isActive:false},
          {img:'pic4',content:'modelType_04',url:'t3',name:'data4',isActive:false},
          {img:'pic5',content:'modelType_05',url:'t4',name:'data5',isActive:false},
          {img:'pic6',content:'modelType_06',url:'notebook',name:'notebook',isActive:false}
        ];
        createModel.open(index, arrItem).then((msg) => {
          if (msg === 'success') {
            $scope.listAllProject=[[]]; 
            projectList.get({}, function (res) {handleSuccess(res);});
          }
        })
        .catch(err =>{console.log('err',err);});
      }
      if (index === 6 ) {
        arrItem = []; 
        templateList.get({}, function (data) {
          if (data !== null && data !== undefined ){
            data.files.forEach(file => {  
              if (file.split('.ipynb')[0] !== 'new'){
                arrItem.push({content: file.split('.ipynb')[0], img:'template',isActive:false});
              }
            });
            arrItem.push({content: 'new', img:'add_btn', isActive:false});
            createExpertModule.open(arrItem).then((model)=>{
              openNotebook.open(model.modelTemplate, model.modelName, 'explore').then((msg) => {
                $scope.listAllProject=[[]];
                projectList.get({}, function (res) {handleSuccess(res);});
              }
              );
            });
          }else{
            console.log('HERE!');  
          }

        });

      }
    };
}]);



