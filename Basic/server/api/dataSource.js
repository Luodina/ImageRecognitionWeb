"use strict";
import { Kernel, Session, ContentsManager } from '@jupyterlab/services';
import { XMLHttpRequest } from "xmlhttprequest";
import { default as WebSocket } from 'ws';
import config from './../config';

global.XMLHttpRequest = XMLHttpRequest;
global.WebSocket = WebSocket;

let express = require('express');
let router = express.Router();
let path = require('path');
let fs = require('fs');
let multer  = require('multer');
const fileName = "./uploads/dataFile.csv";
let storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, "dataFile.csv");
  }
});
let upload = multer({ storage: storage });
//


router.get('/user', function(req, res){
  let usertype = req.query.usertype;
  if(usertype === "admin") {
    User.findAll({attributes: ['USER_NAME']}).then(function (users) {
      res.send(users);
    }, function () {
      res.status(500).send(trans.databaseError);
    });
  }else{
    res.status(500).send(trans.authError);
  }
});

// The base url of the Jupyter server.
var BASE_URL = 'http://localhost:8888';
var token = '250db827661a13d4851e07f133b14ebd6a833ddf97d318fc';
var ipynbPath = '/dataProfile.ipynb';

//连接到session(如果已经存在该ipynb对应的session,则直接使用;如果没有，则创建一个session)
var options = {
    baseUrl: BASE_URL,
    token:token,
    kernelName: 'python',
    path:ipynbPath
};

var kernel;
var dataFile;
    Session.listRunning(options).then(sessionModels => {
        var sessionNums = sessionModels.length;
        var existSession = false;
        for(var i=0;i<sessionNums;i++){
        var path=sessionModels[i].notebook.path;
        if(path===ipynbPath){//存在session，直接连接
            var sessionOptions = {
                baseUrl: BASE_URL,
                token:token,
                kernelName: sessionModels[i].kernel.name,
                path: sessionModels[i].notebook.path
            };
            Session.connectTo(sessionModels[i].id, sessionOptions).then((session) => {
            console.log('connected to existing session');
            console.log(session.kernel.name);
            kernel=session.kernel;
                // return res.send({result:"Hey!"});
            });
            existSession = true;
            break;
        }
        }
        if(!existSession){//没有现有的session，新创建session
        console.log('start new session');
        Session.startNew(options).then(session => {
            kernel=session.kernel;
            // return res.send({result:"Hey!"});
        });
        }
    });
    console.log('options', options);
    let contents = new ContentsManager(options);
     var sourceCodes=new Array();
    console.log('contents', contents, 'ipynbPath', ipynbPath);
    contents.copy(ipynbPath, '/dataProfileFolder').then((model) => {
        console.log('contents.copy');
        var filePath = model.path;
        contents.get(filePath).then((model) => {
            console.log('model', model);
            var cellsLength = model.content.cells.length;
            console.log('cellsLength', cellsLength);
            for(let i=0;i<cellsLength;i++){
                sourceCodes[i] =  model.content.cells[i].source;
                // console.log('sourceCodes[i]', sourceCodes[i]);
            }
            
        });   
    });
    router.post('/upload', upload.single('file'), function(req, res){
        res.status(200).send({fileName: req.file.originalname}); 
    });
    router.get('/step1', function(req, res){  
        
        // let newpath = "filePath=\""+path.join(__dirname,"../../uploads/dataFile.csv\"");
        // console.log('newpath:', newpath);
        // let fileCode = sourceCodes[0].replace(/filePath=/g, newpath);     
        // console.log('fileCode:', fileCode);
        // let future = kernel.requestExecute({ code: fileCode } );
        //     future.onIOPub = (msg) => {
        //     if (msg.header.msg_type === "stream"){
        //     console.log('msg:', msg);
        //     return res.send({result:msg});}
        // }; 
        return res.send({result:"Hey!step1"});
    });
    router.get('/step2', function(req, res){  
        console.log('sourceCodes[1]', sourceCodes[1]);
        let newpath = "filePath=\""+path.join(__dirname,"../../uploads/dataFile.csv\"");
        let fileCode =sourceCodes[1].replace(/htmlFilePath=/g, "htmlFilePath=\""+path.join(__dirname,"../../uploads/report.html\""));
        fileCode = fileCode.replace(/filePath=/g, newpath); 
        
        let future = kernel.requestExecute({ code: fileCode } );

        fs.readFile('./uploads/report.html', function (err, html) {
            if (err) {
                throw err; 
            }
            res.writeHeader(200, {"Content-Type": "text/html"});  
            res.write(html);  
            res.end(); 
        }); 
    });
    router.get('/step3', function(req, res){  
        console.log('sourceCodes[3]', sourceCodes[2]);
        return res.send({result:"Hey!step3"});  
    });
    router.get('/step4', function(req, res){  
        console.log('sourceCodes[4]', sourceCodes[3]);
        return res.send({result:"Hey!step4"});  
    });
module.exports = router; 