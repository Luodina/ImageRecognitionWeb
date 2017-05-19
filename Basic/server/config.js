"use strict";
module.exports = {
  dev: {
    dist: 'app',
    port: 9000,
    notebook: 'http://127.0.0.1:8888/',
    token:"b61d93a4869b8852c0a8633ba40c07ff603944f7c400188c"
  },
  prod: {
    dist: 'dist',
    port: 9000
  },
  env: "dev"
};
