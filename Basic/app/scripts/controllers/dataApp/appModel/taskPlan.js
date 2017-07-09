
"use strict";
angular.module('basic')
  .controller('TaskPlanCtrl',['$rootScope','$filter', '$scope',
  ($rootScope, $filter, $scope) => {

  }])
  .directive('task', () => {
    return {
      templateUrl: 'views/dataApp/appModel/taskPlan.html'
    };
  });

