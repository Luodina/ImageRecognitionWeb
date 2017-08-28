'use strict';
module.exports = {
    dev: {
        dist: 'app',
        port: 9000,
        notebookUrl: 'http://127.0.0.1:8888/',
        token: '99917c916760d95049898ac791ad3f7d05d717b183dd6f14',
        mariadb: 'mariadb://ocai:Ocai@1234@10.1.236.82:3306/ocai',
        appPath: 'notebookApp',
        modelPath: 'notebookModel',
        logTo: 'stdout', // 'stdout' or 'file'. if 'file', logs will be saved in 'logs/server.log'
        logLevel: 'debug' // 'debug' or 'info'
    },
    prod: {
        dist: 'app',
        port: 9000,
        notebookUrl: 'http://127.0.0.1:8888/',
        token: '99917c916760d95049898ac791ad3f7d05d717b183dd6f14',
        mariadb: 'mariadb://ocai:Ocai@1234@10.1.236.82:3306/ocai',
        appPath: 'notebookApp',
        modelPath: 'notebookModel',
        logTo: 'stdout', // 'stdout' or 'file'
        logLevel: 'debug' // 'debug' or 'info'
    },
    env: 'dev',
    trans: 'zh'
};