"use strict";
import {Kernel, KernelMessage} from '@jupyterlab/services';
import { XMLHttpRequest } from "xmlhttprequest";
import { default as WebSocket } from 'ws';

global.XMLHttpRequest = XMLHttpRequest;
global.WebSocket = WebSocket;

// The base url of the notebook server.
const BASE_URL = 'http://127.0.0.1:8888/';
const TOKEN = "c878f8202786ddb4622e05c1577ef81e841e18cce7b6a1d8";
let express = require('express');
let router = express.Router();

// Get info about the available kernels and start a new one.
router.get('/', function(req, res){
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
    console.log('Kernel started:', kernel);
    kernel.requestKernelInfo().then(function (reply) {
      var content = reply.content;
      // $('#kernel-info').text(content.banner);
      console.log('Kernel info:', content);
      res.send({msg:"Kernel", kernelInfo : content.banner});;
    })
  });
  }).catch((err)=>{console.log('error', err);});
});

module.exports = router; 