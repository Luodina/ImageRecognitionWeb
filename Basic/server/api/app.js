//
'use strict';
let sequelize = require('../sequelize');
let Sequelize = require('sequelize');
let App = require('../model/APP_INFO')(sequelize, Sequelize);
let express = require('express');
let router = express.Router();
let moment = require('moment');

router.get('/getAppList', (req, res)=>{    
    App.findAll({ raw: true })
    .then(app => { res.send({app});})
    .catch(err => { console.log("err",err);});    
});

module.exports = router; 