'use strict';
import {mkdir,readdir, createReadStream, createWriteStream} from 'fs';
import {copySync,moveSync} from 'fs-extra';
const fs = require('fs');
const express = require('express');
const router = express.Router();
const path = require('path');
const config = require('./../config');
let env = config.env || 'dev';

let templatIpynbPath = path.join(__dirname, '../../template/notebookTemplates/');
let baseNotebookPath;
let baseNotebookUrl = config[env].notebookUrl;
let templatIpynbFile = 'new.ipynb';
const modelPath = config[env].modelPath;
const appPath = config[env].appPath;

//notebook
function notebookPath(type){
  if (type === 'explore'){
    return path.join(__dirname, '../../' + modelPath);
  } else {
    return path.join(__dirname, '../../' + appPath);
  }
}
function notebookDir(type){
  if (type === 'explore'){
    return 'notebookModel';
  } else {
    return 'notebookApp';
  }
}

function deleteall(path) {
  var files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteall(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

router.get('/pathNoteBook', function (req, res) {
  let modelName = req.query.modelName;
  let type = req.query.modelType;
  let projectType=type;
  baseNotebookPath = notebookPath(type);
  let dirName = path.join(baseNotebookPath, modelName);
  let destUrl = baseNotebookUrl + 'notebooks/'+ notebookDir(type)+ '/' + projectType + '/' + modelName + '.ipynb';
  if (type === 'explore'){
    let templateDir = req.query.modelTemplate;
    templatIpynbFile = req.query.modelTemplate + '.ipynb';
    projectType = modelName;
    mkdir(dirName, function (error) {
      if (error) {
        console.error('exec error: ' + error);
        return;
      }
      let destUrl = baseNotebookUrl + 'notebooks/'+ notebookDir(type)+ '/' + projectType + '/' + modelName + '.ipynb';
      copySync(templatIpynbPath + templateDir, baseNotebookPath +'/'+ projectType);
      moveSync(baseNotebookPath +'/'+ projectType+ '/notebook.ipynb', baseNotebookPath +'/'+ projectType+ '/' + modelName+  '.ipynb' );
      res.send({jpyPath: destUrl,notebookPath: notebookDir(type)});
    });
  }else{
    createReadStream(templatIpynbPath + templatIpynbFile).pipe(createWriteStream(baseNotebookPath + '/'+ projectType + '/'+ modelName + '.ipynb'));
    res.send({jpyPath: destUrl,notebookPath: notebookDir(type)});
  }
});

router.get('/delete',function (req,res) {
  let modelNm = req.query.modelNm;
  let appNm = req.query.appNm;
  console.log('!!!!!!!!!!!!!!',modelNm)
  baseNotebookPath = path.join(__dirname, '../../' + modelPath+ '/' + modelNm);
  // if (appNm !== null){
  //   baseNotebookPath = path.join(__dirname, '../../' + appPath + '/' + appNm);
  // }

  console.log('deletedelete===' + baseNotebookPath);
  deleteall(baseNotebookPath);
  res.send({path: baseNotebookPath});
});

router.get('/notebook/templateList', function (req, res) {
  readdir(templatIpynbPath, (error, files) => {
    if (error) {
      console.error('exec error: ' + error);
      return;
    }
    res.send({files: files});
  });

});
router.get('/notebook/open/:modelName/:projectType', function (req, res) {
  let destUrl;
  let projectType =req.params.projectType;
  let modelName = req.params.modelName;
  console.error('projectType: ' ,projectType);
  if (projectType === 'explore') {
    destUrl = baseNotebookUrl + 'notebooks/'+ notebookDir(projectType)+ '/' + modelName + '/' + modelName + '.ipynb';
  }else{
    destUrl = baseNotebookUrl + 'notebooks/'+ notebookDir(projectType)+ '/' + projectType + '/' + modelName + '.ipynb';
  }
  console.error('destUrl: ' ,destUrl);
  res.send({jpyPath: destUrl});
});

module.exports = router;
