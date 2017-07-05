/**
 * Controller
 */
"use strict";
angular.module('basic')
  .controller('DataSourceCtrl',['$rootScope', '$location','$sce','$filter', '$scope','$http','Upload', 'Notification', '$timeout',
    function ($rootScope, $location, $sce, $filter, $scope, $http, Upload, Notification, $timeout) {
    $scope.name = $filter('translate')('web_common_data_explore_001');
    
    // $scope.isNew = false;
    $scope.$on('model',function(el, dataModel){
      $scope.model = dataModel.model;
      $scope.notebook = dataModel.notebook;
      $scope.mode = dataModel.mode;
      //console.log('model in DS:', $scope.model.model, "notebook", $scope.model.notebook[1]['text/html'], "mode:", $scope.model.mode);
      // console.log('model in DS:', $scope.model, dataModel[1]['text/html']);
      if ($scope.mode !== 'new'){
        $scope.result = $scope.notebook[1]['text/html']?  $scope.notebook[1]['text/html'] :"Result...";
      }
        
      //$scope.result = $scope.model.outputs[1]['text/html']? $scope.model.outputs[1]['text/html'] :"Result...";      // if (Object.keys($scope.model).length == 0) {
      //   $scope.isNew = true;
        
      // }else{
      //   var fn = getFileName($scope.model.FILE_PATH) + '_' + $rootScope.getUsername() + '.' + getFileExtension($scope.model.FILE_PATH);
      //   console.log('$scope.model.FILE_PATH', $scope.model.FILE_PATH,'$scope.model.NOTEBOOK_PATH', $scope.model.NOTEBOOK_PATH)
      // }
      //$scope.init($scope.model.FILE_PATH, $scope.model.NOTEBOOK_PATH);
      
    });
      
    function getFileExtension(filename) {
      return filename
        .split('.')    // Split the string on every period
        .slice(-1)[0]; // Get the last item from the split
    }

    function getFileName(filename) {
      return filename.replace("." + getFileExtension(filename), ''); // Get the first item from the split
    }

    $scope.upload = function(){
      if($scope.file !== undefined && $scope.file !== "") {
        $scope.uploadFile($scope.file);
      }
    };

    $scope.uploadFile = function (file) {
      console.log('!!!!!!!!file',file, "$scope", $scope)
      //Upload.rename(file, getFileName(file.name)+'_' + $rootScope.getUsername() + '.' + getFileExtension(file.name));
      Upload.upload({
        url:'/api/jupyter/upload',
        data: { file: file}
      }).then(function (data) {
        $timeout(function(){
          $scope.fileName = data.data.fileName;
          $scope.htmlFileName = getFileName(data.data.fileName) + "_report.html";
          Notification.success($filter('translate')('web_common_explore_013'));
        }, 1000);
      }, function (err) {
          console.log(err);
      });
    };

    $scope.run = function(){
      if($scope.file!== undefined && $scope.file !== "") {
        $scope.runFile($scope.fileName, $scope.htmlFileName );
      }
    };

    $scope.runFile = function(fileName,htmlFileName){
      $http.post('/api/jupyter/step1/',{fileName, htmlFileName})
      .success(function(data){
        console.log("data",data)
        $scope.result = $sce.trustAsHtml(data.result.content.data["text/html"]);
      })
      .catch(err =>{console.log("err",err);
      });
    };

    // $scope.init = function(fileName,notebookPath){
    //   console.log("Let's init it :)", 'fileName', fileName, 'notebookPath', notebookPath);
    //   $http.post('/api/jupyter/init/', {fileName, notebookPath})
    //   .success(function(data){
    //     console.log("data.msg",data.msg);
    //     $scope.result = data.msg;
    //   })
    //   .catch(err =>{console.log("err",err);
    //   });
    // };   

    $scope.save = function(){
      console.log("Let's save it :)");
      $http.get('/api/jupyter/save/')
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


