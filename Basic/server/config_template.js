'use strict';
module.exports = {
    dev: {
        dist: 'app',
        port: 9000,
        notebookUrl: 'http://127.0.0.1:8888/',
        token: '09b2dc4b7260f502950a27ee106b917cae813ec1f1c22922',
        notebookPath: '/Users/niuniu/Documents/Project/jupyter-notebooks/',
        mariadb: 'mariadb://ocai:Ocai@1234@10.1.236.82:3306/ocai',
        jupyterContainerWorkPath: '', //if not jupyter conatainer in use this value is empty
        logTo: 'stdout', // 'stdout' or 'file'. if 'file', logs will be saved in 'logs/server.log'
        logLevel: 'debug', // 'debug' or 'info'
    },
    prod: {
        dist: 'app',
        port: 9000,
        notebookUrl: 'http://@JUPYTER_IP@:@JUPYTER_PORT@/',
        token: '@JUPYTER_TOKEN@',
        notebookPath: '@JUPYTER_WORKDIR@',
        mariadb: 'mariadb://@MYSQL_UNAME@:@MYSQL_PWD@@@MYSQL_ADDR@/@MYSQL_DATABASE@',
        jupyterContainerWorkPath: '@JUPYTER_CONTAINER_WORKDIR@', //if not jupyter conatainer in use this value is empty
        logTo: 'stdout', // 'stdout' or 'file'
        logLevel: 'debug' // 'debug' or 'info'
    },
    env: 'dev',
    trans: 'zh'
};