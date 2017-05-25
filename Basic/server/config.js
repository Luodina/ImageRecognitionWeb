"use strict";
module.exports = {
  dev: {
    dist: 'app',
    port: 9000,
    notebook: 'http://127.0.0.1:8888/',
    token:"91de8f757552677d4c91f0fbc4a8d820d20ea40e13960b00"
  },
  prod: {
    dist: 'dist',
    port: 9000
  },
  env: "dev"
};
