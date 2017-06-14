"use strict";
import {
  KernelMessage, Kernel, Session, ContentsManager
} from '@jupyterlab/services';

import { XMLHttpRequest } from "xmlhttprequest";
import { default as WebSocket } from 'ws';

global.XMLHttpRequest = XMLHttpRequest;
global.WebSocket = WebSocket;

var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function filename(req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage });

var fileName ;

let config = require('./../config');
let env = config.env || 'dev';

var templatIpynbPath = '/dataProfile.ipynb';
var templatFolderPath = '/dataProfileFolder';

const filePath = "filePath=\n";
const htmlFilePath = "htmlFilePath=\n";
var sourceCodes = new Array();
// var notebookModel;
// var notebookFilePath;

// var dataFile;

var basePath =path.join(__dirname, "../../uploads/");

var obj = {
};
var options = {
    baseUrl: config[env].notebook,
    token: config[env].token,
    kernelName: 'python',
    path:templatIpynbPath
};

var sourceCodes = new Array();
var outputs = new Array();
var mysession;
var kernel;
console.log('!!!!!!!!___________OPTIONS:', options);
var contents = new ContentsManager(options);

contents.get(templatFolderPath).then((model) => {
    console.log('files in ', templatFolderPath , ":", model.content);
    for (var i = 0, len = model.content.length; i < len; i++) {
        if (("/" + model.content[i].name)===templatIpynbPath){
            contents.delete(templatFolderPath + templatIpynbPath);  
            console.log('deleted:' , templatFolderPath + templatIpynbPath);  
        }
    }
}); 

function runNewSession(){
    Session.listRunning(options).then(sessionModels => {
        var sessionNums = sessionModels.length;
        var existSession = false;
        console.log('sessionModels.length',sessionModels.length);
        for (let i = 0; i < sessionNums; i++) {
            let path = sessionModels[i].notebook.path;
            if (path === templatIpynbPath) {
                Session.connectTo(sessionModels[i].id, options).then(session => {
                    kernel = session.kernel;
                    mysession = session;
                    console.log('session started');
                });
                existSession = true;
                break;
            }
        }
        if (!existSession) {
            //没有现有的session，新创建session
            console.log('start new session');
            Session.startNew(options).then(session => {
                kernel = session.kernel;
                mysession = session;
                console.log('session started');
            });
        }
    });
}


router.post('/init', function (req, res) { 

    contents.copy(templatIpynbPath, templatFolderPath).then(model =>{
        fs.readFile('/Users/luodina/dataProfileFolder/dataProfile.ipynb', 'utf8', 
            function readFileCallback(err, data){
                if (err){
                    console.log(err);
                } else {
                obj = JSON.parse(data);  //now it an object
                for (let i = 0, len = obj.cells[0].source.length; i < len; i++) {
                    if (obj.cells[0].source[i] === filePath){
                        obj.cells[0].source[i] ="filePath=\"" + basePath + "iris_ocai.csv\"\n";
                    };
                    if (obj.cells[0].source[i] === htmlFilePath){
                        obj.cells[0].source[i] ="htmlFilePath=\"" + basePath + "iris_ocai_report.html\"\n"; 
                    }
                }               
                var json = JSON.stringify(obj); //convert it back to json           
                fs.writeFile('/Users/luodina/dataProfileFolder/dataProfile.ipynb', json, 'utf8', 
                    function writeFileCallback(err){
                        if(err) {
                            console.log(err);
                        } else {
                            contents.get(templatFolderPath + templatIpynbPath).then(model =>{ 
                                for(var i=0;i<model.content.cells.length;i++){
                                    sourceCodes[i] =  model.content.cells[i].source;
                                }   
                                console.log('sourceCodes',sourceCodes);
                                runNewSession();
                                res.status(200).send({ msg: "GREAT SUCCESS WE INIT IT!!!" });
                            })
                        }
                    }
                ); // write it back 
            }
        });
    });  
});

router.post('/upload', upload.single('file'), function (req, res) { 
    res.status(200).send({ fileName: req.file.originalname });
});

router.get('/report', function (req, res) {
    //console.log("RESULT fs.existsSync('./uploads/" + fileName.replace(/.csv/g, "_") + "report.html')", fs.existsSync('./uploads/report.html'));
    if (fs.existsSync("./uploads/" + fileName.replace(/.csv/g, "_") + "report.html")) {
        var html = fs.readFileSync("./uploads/" + fileName.replace(/.csv/g, "_") + "report.html", 'utf8');
        res.writeHeader(200, { "Content-Type": "text/html" });
        res.write(html);
        res.end();
    } else {
        res.writeHeader(200, { "Content-Type": "text/html" });
        res.write('<div>!!!!!!!</div>');
        res.end();
    }
});

router.post('/step1', function (req, res) {
    console.log('sourceCodes in /step1',sourceCodes);
    if (sourceCodes[0] !== undefined){
        console.log('!!!!!!!!STEP1___________CODE:', sourceCodes[0]);
        var future = kernel.requestExecute({ code: sourceCodes[0]});  
        future.onIOPub = function (msg) {
            if (msg.header.msg_type === "execute_result") {
                    console.log('!!!!!!!!STEP1___________RESULT:', msg);
                    outputs.push(msg.content);
                    return res.send({ result: msg });  
            }
        }
    }
});

router.get('/save', function (req, res) {
    // console.log('sourceCodes in /step1',outputs);
    res.status(200).send({ msg: "GREAT SUCCESS WE SAVED IT!!!" });
    // Kill the session.
    mysession.shutdown().then(() => {
        console.log('session closed');
        fs.readFile('/Users/luodina/dataProfileFolder/dataProfile.ipynb', 'utf8', 
            function readFileCallback(err, data){
                if (err){
                    console.log(err);
                } else {
                console.log('obj json', obj);
                obj = JSON.parse(data);  //now it an object
                console.log('obj as obj', obj);
                for (let i = 0, len = obj.cells.length; i < len; i++) {
                    if (i === 0){
                        outputs[i].output_type = "execute_result";
                        console.log('outputs[0]', outputs[i]);
                        obj.cells[i].outputs.push(outputs[i]);
                        obj.cells[i].execution_count = i+1;
                    };
                }               
                var json = JSON.stringify(obj); //convert it back to json   
                console.log('json', json);        
                fs.writeFile('/Users/luodina/dataProfileFolder/dataProfile.ipynb', json, 'utf8', 
                    function writeFileCallback(err){
                        if(err) {
                            console.log(err);
                        } 
                    }
                ); // write it back 
            }
        });      
    });
});

module.exports = router;
