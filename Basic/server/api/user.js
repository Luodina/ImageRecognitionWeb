//
'use strict';
let sequelize = require('../sequelize');
let Sequelize = require('sequelize');
let User = require('../model/USER_INFO')(sequelize, Sequelize);
let express = require('express');
let router = express.Router();

router.post('/login', function(req, res){
  let username = req.body.username;
  let pass = req.body.password;
  console.log("username",username);
  console.log("pass",pass);
  res.send({status: true});
});

module.exports = router; 