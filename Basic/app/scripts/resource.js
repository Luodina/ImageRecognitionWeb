'use strict';
angular.module('basic.resource', ['ngResource'])
  .factory('getAllData', ['$resource', 'GLOBAL',function ($resource,GLOBAL) {
    let getAllData = $resource(GLOBAL.host_getAllData +'/datasets', {}, {
    });
    return getAllData;
  }])
;

