"use strict";
import { Kernel, Session, ContentsManager } from '@jupyterlab/services';
import { XMLHttpRequest } from "xmlhttprequest";
import { default as WebSocket } from 'ws';
import config from './../config';
let env = config.env || 'dev';
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


// The base url of the Jupyter server.
var BASE_URL = config[env].notebook;
var token = config[env].token;
var ipynbPath = '/dataProfile.ipynb';

//连接到session(如果已经存在该ipynb对应的session,则直接使用;如果没有，则创建一个session)
var options = {
    baseUrl: BASE_URL,
    token: token,
    kernelName: 'python',
    path: ipynbPath
};

var kernel;
var dataFile;
Session.listRunning(options).then(sessionModels => {
var sessionNums = sessionModels.length;
var existSession = false;
// console.log('sessionModels.length',sessionModels.length);
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
    });
}
});
console.log('!!!!!!!!___________OPTIONS:', options);
let contents = new ContentsManager(options);
var sourceCodes=new Array();
//console.log('contents', contents, 'ipynbPath', ipynbPath);
contents.copy(ipynbPath, '/dataProfileFolder').then((model) => {
//console.log('contents.copy');
var filePath = model.path;
contents.get(filePath).then((model) => {
    console.log('model', model);
    var cellsLength = model.content.cells.length;
    console.log('cellsLength', cellsLength);
    for(let i=0;i<cellsLength;i++){
        sourceCodes[i] =  model.content.cells[i].source;
    }

});
});
router.post('/upload', upload.single('file'), function(req, res){
res.status(200).send({fileName: req.file.originalname});
});

router.get('/step1', function(req, res){
    let newpath = "filePath=\""+path.join(__dirname,"../../uploads/dataFile.csv\"");
    // console.log('!!!!!!!!!!!!!!!!!!!newpath:', newpath);
    let fileCode = sourceCodes[0].replace(/filePath=/g, newpath);
    fileCode =fileCode.replace(/htmlFilePath=/g, "htmlFilePath=\""+path.join(__dirname,"../../uploads/report.html\""));
    console.log('!!!!!!!!STEP1___________CODE:', fileCode);
    let future = kernel.requestExecute({ code: fileCode } );
    future.onIOPub = (msg) => {
        if (msg.header.msg_type === "execute_result"){
        console.log('!!!!!!!!STEP1___________RESULT:', msg);
        return res.send({result:msg});}
    };
});
router.get('/report', function(req, res){
    if (fs.existsSync('./uploads/report.html')){
        fs.readFile('./uploads/report.html', function (err, html) {
            if (err) {
                throw err;
            }
            res.writeHeader(200, {"Content-Type": "text/html"});
            res.write(html);
            res.end();
        });
    } else {
            res.writeHeader(200, {"Content-Type": "text/html"});
            res.write('<div>!!!!!!!</div>');
            res.end();
    }
});
router.get('/step2', function(req, res){
    console.log('!!!!!!!!STEP2___________CODE:', sourceCodes[1]);
    let future = kernel.requestExecute({ code: sourceCodes[1]});
    future.onIOPub = (msg) => {
        if (msg.header.msg_type === "stream"){
            console.log('!!!!!!!!STEP2___________RESULT:', msg.content.text);
            return res.send({result:msg.content.text});
        }
    }
});
router.get('/step3', function(req, res){
    console.log('!!!!!!!!STEP3___________CODE:', sourceCodes[2]);
    let future = kernel.requestExecute({code: sourceCodes[2]});
    future.onIOPub = (msg) => {
        if (msg.header.msg_type === "execute_result"){
        console.log('!!!!!!!!STEP3___________RESULT:', msg);
        return res.send({result:msg});}
    };
});

router.get('/step4', function(req, res){
    let newpath = "outputFilePath=\""+path.join(__dirname,"../../uploads/dataFileNew.csv\"");
    let fileCode = sourceCodes[3].replace(/outputFilePath=/g, newpath);
    console.log('!!!!!!!!STEP4___________CODE:', fileCode);
    let future = kernel.requestExecute({code: fileCode});
    future.onIOPub = (msg) => {
        if (msg.header.msg_type === "execute_result"){
        console.log('!!!!!!!!STEP1___________RESULT:', msg);
        return res.send({result:msg});}
    };
});
module.exports = router;
