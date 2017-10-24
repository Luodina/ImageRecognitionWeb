'use strict';
let XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest,
  WebSocket = require('ws'),
  chai = require('chai'),
  expect = chai.expect,
  http = require('http'),
  sinon = require('sinon'),
  nock = require('nock'),
fs = require('fs');

import {Session, Kernel} from '@jupyterlab/services';

global.XMLHttpRequest = XMLHttpRequest;
global.WebSocket = WebSocket;
import {getUserWorkspace, SimpleServerStrategy, HubServerStrategy, Workspace} from '../../server/workspace';

import {describe, it} from 'mocha';

let config = {};

describe('workspace.js', function () {

  beforeEach(function () {
    config = {
      serverType: 'notebook',
      notebookUrl: 'http://localhost:8888',
      token: '88ee53e8e6b2f565d0425c17f781d3080400b36b035340b1'
    };
  });

  afterEach(function () {
    config = {};
  });

  describe('getUserWorkspace', function () {
    it('simple server strategy', function () {
      var workspace = getUserWorkspace('any', config);
      expect(workspace.strategy).to.be.an.instanceof(SimpleServerStrategy);
    });

    it('hub server strategy', function () {
      config = {serverType: 'hub'};
      var workspace = getUserWorkspace('any', config);
      expect(workspace.strategy).to.be.an.instanceof(HubServerStrategy);
    });
  });

  describe('SimpleServerStrategy', function () {

    let url = 'http://localhost:8888',
      token = '88ee53e8e6b2f565d0425c17f781d3080400b36b035340b1';
    let server = null;

    beforeEach(() => {
      server = new SimpleServerStrategy(url, token, __dirname + '/../test_data_dir/');
    });

    it('simple strategy token should be same for all users', function () {

      server.getServerUrl().then(url => {
        expect(url).to.be.equal(config.notebookUrl);
      });
      server.getToken('abc').then(token => {
        expect(token).to.be.equal(config.token);
      });
      server.getToken('def').then(token => {
        // 不同用户也会有相同的token
        expect(token).to.be.equal(config.token);
      });
    });

    it('test server status running', function () {
      nock(url).get('/api/status').reply(200, {'started': 'anyblabla'});
      return server.isActive('abc').then(function (res) {
        expect(res).to.be.equal(true);
        nock.cleanAll();
      });
    });

    it('test server status running empty body', function () {
      nock(url).get('/api/status').reply(200, {});
      return server.isActive('abc').then(function (res) {
        expect(res).to.be.equal(false);
        nock.cleanAll();
      });
    });

    it('test server status not running', function () {
      server = new SimpleServerStrategy('http://any_url', token);
      return server.isActive('abc').then(function (res) {
        expect(res).to.be.equal(false);
      });
    });

    describe('listProjects', function () {
      it('list empty folder should return empty list', function () {
        let stub = sinon.stub(fs, 'readdirSync').returns([]);
        expect(server.listProjects('abc')).to.be.eql([]);
        stub.restore();
      });

      it('list folder with invalid name should return empty', function () {
        let stub = sinon.stub(fs, 'readdirSync')
          .returns([
            'xxx',
            'bbb',
            'xxx_123',
            'APP_123',
            'xxx_73f7eebd-daa4-479d-97b1-77c96bee9d82'
          ]);
        expect(server.listProjects('abc')).to.be.eql([]);
        stub.restore();
      });

      it('list folder with valid name should not return empty', function () {
        expect(server.listProjects('test')).to.be.lengthOf(1);
      });
    });

    describe('scanProjectFolder', function () {
      it('scan', function () {
        let stub1 = sinon.stub(fs, 'readdirSync')
          .returns([
            'Test.ipynb',
            'Test2.ipynb',
            'data'
          ]);
        let stub2 = sinon.stub(fs, 'statSync')
          .returns({
            size: 0,
            mtime: 111
          });

        expect(server.scanProjectFolder('marta', '3ea4f3cb-c640-4d7a-9b14-baa32a62b7fd'))
          .not.to.be.empty;
        stub1.restore();
        stub2.restore();

      });
    });

    describe('readFile', function () {
      it('read markdown file', function() {
        return server.readFile('marta', '3ea4f3cb-c640-4d7a-9b14-baa32a62b7fd',
          'README.md')
          .then(content => {
            expect(content).not.to.be.empty;
          });

      });

      it('read csv file', function() {
        return server.readFile('marta', '3ea4f3cb-c640-4d7a-9b14-baa32a62b7fd',
          'data/raw/raw.csv')
          .then(content => {
            expect(content).not.to.be.empty;
          });

      });

      it('read csv file online 1 line', function() {
        return server.readFile('marta', '3ea4f3cb-c640-4d7a-9b14-baa32a62b7fd',
          'data/raw/raw.csv', 1)
          .then(content => {
            expect(content).to.be.lengthOf(1);
          });

      });
    });

    describe('createApp', function () {
      it('create empty app', function () {
        server.createApp('APP', null, 'marta');
      });
    });

    describe('createModel', function () {
      it('create with empty name should have notebook.ipynb', function () {
        server.createModel(3, '3ea4f3cb-c640-4d7a-9b14-baa32a62b7fd' , 'marta', null);
      });

      it('create with empty name should have name.ipynb', function () {
        server.createModel(3, '3ea4f3cb-c640-4d7a-9b14-baa32a62b7fd' , 'marta', 'name');
      });


    });

  });

  describe('Workspace', function () {
    it('list running session', function () {
      var stub = sinon.stub(Session, 'listRunning').resolves([{
        id: '123',
      }]);
      var workspace = getUserWorkspace('any', config);
      return workspace.listRunningSessions().then(res => {
        expect(res).to.be.lengthOf(1);
        stub.restore();
      });
    });

    let sessionResponse = [{
      id: '3bbbc391-7168-403a-9219-d366e1c8cdd9',
      path: 'Untitled.ipynb',
      name: '',
      type: 'notebook',
      kernel: {
        id: '46acd766-0886-4b61-a035-6b8dec77da12',
        name: 'python3',
        last_activity: '2017-10-21T10:19:57.725189Z',
        execution_state: 'idle',
        connections: 1
      },
      notebook: {
        path: 'Untitled.ipynb',
        name: ''
      }
    }];

    describe('startSession', function () {
      it('connect existing if path exist', function () {
        nock(config.notebookUrl)
          .get('/api/sessions').query(true)
          .reply(200, sessionResponse)
          .get('/api/sessions/' + sessionResponse[0].id).query(true)
          .reply(200, sessionResponse[0])
          .post('/api/sessions/').query(true)
          .reply(200, sessionResponse[0])
          .get('/api/kernels/' + sessionResponse[0].kernel.id).query(true)
          .reply(200, sessionResponse[0].kernel);
        var workspace = getUserWorkspace('any', config);
        return workspace.startSession('Untitled.ipynb').then(res => {
          expect(res.session).not.to.be.null;
          expect(res.kernel).not.to.be.null;
          nock.cleanAll();
        });
      });

      it('create if path not exist', function () {
        nock(config.notebookUrl)
          .get('/api/sessions').query(true)
          .reply(200, sessionResponse)
          .get('/api/sessions/' + sessionResponse[0].id).query(true)
          .reply(200, sessionResponse[0])
          .post('/api/sessions', /.*/).query(true)
          .reply(200, sessionResponse[0]);
        var workspace = getUserWorkspace('any', config);
        return workspace.startSession('not_exist.ipynb').catch(err => {
          expect(err);
          nock.cleanAll();
        });
      });
    });


    describe('closeSession', function () {
      it('spec name', function () {
        nock(config.notebookUrl)
          .get('/api/kernelspecs').query(true)
          .reply(200, {"default": "python3",
            "kernelspecs": {
            "python3": {
              "name": "python3",
              "spec": {"argv": ["python", "-m", "ipykernel_launcher", "-f", "{connection_file}"], "env": {}, "display_name": "Python 3", "language": "python"},
              "resources": {"logo-64x64": "/kernelspecs/python3/logo-64x64.png", "logo-32x32": "/kernelspecs/python3/logo-32x32.png"}}}}
          );
        var workspace = getUserWorkspace('any', config);
        return workspace.listKernelSpec().then(res => {
          expect(res).to.have.keys(['default','kernelspecs']);
        });
      });
    });



  });
});

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
// let server = new app.HubServerStrategy();
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
// let workSpace = new app.Workspace(server,'jiazz');

// let options={
//   baseUrl:"http://10.20.51.5:8000/user/admin",
//   token:"57fb7f5be0b748f0be4ff2d2805f35b3"
// }
// workSpace.getKernelSpecs(options).then(function (data) {
//   console.log(data)
// }).catch(function (err) {
//   console.log("err",err.xhr.responseText)
// })

// let nowsession;
// workSpace.startSession('Untitled.ipynb','python3').then(data =>{
//   nowsession = data.session;
//   if(data.kernel){
//     workSpace.executeCode(data.kernel,'print("hello")',function (msg) {
//       // console.log("test-mesg--->",msg);
//       if (msg.header.msg_type === 'error') {
//         console.log(`ERROR:'${msg.content.evalue}`);
//       }
//       if (msg.header.msg_type === 'stream') {
//         console.log("success------------------",msg.content);
//       }
//
//     });
//   }else{
//     console.log("kernel is null")
//   }
//
//   // setTimeout(function () {
//   //   workSpace.closeSession(nowsession)
//   // },1000);
// },err =>{
//   console.log(err)
// });
//


// let options = {
//   baseUrl: 'http://10.20.51.5:8000/user/jiazz',
//   token: '002c162323b444c0821c223c40ff0ca6\n',
//   kernelName: 'python',
//   path: 'Untitled.ipynb' }
// workSpace.runNewSession(options)
