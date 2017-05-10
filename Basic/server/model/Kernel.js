"use strict";
import {Kernel, KernelMessage} from '@jupyterlab/services';
import { XMLHttpRequest } from "xmlhttprequest";
import { default as WebSocket } from 'ws';

global.XMLHttpRequest = XMLHttpRequest;
global.WebSocket = WebSocket;
// The base url of the notebook server.
const BASE_URL = 'http://127.0.0.1:8888/';

let kernelInfo = {};
// Get info about the available kernels and start a new one.
// module.exports = function (){ 

  Kernel.getSpecs({ baseUrl: BASE_URL, token:'65f9b2a617342a3f633a4e2095899b40ce0d2621eb67b97c', name:'python' }).then(kernelSpecs => {
  console.log('Default spec:', kernelSpecs.default);
  console.log('Available specs', Object.keys(kernelSpecs.kernelspecs));
  // use the default name
  let options = {
    baseUrl: BASE_URL,
    name: kernelSpecs.default,
    token:'65f9b2a617342a3f633a4e2095899b40ce0d2621eb67b97c'
  };
  Kernel.startNew(options).then(kernel => {
    console.log('Kernel started:', kernel);
    kernel.requestKernelInfo().then(function (reply) {
      var content = reply.content;
      // $('#kernel-info').text(content.banner);
      console.log('Kernel info:', content);
      kernelInfo = content.banner
    })
    // Execute and handle replies.
    // let future = kernel.requestExecute({ code: 'a = 1' } );
    // future.onDone = () => {
    //   console.log('Future is fulfilled', future);
    // };
    // future.onIOPub = (msg) => {
    //   console.log(msg.content);  // Print rich output data.
    // };

    // // Restart the kernel and then send an inspect message.
    // kernel.restart().then(() => {
    //   let request = {
    //     code: 'hello', cursor_pos: 4, detail_level: 0
    //   };
    //   kernel.requestInspect(request).then(reply => {
    //     console.log(reply.content.data);
    //   });
    // });

    // // Interrupt the kernel and then send a complete message.
    // kernel.interrupt().then(() => {
    //   kernel.requestComplete({ code: 'impor', cursor_pos: 4 } ).then((reply) => {
    //     console.log(reply.content.matches);
    //   });
    // });

    // // Register a callback for when the kernel changes state.
    // kernel.statusChanged.connect((status) => {
    //   console.log('status', status);
    // });

    // // Kill the kernel.
    // kernel.shutdown().then(() => {
    //   console.log('Kernel shut down');
    // });
  });
  }).catch((err)=>{console.log('error', err);});
// }
;
module.export = kernelInfo;