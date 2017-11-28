'use strict';
module.exports = {
    dev: {
        dist: 'app',
        port: '@WEB_PORT@',
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