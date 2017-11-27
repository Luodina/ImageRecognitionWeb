'use strict';
module.exports = {
  dev: {
    dist: 'app',
    port: 9000,
    serverType: 'notebook',
    //notebookUrl: 'http://10.20.51.5:8000/',for hub
    notebookUrl:'http://127.0.0.1:8888/',
    token:'0efe6bc71837e5403993532a427646243e817277e598ff3a',
    notebookPath:'/Users/niuniu/Documents/Project/jupyter-notebooks/',
    jupyterContainerWorkPath:'',//if not jupyter conatainer in use this value is empty
    dataDir: '../data_dir/',
    mariadb: 'mariadb://ocai:Ocai@1234@10.1.236.82:3306/ocai',
    logTo: 'stdout', // 'stdout' or 'file'. if 'file', logs will be saved in 'logs/server.log'
    logLevel: 'debug', // 'debug' or 'info'
    mdpUrl:'http://10.13.6.103:9099',
    jupyterHubHost: '10.20.51.5',
    jupyterHubUserName: 'root',
    jupyterHubPassword: 'Asiainfo123456'
    // huburl:'http://10.20.51.5:8000/user/'
  },
  prod: {
    dist: 'app',
    port: 9000,
    notebookUrl: 'http://127.0.0.1:8888/',
    serverType: 'notebook',
    token: '99917c916760d95049898ac791ad3f7d05d717b183dd6f14',
    mariadb: 'mariadb://ocai:Ocai@1234@10.1.236.82:3306/ocai',
    appPath: 'notebookApp',
    dataDir: '../data_dir/',
    // logTo: 'file', // 'stdout' or 'file's
    // logLevel: 'info', // 'debug' or 'info'
    modelPath: 'notebookModel',
    logTo: 'stdout', // 'stdout' or 'file'
    logLevel: 'debug' // 'debug' or 'info'
  },
  env: 'dev',
  trans: 'zh'
};
