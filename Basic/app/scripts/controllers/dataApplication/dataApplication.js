/**
 * Created by JiYi on 17/6/21.
 */
'use strict';
angular.module('basic')
  .controller('DataApplicationCtrl',['createModel','$rootScope','$scope','$filter','$http','$timeout', 'dataExploreFactory', function (createModel, $rootScope, $scope, $filter, $http, $timeout, dataExploreFactory) {
    $scope.msg = $filter('translate')('web_common_data_explore_002');
    $scope.projectType=['web_common_data_application_02', 'web_common_data_application_03', 'web_common_data_application_04'];
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
      createModel.open({'title': 'web_common_data_application_layer_01', 'con':'web_common_data_application_layer_02'}, 'applicationInfomation');
    };
  }]);
