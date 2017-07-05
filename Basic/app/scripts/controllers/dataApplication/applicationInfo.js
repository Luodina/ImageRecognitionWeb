/**
 * Created by JiYi on 17/6/21.
 */
'use strict';
angular.module('basic')
  .controller('ApplicationInfoCtrl',['$location', '$rootScope', '$scope','$http', '$filter','Upload', 'Notification', '$timeout','$window','openPreview',
    function ( $location, $rootScope, $scope, $http, $filter, Upload, Notification, $timeout,$window,openPreview) {
      $scope.tab=0;
      // $scope.init = function(){
      //   let modelName = $location.path().split(/[\s/]+/).pop();
      //   console.log("data init modelName",modelName);
      //   if (modelName !==""){
      //     $http.get('/api/model/' + modelName)
      //       .success(function(data){
      //         console.log("data init modelName",modelName);
      //         if (data.model !== null && data.model !== undefined){
      //           $scope.model = data.model;
      //
      //         }else{
      //           $scope.model={};
      //         }
      //         console.log('$scope.model IN data', $scope.model);
      //         $scope.$broadcast('model',$scope.model );
      //       })
      //       .catch(err =>{console.log("err",err);});
      //   }  else {
      //     $location.path("/explore")
      //   };
      // };
      //$scope.init();

      $scope.clicked=function(num){
        $scope.tab = num;
        if(num===4){
          $scope.$broadcast('tab',num);
          $scope.tab = 4
        }if(num===3){
          $scope.$broadcast('tab',num);
          $scope.tab = 3
        }if(num===2){
          $scope.$broadcast('tab',num);
          $scope.tab = 2
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
