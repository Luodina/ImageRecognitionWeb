'use strict';
let sequelize = require('../sequelize');
let Sequelize = require('sequelize');
let MakeSchedule = require('../model/APP_MAKESCHEDULE')(sequelize, Sequelize);
let express = require('express');
let router = express.Router();
let moment = require('moment');

// SELECT * from APP_MAKESCHEDULE;
router.get('/getMakeScheduleList', (req, res) => {    
    MakeSchedule.findAll({ raw: true })
    .then(makeSchedule => { res.send({ makeSchedule });})
    .catch(err =>{console.log('err',err);});    
});

// SELECT * from APP_MAKESCHEDULE where APP_MAKESCHEDULE = 1;
router.get('/:makeSchedule', (req, res) => {
  let makeSchedule = req.params.makeSchedule;
  console.log('makeSchedule',makeSchedule); 
  if (makeSchedule !== null){
    MakeSchedule.findAll({
        where: { APP_MAKESCHEDULE: makeSchedule},
        raw: true
    })
    .then(makeSchedule => {  
      console.log('makeSchedule is:',makeSchedule); 
      res.send({makeSchedule: makeSchedule});
    })
    .catch(err =>{console.log('err',err);});
  }
});

// create new makeScheduleID
router.post('/:makeScheduleID', (req, res) => {
    let appID = req.body.APP_ID;
    let scheduleName = req.body.SCHEDULE_NAME;
    let state = req.body.STATE;
    let command = req.body.COMMAND;
    sequelize.transaction(t => {
        return MakeSchedule.create({
            ID: t.id, 
            APP_ID: appID, 
            SCHEDULE_NAME:scheduleName,
            STATE:state,
            COMMAND:command,
            SECOND: '2',
            MINUTE: '3',
            HOUR: '9',
            DATE: '6',
            MONTH: '7',
            YEAR: '2017',
            DAYOFWEEK: '3',
            isNewRecord:true})
            .then(() => {res.send({ msg:'Success!!!!' });})
            .catch(err =>{console.log('err', err);});
    }); 
});

module.exports = router;
