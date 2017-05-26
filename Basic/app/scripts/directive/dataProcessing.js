/**
 * Controller
 */

"use strict";

angular.module('basic')
  .controller('DataProcessingCtrl',['$rootScope', '$scope','$http', function ($rootScope, $scope, $http) {
  $scope.data = "DataProcessingCtrl";
  $scope.$on('tabs',function(){
    $http.get('/api/jupyter/step2').success(function(data){
        $scope.data = data.result;
        console.log("DataProcessingCtrl data:", data.result);
    });
  });
  }])
  .directive('processing', function() {
    return {
      templateUrl: 'views/directive/dataProcessing.html'
    };
  });
