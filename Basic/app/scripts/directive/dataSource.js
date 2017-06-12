/**
 * Controller
 */
"use strict";
angular.module('basic')
  .controller('DataSourceCtrl',['$rootScope', '$location','$sce','$filter', '$scope','$http','Upload', 'Notification', '$timeout',
    function ($rootScope, $location, $sce, $filter, $scope, $http, Upload, Notification, $timeout) {
    $scope.name = $filter('translate')('web_common_data_explore_001');
    $scope.result = "Result..."
    // $scope.model = {};
    $scope.isNew = false;
    $scope.$on('model',function(el, dataModel){
      $scope.model = dataModel;
      console.log('model in DS:', $scope.model);
      if (Object.keys($scope.model).length == 0) {
        $scope.isNew = true;
        $scope.init2();
      }else{
        let fn = getFileName($scope.model.FILE_PATH) + '_' + $rootScope.getUsername() + '.' + getFileExtension($scope.model.FILE_PATH);
        //console.log(getFileName($scope.model.FILE_PATH) + '_' + $rootScope.getUsername() + '.' + getFileExtension($scope.model.FILE_PATH))
        $scope.runFile(fn);
      }
    });
      
    function getFileExtension(filename) {
      return filename
        .split('.')    // Split the string on every period
        .slice(-1)[0]; // Get the last item from the split
    }

    function getFileName(filename) {
      return filename.split('.')[0]; // Get the first item from the split
    }

    $scope.upload = function(){
      console.log('!!!!!!!!file',$scope.file , "$scope", $scope)
      if($scope.file !== undefined && $scope.file !== "") {
        $scope.uploadFile($scope.file);
      }
    };

    $scope.uploadFile = function (file) {
      console.log('!!!!!!!!file',file, "$scope", $scope)
      Upload.rename(file,getFileName(file.name)+'_' + $rootScope.getUsername() + '.' + getFileExtension(file.name));
      Upload.upload({
        url:'/api/jupyter/upload',
        data: { file: file}
      }).then(function (data) {
        $timeout(function(){
          $scope.fileName = data.data.fileName;
          console.log('!!!!!!!! $scope.fileName',$scope.fileName);
          Notification.success($filter('translate')('web_common_explore_013'));
        }, 1000);
      }, function (err) {
          console.log(err);
      });
    };

    $scope.run = function(fileName){
      console.log('!!!!!!!!fileName in run',fileName);
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

    $scope.init2 = function(){
      console.log("Let's init it :)");
      $http.post('/api/jupyter/init/')
      .success(function(data){
        console.log("data.msg",data.msg);
      })
      .catch(err =>{console.log("err",err);
      });
    };
    // $scope.init();
  }])
.directive('source', function() {
  return {
    templateUrl: 'views/directive/dataSource.html'
  };
});

