'use strict';
angular.module('basic')
  .controller('DataExploreCtrl',['buildLog','$rootScope','$scope','$filter','$http','$timeout', 'dataExploreFactory', function (buildLog, $rootScope, $scope, $filter, $http, $timeout, dataExploreFactory) {
    $scope.msg = $filter('translate')('web_common_data_explore_002');
    
    $scope.projectType=['web_common_007', 'web_common_008', 'web_common_data_explore_014', 'web_common_data_explore_015'];
    $scope.listAllProject=[[]];
    var handleSuccess = function(data, status) {
      let listAllProject  = data.model;
      listAllProject.forEach(function(model) {
       if (model.USER_ID === 'ocai'){
        $scope.listAllProject[0].push(model);  
       };
       if (model.VIEW_MENU_ID !== null && model.VIEW_MENU_ID !== undefined ){
          if ($scope.listAllProject[parseInt(model.VIEW_MENU_ID)]===undefined){
            $scope.listAllProject[parseInt(model.VIEW_MENU_ID)]=[];
          } 
          $scope.listAllProject[parseInt(model.VIEW_MENU_ID)].push(model);
       }
      }, this);
      console.log("$scope.listAllProject", $scope.listAllProject)
    };

    dataExploreFactory.getProjectList().success(handleSuccess);    
    $scope.newProject = function () {
      buildLog.open(); 
    };
}]);



