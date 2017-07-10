"use strict";
module.exports = {
  dev: {
    dist: 'app',
    port: 9000,
    notebookUrl: 'http://127.0.0.1:8889/',
    notebookPath: "/Users/JiYi",
    token:"e8437e50fa7266693a21a59f6ab6bfe7393e95dcc841afc8",
    mariadb:"mariadb://ocai:Ocai@1234@10.1.236.82:3306/ocai"
  },
  prod: {
    dist: 'app',
    port: 9000,
    notebookUrl: 'http://127.0.0.1:8889/',
    notebookPath: "@NOTEBOOK_PATH@",
    token:"e8437e50fa7266693a21a59f6ab6bfe7393e95dcc841afc8",
    mariadb:"mariadb://@MARIADB_UNAME@:@MARIADB_PWD@@@MARIADB_ADDR@/@MARIADB_DATABASE@"
  },
  env: "dev",
  trans: "zh"
};
