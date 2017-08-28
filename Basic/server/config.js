'use strict';
module.exports = {
    // dev: {
    //   dist: 'app',
    //   port: 9000,
    //   jupyterUrl: 'http://10.1.236.83:8800/',
    //   mariadb:'mariadb://ocai:Ocai@1234@10.1.236.82:3306/ocai',
    //   logTo:'stdout', // 'stdout' or 'file'. if 'file', logs will be saved in 'logs/server.log'
    //   logLevel:'debug' // 'debug' or 'info'
    // },
    dev: {
        dist: 'app',
        port: 9000,
        notebookUrl: 'http://10.1.236.83:8800',
        token: 'ab29f71d86c4ba321a33475a2c6fe6752025209d3ef30dcc',
        mariadb: 'mariadb://ocai:Ocai@1234@10.1.236.82:3306/ocai',
        appPath: 'notebookApp',
        modelPath: 'notebookModel',
        logTo: 'stdout', // 'stdout' or 'file'
        logLevel: 'debug' // 'debug' or 'info'
    },
    env: 'dev',
    trans: 'zh'
};