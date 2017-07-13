/**
 * Created by JiYi on 17/7/6.
 */
'use strict';

angular.module('basic').controller('NotebookCtrl', ['$cookies', '$sce', '$location', '$rootScope', '$scope', '$http',  function ($cookies, $sce, $location, $rootScope, $scope, $http) {
  $scope.notebookPath = '';
  var ipyPath = '';
  $scope.init = function () {
    var modelName = $location.path().split(/[\s/]+/).pop();
    console.log("modelName", modelName);

    $http.get('/api/expert/pathNoteBook', {
      params: {
        "modelName": modelName
      }
    }).then(function (response) {
      ipyPath = response.data.jpyPath;
      $scope.notebookPath = $sce.trustAsResourceUrl(ipyPath);
      // $http.get('/api/jupyter/save').success(function (data) {
      var date = new Date();
      var savaData = {
        MODEL_NAME: $location.path().split(/[\s/]+/).pop(),
        USER_ID: $cookies.get("username"),
        TYPE_MENU_ID: "01",
        VIEW_MENU_ID: "06",
        UPDATED_TIME: date.getTime(),
        NOTEBOOK_PATH: response.data.notebookPath,
        COMMENT: 'Lets try it!'
      };
      console.log("Data to DB savaData:", savaData);
      $http.post('/api/model/new', savaData).success(function (data) {
        console.log("Expert MODE save:", data.msg);
      });
      // $location.path("/explore");
      // });
    });
  };
  $scope.init();
}]);