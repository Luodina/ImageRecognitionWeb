"use strict";
import {Kernel, KernelMessage} from '@jupyterlab/services';
import { XMLHttpRequest } from "xmlhttprequest";
import { default as WebSocket } from 'ws';

global.XMLHttpRequest = XMLHttpRequest;
global.WebSocket = WebSocket;

// The base url of the notebook server.
const BASE_URL = 'http://127.0.0.1:8888/';
const TOKEN = "cc41665e3b4f3f7930dd04cdce6819283b278aa7419e63ad";
let express = require('express');
let router = express.Router();
let arr =[]
 console.log('!!!!!!!!!!');
// Get info about the available kernels and start a new one.
router.get('/jupyter', function(req, res){
  
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
    })

    // Execute and handle replies.
    let future = kernel.requestExecute({ code: 'print"hello world"' } );

    future.onIOPub = (msg) => {
      console.log("!!!!!!!!!!!!", );  // Print rich output data.
      if (msg.header.msg_type === "stream"){return res.send({msg:msg});}
        
      // 
    };
    future.onDone = () => {
      console.log('Future is fulfilled', future);    
    };
    
  });
  }).catch((err)=>{console.log('error', err);});
});

module.exports = router; 