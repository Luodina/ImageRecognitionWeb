"use strict";

module.exports = {
  prod: {
    dist: 'app',
    port: 9000,
    notebookUrl: 'http://notebook:8888/',
    notebookPath: "/aura-data",
    token: "9e4f96c5239743a8dd5910216c6f02dad89a58932d63db7f",
    mariadb: "mariadb://root:1qaz@wsx@aura_mysql:3306/ocai"
  },
  env: "prod",
  trans: "zh"
};