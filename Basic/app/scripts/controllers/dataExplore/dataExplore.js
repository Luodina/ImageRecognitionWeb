'use strict';
angular.module('basic')
  .controller('DataExploreCtrl',['buildLog','$rootScope','$scope','$filter','$http','$timeout', function (buildLog, $rootScope, $scope, $filter, $http, $timeout) {
    $scope.msg = $filter('translate')('web_common_data_explore_002');
    $scope.listofProject = [
      {header:"Structural data", content:{Rows: "1", Columns: 'aaa',NumberOfNumericVariables:'',NumberOfCategoryVariables:'',NullRatio:''}, footer:'Add a description'},
      {header:"Text preprocessing", content:{Ngram: "2", TheNumberOfWords: '1000',NumberOfFeatures:'40998',Weight:'tf-idf'}, footer:'Add a description'}
    ];
    $scope.listofProjectTwo = [
      {header:"Project3", content:"container", footer:'Add a description'},
      {header:"Project4", content:"container container", footer:'Add a description'}
    ];
    $scope.listofProjectTwoCount = $scope.listofProjectTwo.length;
    $scope.newProject = function () {
      buildLog.open(); 
    };
    

    function getProjectList() {
      console.log("inside getProjectList");
      $http.get('/api/model/getProjectList').success(function(data){
        console.log("getProjectList:", data.model);
        $timeout(function(){
          $scope.listofProjectTwo = data.model;
          // Notification.success('Success!!!');
        }, 1000);     
      });   
    };
    getProjectList();
}]);



