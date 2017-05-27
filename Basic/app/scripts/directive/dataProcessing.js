/**
 * Controller
 */

"use strict";

angular.module('basic')
  .controller('DataProcessingCtrl',['$rootScope', '$scope','$http','$sce','Notification', '$timeout', '$filter','openPreview', function ($rootScope, $scope, $http, $sce, Notification, $timeout, $filter,openPreview) {
  $scope.data = "DataProcessingCtrl";
  $scope.resultPreview = "Preview";
  $scope.$on('tabs',function(el, num){
    if (num ===2) {
      $http.get('/api/jupyter/step2').success(function(data){
          $scope.data = data.result;
          console.log("DataProcessingCtrl data:", data.result);
        $scope.dataItem = JSON.parse(data.result).highCorr;
        $scope.dataItemTwo = JSON.parse(data.result).imputer;
        $scope.dataItemThree = JSON.parse(data.result).scalar;
      });
    }
  });
  $scope.apply = function(){
    console.log("Apply!!!");
    $http.get('/api/jupyter/step3').success(function(data){
      $timeout(function(){
        Notification.success('Success!!!');
      }, 1000);   
    });
  };
  // $scope.preview1 = function(){
  //   console.log("Preview!!!");
  //   $http.get('/api/jupyter/step4').success(function(data){
  //     console.log("DataProcessingCtrl preview:", data.result.content.data["text/html"]);
  //     $timeout(function(){
  //       $scope.resultPreview = $sce.trustAsHtml(data.result.content.data["text/html"])
  //       Notification.success($filter('translate')('web_common_explore_013'));
  //     }, 1000);     
  //   });
  // };
  $scope.preview = function () {
     $http.get('/api/jupyter/step4').success(function(data){
      console.log("DataProcessingCtrl preview:", data.result.content.data["text/html"]);
      $timeout(function(){
        $scope.resultPreview = $sce.trustAsHtml(data.result.content.data["text/html"])
        openPreview.open($scope.resultPreview);
        Notification.success('Success!!!');
      }, 1000);     
    });
    
  };
  }])
  .directive('processing', function() {
    return {
      templateUrl: 'views/directive/dataProcessing.html'
    };
  });
