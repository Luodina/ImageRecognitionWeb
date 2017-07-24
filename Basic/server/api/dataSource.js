'use strict';
import { Session, ContentsManager} from '@jupyterlab/services';
import { XMLHttpRequest } from 'xmlhttprequest';
import { default as WebSocket } from 'ws';
import { readFile, writeFile, existsSync, readFileSync, mkdir, createReadStream, createWriteStream } from 'fs';
global.XMLHttpRequest = XMLHttpRequest;
global.WebSocket = WebSocket;
const express = require('express');
const router = express.Router();
const path = require('path');
const config = require('./../config');
const env = config.env || 'dev';

const templatIpynbPath = path.join(__dirname, '../../template');
const templatIpynbFile = '/dataProfile-V4.0.ipynb';
const modelPath = config[env].modelPath;
const appPath = config[env].appPath;
let baseNotebookPath;
let baseNotebookDir;
let projectType;
let modelName;
let userName;
let type;
function notebookPath(type){
    if (type === 'explore'){
        return path.join(__dirname, '../../' + modelPath);
    } else {
        return path.join(__dirname, '../../' + appPath);
    }
}
function notebookDir(type){
    if (type === 'explore'){
        return 'notebookModel';
    } else {
        return 'notebookApp';
    }
}
function notebookOpts(type){
    return {
        baseUrl: config[env].notebookUrl,
        token: config[env].token,
        kernelName: 'python',
        path: notebookPath('app'),
    };
}

let outputs = Array(10);
let source = Array(10);
let sourceCodes = [];
let mode;
let dataFileName;
let htmlFileName;
let modelInfo;
let mysession;
let kernel;

//console.log('!!!!!!!!___________OPTIONS:', options);
//let contents = new ContentsManager(options);
let multer = require('multer');
let storage = multer.diskStorage({
    destination:
     function destination(req, destination, cb) {
        cb(null, baseNotebookPath + '/' + projectType);
    },

    filename: function filename(req,file, cb) {
        cb(null, file.originalname);
        dataFileName = file.originalname;
    }
});

let upload = multer({ storage: storage });

function ensureExists(path, mask, cb) {
    if (typeof mask === 'function') { // allow the `mask` parameter to be optional
        cb = mask;
        mask = '0777';
    }
    mkdir(path, mask, function(err) {
        console.log('mkdir done!');
        if (err) {
            (err.code === 'EEXIST')? cb(null):cb(err); // ignore the error if the folder already exists
        }else {
            cb(null);
        } // successfully created folder
    });
}

function init(){
    console.log('init');
    if (sourceCodes[0] !== undefined){
        console.log('!!!!!!!!STEP0___________CODE:', sourceCodes[0]);
        kernel.requestExecute({ code: sourceCodes[0]});
    }
}
function runNewSession(options){
    Session.listRunning(options).then(sessionModels => {
        let sessionNums = sessionModels.length;
        let existSession = false;
        console.log('sessionModels.length',sessionModels.length);
        for (let i = 0; i < sessionNums; i++) {
            let path = sessionModels[i].notebook.path;
            if (path === templatIpynbPath) {
                console.log(sessionModels[i]);
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
    //let notebookPath = req.body.notebookPath;
    modelName = req.body.projectName;
    userName = req.body.userName;
    type = req.body.projectType;
    mode = req.body.modelMode;
    baseNotebookPath = notebookPath(type);
    baseNotebookDir = notebookDir(type);
    if (type === 'explore') {      
        projectType = modelName;
    } else{
        projectType = type;    
    }
    let options = notebookOpts(type);
    console.log('!!!!!!!!___________OPTIONS:', options);
    let contents = new ContentsManager(options);   
    console.log(`/init: fileName ${fileName}
                        modelName ${modelName} 
                        userName ${userName}
                        projectType ${projectType}
                        baseNotebookPath' ${baseNotebookPath}
                        contents ${contents}`);
    
    if (mode === 'new'){
        ensureExists(baseNotebookPath + '/'+ projectType, '0744', function(err) {
            if (err) {
                console.log('Cannot create folder: ',err);
            } else {           
                createReadStream(templatIpynbPath + templatIpynbFile)
                .pipe(createWriteStream(baseNotebookPath + '/'+ projectType + '/'+ modelName + '.ipynb'))
                console.log('Success!!!' , baseNotebookPath + '/'+ projectType + '/'+ modelName + '.ipynb', 'exists!');
                contents.get( baseNotebookDir + '/' + projectType + '/'+ modelName + '.ipynb')
                .then(model =>{
                    for(let i = 0; i<model.content.cells.length; i++){
                        sourceCodes[i] =  model.content.cells[i].source;
                    }
                    runNewSession(options);
                    res.status(200).send({ msg: 'success', outputs: outputs,sources:source });
                })
                .catch(err => {
                    console.log('Content problem!', err);
                })
               
            }
        });
    }
    if (mode === 'update' || mode === 'view'){
        console.log('!!!!!!!!!!!!!File ', baseNotebookPath + '/' + projectType + '/'+ modelName + '.ipynb') ;
        if (existsSync(baseNotebookPath  + '/' + projectType  + '/' + modelName + '.ipynb')) {
            readFilePromisified(baseNotebookPath  + '/'+ projectType + '/' + modelName + '.ipynb')
            .then(text => {
                let obj = JSON.parse(text);  //now it an object
                for (let i = 0, len = obj.cells.length; i < len; i++) {
                    let tmpOutputs = obj.cells[i].outputs;
                    if (tmpOutputs !== undefined && tmpOutputs !== null){
                        if (tmpOutputs.length !== 0) {
                            if (tmpOutputs[0].data !== undefined && tmpOutputs[0].data !== null ){
                                outputs[i] = tmpOutputs[0].data;
                            }
                        }
                    }
                    let tmpSource = obj.cells[i].source;
                    if (tmpSource !== undefined && tmpSource !== null){
                        if (tmpSource.length !== 0) {
                            if (tmpSource!== undefined && tmpSource!== null ){
                                source[i] = tmpSource;
                            }
                        }
                    }
                }
                res.status(200).send({ msg: 'success', outputs: outputs, sources:source});
            })
            .catch(err => {
                console.log(err);
            });
        } else {
            console.log('File ', baseNotebookPath + '/' + projectType + '/'+ modelName + '.ipynb', ' does not exist!') ;
        }
    }
});

router.post('/upload', upload.single('file'), function (req, res) {
    res.status(200).send({ fileName: req.file.originalname});
});

router.get('/report/:fn', function (req, res) {
    console.log(' !!!!!!!!dataFileName', dataFileName, 'req.params.fn', req.params.fn);

    if (req.params.fn !== undefined && mode !== 'new') {
        dataFileName = req.params.fn;
    }

    if (existsSync(baseNotebookPath + '/'+ projectType + '/' + dataFileName.replace(/.csv/g, '_') + 'report.html')) {
        let html = readFileSync(baseNotebookPath + '/'+ projectType + '/' + dataFileName.replace(/.csv/g, '_') + 'report.html', 'utf8');
        res.status(200).send({data: html });
    } else {
        res.status(200).send({data: '<div>!!!!!!!</div>' });
    }
});

router.post('/step1', function (req, res) {
    let dataFileName = req.body.fileName;
    let htmlFileName = req.body.htmlFileName;

    // notebookPath = templatFolderPath + '/'+ dataFileName + '.ipynb'
    console.log('dataFileName ', dataFileName, 'htmlFileName', htmlFileName, '/'+ projectType + '/');
    // // Rename a file.
    // contents.rename(templatFolderPath + templatIpynbPath, notebookPath);
        if (sourceCodes[1] !== undefined){
            let code = sourceCodes[1];
            code = code.replace(/filePath=/g, 'filePath=\'' + baseNotebookPath + '/'+ projectType + '/'+ dataFileName +'\'\n');
            code = code.replace(/htmlFilePath=/g, 'htmlFilePath=\'' + baseNotebookPath + '/'+ projectType + '/'+htmlFileName + '\'\n');
            console.log('!!!!!!!!STEP1___________CODE:', code);
            source[1]=code;
            let future = kernel.requestExecute({ code: code});
            future.onIOPub = function (msg) {
                console.log('!!!!!!!!STEP1___________RESULT:', msg);
                if (msg.header.msg_type === 'error') {
                    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!ERROR:',msg.content.evalue);
                }
                if (msg.header.msg_type === 'execute_result') {
                    console.log('!!!!!!!!STEP1___________RESULT:', msg);
                    outputs[1]=msg.content;
                    console.log('!!!!!!!!OUTPUTS___________RESULT:', outputs[1]);
                    return res.send({ result: msg });
                }
            };
        }


});

//相关性分析
router.get('/step2', function (req, res) {
    if (sourceCodes[2] !== undefined){
        console.log('!!!!!!!!STEP2___________CODE:', sourceCodes.length, '--', sourceCodes[2]);
        let future = kernel.requestExecute({code: sourceCodes[2]});
        future.onIOPub = function (msg) {
            if (msg.header.msg_type === 'execute_result') {
                console.log('!!!!!!!!STEP2___________RESULT:', msg);
                outputs[2]=msg.content;
                console.log('!!!!!!!!OUTPUTS___________RESULT:', outputs[2]);
                return res.send({result: msg.content.data['text/plain']});
            }
        };
    }
});

router.post('/step3', function (req, res) {
    let deleteCols = req.body.deleteCols; //"deleteCols='petal length (cm)'";
    console.log('!!!!!!!!deleteCols:', deleteCols);
    if (sourceCodes[3] !== undefined && sourceCodes[4] !== undefined ){
        let code = sourceCodes[3];
        //delete corr cols
        code = code.replace(/deleteCols=/g, deleteCols);
        console.log('!!!!!!!!STEP3___________DeleteCODE:', code);
        source[3]=code;
        let future = kernel.requestExecute({code: code});
        future.onIOPub = function (msg) {
            if (msg.header.msg_type === 'execute_result') {
                console.log('!!!!!!!!STEP3___________RESULT:', msg);
                outputs[3]=msg.content;
                console.log('!!!!!!!!OUTPUTS___________RESULT:', outputs[3]);
            }
        };
        // get p_missing
        let codeNR = sourceCodes[4];
        console.log('!!!!!!!!STEP3___________getNulCODE:', codeNR);
        let futureNR = kernel.requestExecute({code: codeNR});
        futureNR.onIOPub = function (msg) {
            if (msg.header.msg_type === 'execute_result') {
                console.log('!!!!!!!!STEP3___________GetNulRESULT:', msg);
                outputs[4]=msg.content;
                console.log('!!!!!!!!OUTPUTS___________RESULT:', outputs[1]);
                return res.send({result: msg.content.data['text/plain']});
            }
        };
    }
});
//空值处理并获取标准差
router.post('/step4', function (req, res) {
  let imputerCols = req.body.imputerCols;//"imputerCols={'sepal width (cm)':'mean'}";
  console.log('!!!!!!!!imputerCols:', imputerCols);
  if (sourceCodes[5] !== undefined && sourceCodes[6] !== undefined){
    //imputer code
    let code = sourceCodes[5];
    code = code.replace(/col_input=/g, imputerCols);
    source[5]=code;
    console.log('!!!!!!!!STEP4___________CODE:', code);
    let future = kernel.requestExecute({code: code});
    future.onIOPub = function (msg) {
        if (msg.header.msg_type === 'execute_result') {
            console.log('!!!!!!!!STEP4___________RESULT:', msg);
            outputs[5]=msg.content;
            console.log('!!!!!!!!OUTPUTS___________RESULT:', outputs[5]);
        }
    };
    //get std var
    let codeStd = sourceCodes[6];
    let futureStd = kernel.requestExecute({code: codeStd});
    futureStd.onIOPub = function (msg) {
        if (msg.header.msg_type === 'execute_result') {
            console.log('!!!!!!!!STEP4___________GetstdRESULT:', msg);
            outputs[6]=msg.content;
            console.log('!!!!!!!!OUTPUTS___________RESULT:', outputs[6]);
            return res.send({result: msg.content.data['text/plain']});
        }
    };
  }
});
//正则化
router.post('/step5', function (req, res) {
  let standardCols = req.body.standardCols;//
  console.log('!!!!!!!!standardCols:', standardCols);
  //standard code
  if (sourceCodes[7] !== undefined){
    let code = sourceCodes[7];
    code = code.replace(/col_input =/g, standardCols);
    source[7]=code;
    console.log('!!!!!!!!STEP5___________CODE:', code);
    let future = kernel.requestExecute({code: code});
    future.onIOPub = function (msg) {
        if (msg.header.msg_type === 'execute_result') {
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
        let future = kernel.requestExecute({code: sourceCodes[9]});
        future.onIOPub = function (msg) {
            if (msg.header.msg_type === 'execute_result') {
                console.log('!!!!!!!!STEP10___________RESULT:', msg);
                modelInfo = msg.content.data['text/plain'];
                console.log('!!!!!!!!OUTPUTS___________RESULT:', modelInfo);
                return res.send({result: 'Got model info!'});
            }
        };
    }
});

router.get('/save', function (req, res) {
    if (existsSync(baseNotebookPath + '/'+ projectType  + '/' + modelName + '.ipynb')) {
        readFilePromisified(baseNotebookPath + '/'+ projectType + '/' + modelName + '.ipynb')
    //readFilePromisified(baseNotebookPath + notebookPath)
        .then(text => {
            console.log('outputs array', outputs);
            console.log('source array', source);
            //console.log('obj json', obj);
            let obj = JSON.parse(text);  //now it an object
            //console.log('obj as obj', obj);
            //save to cell outputs
            for (let i = 0, len = obj.cells.length; i < len; i++) {
                //console.log('obj.cells[i]', obj.cells[i]);
                if (outputs[i] !== undefined && outputs[i] !== null){
                    outputs[i].output_type = 'execute_result';
                    //console.log('outputs[',i,']',  outputs[i]);
                    obj.cells[i].outputs.push(outputs[i]);
                    obj.cells[i].execution_count = i+1;
                }
                if (source[i] !== undefined && source[i] !== null){
                    //console.log('source[',i,']', source[i]);
                    obj.cells[i].source = source[i];
                }
            }
            let json = JSON.stringify(obj); //convert it back to json
            console.log('json', json);
            writeFilePromisified(baseNotebookPath +'/' +  projectType + '/' + modelName + '.ipynb', json)
            .then(() => {
                // get model info

                // Kill the session.
                mysession.shutdown()
                .then(() => {
                    console.log('session closed');
                    console.log('modelInfo', modelInfo, 'dataFileName', dataFileName, 'baseNotebookDir', baseNotebookDir,'type',type);
                    res.status(200).send({ modelInfo: modelInfo, 
                                           dataFileName:dataFileName,
                                           notebookPath: baseNotebookDir, 
                                           projectType: projectType,
                                           modelType: '01'
                                        });
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
    } else {
        console.log('File ', baseNotebookPath + '/'+ projectType + '/'+ modelName + '.ipynb', ' does not exist!') ;
    }
});

module.exports = router;
