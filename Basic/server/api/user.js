//
'use strict';
// let sequelize = require('../sequelize');
// let Sequelize = require('sequelize');
// let User = require('../model/USER_INFO')(sequelize, Sequelize);
let express = require('express');
let router = express.Router();

router.get('/login', function(req, res){
    User.findAll().then(function (user) {
      res.send({hello:1});
    }, function () {
      res.status(500).send('databaseError');
    });
});

module.exports = router; 