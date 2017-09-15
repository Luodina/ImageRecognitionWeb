'use strict';
import { Session, ContentsManager, Kernel } from '@jupyterlab/services';

import { XMLHttpRequest } from 'xmlhttprequest';
import { default as WebSocket } from 'ws';
global.XMLHttpRequest = XMLHttpRequest;
global.WebSocket = WebSocket;
const express = require('express');
const router = express.Router();
const path = require('path');
const config = require('./../config');
const env = config.env || 'dev';

const fs = require('fs');
const node_ssh = require('node-ssh');
const ssh = new node_ssh();
const sshJupyterHubOpts = {
    host: config[env].jupyterHubHost, //'10.20.51.5', //'10.1.236.84'
    // port: 22,
    username: config[env].jupyterHubUserName, //'root',
    //privateKey: '/Users/luodina/.ssh/id_rsa'
    password: config[env].jupyterHubPassword, //'Asiainfo123456' // 'Ocai@131415' 
};

let type,
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
//let token;

let dataFileName;
let command;


router.post('/initNotebook', function(req, res) {
    let modelId = "model_";
    let userName = "niusy";
    let token
    let jupyterOpts
    ssh.connect(sshJupyterHubOpts).then(() => {
        command = 'docker exec -i auradeploy_hub_1 sh -c "jupyterhub token ' + userName + '"\nexit\n';
        //get token
        ssh.execCommand(command).then(result => {
            if (result.stdout !== '') {
                token = result.stdout;
                console.log('token:', result.stdout);
                //res.status(200).send({ msg: 'success' });
                if (token !== '') {
                    jupyterOpts = {
                        baseUrl: config[env].notebookUrl + 'user/' + userName,
                        token: token,
                        kernelName: 'python3',
                        path: modelId + '/notebook.ipynb'
                    };
                    console.log('jupyterOpts', jupyterOpts);
                    // Kernel.getSpecs({ baseUrl: 'http://10.20.51.5:8000/user/niusy' }).then(kernelSpecs => {
                    //     console.log('Default spec:', kernelSpecs.default);
                    //     console.log('Available specs', Object.keys(kernelSpecs.kernelspecs));
                    // }).catch(function(err) {
                    //     console.log('Kernel err', err);
                    // });
                    let contents = new ContentsManager(jupyterOpts);
                    contents.get(modelId + '/notebook.ipynb')
                        .then(function(model) {

                            for (var i = 0; i < model.content.cells.length; i++) {
                                sourceCodes[i] = model.content.cells[i].source;
                            }
                            let obj = model.content;
                            let cells = Array(obj.cells.length);
                            for (let i = 0, len = obj.cells.length; i < len; i++) {
                                cells[i] = {};
                                let tmpSource = obj.cells[i].source;
                                if (tmpSource !== undefined && tmpSource !== null) {
                                    if (tmpSource.length !== 0) {
                                        if (tmpSource !== undefined && tmpSource !== null) {
                                            source[i] = tmpSource;
                                            cells[i].code = source[i]
                                        }
                                    }
                                }
                                let tmpOutputs = obj.cells[i].outputs;
                                //console.log("tmpOutputs", tmpOutputs)
                                if (tmpOutputs !== undefined && tmpOutputs !== null) {
                                    if (tmpOutputs.length !== 0) {
                                        for (let j = 0, len = tmpOutputs.length; j < len; j++) {
                                            if (tmpOutputs[j].data !== undefined && tmpOutputs[j].data !== null) {
                                                console.log("tmpOutputs[j]", tmpOutputs[j])
                                                outputs[i] = tmpOutputs[j].data;
                                                cells[i].result = outputs[i]
                                            }
                                        }
                                    }
                                }
                            }
                            console.log("cells", cells)
                                //-------------
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
                                            res.status(200).send({ cells: cells });
                                        });
                                        existSession = true;
                                        break;
                                    }
                                }
                                if (!existSession) {
                                    Session.startNew(jupyterOpts).then(function(session) {
                                        kernel = session.kernel;
                                        mysession = session;
                                        console.log('New Jupyter Notebook session started');
                                        res.status(200).send({ cells: cells });
                                    }).catch(function(err) {
                                        console.log(err, err);
                                    });
                                }
                            }).catch(function(err) {
                                console.log(err);
                            });
                            //-------------
                        }).catch(function(err) {
                            console.log(err);
                        });


                }
            }
        })

    }).catch(function(err) {
        console.log(err);
    });

    // let jupyterOpts = {
    //     baseUrl: config[env].notebookUrl + '/user/' + userName,
    //     token: token,
    //     kernelName: 'python3',
    //     path: modelId + '/notebook.ipynb'
    // };

    // console.log('jupyterOpts', jupyterOpts);
    // let contents = new ContentsManager(jupyterOpts);
    // contents.get(modelId + '/notebook.ipynb').then(function(model) {
    //     for (var i = 0; i < model.content.cells.length; i++) {
    //         sourceCodes[i] = model.content.cells[i].source;
    //     }
    //     Session.listRunning(jupyterOpts).then(function(sessionModels) {
    //         var sessionNums = sessionModels.length;
    //         var existSession = false;
    //         for (var _i = 0; _i < sessionNums; _i++) {
    //             var _path = sessionModels[_i].notebook.path;
    //             if (_path === modelName + '/' + modelName + '.ipynb') {
    //                 Session.connectTo(sessionModels[_i].id, jupyterOpts).then(function(session) {
    //                     kernel = session.kernel;
    //                     mysession = session;
    //                     console.log('connected to running Jupyter Notebook session');
    //                 });
    //                 existSession = true;
    //                 break;
    //             }
    //         }
    //         if (!existSession) {
    //             Session.startNew(jupyterOpts).then(function(session) {
    //                 kernel = session.kernel;
    //                 mysession = session;
    //                 // future.onDone = function() {
    //                 //     console.log('Future is fulfilled');
    //                 res.status(200).send({ msg: 'success', outputs: outputs, sources: source });
    //                 // }; console.log('New Jupyter Notebook session started');
    //             }).catch(function(err) {
    //                 console.log(err, err);
    //             });
    //         }
    //     }).catch(function(err) {
    //         console.log(err);
    //     });
    // }).catch(function(err) {
    //     console.log('Content problem!', err);
    //     res.status(200).send({ msg: err.xhr.responseText });
    // });
});

router.post('/run', function(req, res) {
    let sourceCodes = req.body.sourceCodes;
    console.log(`CODE:'${sourceCodes}`)
    let future = kernel.requestExecute({ code: sourceCodes });
    future.onDone = () => {
        console.log('Future is fulfilled');
    };
    future.onIOPub = msg => {
        if (msg.header.msg_type === 'error') {
            console.log(`
                    ERROR: '${msg.content.evalue}
                    CODE: $ { sourceCodes[2] }
                    `);
            res.status(200).send({ result: msg.content.evalue, msg: 'error' });
        }
        if (msg.header.msg_type === 'execute_result') {
            console.log(`msg.content:'${msg.content}`)
            return res.send({ result: msg.content, msg: 'success' });
        }
    };
});

// router.post('/upload', upload.single('file'), function(req, res) {
//     res.status(200).send({ fileName: req.file.originalname });
//     ssh.connect(sshJupyterHubOpts).then(function() {
//         ssh.putFiles([{
//             local: uploadDir + '/' + dataFileName,
//             remote: '/var/lib/docker/volumes/' + userPath + '/_data/' + modelName + '/' + dataFileName
//         }]).then(function() {
//             console.log("The File thing is done");
//         }, function(error) {
//             console.log("Something's wrong");
//             console.log(error);
//         });
//     });
// });
// router.post('/step0', function(req, res) {
//     var future = kernel.requestExecute({ code: sourceCodes[0] });
//     future.onIOPub = function(msg) {
//         if (msg.header.msg_type === 'error') {
//             console.log('ERROR:\'' + msg.content.evalue);
//             res.status(200).send({ msg: msg.content.evalue });
//         }
//     };
//     future.onDone = function() {
//         console.log('Future is fulfilled');
//         res.status(200).send({ msg: 'success', outputs: outputs, sources: source });
//     };
// });

// router.post('/step1', function(req, res) {
//     var dataFileName = 'iris.csv'; //req.body.fileName;
//     var htmlFileName = 'report.html'; //req.body.htmlFileName;
//     ssh.connect(sshJupyterHubOpts).then(function() {
//         if (sourceCodes[1] !== undefined && sourceCodes[1] !== undefined) {
//             var code = sourceCodes[1];
//             code = code.replace(/filePath=/g, 'filePath=\'' + dataFileName + '\'\n');
//             code = code.replace(/htmlFilePath=/g, 'htmlFilePath=\'' + htmlFileName + '\'\n');
//             source[1] = code;
//             var future = kernel.requestExecute({ code: code });
//             future.onIOPub = function(msg) {
//                 if (msg.header.msg_type === 'error') {
//                     console.log('ERROR:\'' + msg.content.evalue + '\n                                CODE: ' + code);
//                     res.status(200).send({ result: msg.content.evalue, msg: 'error' });
//                 }
//                 if (msg.header.msg_type === 'execute_result') {
//                     outputs[1] = msg.content;
//                     res.send({ result: msg, msg: 'success' });
//                 }
//             };
//         } else {
//             res.status(200).send({ result: 'cell[0] in .ipynb cannot be NULL or undefined', msg: 'error' });
//         }
//     }).catch(function(err) {
//         console.log(err);
//     });
// });

// router.get('/report/:fn', function(req, res) {
//     if (req.params.fn !== undefined && mode !== 'new') {
//         dataFileName = req.params.fn;
//     }

//     if (existsSync(uploadDir + '/' + projectType + '/' + dataFileName.replace(/.csv/g, '_') + 'report.html')) {
//         var html = readFileSync(uploadDir + '/' + projectType + '/' + dataFileName.replace(/.csv/g, '_') + 'report.html', 'utf8');
//         res.status(200).send({ data: html });
//     } else {
//         res.status(200).send({ data: '<div>Report does not exist</div>' });
//     }
// });

module.exports = router;