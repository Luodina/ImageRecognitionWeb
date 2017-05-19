"use strict";
module.exports = {
  dev: {
    dist: 'app',
    port: 9000,
    notebook: 'http://127.0.0.1:8888/',
    token:"e2f072a9b286682f73a90f729333409ac4b42b09044b81e3"
  },
  prod: {
    dist: 'dist',
    port: 9000
  },
  env: "dev"
};
