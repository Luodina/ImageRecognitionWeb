"use strict";
module.exports = {
  dev: {
    dist: 'app',
    port: 9000,
    notebookUrl: 'http://127.0.0.1:8888/',
    notebookPath: "/Users/luodina",
    token:"37994b6a250c972c72574f1d5b775c54d95360f3618e59b0",
    mariadb:"mariadb://ocai:Ocai@1234@10.1.236.82:3306/ocai"
  },
  prod: {
    dist: 'dist',
    port: 9000
  },
  env: "dev",
  trans: "zh",
};
