//
'use strict';
let sequelize = require('../sequelize');
let Sequelize = require('sequelize');
let MakeFile = require('../model/APP_MAKEFILE')(sequelize, Sequelize);
let express = require('express');
let router = express.Router();

// SELECT * from APP_MAKEFILE;
router.get('/getMakeFileList', (req, res) => {    
    MakeFile.findAll({raw: true})
    .then(makeFile => { res.send({MakeFile});})
    .catch(err =>{console.log("err",err);});    
});

// SELECT * from APP_MAKEFILE where MAKEFILE_ID = 1;
router.get('/:makeFileID', (req, res) => {
  let makeFileID = req.params.makeFileID;
  console.log("makeFileID",makeFileID); 
  if (makeFileID !== null){
    MakeFile.findAll({
        where: { MAKEFILE_ID: makeFileID},
        raw: true
    })
    .then(makeFile => {  
      console.log("MakeFile is:",MakeFile); 
      res.send({MakeFile: MakeFile});
    })
    .catch(err =>{console.log("err",err);});
  }
});

// create new makeFileID
router.post('/:makeFileID', (req, res) => {
    let makeFile = req.body.MAKEFILE_ID;
    let userName = req.body.USER_ID;
    let appID = req.body.APP_ID;
    let target = req.body.TARGET;
    let prerequisites = req.body.PREREQUISITES;
    let flag = req.body.FLAG;
    console.log("req.body", req.body);
    sequelize.transaction(t => {
        return MakeFile.create({
            ID: t.id, 
            MAKEFILE_ID: makeFile, 
            USER_ID: userName,
            APP_ID: appID, 
            TARGET: target,
            PREREQUISITES: prerequisites,
            FLAG: flag,
            isNewRecord:true})
            .then(() => {res.send({ msg:"Success!!!!" });})
            .catch(err =>{console.log("err", err);});
    }); 
});