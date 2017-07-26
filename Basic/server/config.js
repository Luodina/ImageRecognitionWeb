'use strict';
module.exports = {
  dev: {
    dist: 'app',
    port: 9000,
    notebookUrl: 'http://127.0.0.1:8888/',
    token:'56d721a9ae536e5a592868d1dac3e6129e332f158a2e44b8',
    mariadb:'mariadb://ocai:Ocai@1234@10.1.236.82:3306/ocai',
    appPath:'notebookApp',
    modelPath:'notebookModel'
  },
  prod: {
    dist: 'app',
    port: 9000,
    notebookUrl: 'http://127.0.0.1:8888/',
    token:'56d721a9ae536e5a592868d1dac3e6129e332f158a2e44b8',
    mariadb:'mariadb://ocai:Ocai@1234@10.1.236.82:3306/ocai',
    appPath:'notebookApp',
    modelPath:'notebookModel'
  },
  env: 'dev',
  trans: 'zh',
};
