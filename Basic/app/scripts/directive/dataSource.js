
"use strict";
angular.module('basic')
  .controller('DataSourceCtrl',['cdmSource','$rootScope', '$location','$sce','$filter', '$scope','$http','Upload', 'Notification', '$timeout','FileUploader',
    function (cdmSource, $rootScope, $location, $sce, $filter, $scope, $http, Upload, Notification, $timeout,FileUploader) {
    $scope.name = $filter('translate')('web_common_data_explore_001');
      $scope.bigData =false;
      $scope.bigData =2;
    $scope.unablePreview =false;
      var uploader = $rootScope.uploader = new FileUploader({
        url: 'upload.php',
        queueLimit: 1,     //文件个数
        removeAfterUpload: true
      });
      //
      //var loadsecretskey= function () {
      //  secretskey.get({
      //    namespace: $rootScope.namespace,
      //    region: $rootScope.region
      //  }, function (res) {
      //    //console.log('-------loadsecrets', res);
      //    if (res.items) {
      //      $scope.secretsitems = res.items;
      //    }
      //  })
      //}


      $rootScope.clearItems = function(){    //重新选择文件时，清空队列，达到覆盖文件的效果
        uploader.clearQueue();
      }
    $scope.$on('model',function(el, dataModel){
      //console.log('dataModel',dataModel);
      $scope.model = dataModel.model;
      $scope.notebook = dataModel.notebook;
      $scope.mode = dataModel.mode;
      //console.log('model in DS:', $scope.model.model, "notebook", $scope.model.notebook[1]['text/html'], "mode:", $scope.model.mode);
      //console.log('model in DS:', $scope.model, $scope.notebook, $scope.mode);
      if ($scope.mode !== 'new'){
        $scope.result = $scope.notebook.outputs?  $scope.notebook.outputs[1]['text/html'] :"Result...";
      }
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
      if($scope.file) {
        document.getElementById('fileUpload').style.background='#f4f4f4';
        document.getElementById('fileUpload').style.color='#999';
        document.getElementById('fileUpload').style.border='solid 1px #999';
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
        $scope.unablePreview =true;
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
      document.getElementById('sourcePreview').style.color='#4874ff';
      document.getElementById('sourcePreview').style.border='solid 1px #4874ff';
      console.log($scope.fileName,$scope.htmlFileName )
      if($scope.file!== undefined && $scope.file !== "") {
        $scope.runFile($scope.fileName, $scope.htmlFileName );
      }
    };
    $scope.runFile = function(fileName,htmlFileName){
      $http.post('/api/jupyter/step1/',{fileName, htmlFileName})
      .success(function(data){
        $scope.$emit("unableNext", true);
        console.log("data",data)
        $scope.result = $sce.trustAsHtml(data.result.content.data["text/html"]);
      })
      .catch(err =>{console.log("err",err);
      });
    };

    $scope.save = function(){
      console.log("Let's save it :)");
      $http.get('/api/jupyter/save/')
      .success(function(data){
        console.log("data.msg",data.msg);
      })
      .catch(err =>{console.log("err",err);
      });
    };
    let handleSuccesscdmSource = (data, status)=> {
      console.log('handleSuccesscdmSource cdmSource',data);
      if(data!== undefined && data !== null) {
        $scope.cmdDataset = data;
      }
    }
    cdmSource.query({}, function (res) {
      console.log('cdmSource',res);
      handleSuccesscdmSource(res);
    });
    // $scope.init();
  }])
.directive('source', function() {
  return {
    templateUrl: 'views/directive/dataSource.html'
  };
});


