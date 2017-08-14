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
let exec = require('child_process').exec;

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
    return modelPath;
  } else {
    return appPath;
  }
}

function deleteall(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function (file, index) {
      let curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteall(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

 function chooseHtml(inputPath,outputPath) {
//   let comms = 'jupyter '+'nbconvert '+ '/Users/JiYi/Desktop/7.31zhengli/OCAI/Basic/notebookModel/nnnn4/nnnn4.ipynb '+"--output='/Users/JiYi/Desktop/7.31zhengli/OCAI/Basic/notebookModel/nnnn4/nnnn4'";
  let comms = 'jupyter '+'nbconvert '+ inputPath+"--output=outputPath";
  console.log('comms',comms);

  console.log('--------------comms=>', comms);
  exec(comms, [''], function (error, stdout) {
    if (error) {
    }
    console.log('shell exec--------->', stdout);
  });
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

router.put('/delete',function (req,res) {
  let item = req.body.item;
  let type = req.body.type;
  let baseNotebookPath = path.join(__dirname, '../../' + req.body.path);
  console.log('req.body', req.body,'item',item,'type',type, 'baseNotebookPath', baseNotebookPath);
  deleteall(baseNotebookPath);
  res.send({result:'success'});
  
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
