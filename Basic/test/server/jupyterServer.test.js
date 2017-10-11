'use strict';
let XMLHttpRequest=require('xmlhttprequest').XMLHttpRequest;
let WebSocket=require('ws');
global.XMLHttpRequest = XMLHttpRequest;
global.WebSocket = WebSocket;
let app = require('../../server/jupyterServer');
//let chai = require('chai');
//let expect = require('chai').expect;
//let assert = chai.assert;
//let sinon = require('sinon');

// describe('jupyter集成', function() {
//   let server = new app.HubServerStrategy();
//   it('getServerUrl', function() {
//     expect(server.getServerUrl("jiazz")).to.be.equal('http://10.20.51.5:8000/user/jiazz');
//
//   });
//
//   let token='';
//   console.log("token",token)
//   it('getToken',function () {
//     server.getToken("jiazz").then(res => {
//       console.log("ok",res)
//       token=res;
//     }, err => {
//       console.error(err)
//     })
//     expect(token).to.be.not.equal('');
//
//   })
// });
//
//==================================
// let token=''
let server = new app.HubServerStrategy();
// server.getToken("jiazz").then(res => {
//   console.log("ok",res)
// }, err => {
//   console.error(err)
// })


// server.createApp('data_apply_demo','app','','jiazz').then(res=>{
//   console.log("success",res)
// },err=>{
//   console.log(err)
// });

// // ///Users/zezhenjia/workSpace/auraDev/OCAI/Basic/template/notebookTemplates/文本数据预处理
// server.createApp('notebookTemplates/文本数据预处理','expert02','','jiazz').then(res=>{
//   console.log("success",res)
// },err=>{
//   console.log(err)
// });

//
// server.createModel('dataProfile-V4.0.ipynb','model','','jiazz').then(res=>{
//   console.log("success",res)
// },err=>{
//   console.log(err)
// });


// server.deleteit('expert02_4EAC1205CCA836F6','jiazz').then(res=>{
//   console.log("success",res)
// },err=>{
//   console.log(err)
// });

//==================================
//let simpleServer = new app.SimpleServerStrategy();
// let token=simpleServer.getToken('jiazz')
// console.log(token)

// simpleServer.createModel('dataProfile-V4.0.ipynb','model','','jiazz').then(res=>{
//   console.log("success",res)
// },err=>{
//   console.log(err)
// });


//
// simpleServer.createApp('notebookTemplates/文本数据预处理','expert02','','jiazz').then(res=>{
//   console.log("success",res)
// },err=>{
//   console.log(err)
// });

// simpleServer.deleteit('model_A092EA1A48EF8214','jiazz').then(res=>{
//   console.log("success",res)
// },err=>{
//   console.log(err)
// });

//==================================
let workSpace = new app.Workspace(server,'jiazz');

// let options={
//   baseUrl:"http://10.20.51.5:8000/user/admin",
//   token:"57fb7f5be0b748f0be4ff2d2805f35b3"
// }
// workSpace.getKernelSpecs(options).then(function (data) {
//   console.log(data)
// }).catch(function (err) {
//   console.log("err",err.xhr.responseText)
// })

let nowsession;
workSpace.startSession('Untitled.ipynb','python3').then(data =>{
  nowsession = data.session;
  if(data.kernel){
    workSpace.executeCode(data.kernel,'print("hello")',function (msg) {
      // console.log("test-mesg--->",msg);
      if (msg.header.msg_type === 'error') {
        console.log(`ERROR:'${msg.content.evalue}`);
      }
      if (msg.header.msg_type === 'stream') {
        console.log("success------------------",msg.content);
      }

    });
  }else{
    console.log("kernel is null")
  }

  // setTimeout(function () {
  //   workSpace.closeSession(nowsession)
  // },1000);
},err =>{
  console.log(err)
});



// let options = {
//   baseUrl: 'http://10.20.51.5:8000/user/jiazz',
//   token: '002c162323b444c0821c223c40ff0ca6\n',
//   kernelName: 'python',
//   path: 'Untitled.ipynb' }
// workSpace.runNewSession(options)
