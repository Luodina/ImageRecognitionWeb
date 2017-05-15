'use strict';
/**
 * Resource file for en g18n
 */
angular.module('basic').config(['$translateProvider', function($translateProvider) {
  $translateProvider.translations('zh', {
    'web_common_000': 'OCAI',
    'web_common_001': '数据应用',
    'web_common_002': '数据探索',
    'web_common_003': '任务计划',
    'web_common_004': '知识图谱',
    'web_common_005': '系统设置',
    'web_common_006': '添加应用',
    'web_common_007': '我的数据探索',
    'web_common_008': '结构化数据探索',
    'web_common_009': '下一步',
    
    'web_common_data_explore_001': '数据选择',
    'web_common_data_explore_002': '数据探索',
    'web_common_data_explore_003': '数据预处理建议',
    'web_common_data_explore_004': '结构化数据探索',
    'web_common_data_explore_005': '默认数据源 通过参数设置配置的数据源(CDM接口)',
    'web_common_data_explore_006': '数据文件导入',
    'web_common_data_explore_007': '导入',
    'web_common_data_explore_008': '数据预览',

  });
}]);
