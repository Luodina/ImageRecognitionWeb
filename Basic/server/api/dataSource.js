"use strict";
import {
  KernelMessage, Kernel, Session, ContentsManager
} from '@jupyterlab/services';

import { XMLHttpRequest } from "xmlhttprequest";
import { default as WebSocket } from 'ws';
import { readFile, writeFile, existsSync, readFileSync } from 'fs';

global.XMLHttpRequest = XMLHttpRequest;
global.WebSocket = WebSocket;
var fileName ;
var express = require('express');
var router = express.Router();
var path = require('path');
//var fs = require('fs');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function filename(req, file, cb) {
        cb(null, file.originalname);
        fileName =  file.originalname;
    }
});
var upload = multer({ storage: storage });

let config = require('./../config');
let env = config.env || 'dev';

var templatIpynbPath = '/dataProfile-V4.0.ipynb';
var templatFolderPath = '/dataProfileFolder';

const filePath = "filePath=\n";
const htmlFilePath = "htmlFilePath=\n";

var basePath = path.join(__dirname, "../../uploads/");
var baseNotebookPath = "/Users/luodina"
var obj = {};
var options = {
    baseUrl: config[env].notebook,
    token: config[env].token,
    kernelName: 'python',
    path:templatIpynbPath
};
var dataFileName
var htmlFileName
var sourceCodes = new Array();
var outputs = Array(10);
var source = Array(10);
var modelInfo;
var mysession;
var kernel;
var notebookPath;
console.log('!!!!!!!!___________OPTIONS:', options);
var contents = new ContentsManager(options);

contents.get(templatFolderPath)
.then((model) => {
    console.log('files in ', templatFolderPath , ":", model.content);
    for (var i = 0, len = model.content.length; i < len; i++) {     
        if (("/" + model.content[i].name)===templatIpynbPath){
            // contents.delete(templatFolderPath + templatIpynbPath)
            // .then(()=>{
            //     console.log('deleted:' , templatFolderPath + templatIpynbPath); 
            // })
            // .catch(err => {
            //     console.log(err);
            // });                   
        }
    }
})
.catch(err => {
    console.log(err);
});
function getMode(f1,f2){
    if ((f1 != undefined && f1 != null) && (f1 != undefined && f1 != null)) {
        return "readOnly";
    // }  else if ((!(f1 != undefined) ^ !(f1 != null)) && (f1 != undefined && f1 != null))  {
    //     return "readOnly";
    } else { return "new"} ; 
}
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
                    init();
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
                init();
                console.log('session started');
            });
        }
    });
}

function init(){
    console.log('init');
    if (sourceCodes[0] !== undefined){
        // console.log('!!!!!!!!STEP0___________CODE:', sourceCodes[0]);
        var future = kernel.requestExecute({ code: sourceCodes[0]});  
    }
}

function readFilePromisified(filename) {
    return new Promise(
        function (resolve, reject) {
            readFile(filename, { encoding: 'utf8' },
                (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
}

function writeFilePromisified(filename,text) {
    return new Promise(
        function (resolve, reject) {
            writeFile(filename, text, { encoding: 'utf8' },
                (error, data) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
}

router.post('/init', function (req, res) { 
    let fileName = req.body.fileName;
    let notebookPath = req.body.notebookPath;
    console.log('/init: fileName ', fileName, ' notebookPath ',notebookPath);
    var mode = getMode(fileName, notebookPath);
    console.log('mode',mode);
    if (mode === 'new'){
        contents.copy(templatIpynbPath, templatFolderPath)
        .then(model =>{       
            contents.get(templatFolderPath + templatIpynbPath).then(model =>{ 
                for(var i = 0; i<model.content.cells.length; i++){
                    sourceCodes[i] =  model.content.cells[i].source;
                }   
                console.log('sourceCodes',sourceCodes);
                runNewSession();
                // init();
                res.status(200).send({ msg: "GREAT SUCCESS WE INIT IT!!!" });
            })
        })
        .catch(err => {
            console.log(err);
        });
    }
    if (mode === 'readOnly'){
        console.log('mode is readOnly', baseNotebookPath + notebookPath); 
        readFilePromisified(baseNotebookPath + notebookPath)
        .then(text => { 
            var obj = JSON.parse(text);  //now it an object       
            for (let i = 0, len = obj.cells.length; i < len; i++) { 
                let tmp = obj.cells[i].outputs;  
                       
                if (tmp !== undefined && tmp !== null){
                   if (tmp.length !== 0) {
                       console.log('tmp', tmp); 
                        if (tmp[0].data !== undefined && tmp[0].data !== null ){                              
                            outputs[i] = tmp[0].data ;
                        }         
                   }
                   
                    
                }
            }
            res.status(200).send({ msg: "GREAT SUCCESS WATCH IT!!!" , outputs: outputs});     
        }) 
        .catch(err => {
            console.log(err);
        });
    }

})           

router.post('/upload', upload.single('file'), function (req, res) { 
    res.status(200).send({ fileName: req.file.originalname });
});

router.get('/report/:fn', function (req, res) {
    (req.params.fn)? fileName = req.params.fn :fileName;
    console.log(" fileName", fileName);
    if (existsSync("./uploads/" + fileName.replace(/.csv/g, "_") + "report.html")) {
        var html = readFileSync("./uploads/" + fileName.replace(/.csv/g, "_") + "report.html", 'utf8');
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
    (req.body.fileName)?(dataFileName = req.body.fileName):fileName;
    (req.body.htmlFileName)? (htmlFileName = req.body.htmlFileName):fileName+'report.html';

    notebookPath = templatFolderPath + '/'+ dataFileName + '.ipynb'
     console.log('dataFileName ', dataFileName, 'htmlFileName', htmlFileName, "notebookPath", notebookPath);
    // Rename a file.
    contents.rename(templatFolderPath + templatIpynbPath, notebookPath);
        if (sourceCodes[1] !== undefined){
            var code = sourceCodes[1];
            code = code.replace(/filePath=/g, "filePath=\"" + basePath + dataFileName +"\"\n");
            code = code.replace(/htmlFilePath=/g, "htmlFilePath=\"" + basePath + htmlFileName + "\"\n");
            console.log('!!!!!!!!STEP1___________CODE:', code);
            source[1]=code;
            var future = kernel.requestExecute({ code: code});  
            future.onIOPub = function (msg) {
                console.log('!!!!!!!!STEP1___________RESULT:', msg);
                if (msg.header.msg_type === "execute_result") {
                        console.log('!!!!!!!!STEP1___________RESULT:', msg);
                        outputs[1]=msg.content;
                        console.log('!!!!!!!!OUTPUTS___________RESULT:', outputs[1]);
                        return res.send({ result: msg });  
                }
            }
        }
    

});

//相关性分析
router.get('/step2', function (req, res) {  
    if (sourceCodes[2] !== undefined){
        console.log('!!!!!!!!STEP2___________CODE:', sourceCodes.length, "--", sourceCodes[2]);
        var future = kernel.requestExecute({code: sourceCodes[2]});      
        future.onIOPub = function (msg) {
            if (msg.header.msg_type === "execute_result") { 
                console.log('!!!!!!!!STEP2___________RESULT:', msg);
                outputs[2]=msg.content;
                console.log('!!!!!!!!OUTPUTS___________RESULT:', outputs[2]);
                return res.send({result: msg.content.data["text/plain"]});
            }
        };
    }
});

router.post('/step3', function (req, res) {
    var deleteCols = req.body.deleteCols; //"deleteCols='petal length (cm)'";
    console.log('!!!!!!!!deleteCols:', deleteCols);
    if (sourceCodes[3] !== undefined && sourceCodes[4] !== undefined ){
        var code = sourceCodes[3];
        //delete corr cols
        code = code.replace(/deleteCols=/g, deleteCols);
        console.log('!!!!!!!!STEP3___________DeleteCODE:', code);
        source[3]=code;
        var future = kernel.requestExecute({code: code});
        future.onIOPub = function (msg) {
            if (msg.header.msg_type === "execute_result") { 
                console.log('!!!!!!!!STEP3___________RESULT:', msg);
                outputs[3]=msg.content;
                console.log('!!!!!!!!OUTPUTS___________RESULT:', outputs[3]);
            }
        };
        // get p_missing
        var codeNR = sourceCodes[4];
        console.log('!!!!!!!!STEP3___________getNulCODE:', codeNR);
        var futureNR = kernel.requestExecute({code: codeNR});
        futureNR.onIOPub = function (msg) {
            if (msg.header.msg_type === "execute_result") {
                console.log('!!!!!!!!STEP3___________GetNulRESULT:', msg);
                outputs[4]=msg.content;
                console.log('!!!!!!!!OUTPUTS___________RESULT:', outputs[1]);
                return res.send({result: msg.content.data["text/plain"]});
            }
        };
    }
});
//空值处理并获取标准差
router.post('/step4', function (req, res) {
  var imputerCols = req.body.imputerCols;//"imputerCols={'sepal width (cm)':'mean'}";
  console.log('!!!!!!!!imputerCols:', imputerCols);
  if (sourceCodes[5] !== undefined && sourceCodes[6] !== undefined){    
    //imputer code
    var code = sourceCodes[5];
    code = code.replace(/col_input=/g, imputerCols);
    source[5]=code;
    console.log('!!!!!!!!STEP4___________CODE:', code);
    var future = kernel.requestExecute({code: code});
    future.onIOPub = function (msg) {
        if (msg.header.msg_type === "execute_result") { 
            console.log('!!!!!!!!STEP4___________RESULT:', msg);
            outputs[5]=msg.content;
            console.log('!!!!!!!!OUTPUTS___________RESULT:', outputs[5]);
        }
    };
    //get std var
    var codeStd = sourceCodes[6];
    var futureStd = kernel.requestExecute({code: codeStd});
    futureStd.onIOPub = function (msg) {
        if (msg.header.msg_type === "execute_result") {
            console.log('!!!!!!!!STEP4___________GetstdRESULT:', msg);
            outputs[6]=msg.content;
            console.log('!!!!!!!!OUTPUTS___________RESULT:', outputs[6]);
            return res.send({result: msg.content.data["text/plain"]});
        }
    };
  }
});
//正则化
router.post('/step5', function (req, res) {
  var standardCols = req.body.standardCols;//
  console.log('!!!!!!!!standardCols:', standardCols);
  //standard code
  if (sourceCodes[7] !== undefined){ 
    var code = sourceCodes[7];
    code = code.replace(/col_input =/g, standardCols);
    source[7]=code;
    console.log('!!!!!!!!STEP5___________CODE:', code);
    var future = kernel.requestExecute({code: code});
    future.onIOPub = function (msg) {
        if (msg.header.msg_type === "execute_result") {
            console.log('!!!!!!!!STEP5___________RESULT:', msg);
            outputs[7]=msg.content;
            console.log('!!!!!!!!OUTPUTS___________RESULT:', outputs[7]);
        return res.send({result: msg});
        }
    };
  }
});

router.get('/step6', function (req, res) {
    console.log('!!!!!!!!STEP6___________CODE:', sourceCodes[9]);
    if (sourceCodes[9] !== undefined){ 
        var future = kernel.requestExecute({code: sourceCodes[9]});
        future.onIOPub = function (msg) {
            if (msg.header.msg_type === "execute_result") {
                console.log('!!!!!!!!STEP10___________RESULT:', msg);
                modelInfo = msg.content.data['text/plain'];
                console.log('!!!!!!!!OUTPUTS___________RESULT:', modelInfo);
                return res.send({result: "Got model info!"});
            }
        };
    }
});

router.get('/save', function (req, res) {
    readFilePromisified(baseNotebookPath + notebookPath)
        .then(text => {
            console.log('outputs array', outputs);
            console.log('source array', source);
            //console.log('obj json', obj);
            var obj = JSON.parse(text);  //now it an object
            //console.log('obj as obj', obj);
            //save to cell outputs 
            for (let i = 0, len = obj.cells.length; i < len; i++) {
                //console.log('obj.cells[i]', obj.cells[i]);
                if (outputs[i] !== undefined && outputs[i] !== null){
                    outputs[i].output_type = "execute_result";
                    //console.log('outputs[',i,']',  outputs[i]);
                    obj.cells[i].outputs.push(outputs[i]);
                    obj.cells[i].execution_count = i+1;
                }
                if (source[i] !== undefined && source[i] !== null){
                    //console.log('source[',i,']', source[i]);
                    obj.cells[i].source = source[i];
                }
            }               
            var json = JSON.stringify(obj); //convert it back to json   
            console.log('json', json); 
            writeFilePromisified(baseNotebookPath + notebookPath, json)
            .then(() => {  
                // get model info
                
                // Kill the session.  
                mysession.shutdown()
                .then(() => {
                    console.log('session closed');
                    console.log('modelInfo', modelInfo);
                    res.status(200).send({ modelInfo: modelInfo, dataFileName:dataFileName, notebookPath: notebookPath });
                })
                .catch(err => {
                    console.log(err);
                });
            })
            .catch(err => {
                console.log(err);
            });     
    })
    .catch(err => {
        console.log(err);
    });
});


module.exports = router;
