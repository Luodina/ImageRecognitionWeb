/**
 * Created by JiYi on 17/7/6.
 */
'use strict';
angular.module('basic')
  .controller('NotebookCtrl',['$location', '$rootScope', '$scope','$http', '$filter','Upload', 'Notification', '$timeout','$window',
    function ( $location, $rootScope, $scope, $http, $filter, Upload, Notification, $timeout,$window) {
      $scope.isShow = true;
      $scope.openJupyter = ()=>{
        $scope.isShow = false;
        var modelName = $location.path().split(/[\s/]+/).pop();
        console.log("modelName",modelName);
        $http.get('/api/jupyter/pathNoteBook',{
          params: {
            "modelName":modelName
          }
        })
        }
      }
    ]);
