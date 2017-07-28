'use strict';
let sequelize = require('../sequelize');
let Sequelize = require('sequelize');
let AppResults = require('../model/APP_RESULTS')(sequelize, Sequelize);
let express = require('express');
let router = express.Router();
let fs = require('fs-extra');
const path = require('path');
const config = require('./../config');
const env = config.env || 'dev';
const appPath=config[env].appPath;
const dataAppPath=path.join(__dirname, '../../' + appPath);


//------------------------------------------------------------functions
function viewReports(appName,scheduleName,time) {
  let result=[];
  let filePath =dataAppPath+'/'+appName+'/reports/'+scheduleName+'/'+time;
  function finder(fp) {
    let files=fs.readdirSync(fp);
    files.forEach((val,index) => {
      let fPath=path.join(fp,val);
      let stats=fs.statSync(fPath);
      if(stats.isDirectory()){
        finder(fPath);
      }
      if(stats.isFile()){
        let index = val.indexOf('.');
        let fileType=val.substr(index+1);
        let content='';
        if(fileType==='txt' || fileType==='out'){
          content=fs.readFileSync(fPath,'utf-8');
        }
        let jsonObj ={name:val,path:fPath,fileType:fileType,content:content};
        result.push(jsonObj);
      }
    });

  }
  finder(filePath);
  return result;
}

//medical_records_analysis/reports/plan-1/201707261519
//viewReports('medical_records_analysis','plan-1','201707261519');

//UPDATE `APP_RESULTS` SET `EXECUTE_STATUS`='SUCCESS' WHERE `ID`='32bdd11d-f3d1-46bf-9326-924003667c53';
function updateStutus(id,stauts,cb) {
  let param = {EXECUTE_STATUS:stauts};
  sequelize.transaction(function(){
    return AppResults.update(
      param,{
        where:{ID:id}
      }
    ).then(function() {
      cb('success');
    }).catch(function(err){
      console.log('err', err);
      cb('err');
    });
  });

  //
}

// SELECT * FROM APP_RESULTS;
function getAllResultsList() {
  AppResults.findAll({ raw: true })
    .then(results => {
      //console.log('success get all results list',results);
      results.forEach(function (result) {
        // IF result.EXECUTE_STATUS NULL then to find the outputs
        if(!result.EXECUTE_STATUS){
          //to find the outputs location at app_name/reports/schedule_name/schedule_time
          //.../OCAI/Basic/myAppFoldermedical_records_analysis/reports/plan-1/201707261955
          const outputs_path = dataAppPath+'/'+ result.APP_NAME+'/reports/'+result.SCHEDULE_NAME+'/'+result.EXECUTE_TIME;
          const report_path = outputs_path+'/'+result.SCHEDULE_TARGET+'.html';
          const err_path = outputs_path+'/error.out';
          fs.pathExists(report_path, (err, exists) => {
            if(exists){
              console.log('files------->',exists); // => false
              //update execute_stauts in db
              let status=null;
              if(exists){
                status='SUCCESS';
                updateStutus(result.ID,status,function (msg) {
                  if(msg!=='success'){
                    console.log('update err-----',msg);
                  }
                });
              }

            }else if(err){
              console.log('files------->err',err); // => null
            }
          });
          fs.pathExists(err_path, (err, exists) => {
            if(exists){
              console.log('files------->',exists); // => false
              //update execute_stauts in db
              let status=null;
              if(exists){
                status='FAILED';
                updateStutus(result.ID,status,function (msg) {
                  if(msg!=='success'){
                    console.log('update err-----',msg);
                  }
                });
              }

            }else if(err){
              console.log('files------->err',err); // => null
            }
          });

        }


      });
    })
    .catch(err =>{console.log('err',err);});
}
setInterval(getAllResultsList,10000);


//------------------------------------------------------------routers

router.get('/getReportViews',(req, res) => {
  let app_name = req.params.appName;
  let schedule_name = req.params.scheduleName;
  let execute_time = req.params.executeTime;
  if(app_name!==''&&schedule_name!==''&&execute_time!==''){
    res.send({results:viewReports(app_name,schedule_name,execute_time)});
  }else{
    res.send({error:'get views failed!'});
  }

});


//SELECT SCHEDULE_NAME FROM APP_RESULTS WHERE APP_NAME='medical_records_analysis'  GROUP BY SCHEDULE_NAME;
router.get('/getScheduleNames/:appName',(req, res) => {
  let app_name = req.params.appName;
  AppResults.findAll({
    group:'SCHEDULE_NAME',
    where:{APP_NAME:app_name},
    raw: true
  }).then(results => {
    //console.log('groupby--------->>>>>',results)
    res.send({results});
  }).catch(err=>{
    console.log('err',err);
  });
});

//    SELECT * FROM APP_RESULTS WHERE SCHEDULE_NAME=schedule_name
router.get('/getResultsList/:scheduleName',(req, res) => {
  let schedule_name = req.params.scheduleName;
  let resultArr=[];
  AppResults.findAll({
    where:{SCHEDULE_NAME:schedule_name}
  }).then(results => {
    results.forEach(function (result) {
      let jsonObj ={
        ID:result.ID,
        SCHEDULE_NAME:result.SCHEDULE_NAME,
        APP_NAME:result.APP_NAME,
        EXECUTE_TIME:result.EXECUTE_TIME,
        SCHEDULE_TARGET:result.SCHEDULE_TARGET,
        EXECUTE_STATUS:result.EXECUTE_STATUS,
        RESULTS_LIST:result.RESULTS_LIST
      };
      resultArr.push(jsonObj);
    });
    res.send({resultArr});
  }).catch(err=>{
    console.log('err',err);
  });
});






module.exports = router;

