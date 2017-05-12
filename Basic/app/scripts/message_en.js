'use strict';
/**
 * Resource file for en g18n
 */
angular.module('basic').config(['$translateProvider', function($translateProvider) {
  $translateProvider.translations('en', {
    'web_common_000': 'OCAI',
    'web_common_001': 'Data Application',
    'web_common_002': 'Data Explore',
    'web_common_003': 'Task Schedule',
    'web_common_004': 'Knowledge Map',
    'web_common_005': 'Settings',
    'web_common_006': 'Add',
    'web_common_007': 'My data explore',
    'web_common_008': 'Structural data',

    'web_common_data_explore_001': 'Data Source',
    'web_common_data_explore_001': 'Data File',
    'web_common_data_explore_002': 'Data Report',
    'web_common_data_explore_003': 'Data Processing',
  });
}]);
