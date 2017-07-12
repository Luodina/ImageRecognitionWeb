
"use strict";
angular.module('basic')
  .controller('TaskPlanCtrl',['$rootScope','$filter', '$scope','createTaskPlan',
  ($rootScope, $filter, $scope,createTaskPlan) => {
    $scope.openTaskPlan = ()=>{
      createTaskPlan.open()
    }
  }])
  .directive('task', () => {
    return {
      templateUrl: 'views/dataApp/appModel/taskPlan.html'
    };
  });

