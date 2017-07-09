/**
 * Created by JiYi on 17/6/21.
 */
'use strict';
angular.module('basic')
  .controller('AppInfoCtrl',['$location', '$rootScope', '$scope','$http', '$filter','Upload', 'Notification', '$timeout','$window','openPreview',
    ( $location, $rootScope, $scope, $filter) => {
      $scope.tab=0;
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
