"use strict";
module.exports = {
  dev: {
    dist: 'app',
    port: 9000,
    notebook: 'http://127.0.0.1:8888/',
    token:"f3c61d3f9402a6ba0f7ce767f863d84cb80807c82b4dce5a",
    mariadb:"mariadb://ocai:Ocai@1234@10.1.236.82:22022/OCAI"

  },
  prod: {
    dist: 'dist',
    port: 9000
  },
  env: "dev",
  trans: "zh",
};
