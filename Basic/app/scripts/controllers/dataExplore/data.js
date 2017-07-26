
/**
 * Controller
 */
'use strict';
angular.module('basic')
  .controller('DataCtrl',['$location', '$rootScope', '$scope','$http',
  ( $location, $rootScope, $scope, $http ) => {
    $scope.tab=0;
    //左边导航自动变化
    let left_by_block = function(){
      let thisheight = $(window).height()-$('.header').height();
      $('.exploreModelLeft').height(thisheight);
    };
    $(window).resize(function(){
      left_by_block();
    });
    $(function(){
      left_by_block();
    });

    //右边数据自动变化
    let right_by_block = function(){
      let thisheight = $(window).height()-$('.header').height()-20;
      $('.exploreModelRight').height(thisheight);
    };
    $(window).resize(function(){
      right_by_block();
    });
    $(function(){
      right_by_block();
    });
    let projectType = $location.path().split(/[\s/]+/)[1];
    let modelType = $location.path().split(/[\s/]+/)[2];
    let modelMode= $location.path().split(/[\s/]+/)[3];
    let modelName = $location.path().split(/[\s/]+/)[4];
    let userName = $rootScope.getUsername();
    let initNotebook = (fileName, notebookPath, projectName, userName, modelMode,projectType) => {
      return $http.post('/api/jupyter/init/', { fileName, notebookPath, projectName, userName, modelMode, projectType})
      .success( data => {
        if (data.msg !== 'success') {
          $location.path('/explore');
          console.log('Error with Notebook init!');
        }
      })
      .catch( err => {console.log('err in initNotebook():',err);});
    };
    $scope.init = () => {
      $http.get('/api/model/' + modelName).success(data => {
        $scope.modelDB = data.result;
        if ($scope.modelDB !== null && $scope.modelDB !== undefined) {
          if (modelMode === 'new') {
            $location.path('/explore');
          }
          initNotebook($scope.modelDB.FILE_PATH, $scope.modelDB.NOTEBOOK_PATH, $scope.modelDB.MODEL_NAME, $scope.modelDB.USER_ID,modelMode, projectType)
          .then(data => {
            if ($scope.modelDB.USER_ID === userName) {
              if (modelMode !== 'update') {
                $location.path('/explore');
                console.log('Error! Please, Check mode!');
              }
              $scope.$broadcast('model',{ notebook: data.data, model:$scope.modelDB, mode: 'update'});
            } else {
              if (modelMode !== 'view') {
                $location.path('/explore');
                console.log('Error! Please, Check mode!');
              }
              $scope.$broadcast('model',{ notebook: data.data, model:{}, mode: 'view' });
            }
          })
          .catch(err =>{console.log('err',err);});
        } else {
          initNotebook(null, null, modelName, userName,modelMode, projectType);
          $scope.$broadcast('model',{ notebook:{}, model:{}, mode: 'new' });
        }
      })
      .catch(err =>{console.log('err',err);});
    };
    $scope.init();
    $scope.clicked= num => {
      console.log('num',num);
      $scope.tab = num;
      if(num===2){
        $scope.tab = 2;
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
    };
  }]);
