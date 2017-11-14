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
  .factory('makefileList', ['$resource', 'GLOBAL',function ($resource,GLOBAL) {
    let makefileList = $resource(GLOBAL.host_makefile+'/getMakeFileList/:appName', {appName:'@appName'}, {
    });
    return makefileList;
  }])
;

