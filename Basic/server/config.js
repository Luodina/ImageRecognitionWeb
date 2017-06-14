"use strict";
module.exports = {
  dev: {
    dist: 'app',
    port: 9000,
    notebook: 'http://127.0.0.1:8888/',
    token:"1460da2f5b0b9caa5dad710e3ba0df16a6e81923aa66e8c4",
    mariadb:"mariadb://ocai:Ocai@1234@10.1.236.82:3306/ocai"
  },
  prod: {
    dist: 'dist',
    port: 9000
  },
  env: "dev",
  trans: "zh",
};
