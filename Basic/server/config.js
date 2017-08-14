'use strict';
module.exports = {
  dev: {
    dist: 'app',
    port: 9000,
    notebookUrl: 'http://127.0.0.1:8888/',
    token:'e098a342ee3da5d18b0ca872fb2fe99fb50fe5c98bf8a3ce',
    mariadb:'mariadb://ocai:Ocai@1234@10.1.236.82:3306/ocai',
    appPath:'notebookApp',
    modelPath:'notebookModel',
    logTo:'stdout', // 'stdout' or 'file'. if 'file', logs will be saved in 'logs/server.log'
    logLevel:'debug' // 'debug' or 'info'
  },
  prod: {
    dist: 'app',
    port: 9000,
    notebookUrl: 'http://127.0.0.1:8888/',
    token:'e098a342ee3da5d18b0ca872fb2fe99fb50fe5c98bf8a3ce',
    mariadb:'mariadb://ocai:Ocai@1234@10.1.236.82:3306/ocai',
    appPath:'notebookApp',
    modelPath:'notebookModel',
    logTo:'stdout', // 'stdout' or 'file'
    logLevel:'debug' // 'debug' or 'info'
  },
  env: 'dev',
  trans: 'zh'
};
