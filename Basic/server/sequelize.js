"use strict";
// sequelize config
let Sequelize = require('sequelize');
let config = require('./config');
let env = config.env || 'dev';
console.log("config[env].mariadb", config[env].mariadb);
let sequelize = new Sequelize(config[env].mariadb);

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
module.exports = sequelize;