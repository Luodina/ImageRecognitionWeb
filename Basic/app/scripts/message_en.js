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
    'web_common_009': 'Next',

    'web_common_data_explore_001': 'Data Source',
    'web_common_data_explore_002': 'Data Report',
    'web_common_data_explore_003': 'Data Processing',
    'web_common_data_explore_004': 'Data datamation demo',
    'web_common_data_explore_005': 'Default data source Data source (CDM interface) configured with parameter settings',
    'web_common_data_explore_006': 'Data file import',
    'web_common_data_explore_007': 'Import',
    'web_common_data_explore_008': 'Data preview',
    'web_common_data_explore_009': 'Step one  High relevance variable to weight (check the reserved variables)',
    'web_common_data_explore_010': 'Step two  Variable null processing',
    'web_common_data_explore_011': 'Step three Variable regularization',
    'web_common_data_explore_012': 'Application',
    'web_common_explore_013':'File uploaded'




  });
}]);
