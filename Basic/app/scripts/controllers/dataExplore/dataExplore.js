'use strict';
angular.module('basic')
  .controller('DataExploreCtrl',['createModel','$rootScope','$scope','$filter','$http','$timeout', 'dataExploreFactory', function (createModel, $rootScope, $scope, $filter, $http, $timeout, dataExploreFactory) {
    $scope.msg = $filter('translate')('web_common_data_explore_002');
    $scope.projectType= ['modelType_00', 'modelType_01', 'modelType_02', 'modelType_03','modelType_04', 'modelType_5'];   
    $scope.listAllProject=[[]];
    
    var handleSuccess = (data, status)=> {
      let listAllProject  = data.model;
      if (listAllProject !== null && listAllProject !== undefined ){
        listAllProject.forEach(model => {
        if (model.USER_ID !== null && model.USER_ID !== undefined ){
          if (model.USER_ID === $rootScope.getUsername()){
            model.mode = 'update'
            $scope.listAllProject[0].push(model);
            
          };
        }
        if (model.VIEW_MENU_ID !== null && model.VIEW_MENU_ID !== undefined ){
          if ($scope.listAllProject[parseInt(model.VIEW_MENU_ID)]===undefined){
            $scope.listAllProject[parseInt(model.VIEW_MENU_ID)]=[];
          } 
          if (model.MODEL_INFO !==undefined && model.MODEL_INFO !==undefined){
            var objJSON = eval("(function(){return " + model.MODEL_INFO + ";})()");
            model.MODEL_INFO = Object.values(objJSON);
          }
          if (model.USER_ID === $rootScope.getUsername()){
            model.mode = 'update'
          }else{
            model.mode = 'view'  
          };
          $scope.listAllProject[parseInt(model.VIEW_MENU_ID)].push(model);

        }
        }, this);
        console.log("$scope.listAllProject", $scope.listAllProject)
      }
    };

    dataExploreFactory.getProjectList().success(handleSuccess);
    $scope.newProject = (index) => {
      var arr = [
        {'title':'modelType_00','con':'web_common_data_explore_020'},
        {'title':'modelType_01','con':'modelType_01'},
        {'title':'modelType_02','con':'modelType_02'},
        {'title':'modelType_03','con':'modelType_03'},
        {'title':'modelType_04','con':'modelType_04'},
        {'title':'modelType_05','con':'modelType_05'},
        {'title':'modelType_06','con':'modelType_06'}
      ];
      var arr2 = ['test','data','test','test','test','test','notebook'];
      createModel.open(arr[index],arr2[index])
    };
}]);



