"use strict";
module.exports = {
  dev: {
    dist: 'app',
    port: 9000,
    notebook: 'http://127.0.0.1:8888/',
    token:"2dcfb272ea12e2156528a2193e20c56f1fb3214090e3c163",
    mariadb:"mariadb://ocai:Ocai@1234@10.1.236.82:22022/OCAI"
  },
  prod: {
    dist: 'dist',
    port: 9000
  },
  env: "dev",
  trans: "zh",
};
