"use strict";
module.exports = {
  dev: {
    dist: 'app',
    port: 9000,
    notebook: 'http://127.0.0.1:8888/',
    token:"c1c371a961b3d5e3f7998bb13f0d4ed141d5909e2c039cb9",
    mariadb:"mariadb://ocai:Ocai@1234@10.1.236.82:22022/OCAI"
  },
  prod: {
    dist: 'dist',
    port: 9000
  },
  env: "dev",
  trans: "zh",
};
