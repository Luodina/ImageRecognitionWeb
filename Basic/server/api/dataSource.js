"use strict";
import { Kernel } from '@jupyterlab/services';
import { XMLHttpRequest } from "xmlhttprequest";
import { default as WebSocket } from 'ws';
import config from './../config';

global.XMLHttpRequest = XMLHttpRequest;
global.WebSocket = WebSocket;

let env = config.env || 'dev';

// The base url of the notebook server.
const BASE_URL = config[env].notebook || 'http://127.0.0.1:8888/';
const TOKEN = config[env].token;

let express = require('express');
let router = express.Router();
let fs = require('fs');
let path = require('path');

// Get info about the available kernels and start a new one.
router.get('/:path', function(req, res){
  let fileContent = fs.readFileSync('./uploads/step1.py', "utf8");// + req.params.path, "utf8");
  let newpath = "filePath=\""+path.join(__dirname,"../../uploads/"+req.params.path)+"\"";
  let fileCode = fileContent.replace(/filePath=/g, newpath);
  fileCode = fileCode.replace(/htmlFilePath=/g, "htmlFilePath=\""+path.join(__dirname,"../../uploads/test.html\""));
  Kernel.getSpecs({ baseUrl: BASE_URL, token:TOKEN, name:'python' }).then(kernelSpecs => {
    console.log('Default spec:', kernelSpecs.default);
    console.log('Available specs', Object.keys(kernelSpecs.kernelspecs));
    // use the default name
    let options = {
      baseUrl: BASE_URL,
      name: kernelSpecs.default,
      token: TOKEN
    };
    Kernel.startNew(options).then(kernel => {
      // Execute and handle replies.
      let future = kernel.requestExecute({ code: fileCode } );
      future.onIOPub = (msg) => {
        if (msg.header.msg_type === "stream"){
          return res.send({result:msg});}
      };     
    });
    }).catch((err)=>{console.log('error', err);});
});

module.exports = router; 