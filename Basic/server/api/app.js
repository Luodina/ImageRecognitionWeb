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

router.get('/:appName', function(req, res){
  let appName = req.params.appName;
  console.log("req.params.appName",req.params.appName, "appName",appName); 
  if (appName !== null){
    App.findOne({
        where: { APP_NAME: appName},
        raw: true
    })
    .then(app => {  
      console.log("app is:",app); 
      res.send({result: app});
    })
    .catch(err =>{console.log("err",err);});
  }
});

router.post('/:appName', function(req, res){
    let appName = req.body.APP_NAME;
    let userName = req.body.USER_NAME;
    console.log("appName",appName);
    sequelize.transaction(t => {
        return App.create({
            APP_ID: t.id, 
            APP_NAME: appName,
            USER_NAME: userName, 
            isNewRecord:true})
            .then(() => {res.send({ msg:"Success!!!!" });})
            .catch(err =>{console.log( "err",err );});
    }) 
});

module.exports = router; 