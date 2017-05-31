
/**
 * Controller
 */
'use strict';
angular.module('basic')
  .controller('DataCtrl',['$rootScope', '$scope','$http', '$filter','Upload', 'Notification', '$timeout','$window','openPreview',
    function ($rootScope, $scope, $http, $filter, Upload, Notification, $timeout,$window,openPreview) {
    $scope.processing = $filter('translate')('web_common_data_explore_003');
    $scope.source = $filter('translate')('web_common_data_explore_001');
    $scope.report = $filter('translate')('web_common_data_explore_002');
    $scope.datamation = $filter('translate')('web_common_data_explore_004');
    $scope.defaultData = $filter('translate')('web_common_data_explore_005');
    $scope.datafileimport = $filter('translate')('web_common_data_explore_006');
    $scope.fileimport = $filter('translate')('web_common_data_explore_007');
    $scope.datapreview = $filter('translate')('web_common_data_explore_008');
    $scope.next = $filter('translate')('web_common_009');
    $scope.back = $filter('translate')('web_common_016');
    $scope.previewPage = $filter('translate')('web_common_017');
    $scope.stepone = $filter('translate')('web_common_data_explore_009');
    $scope.steptwo = $filter('translate')('web_common_data_explore_010');
    $scope.stepthree = $filter('translate')('web_common_data_explore_011');
    $scope.application = $filter('translate')('web_common_data_explore_012');
    $scope.headline = $filter('translate')('web_common_data_explore_021');

    $scope.tab=0;
    $scope.clicked=function(num){
      $scope.tab=num;
      if(num===2){
        // $scope.$broadcast('tabs',num);
        $scope.tab = 2
      }
      if(num===1){
        $scope.tab = 1;
        $scope.$broadcast('tabs',num);
        
      }
      if(num===0){
        $scope.tab = 0;
        $scope.$broadcast('tabs',num);

      }
    }

      $scope.isShowOne = true;
      $scope.isShowTwo = true;
      $scope.isShowThree = true;

      $scope.pulldownlistone = function () {
        $scope.isShowOne = !$scope.isShowOne;
      };

      $scope.pulldownlisttwo = function () {
        $scope.isShowTwo = !$scope.isShowTwo;
      };

      $scope.pulldownlistthree = function () {
        $scope.isShowThree = !$scope.isShowThree;
      };

    }]);
