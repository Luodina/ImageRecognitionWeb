'use strict';

angular.module('basic')
  .controller('NotebookCtrl', ['$cookies', '$sce', '$location', '$rootScope', '$scope', '$http',
  function ($cookies, $sce, $location, $rootScope, $scope, $http) {
  $scope.init = function () {
    var modelName = $location.path().split(/[\s/]+/).pop();
    console.log('modelName', modelName);
    $http.get('/api/expert/notebook/open/'+ modelName + '/explore')
    .success( data => {
      console.log('data',data);
      if (data !== null && data !== undefined) {
        $scope.notebookPath=$sce.trustAsResourceUrl(data.jpyPath);
      }else{
        console.log('Error with Notebook init!');
      }
    })
    .catch( err => {console.log('err in initNotebook():',err);});
  };
  $scope.init();
}]);
