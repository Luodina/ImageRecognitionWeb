/**
 * Controller
 */

"use strict";

angular.module('basic')
  .controller('DataProcessingCtrl',['$rootScope', '$scope','$http','openPreview', function ($rootScope, $scope, $http,openPreview) {
  $scope.data = "DataProcessingCtrl";
  $scope.$on('tabs',function(){
    $http.get('/api/jupyter/step2').success(function(data){
        $scope.data = data.result;
      // console.log("DataProcessingCtrl data:", typeof(data.result));
        $scope.dataItem = JSON.parse(data.result).highCorr;
        $scope.dataItemTwo = JSON.parse(data.result).imputer;
        $scope.dataItemThree = JSON.parse(data.result).scalar;
    });
  });

    $scope.preview = function () {
      openPreview.open();
    }
  }])
  .directive('processing', function() {
    return {
      templateUrl: 'views/directive/dataProcessing.html'
    };
  });
