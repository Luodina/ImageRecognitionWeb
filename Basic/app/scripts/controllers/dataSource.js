/**
 * Controller
 */
angular.module('basic')
  .controller('DataSourceCtrl',['$rootScope', '$scope','$http', function ($rootScope, $scope, $http) {   
    $scope.msg = "DataSourceCtrl";
  }]);