/**
 * Controller
 */

"use strict";

angular.module('basic')
  .controller('DataProcessingCtrl',['$rootScope', '$scope','$http','$sce','Notification', '$timeout', '$filter','openPreview', function ($rootScope, $scope, $http, $sce, Notification, $timeout, $filter,openPreview) {
  $scope.data = "DataProcessingCtrl";
  $scope.resultPreview = "Preview";
  $scope.$on('tab',function(el, num){
    console.log("num:", num);
    if (num ===2) {
      $http.get('/api/jupyter/step2').success(function(data){
          $scope.data = data.result;
          // console.log("DataProcessingCtrl data:", data.result);
        $scope.dataItem = JSON.parse(data.result).highCorr;
        console.log("$scope.dataItem:", $scope.dataItem);
        $scope.dataItemTwo = JSON.parse(data.result).imputer;
        console.log(" $scope.dataItemTwo:", $scope.dataItemTwo);
        $scope.dataItemThree = JSON.parse(data.result).scalar;
        console.log("$scope.dataItemThree :", $scope.dataItemThree);
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

  $scope.selectedSite = [];
  // console.log("$scope.dataItemThree :", $scope.selectedSite);
  $scope.submit =function(){
     console.log("submit :", $scope.selectedSite);
  };
  }])
  .directive('processing', function() {
    return {
      templateUrl: 'views/directive/dataProcessing.html'
    };
  });
