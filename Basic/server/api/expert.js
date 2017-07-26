'use strict';
import {mkdir, createReadStream, createWriteStream } from 'fs';
const express = require('express');
const router = express.Router();
const path = require('path');
const config = require('./../config');
let env = config.env || 'dev';

let templatIpynbPath = path.join(__dirname, '../../template');
let baseNotebookPath;
let baseNotebookUrl = config[env].notebookUrl;
let templatIpynbFile = '/expert_blank.ipynb';
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

router.get('/pathNoteBook', function (req, res) {
    let modelName = req.query.modelName; 
    let type = req.query.modelType;
    let projectType=type;
    baseNotebookPath = notebookPath(type);
    let dirName = path.join(baseNotebookPath, modelName);
    let destUrl = baseNotebookUrl + 'notebooks/'+ notebookDir(type)+ '/' + projectType + '/' + modelName + '.ipynb';
    if (type === 'explore'){
        projectType = modelName;
        mkdir(dirName, function (error) {
        if (error) {
            console.error('exec error: ' + error);
            return;
        }
            let destUrl = baseNotebookUrl + 'notebooks/'+ notebookDir(type)+ '/' + projectType + '/' + modelName + '.ipynb';
            createReadStream(templatIpynbPath + templatIpynbFile).pipe(createWriteStream(baseNotebookPath + '/'+ projectType + '/'+ modelName + '.ipynb'));
            res.send({jpyPath: destUrl,notebookPath: notebookDir(type)});
        });
    }else{
        createReadStream(templatIpynbPath + templatIpynbFile).pipe(createWriteStream(baseNotebookPath + '/'+ projectType + '/'+ modelName + '.ipynb'));
        res.send({jpyPath: destUrl,notebookPath: notebookDir(type)});
    }
});

module.exports = router;
