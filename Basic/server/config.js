"use strict";
module.exports = {
  dev: {
    dist: 'app',
    port: 9000,
    jupyter: 'http://localhost:8889/',
    token:'2115ff8b40b63374edc0edfd14533defdacc024df4f7832a'
  },
  prod: {
    dist: 'dist',
    port: 9000
  },
  env: "dev"
};
