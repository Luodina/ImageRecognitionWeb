'use strict';
angular.module('basic.resource', ['ngResource'])
  .factory('getAllData', ['$resource', 'GLOBAL',function ($resource,GLOBAL) {
    let getAllData = $resource(GLOBAL.host_getAllData +'/datasets', {}, {
    });
    return getAllData;
  }])
  .factory('appList', ['$resource', 'GLOBAL',function ($resource,GLOBAL) {
    let appList = $resource(GLOBAL.host_app, {}, {
    });
    return appList;
  }])
  .factory('appDetail', ['$resource', 'GLOBAL',function ($resource,GLOBAL) {
    return $resource(GLOBAL.host_app+'/:appName', {appName:'@appName'}, {});
  }])
  .factory('templateList', ['$resource', 'GLOBAL',function ($resource,GLOBAL) {
    let templateList = $resource(GLOBAL.host_expert +'/notebook/templateList', {}, {
    });
    return templateList;
  }]);
