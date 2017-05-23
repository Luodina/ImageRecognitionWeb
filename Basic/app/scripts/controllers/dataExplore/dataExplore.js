'use strict';
/**
 * Created by JiYi on 17/5/8.
 */
angular.module('basic')
  .controller('DataExploreCtrl',['$rootScope', '$scope', '$filter', '$http', function ($rootScope, $scope, $filter, $http) {
    $scope.msg = $filter('translate')('web_common_006');

    $scope.listofProject = [
      {header:"Structural data", content:{Rows: "1", Columns: 'aaa',NumberOfNumericVariables:'',NumberOfCategoryVariables:'',NullRatio:''}, footer:'Add a description'},
      {header:"Text preprocessing", content:{Ngram: "2", TheNumberOfWords: '1000',NumberOfFeatures:'40998',Weight:'tf-idf'}, footer:'Add a description'}
    ];
    $scope.listofProjectTwo = [
      {header:"Project3", content:"container", footer:'Add a description'},
      {header:"Project4", content:"container container", footer:'Add a description'}
    ]

  }]);
