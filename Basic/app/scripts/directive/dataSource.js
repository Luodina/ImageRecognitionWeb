/**
 * Controller
 */
"use strict";
angular.module('basic')
  .controller('DataSourceCtrl',['$rootScope', '$location','$sce','$filter', '$scope','$http','Upload', 'Notification', '$timeout',
    function ($rootScope, $location, $sce, $filter, $scope, $http, Upload, Notification, $timeout) {
    $scope.name = $filter('translate')('web_common_data_explore_001');
    $scope.result = "Result..."
    $scope.model = {};
    $scope.$on('model',function(el, model){
      console.log('model in DS:', model);
      $scope.model = model;
    });

    $scope.upload = function(){
      console.log('$scope.file',$scope.file)
      if($scope.file !== undefined && $scope.file !== "") {
        $scope.uploadFile($scope.file);
      }
    };
    $scope.uploadFile = function (file) {
      console.log('!!!!!!!!file',file, "$scope", $scope)
      Upload.upload({
        url:'/api/jupyter/upload',
        data: {file: file, username: 'py'}
      }).then(function (data) {
        $timeout(function(){
          $scope.fileName = data.data.fileName;
          console.log('!!!!!!!! $scope.fileName',data.data.fileName);
          Notification.success($filter('translate')('web_common_explore_013'));
        }, 1000);
      }, function (err) {
          console.log(err);
      });
    };

    $scope.run = function(fileName){
      console.log('!!!!!!!!fileName',fileName);
      if($scope.file!== undefined && $scope.file !== "") {
        $scope.runFile($scope.fileName);
      }
    };

    $scope.runFile = function(fileName){
      $http.post('/api/jupyter/step1/',{fileName})
      .success(function(data){
        $scope.result = $sce.trustAsHtml(data.result.content.data["text/html"]);
      })
      .catch(err =>{console.log("err",err);
      });
    };

    $scope.init = function(){
      if ($scope.model.FILE_PATH) {
        $scope.runFile($scope.model.FILE_PATH);
      }     
    };
    $scope.init();
  }])
.directive('source', function() {
  return {
    templateUrl: 'views/directive/dataSource.html'
  };
});

