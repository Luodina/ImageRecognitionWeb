'use strict';
let Sequelize = require('sequelize');
let config = require('./config');
let env = config.env || 'dev';
let sequelize = new Sequelize(config[env].mariadb, {logging: false});

sequelize.authenticate()
  .then(() => {
    console.log('Connection to', config[env].mariadb ,' has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', config[env].mariadb, err);
  });
module.exports = sequelize;