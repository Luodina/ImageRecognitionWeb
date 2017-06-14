//
'use strict';
let sequelize = require('../sequelize');
let Sequelize = require('sequelize');
let Model = require('../model/MODEL_INFO')(sequelize, Sequelize);
let express = require('express');
let router = express.Router();

router.get('/getProjectList', function(req, res){
    
    Model.findAll({
      raw: true
    }).then(function(model){  
        res.send({model});
    }).catch(err =>{
        console.log("err",err);
    });
    
});

router.post('/newModel', function(req, res){
    let modelName = req.body.MODEL_NAME;
    let userName = req.body.USER_ID;
    let viewOrCode = req.body.VIEW_OR_CODE;
    let menuID = req.body.VIEW_MENU_ID;
    let time = req.body.UPDATED_TIME;
    let items = req.body.USER_INPUT_ITEMS;
    console.log("req.body", req.body);
    sequelize.transaction(function (t) {
        return Model.create({
            MODEL_ID: t.id, 
            MODEL_NAME: modelName, 
            USER_ID: userName, 
            VIEW_OR_CODE: viewOrCode,
            VIEW_MENU_ID: menuID,
            UPDATED_TIME: time,
            USER_INPUT_ITEMS: items,
            FILE_PATH: 'iris.csv',
            isNewRecord:true})
            .then(function(){res.send({msg:"Success!!!!"});})
            .catch(err =>{console.log("err",err);});
    }) 
});

router.get('/:modelName', function(req, res){
  let modelName = req.params.modelName;
  console.log("req.params.modelName",req.params.modelName, "modelName",modelName); 
  if (modelName !== null){
    Model.findOne({
        where: { MODEL_NAME: modelName},
        raw: true
    })
    .then(function(model){  
      console.log("model is:",model); 
      res.send(model);
    })
    .catch(err =>{
      console.log("err",err);
    });
  }
});
module.exports = router; 