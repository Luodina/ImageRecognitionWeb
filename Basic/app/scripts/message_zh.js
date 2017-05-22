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
    'web_common_010': '用户名',
    'web_common_011': '密码',
    'web_common_012': '登录',
    'web_common_013': '退出',
    'web_common_014': '用户名或密码错误,请重新输入',


    'web_common_data_explore_001': '数据选择',
    'web_common_data_explore_002': '数据探索',
    'web_common_data_explore_003': '数据预处理建议',
    'web_common_data_explore_004': '结构化数据探索',
    'web_common_data_explore_005': '默认数据源 通过参数设置配置的数据源(CDM接口)',
    'web_common_data_explore_006': '数据文件导入',
    'web_common_data_explore_007': '导入',
    'web_common_data_explore_008': '数据预览',
    'web_common_data_explore_009': '步骤一  高关联性变量去重(请勾选保留的变量)',
    'web_common_data_explore_010': '步骤二  变量空值处理',
    'web_common_data_explore_011': '步骤三  变量正则化',
    'web_common_data_explore_012': '应用',
    'web_common_explore_013':' File uploaded'


  });
}]);
