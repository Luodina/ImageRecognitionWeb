'use strict';
module.exports = {
    dev: {
        dist: 'app',
        port: 9000,
        //notebookUrl: 'http://10.20.51.5:8000/',for hub
        notebookUrl:'http://notebook:8889/lab/',
        token:'9e4f96c5239743a8dd5910216c6f02dad89a58932d63db7f',
        notebookPath:'/app/notebookPath/',
        appPath:'notebookApp',
        serverType: 'notebook',
        modelPath:'notebookModel',
        jupyterContainerWorkPath:'work/notebookPath/',//if no jupyter conatainer in use this value is empty
        mariadb: "mariadb://root:Ocai@1234@mysql:3306/ocai",
        logTo: 'stdout', // 'stdout' or 'file'. if 'file', logs will be saved in 'logs/server.log'
        logLevel: 'debug', // 'debug' or 'info'
        jupyterHubHost: '10.20.51.5',
        jupyterHubUserName: 'root',
        jupyterHubPassword: 'Asiainfo123456'
        // huburl:'http://10.20.51.5:8000/user/'
    },
    prod: {
        dist: 'app',
        port: 9000,
        notebookUrl: 'http://notebook:8888/',
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
