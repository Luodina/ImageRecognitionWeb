
/**
 * Controller
 */
'use strict';
angular.module('basic')
  .controller('DataCtrl',['$rootScope', '$scope','$http', '$filter','Upload', 'Notification', '$timeout',
    function ($rootScope, $scope, $http, $filter, Upload, Notification, $timeout) {
    $scope.processing = $filter('translate')('web_common_data_explore_003');
    $scope.source = $filter('translate')('web_common_data_explore_001');
    $scope.report = $filter('translate')('web_common_data_explore_002');
    $scope.datamation = $filter('translate')('web_common_data_explore_004');
    $scope.defaultData = $filter('translate')('web_common_data_explore_005');
    $scope.datafileimport = $filter('translate')('web_common_data_explore_006');
    $scope.fileimport = $filter('translate')('web_common_data_explore_007');
    $scope.datapreview = $filter('translate')('web_common_data_explore_008');
    $scope.next = $filter('translate')('web_common_009');
    $scope.stepone = $filter('translate')('web_common_data_explore_009');
    $scope.steptwo = $filter('translate')('web_common_data_explore_010');
    $scope.stepthree = $filter('translate')('web_common_data_explore_011');
    $scope.application = $filter('translate')('web_common_data_explore_012');

    // $scope.names = {name1:"111"};
    // $scope.tab = "source";
    // $scope.goReport = function(item){
    //   console.log("here!!!!", item);
    //   $scope.tab =item;
    // }

    $scope.bigData = '';
    $scope.testFile = '';
    $scope.isShowOne = false;
    $scope.isShowTwo = false;
    $scope.isShowThree = false;

    $scope.importFlie = function () {
      // alert('1111');
      angular.element('#profile_file').click()
    };

    $scope.fileChange = function (ele) {
      $scope.testFilePath = ele.value;
      $scope.$apply();
    };

    $scope.preview = function () {
      alert("222");

    };

    $scope.nextPage = function () {

    };
    $scope.pulldownlistone = function () {
      $scope.isShowOne = !$scope.isShowOne;
    };
    $scope.pulldownlisttwo = function () {
      $scope.isShowTwo = !$scope.isShowTwo;
    };
    $scope.pulldownlistthree = function () {
      $scope.isShowThree = !$scope.isShowThree;
    }
    $scope.result ="DataCtrl";
}]);
