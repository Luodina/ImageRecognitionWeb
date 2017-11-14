'use strict';

let path = require('path');
let templatePath= __dirname + '/../template';
let notebookTemplates = 'notebookTemplates';

const template_map = {
  0: '自由模式',
  1: '结构化数据探索',
  2: '文本数据预处理',
  3: '分类预测',
  4: '文本聚类分析',
  5: '目标检测',
  6: '自由模式'
};

module.exports = {
  getTemplateNotebook: function(id) {
    return path.join(templatePath,
      notebookTemplates,
      template_map[id in template_map? id : 0],
      'notebook.ipynb');
  },
  getAppFolderTemplate: function() {
    return path.join(templatePath, 'APP_INIT');
  }
};
