'use strict';
/**
 * Resource file for en g18n
 */
angular.module('basic').config(['$translateProvider', function($translateProvider) {
  $translateProvider.translations('en', {
    'web_common_000': 'OCAI',
    'web_common_001': 'Dashboard',
    'web_common_002': 'Data Source',
    'web_common_003': 'Data Report',
    'web_common_004': 'Data Processing'
  });
}]);