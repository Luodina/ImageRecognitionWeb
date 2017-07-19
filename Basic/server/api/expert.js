/**
 * Created by JiYi on 17/7/10.
 */
'use strict';
import { KernelMessage, Kernel, Session, ContentsManager} from '@jupyterlab/services';
import { default as WebSocket } from 'ws';
import { XMLHttpRequest } from "xmlhttprequest";
import { readFile, writeFile, existsSync, readFileSync, mkdir, createReadStream, createWriteStream } from 'fs';
let sequelize = require('../sequelize');
let Sequelize = require('sequelize');
let Model = require('../model/MODEL_INFO')(sequelize, Sequelize);
let moment = require('moment');
let _require = require('child_process');
let exec = _require.exec;

global.XMLHttpRequest = XMLHttpRequest;
global.WebSocket = WebSocket;

const express = require('express');
const router = express.Router();
const path = require('path');
const config = require('./../config');
let env = config.env || 'dev';

let templatIpynbPath = path.join(__dirname, '../../template');
let baseNotebookPath = config[env].notebookPath;
let baseNotebookUrl = config[env].notebookUrl;
let filePath = "filePath=\n";
let htmlFilePath = "htmlFilePath=\n";
let templatIpynbFile = '/expert_blank.ipynb';
//notebook

router.get('/pathNoteBook', function (request, response) {
  var modelName = request.query.modelName;

  var dirName = path.join(baseNotebookPath, modelName);
  mkdir(dirName, function (error) {
    if (error) {
      console.error('exec error: ' + error);
      return;
    }
    var destUrl = baseNotebookUrl + 'notebooks/' + modelName + '/' + modelName + '.ipynb';
    createReadStream(templatIpynbPath + templatIpynbFile).pipe(createWriteStream(baseNotebookPath + '/'+ modelName + '/'+ modelName + '.ipynb'));
    response.send({
      jpyPath: destUrl,
      notebookPath:baseNotebookPath
    });
  });
});

module.exports = router;
