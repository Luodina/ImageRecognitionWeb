
/**
 * Controller
 */
'use strict';
angular.module('basic')
  .controller('DataCtrl',['$location', '$rootScope', '$scope','$http', '$filter','Upload', 'Notification', '$timeout','$window','openPreview',
    function ( $location, $rootScope, $scope, $http, $filter, Upload, Notification, $timeout,$window,openPreview) {
    // $scope.previewPage = $filter('translate')('web_common_017');
    // $scope.stepone = $filter('translate')('web_common_data_explore_009');
    // $scope.steptwo = $filter('translate')('web_common_data_explore_010');
    // $scope.stepthree = $filter('translate')('web_common_data_explore_011');
    // $scope.application = $filter('translate')('web_common_data_explore_012');
    // $scope.headline = $filter('translate')('web_common_data_explore_021');

    $scope.tab=0;
    $scope.init = function(){
      var modelName = $location.path().split(/[\s/]+/).pop();
      $location.path().split(/[\s/]+/).lastIndexOf('new');
      console.log("data init modelName",modelName);
      if (modelName !== ""){
        //is model in DB?
        $http.get('/api/model/' + modelName)
        .success(function(data){
          $scope.modelDB =  data.model;
          //if model exists in DB
          if (data.model !== null && data.model !== undefined) {
            //if try to create new with the same name as in DB
            if ($location.path().split(/[\s/]+/).lastIndexOf('new') !== -1) {
              $location.path("/explore")
              console.log("modelName:", modelName, " already exist!");
            }
            //if model opened by owner
            initNotebook($scope.modelDB.FILE_PATH, $scope.modelDB.NOTEBOOK_PATH, $scope.modelDB.MODEL_NAME, $scope.modelDB.USER_ID)
            .then(data => {
              if ($scope.modelDB.USER_ID  === $rootScope.getUsername()) {
                console.log("outputs", data.data.outputs,'$scope.modelDB',$scope.modelDB);
                $scope.$broadcast('model',{ notebook: data.data.outputs, model:$scope.modelDB, mode: 'update'});
              } else {
                console.log("outputs", data.data.outputs,'$scope.modelDB',$scope.modelDB);
                $scope.$broadcast('model',{ notebook: data.data.outputs, model:{}, mode: 'view'});
              }
            })
            .catch(err =>{console.log("err",err);});
          }else{
            initNotebook(null, null, modelName, $rootScope.getUsername());
            $scope.$broadcast('model',{notebook:{}, model:{}, mode: 'new'});
          }
        })
        .catch(err =>{console.log("err",err);});
      }  else {
         $location.path("/explore")
      };
    };
    $scope.init();

    var initNotebook = (fileName, notebookPath, projectName, userName) => {
      console.log("Let's init it :)", 'fileName', fileName, 'notebookPath', notebookPath, 'projectName', projectName, 'userName', userName);
      return $http.post('/api/jupyter/init/', { fileName, notebookPath, projectName, userName })
      .success( data => {
        // return data.outputs;
        // console.log("data.msg",data.msg,'outputs',data.outputs);
        // $scope.$broadcast('model',data.outputs);
      })
      .catch( err => { console.log("err in initNotebook():",err);
      });
    };

    $scope.clicked=function(num){
      console.log("num",num);
      $scope.tab = num;
      if(num===2){
        $scope.tab = 2
        $scope.$broadcast('tab',num);
      }
      if(num===1){
        $scope.tab = 1;
        $scope.$broadcast('tab',num);
      }
      if(num===0){
        $scope.tab = 0;
        $scope.$broadcast('tab',num);
      }
    }
    }]);
