'use strict';
import { Session, ContentsManager, Kernel } from '@jupyterlab/services';
import { XMLHttpRequest } from 'xmlhttprequest';
import { default as WebSocket } from 'ws';
import { writeFile } from 'fs';

let sequelize = require('../sequelize');
let Sequelize = require('sequelize');
let Model = require('../model/MODEL_INFO')(sequelize, Sequelize);
global.XMLHttpRequest = XMLHttpRequest;
global.WebSocket = WebSocket;
const express = require('express');
const router = express.Router();
const path = require('path');
const config = require('./../config');
const env = config.env || 'dev';
const { exec } = require('child_process');
const node_ssh = require('node-ssh');
const ssh = new node_ssh();
const sshJupyterHubOpts = {
    host: config[env].jupyterHubHost,
    username: config[env].jupyterHubUserName,
    password: config[env].jupyterHubPassword
};
let modelName;
let sourceCodes = [];
const templDir = path.join(__dirname, '../../template/');
// const templDataProfile = templDir + 'dataProfile-V4.0.ipynb';
// const templExpertModelDir = templDir + 'notebookTemplates';
// const templAppDir = templDir + 'data_apply_demo';
const templTemp = templDir + 'temp.ipynb';
let mysession;
let kernel;
let command;
let modelContent;
let jupyterOpts;


function startSession(jupyterOpts) {
    return new Promise((resolve, reject) => {
        Session.listRunning(jupyterOpts).then(sessionModels => {
            let sessionNums = sessionModels.length;
            let existSession = false;
            for (let _i = 0; _i < sessionNums; _i++) {
                let _path = sessionModels[_i].notebook.path;
                if (_path === modelName + '/' + modelName + '.ipynb') {
                    Session.connectTo(sessionModels[_i].id, jupyterOpts).then(session => {
                            kernel = session.kernel;
                            mysession = session;
                            resolve({
                                msg: 'success'
                            });
                            console.log('connected to running Jupyter Notebook session');
                        })
                        .catch(err => {
                            reject({
                                msg: err
                            });
                            console.log(err, err);
                        });
                    existSession = true;
                    break;
                }
            }
            if (!existSession) {
                Session.startNew(jupyterOpts).then(session => {
                    kernel = session.kernel;
                    mysession = session;
                    resolve({
                        msg: 'success'
                    });
                    console.log('New Jupyter Notebook session started');
                }).catch(err => {
                    reject({
                        msg: err
                    });
                    console.log('err', err);
                });
            }
        }).catch(err => {
            reject({
                msg: err
            });
            console.log('err', err);
        });
    });
}

function getKernelList() {
    return new Promise((resolve, reject) => {
        Kernel.getSpecs({ baseUrl: config[env].notebookUrl, token: config[env].token }).then(kernelSpecs => {
            kernelSpecs = kernelSpecs;
            console.log('Default spec:', kernelSpecs.default);
            console.log('Available specs', kernelSpecs.kernelspecs);
            let kernelspecs = kernelSpecs.kernelspecs;
            let tmp = Object.keys(kernelspecs).map(key => {
                return kernelspecs[key];
            });
            let kernellist = {};
            kernellist.default = kernelSpecs.default;
            kernellist.kernelspecs = [];
            tmp.forEach(kernel => {
                kernellist.kernelspecs.push({ name: kernel.name, display_name: kernel.display_name });
            });
            resolve({
                kernellist: kernellist,
                msg: 'success'
            });
        }).catch(err => {
            reject({
                msg: err
            });
        });
    });
}

router.get('/kernels', function(req, res) {
    if (!req.user) {
        res.send({ msg: 'authentification error' });
    }
    getKernelList(req.user.username).then(kernellist => {
        res.send(kernellist);
    }).catch(err => {
        res.send({
            msg: err
        });
    });
});



router.post('/initNotebook', function(req, res) {
    Model.findOne({
        where: { MODEL_NAME: req.body.modelName },
        raw: true
    }).then(model => {
        if (!model || !model.KERNEL) {
            res.send({ result: null, msg: 'KERNEL can not null' });
            return;
        }
        let modelId = 'model_' + model.MODEL_ID;
        let file = '/notebook.ipynb';
        let kernelName = model.KERNEL;
        let token = config[env].token;
        if (token !== '' && token !== null) {
            jupyterOpts = {
                baseUrl: config[env].notebookUrl,
                token: token,
                kernelName: kernelName,
                path: modelId + file
            };
            console.log('jupyterOpts:', jupyterOpts);
            let contents = new ContentsManager(jupyterOpts);
            contents.get(modelId + file)
                .then(model => {
                    modelContent = model.content;
                    for (let i = 0; i < model.content.cells.length; i++) {
                        sourceCodes[i] = model.content.cells[i].source;
                    }
                    let obj = model.content;
                    let cells = Array(obj.cells.length);
                    for (let i = 0, len = obj.cells.length; i < len; i++) {
                        cells[i] = {};
                        cells[i].cell_type = obj.cells[i].cell_type;
                        cells[i].execution_count = obj.cells[i].execution_count;
                        cells[i].metadata = obj.cells[i].metadata;
                        if (obj.cells[i].source !== undefined && obj.cells[i].source !== null) {
                            if (obj.cells[i].source.length !== 0) {
                                cells[i].code = obj.cells[i].source;
                            }
                        }
                        if (obj.cells[i].outputs !== undefined && obj.cells[i].outputs !== null) {
                            cells[i].outputs = obj.cells[i].outputs;
                        }
                    }
                    startSession(jupyterOpts).then(() => {
                            console.log('startSession result', cells);
                            res.status(200).send({ cells: cells });
                        })
                        .catch(err => {
                            console.log('startSession', err);
                            res.status(200).send({ msg: err });
                        });
                }).catch(err => {
                    res.status(200).send({ msg: err });
                    console.log(' contents.get', err);
                });
        }
    }).catch(function(err) {
        console.log('initNotebook err', err);
        res.send({ result: null, msg: err.name });
    });
});





router.post('/run', function(req, res) {
    let result = [];
    let sourceCodes = req.body.sourceCodes;

    let future = kernel.requestExecute({ code: sourceCodes });
    console.log(`CODE:'${sourceCodes}`);
    future.onIOPub = msg => {
        if (msg.header.msg_type === 'execute_result') {
            console.log(`execute_result ${msg.content}`);
            result.push({ output_type: 'execute_result', result: msg.content, msg: 'success' });
        }
        if (msg.header.msg_type === 'stream') {
            console.log(`execute_result ${msg.content}`);
            result.push({ output_type: 'stream', result: msg.content, msg: 'success' });
        }
        if (msg.header.msg_type === 'display_data') {
            console.log(`execute_result ${msg.content}`);
            result.push({ output_type: 'display_data', result: msg.content, msg: 'success' });
        }
        if (msg.header.msg_type === 'error') {
            console.log(`execute_result ${msg.content}`);
            result.push({ output_type: 'error', result: msg.content, msg: 'success' });
        }
    };
    future.onDone = () => {
        console.log('Future is fulfilled result', result);
        return res.send(result);
    };

});

function writeFilePromisified(filename, text) {
    return new Promise(
        (resolve, reject) => {
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

router.post('/saveNotebook', function(req, res) {
    let modelId = 'model_' + req.body.modelID;
    let file = '/notebook.ipynb';
    let path = config[env].notebookPath;
    let newContent = req.body.newContent;
    let oldContent = modelContent;
    for (let i = 0, len = newContent.length; i < len; i++) {
        if (!oldContent.cells[i]) {
            oldContent.cells[i] = {};
        }
        oldContent.cells[i].cell_type = newContent[i].cell_type;
        oldContent.cells[i].execution_count = newContent[i].execution_count;
        oldContent.cells[i].metadata = newContent[i].metadata;
        oldContent.cells[i].source = newContent[i].code ? newContent[i].code : [];
        console.log(' newContent[i]', newContent[i])
        console.log('newContent[i].outputs', newContent[i].outputs)
        if (newContent[i].outputs !== undefined && newContent[i].outputs !== null) {
            oldContent.cells[i].outputs = newContent[i].outputs;
        }

    }
    let json = JSON.stringify(oldContent);
    writeFilePromisified(templTemp, json)
        .then(() => {
            let command = 'rm -rf ' + path + modelId + file + '&& cp -r ' + templTemp + ' ' + path + modelId + file;
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error:`, error);
                    res.status(200).send({ result: 'failed' });
                    return;
                }
                res.status(200).send({ result: 'success' });
            });

        }).catch(err => {
            res.status(200).send({ result: 'failed' });
            console.log(err);
        });
});


router.get('/projects', function(req, res) {
    Model.findAll({
        where: {
            VIEW_MENU_ID: '06',
            USER_NAME: req.user.username
        },
        raw: true
    }).then(model => {
        res.status(200).send(model);
    });
});

router.get('/projects/:modelName', function(req, res) {
    let modelName = req.params.modelName;
    if (!req.user) {
        res.send({ msg: 'authentification error' });
    }
    Model.findAll({
            where: {
                MODEL_NAME: modelName,
                USER_NAME: req.user.username
            },
            raw: true
        })
        .then(result => {
            res.send({
                result: result,
                msg: 'success'
            });
        })
        .catch(err => {
            res.send({
                result: null,
                msg: err.name
            });
        });

});

// function getKernelList(userName) {
//     return new Promise((resolve, reject) => {
//         getJupyterToken(userName).then(result => {
//             let token = result.token;
//             if (token !== '' && token !== null) {
//                 let kernelSpecs;
//                 Kernel.getSpecs({ baseUrl: config[env].notebookUrl + 'user/' + userName, token: token }).then(kernelSpecs => {
//                     kernelSpecs = kernelSpecs;
//                     console.log('Default spec:', kernelSpecs.default);
//                     console.log('Available specs', Object.keys(kernelSpecs.kernelspecs));
//                     // let tmp = Object.values(kernelSpecs.kernelspecs);
//                     let kernelspecs = kernelSpecs.kernelspecs;
//                     let tmp = Object.keys(kernelspecs).map(key => {
//                       return kernelspecs[key];
//                     });
//                     let kernellist = {};
//                     kernellist.default = kernelSpecs.default;
//                     kernellist.kernelspecs = [];
//                     tmp.forEach(kernel => {
//                         kernellist.kernelspecs.push({ name: kernel.name, display_name: kernel.display_name });
//                     });
//                     resolve({
//                         kernellist: kernellist,
//                         msg: "success"
//                     });
//                 }).catch(err => {
//                     reject({
//                         msg: err
//                     });
//                 });
//             } else {
//                 reject({
//                     msg: result.msg
//                 });
//             }
//         }).catch(err => {
//             reject({
//                 msg: err.xhr.responseText
//             });
//         });
//     });
// }

// router.post('/initNotebook', function(req, res) {
//     Model.findOne({
//         where: { MODEL_NAME: req.body.modelName },
//         raw: true
//     }).then(model => {
//         if (!model || !model.KERNEL) {
//             res.send({ result: null, msg: 'KERNEL can not null' });
//             return
//         }
//         let modelId = "model_" + model.MODEL_ID;
//         let userName = req.user.username; //model.USER_NAME;
//         let file = '/notebook.ipynb';
//         let kernelName = model.KERNEL;
//
//         getJupyterToken(userName).then(result => {
//             console.log('result:', result);
//             let token = result.token;
//             if (token !== '' && token !== null) {
//                 jupyterOpts = {
//                     baseUrl: config[env].notebookUrl + 'user/' + userName,
//                     token: token,
//                     kernelName: kernelName,
//                     path: modelId + file
//                 };
//                 console.log('jupyterOpts:', jupyterOpts);
//                 let contents = new ContentsManager(jupyterOpts);
//                 contents.get(modelId + file)
//                     .then(model => {
//                         modelContent = model.content;
//                         for (let i = 0; i < model.content.cells.length; i++) {
//                             sourceCodes[i] = model.content.cells[i].source;
//                         }
//                         let obj = model.content;
//                         let cells = Array(obj.cells.length);
//                         for (let i = 0, len = obj.cells.length; i < len; i++) {
//                             cells[i] = {};
//                             cells[i].cell_type = obj.cells[i].cell_type;
//                             cells[i].execution_count = obj.cells[i].execution_count;
//                             cells[i].metadata = obj.cells[i].metadata;
//                             if (obj.cells[i].source !== undefined && obj.cells[i].source !== null) {
//                                 if (obj.cells[i].source.length !== 0) {
//                                     cells[i].code = obj.cells[i].source;
//                                 }
//                             }
//                             if (obj.cells[i].outputs !== undefined && obj.cells[i].outputs !== null) {
//                                 cells[i].outputs = obj.cells[i].outputs;
//                             }
//                         }
//                         startSession(jupyterOpts).then(result => {
//                                 console.log('startSession result', cells);
//                                 res.status(200).send({ cells: cells });
//                             })
//                             .catch(err => {
//                                 console.log(err);
//                             });
//                     }).catch(err => {
//                         console.log(err);
//                     });
//             }
//         })
//     }).catch(function(err) {
//         console.log('err', err);
//         res.send({ result: null, msg: err.name });
//     });
// });

// router.post('/saveNotebook', function(req, res) {
//     let modelId = 'model_' + req.body.modelID; //"notebookTemplates/文本聚类分析";
//     //let userName = req.user.username; //"marta";
//     let file = '/notebook.ipynb';
//     let path = "/var/lib/docker/volumes/jupyterhub-user-" + req.user.username + "/_data/";
//     let token;
//     let jupyterOpts;
//     console.log(' mysession: ', mysession);
//     let newContent = req.body.newContent;
//     console.log('newContent: ' + newContent);
//     let oldContent = modelContent;
//
//     for (let i = 0, len = newContent.length; i < len; i++) {
//         oldContent.cells[i].cell_type = newContent[i].cell_type;
//         oldContent.cells[i].execution_count = newContent[i].execution_count;
//         oldContent.cells[i].metadata = newContent[i].metadata;
//         oldContent.cells[i].source = newContent[i].code ? newContent[i].code : [];
//         if (newContent[i].outputs !== undefined && newContent[i].outputs !== null) {
//             oldContent.cells[i].outputs = newContent[i].outputs;
//         }
//     }
//
//     function writeFilePromisified(filename, text) {
//         return new Promise(
//             function(resolve, reject) {
//                 writeFile(filename, text, { encoding: 'utf8' },
//                     (error, data) => {
//                         if (error) {
//                             reject(error);
//                         } else {
//                             resolve(data);
//                         }
//                     });
//             });
//     }
//     // Kill the session.
//     mysession.shutdown()
//         .then(() => {
//             console.log('Jupyter Notebook session closed');
//             let json = JSON.stringify(oldContent);
//             writeFilePromisified(templTemp, json)
//                 .then(() => {
//                     ssh.connect(sshJupyterHubOpts).then(function() {
//                         let command = 'rm -rf ' + path + modelId + file;
//                         ssh.execCommand(command)
//                             .then(result => {
//                                 console.log('STDOUT: ' + result.stdout);
//                                 ssh.putFiles([{
//                                     local: templTemp,
//                                     remote: path + modelId + file
//                                 }]).then(function() {
//                                     res.status(200).send({ result: "succeess" });
//                                     console.log("The File thing is SAVED");
//                                 }, function(error) {
//                                     res.status(200).send({ result: "failed" });
//                                     console.log("Something's wrong");
//                                     console.log(error);
//                                 });
//                             })
//                     });
//                 })
//
//         })
// });


module.exports = router;