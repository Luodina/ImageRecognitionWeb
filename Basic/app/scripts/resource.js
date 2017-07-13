'use strict';
angular.module('basic.resource', ['ngResource'])
  .factory('projectList', ['$resource', 'GLOBAL',function ($resource,GLOBAL) {
    var projectList = $resource(GLOBAL.host_model+'/getProjectList', {}, {
    });
    return projectList;
  }])
  .factory('appList', ['$resource', 'GLOBAL',function ($resource,GLOBAL) {
    var appList = $resource(GLOBAL.host_app+'/getAppList', {}, {
    });
    return appList;
  }])
  .factory('dataFactory', ['$resource', '$http', function ($resource, $http) {
    return {
      getProjectList: () => {
        return $http.get('/api/model/getProjectList').success(function (data) {
          console.log("getProjectList", data);
        });
      },
      getAppList: () => {
        return $http.get('/api/app/getAppList').success(function (data) {
          console.log("getAppList", data);
        });
      }
    }
  }])

