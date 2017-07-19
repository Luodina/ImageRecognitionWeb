"use strict";
module.exports = {
  dev: {
    dist: 'app',
    port: 9000,
    notebookUrl: 'http://127.0.0.1:8890/',
    notebookPath: "/Users/luodina",
    token:'c48b9d013a9a2e38c6a5fc9170fe23f96d0453c8ebd5c9fd',
    mariadb:'mariadb://ocai:Ocai@1234@10.1.236.82:3306/ocai',
    dataAppPath:'/Users/luodina/Documents/AppSet'
  },
  prod: {
    dist: 'app',
    port: 9000,
    notebookUrl: 'http://127.0.0.1:8888/',
    notebookPath: "@NOTEBOOK_PATH@",
    token:"37994b6a250c972c72574f1d5b775c54d95360f3618e59b0",
    mariadb:"mariadb://@MARIADB_UNAME@:@MARIADB_PWD@@@MARIADB_ADDR@/@MARIADB_DATABASE@"
  },
  env: 'dev',
  trans: 'zh',
};
