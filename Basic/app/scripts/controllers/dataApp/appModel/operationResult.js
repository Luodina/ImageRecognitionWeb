
"use strict";
angular.module('basic')
  .controller('ResultCtrl',['appOperResult','$location','$rootScope','$filter','$scope','$http',
  (appOperResult,$location,$rootScope,$filter, $scope,$http) => {
    $scope.appName = $location.path().split(/[\s/]+/).pop();
    $scope.projectType=[];
    $scope.projectTypeList=[];

    $http.get('/api/appResults/getScheduleNames/'+ $scope.appName )
      .success((data)=> {
        let result = data.results;
        if (result !== null && result !== undefined){
          $scope.projectType = result;
          result.forEach((projectType,  i)=> {
            console.log('!!!!!projectType',projectType)
            $http.get('/api/appResults/getResultsList/' + projectType.SCHEDULE_NAME )
            .success((resList) => {
              if (resList !== null && resList !== undefined){
                $scope.projectType[i].resList = resList.resultArr;
                console.log('111111111111',$scope.projectType[i].resList)
              }
            })
            .catch(err =>{console.log('err', err);})
          })
        }

      });



    $scope.view =() => {
      appOperResult.open()
    }
  }])
  .directive('result', () => {
    return {
      templateUrl: 'views/dataApp/appModel/operationResult.html'
    };
  })
