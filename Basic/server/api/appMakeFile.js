'use strict';
let sequelize = require('../sequelize');
let Sequelize = require('sequelize');
let MakeFile = require('../model/APP_MAKEFILE')(sequelize, Sequelize);
let express = require('express');
let router = express.Router();

router.get('/getMakeFileList/:appID', (req, res) => {   
  let appID = req.params.appID;
  if (appID !== null){
    MakeFile.findAll({
        where: { APP_ID: appID},
        order: [['MAKEFILE_ID']],//'MAKEFILE_ID DESC',
        raw: true
    })
    .then(appMakeFileList => {   
      res.send({appMakeFileList: appMakeFileList});
    })
    .catch(err =>{console.log('err',err);});
  }
});

// create new makeFileID
router.post('/new', (req, res) => {
    let makeFile = req.body.MAKEFILE_ID;
    let userName = req.body.USER_ID;
    let appID = req.body.APP_ID;
    let target = req.body.TARGET;
    let prerequisites = req.body.PREREQUISITES;
    let flag = req.body.FLAG;
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
            .then(() => {res.send({ msg:'success' });})
            .catch(err =>{console.log('err', err);});
    }); 
});

module.exports = router;