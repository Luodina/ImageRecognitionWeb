"use strict";
module.exports = {
  dev: {
    dist: 'app',
    port: 9000,
    notebookUrl: 'http://127.0.0.1:8888/',
    notebookPath: "/Users/luodina/Desktop/jupyterFile",
    token:'add5328f28833dc092d8f04765349c819b4358f7c9b6aba8',
    mariadb:'mariadb://ocai:Ocai@1234@10.1.236.82:3306/ocai',
    dataAppPath:'/Users/luodina/Desktop/App'
  },
  prod: {
    dist: 'app',
    port: 9000,
    notebookUrl: 'http://127.0.0.1:9000/',
    notebookPath: "@NOTEBOOK_PATH@",
    token:"1d0d0eb3f35da2aa3881ed76920464b053aec02766ec52dc",
    mariadb:"mariadb://@MARIADB_UNAME@:@MARIADB_PWD@@@MARIADB_ADDR@/@MARIADB_DATABASE@"
  },
  env: 'dev',
  trans: 'zh',
};
