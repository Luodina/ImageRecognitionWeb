'use strict';

angular.module('basic')
  .controller('NotebookCtrl', ['$cookies', '$sce', '$location', '$rootScope', '$scope', '$http',
  function ($cookies, $sce, $location, $rootScope, $scope, $http) {
  $scope.init = function () {
    var path_list = $location.path().split(/[\s/]+/);
    console.log('path_list',path_list);
    var modelName = path_list.pop();
    var project = path_list.pop();
    var type = path_list[1];
    var url = '/api/expert/notebook/open/'+ modelName +'/';
    if (type == 'app') {
      //TODO app中点击文件过来的url是 app/notebook/APP_ID/FILE
      url += project;
    } else{
      url += 'explore'
    }

    $http.get(url)
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
