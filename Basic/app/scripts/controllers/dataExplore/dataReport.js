/**
 * Controller
 */

'use strict';
angular.module('basic')
  .controller('DataReportCtrl',['$rootScope', '$scope','$http', '$sce', function ($rootScope, $scope, $http, $sce) {
    $scope.msg = "DataReportCtrl";
    $http.get('/api/report')
    .then(function successCallback(response) {
        $scope.rawHtml = $sce.trustAsHtml(response.data);
    },function errorCallback(response) {
        $scope.rawHtml = $sce.trustAsHtml('<div>There is no html file with report! Please, run your code one more time!</div>');
    });
  }]);






