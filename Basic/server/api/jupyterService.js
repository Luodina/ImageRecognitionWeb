'use strict';
import { Session, ContentsManager } from '@jupyterlab/services';
import { XMLHttpRequest } from 'xmlhttprequest';
import { default as WebSocket } from 'ws';
global.XMLHttpRequest = XMLHttpRequest;
global.WebSocket = WebSocket;
const express = require('express');
const router = express.Router();
const path = require('path');
const config = require('./../config');
const env = config.env || 'local';

const fs = require('fs');
const node_ssh = require('node-ssh');
const ssh = new node_ssh();
const sshJupyterHubOpts = {
    host: '10.1.236.84',
    port: 22,
    username: 'root',
    password: 'Ocai@131415'
};

var type,
    userName,
    modelName,
    mode;
let userPath;
let sourceCodes = [];
let outputs = [];
let source = [];
const templDir = path.join(__dirname, '../../template/');

const templDataProfile = templDir + 'dataProfile-V4.0.ipynb';
const templExpertModelDir = templDir + 'notebookTemplates';
const templAppDir = templDir + 'data_apply_demo';

let mysession;
let kernel;
let token;

let dataFileName;
let uploadDir = path.join(__dirname, '../../uploads');
let multer = require('multer');
let storage = multer.diskStorage({
    destination: function destination(req, destination, cb) {
        cb(null, uploadDir);
    },

    filename: function filename(req, file, cb) {
        cb(null, file.originalname);
        dataFileName = file.originalname;
    }
});

let upload = multer({ storage: storage });

router.post('/init', function(req, res) {
    //modelID = '123';
    modelName = 'newModelTest66'; //req.body.projectName;
    let appName = 'myApp1';
    userName = 'admin'; //req.body.userName;
    type = 'model'; //req.body.projectType;
    mode = req.body.modelMode;
    userPath = 'jupyterhub-user-' + userName;
    let volume = '/var/lib/docker/volumes/' + userPath + '/_data';
    let modelFolderPath = volume + '/' + modelName;
    let modelIpynbPath = volume + '/' + modelName + '/' + modelName + '.ipynb';
    let remotePath = '/var/lib/docker/volumes/' + userPath + '/_data/';
    console.log(templAppDir, remotePath);
    ssh.connect(sshJupyterHubOpts).then(function() {
        let command = '';
        const failed = []
        const successful = []
        ssh.putDirectory(templAppDir, remotePath + appName, {
            recursive: true,
            // validate: function(itemPath) {
            //     const baseName = path.basename(itemPath)
            //     return baseName.substr(0, 1) !== '.' && // do not allow dot files 
            //         baseName !== 'node_modules' // do not allow node_modules 
            // },
            tick: function(localPath, remotePath, error) {
                if (error) {
                    failed.push(localPath)
                } else {
                    successful.push(localPath)
                }
            }
        }).then(function(status) {
            console.log('the directory transfer was', status ? 'successful' : 'unsuccessful')
            console.log('failed transfers', failed.join(', '))
            console.log('successful transfers', successful.join(', '))
        }).catch(err => { console.log(err) });

        // if (type === 'app') {
        //     command = 'cp -r /home/puaiuc/aura_deploy/template/data_apply_demo ' + '/var/lib/docker/volumes/' + userPath + '/_data/' + appName + ' && chmod 777 /var/lib/docker/volumes/' + userPath + '/_data/' + appName + '\nexit\n';
        // }
        // if (type === 'model') {
        //     command = 'mkdir ' + modelFolderPath + ' && cp ' + templDataProfile + ' ' + modelIpynbPath + ' && chmod -R 777 ' + modelFolderPath + '\nexit\n';
        // }
        // ssh.execCommand(command).then(function(result) {
        //     console.log('STDOUT: ' + result.stdout);
        //     console.log('STDERR: ' + result.stderr);
        //     if (result.stderr !== '') {
        //         res.status(200).send({ msg: result.stderr });
        //     } else {
        //         command = 'docker exec -i auradeploy_hub_1 sh -c "jupyterhub token ' + userName + '"\nexit\n';
        //         //get token
        //         ssh.execCommand(command).then(function(result) {
        //             if (result.stdout !== '') {
        //                 token = result.stdout;
        //                 console.log('token:', result.stdout);
        //                 res.status(200).send({ msg: 'success' });
        //             }
        //         })
        //     }
        // });
    }).catch(function(err) {
        console.log(err);
    });
});
router.post('/run', function(req, res) {
    let jupyterOpts = {
        baseUrl: config[env].notebookUrl + '/user/' + userName,
        token: token,
        kernelName: 'python3',
        path: modelName + '/' + modelName + '.ipynb'
    };
    let contents = new ContentsManager(jupyterOpts);
    contents.get(modelName + '/' + modelName + '.ipynb').then(function(model) {
        for (var i = 0; i < model.content.cells.length; i++) {
            sourceCodes[i] = model.content.cells[i].source;
        }
        Session.listRunning(jupyterOpts).then(function(sessionModels) {
            var sessionNums = sessionModels.length;
            var existSession = false;
            for (var _i = 0; _i < sessionNums; _i++) {
                var _path = sessionModels[_i].notebook.path;
                if (_path === modelName + '/' + modelName + '.ipynb') {
                    Session.connectTo(sessionModels[_i].id, jupyterOpts).then(function(session) {
                        kernel = session.kernel;
                        mysession = session;
                        console.log('connected to running Jupyter Notebook session');
                    });
                    existSession = true;
                    break;
                }
            }
            if (!existSession) {
                Session.startNew(jupyterOpts).then(function(session) {
                    kernel = session.kernel;
                    mysession = session;
                    var future = kernel.requestExecute({ code: sourceCodes[0] });
                    future.onIOPub = function(msg) {
                        if (msg.header.msg_type === 'error') {
                            console.log('ERROR:\'' + msg.content.evalue);
                            //CODE: ${sourceCodes[0]}`);
                            res.status(200).send({ msg: msg.content.evalue });
                        }
                    };
                    future.onDone = function() {
                        console.log('Future is fulfilled');
                        res.status(200).send({ msg: 'success', outputs: outputs, sources: source });
                    };
                    console.log('New Jupyter Notebook session started');
                }).catch(function(err) {
                    console.log(err, err);
                });
            }
        }).catch(function(err) {
            console.log(err);
        });
    }).catch(function(err) {
        console.log('Content problem!', err);
        res.status(200).send({ msg: err.xhr.responseText });
    });
})
router.post('/upload', upload.single('file'), function(req, res) {
    res.status(200).send({ fileName: req.file.originalname });
    ssh.connect(sshJupyterHubOpts).then(function() {
        ssh.putFiles([{
            local: uploadDir + '/' + dataFileName,
            remote: '/var/lib/docker/volumes/' + userPath + '/_data/' + modelName + '/' + dataFileName
        }]).then(function() {
            console.log("The File thing is done");
        }, function(error) {
            console.log("Something's wrong");
            console.log(error);
        });
    });
});
router.post('/step0', function(req, res) {
    var future = kernel.requestExecute({ code: sourceCodes[0] });
    future.onIOPub = function(msg) {
        if (msg.header.msg_type === 'error') {
            console.log('ERROR:\'' + msg.content.evalue);
            res.status(200).send({ msg: msg.content.evalue });
        }
    };
    future.onDone = function() {
        console.log('Future is fulfilled');
        res.status(200).send({ msg: 'success', outputs: outputs, sources: source });
    };
});

router.post('/step1', function(req, res) {
    var dataFileName = 'iris.csv'; //req.body.fileName;
    var htmlFileName = 'report.html'; //req.body.htmlFileName;
    ssh.connect(sshJupyterHubOpts).then(function() {
        if (sourceCodes[1] !== undefined && sourceCodes[1] !== undefined) {
            var code = sourceCodes[1];
            code = code.replace(/filePath=/g, 'filePath=\'' + dataFileName + '\'\n');
            code = code.replace(/htmlFilePath=/g, 'htmlFilePath=\'' + htmlFileName + '\'\n');
            source[1] = code;
            var future = kernel.requestExecute({ code: code });
            future.onIOPub = function(msg) {
                if (msg.header.msg_type === 'error') {
                    console.log('ERROR:\'' + msg.content.evalue + '\n                                CODE: ' + code);
                    res.status(200).send({ result: msg.content.evalue, msg: 'error' });
                }
                if (msg.header.msg_type === 'execute_result') {
                    outputs[1] = msg.content;
                    res.send({ result: msg, msg: 'success' });
                }
            };
        } else {
            res.status(200).send({ result: 'cell[0] in .ipynb cannot be NULL or undefined', msg: 'error' });
        }
    }).catch(function(err) {
        console.log(err);
    });
});

router.get('/report/:fn', function(req, res) {
    if (req.params.fn !== undefined && mode !== 'new') {
        dataFileName = req.params.fn;
    }

    if (existsSync(uploadDir + '/' + projectType + '/' + dataFileName.replace(/.csv/g, '_') + 'report.html')) {
        var html = readFileSync(uploadDir + '/' + projectType + '/' + dataFileName.replace(/.csv/g, '_') + 'report.html', 'utf8');
        res.status(200).send({ data: html });
    } else {
        res.status(200).send({ data: '<div>Report does not exist</div>' });
    }
});

module.exports = router;