/**
 * Created by JiYi on 17/7/10.
 */
'use strict';
import { KernelMessage, Kernel, Session, ContentsManager} from '@jupyterlab/services';
import { default as WebSocket } from 'ws';
import { XMLHttpRequest } from "xmlhttprequest";
import { readFile, writeFile, existsSync, readFileSync, mkdir, createReadStream, createWriteStream } from 'fs';
var sequelize = require('../sequelize');
var Sequelize = require('sequelize');
var Model = require('../model/MODEL_INFO')(sequelize, Sequelize);
var moment = require('moment');
var _require = require('child_process');
let exec = _require.exec;

global.XMLHttpRequest = XMLHttpRequest;
global.WebSocket = WebSocket;

var express = require('express');
var router = express.Router();
var path = require('path');
var config = require('./../config');
var env = config.env || 'dev';

var templatIpynbPath = path.join(__dirname, '../../template');
var baseNotebookPath = config[env].notebookPath;
var baseNotebookUrl = config[env].notebookUrl;
var filePath = "filePath=\n";
var htmlFilePath = "htmlFilePath=\n";
var templatIpynbFile = '/expert_blank.ipynb';
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
      jpyPath: destUrl, notebookPath:baseNotebookPath
    });
  });
});

module.exports = router;
