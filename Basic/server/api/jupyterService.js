'use strict';
import { Session, ContentsManager, Kernel } from '@jupyterlab/services';
import { readFile, writeFile, existsSync, readFileSync, mkdir, createReadStream, createWriteStream } from 'fs';
import { XMLHttpRequest } from 'xmlhttprequest';
import { default as WebSocket } from 'ws';
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
const templTemp = templDir + 'temp.ipynb';
let mysession;
let kernel;
let dataFileName;
let command;
let modelContent;
let token;
let jupyterOpts;
let baseNotebookUrl = config[env].notebookUrl;
let modelType = 'explore';

function getKernelList() {
    return new Promise((resolve, reject) => {
        Kernel.getSpecs({ baseUrl: config[env].notebookUrl, token: config[env].token }).then(kernelSpecs => {
            kernelSpecs = kernelSpecs;
            console.log('Default spec:', kernelSpecs.default);
            console.log('Available specs', Object.keys(kernelSpecs.kernelspecs));
            // let tmp = Object.values(kernelSpecs.kernelspecs);
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
                msg: "success"
            });
        }).catch(err => {
            reject({
                msg: err
            });
        });
    });
}


function getJupyterToken(userName) {
    return new Promise((resolve, reject) => {
        ssh.connect(sshJupyterHubOpts).then(() => {
            command = 'docker exec -i auradeploy_hub_1 sh -c "jupyterhub token ' + userName + '"\nexit\n';
            //get token
            ssh.execCommand(command).then(result => {
                let token = result.stdout;
                if (token !== '') {
                    let kernelSpecs;
                    console.log('token:', { token: token, msg: "success" });
                    resolve({ token: token, msg: "success" });
                } else {
                    reject({ msg: "token error" });
                }
            }).catch(err => {
                reject({ msg: err.xhr.responseText })
            })
        }).catch(err => {
            reject({ msg: err.xhr.responseText })
        })
    })

}
router.get('/kernels', function(req, res) {
    console.log("kernels---->");
    if (!req.user) {
        res.send({ msg: "authentification error" });
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
            return
        }
        let modelId = "model_" + model.MODEL_ID;
        let userName = req.user.username; //model.USER_NAME;
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
                    startSession(jupyterOpts).then(result => {
                            console.log('startSession result', cells);
                            res.status(200).send({ cells: cells });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }).catch(err => {
                    console.log(err);
                });
        }
    }).catch(function(err) {
        console.log('err', err);
        res.send({ result: null, msg: err.name });
    });
});



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
                                msg: "success"
                            });
                            console.log('connected to running Jupyter Notebook session');
                            //res.status(200).send({ cells: cells });
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
                        msg: "success"
                    });
                    console.log('New Jupyter Notebook session started');
                    //res.status(200).send({ cells: cells });
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
    })
};

router.post('/run', function(req, res) {
    let sourceCodes = req.body.sourceCodes;

    let future = kernel.requestExecute({ code: sourceCodes });
    console.log(`CODE:'${sourceCodes}
                future ${future }`);
    future.onIOPub = msg => {
        if (msg.header.msg_type === 'execute_result') {
            return res.send({ type: 'execute_result', result: msg.content, msg: 'success' });
        }
        if (msg.header.msg_type === 'stream') {
            return res.send({ type: 'stream', result: msg.content, msg: 'success' });
        }
        if (msg.header.msg_type === 'display_data') {
            return res.send({ type: 'display_data', result: msg.content, msg: 'success' });
        }
        if (msg.header.msg_type === 'error') {
            return res.send({
                type: 'error',
                result: msg.content,
                msg: 'success'
            });
        }
    };
});


router.post('/saveNotebook', function(req, res) {
    console.log('req.body', req.body)
    let modelId = 'model_' + req.body.modelID; //"notebookTemplates/文本聚类分析";
    //let userName = req.user.username; //"marta";
    let file = '/notebook.ipynb';
    //let path = "/var/lib/docker/volumes/jupyterhub-user-" + req.user.username + "/_data/";
    let path = config[env].notebookPath;
    let token;
    let jupyterOpts;
    console.log(' mysession: ', mysession);
    let newContent = req.body.newContent;
    console.log('newContent: ' + newContent);
    let oldContent = modelContent;
    console.log('modelContent: ' + modelContent);
    for (let i = 0, len = newContent.length; i < len; i++) {
        if (!oldContent.cells[i] !== undefined && !oldContent.cells[i] !== null) {

            oldContent.cells[i] = {};
            console.log(' oldContent.cells[i] : ', oldContent.cells[i]);
        }
        oldContent.cells[i].cell_type = newContent[i].cell_type;
        oldContent.cells[i].execution_count = newContent[i].execution_count;
        oldContent.cells[i].metadata = newContent[i].metadata;
        oldContent.cells[i].source = newContent[i].code ? newContent[i].code : [];
        if (newContent[i].outputs !== undefined && newContent[i].outputs !== null) {
            oldContent.cells[i].outputs = newContent[i].outputs;
        }

    }

    function writeFilePromisified(filename, text) {
        return new Promise(
            function(resolve, reject) {
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
    // Kill the session.
    mysession.shutdown()
        .then(() => {
            console.log('Jupyter Notebook session closed');
            let json = JSON.stringify(oldContent);
            writeFilePromisified(templTemp, json)
                .then(() => {

                    console.log("templTemp---->>>>", templTemp)
                    let command = 'rm -rf ' + path + modelId + file + '&& cp -r ' + templTemp + ' ' + path + modelId + file;
                    exec(command, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`exec error:`, error);
                            res.status(200).send({ result: 'failed' });
                            return;
                        }
                        res.status(200).send({ result: 'success' });
                    });

                })

        })
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
        res.send({ msg: "authentification error" });
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
                msg: "success"
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