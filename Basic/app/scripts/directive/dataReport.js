/**
 * Controller
 */
'use strict';
angular.module('basic')
  .controller('DataReportCtrl',['$rootScope', '$scope','$http', '$sce', function ($rootScope, $scope, $http, $sce) {
    $scope.msg = "DataReportCtrl";
    $scope.$on('model',function(el, dataModel){
      console.log("dataModel in report",dataModel);
      $scope.mode = dataModel.mode;
      $scope.model = dataModel.model;
      console.log("$scope.model.FILE_PATH", $scope.model)
      $scope.$on('tab',function(el, num){
        if (num === 1) {
          var tmp = $scope.model.FILE_PATH? $scope.model.FILE_PATH:"";
          $http.get('/api/jupyter/report/' + tmp)
          .then(response => {
            console.log("response",response.data);
              $scope.rawHtml = $sce.trustAsHtml('<div>Hey</div>');
          })
          .catch(response => {
              $scope.rawHtml = $sce.trustAsHtml('<div>There is no html file with report! Please, run your code one more time!</div>');
          });
        }
      })
    });
  }])
  .directive('report', function() {
    return {
      templateUrl: 'views/directive/dataReport.html'
    };
});






