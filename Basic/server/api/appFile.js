'use strict';
let express = require('express');
let router = express.Router();
let path = require('path');
const fs = require('fs-extra');
const config = require('./../config');
const env = config.env || 'dev';
const basePath = config[env].appPath;

const templDir = path.join(__dirname, '../../template/');
const templDataProfile = templDir + 'dataProfile-V4.0.ipynb';
const templExpertModelDir = templDir + 'notebookTemplates';
const templAppDir = templDir + 'data_apply_demo';
const { exec } = require('child_process');
const node_ssh = require('node-ssh');
const ssh = new node_ssh();
let remotePath;
const sshJupyterHubOpts = {
    host: '10.20.51.5', //'10.1.236.84'
    // port: 22,
    username: 'root',
    privateKey: '/Users/luodina/.ssh/id_rsa' //'/root/.ssh/id_rsa'
        //password:'Asiainfo123456' // 'Ocai@131415' 
};

router.post('/:appID', function(req, res) {
    let appName = 'app_' + req.params.appID;
    let userName = req.body.userName;
    let userPath = 'jupyterhub-user-' + userName;
    console.log(appName, userPath, templAppDir);
    ssh.connect(sshJupyterHubOpts)
        .then(() => {
            let command = 'docker volume inspect jupyterhub-user-' + userName;
            ssh.execCommand(command)
                .then(function(result) {
                    console.log('STDOUT: ' + result.stdout)
                    console.log('STDERR: ' + result.stderr, result.stderr != null)
                    if (result.stdout !== '' && result.stdout !== null) {
                        remotePath = JSON.parse(result.stdout)[0]['Mountpoint'];
                        if (remotePath !== "") {
                            command = "scp -r " + templAppDir + " root@10.20.51.5:" + remotePath + "/" + appName;
                            exec(command, (error, stdout, stderr) => {
                                if (error) {
                                    console.error(`exec error: ${error}`);
                                    res.status(200).send({ result: 'failed' });
                                    return;
                                }
                                // console.log(`stdout: ${stdout}`);
                                // console.log(`stderr: ${stderr}`);
                                res.status(200).send({ result: 'success' });
                            });
                        } else { console.log('remotePath', remotePath); }

                    } else { console.log('wtf'); }
                })
                .catch(err => { console.log('err', err) });
        })
        // const failed = [];
        // const successful = [];
        // ssh.putDirectory(templAppDir, remoteAppPath, {
        //         recursive: true,
        //         validate: function(itemPath) {
        //             const baseName = path.basename(itemPath)
        //             return baseName.substr(0, 1) !== '.' && // do not allow dot files 
        //                 baseName !== 'node_modules' // do not allow node_modules 
        //         },
        //         tick: function(localPath, remotePath, error) {
        //             if (error) {
        //                 failed.push(localPath)
        //             } else {
        //                 successful.push(localPath)
        //             }
        //         }
        //     })
        //     .then(function(status) {
        //             console.log('the directory transfer was', status ? 'successful' : 'unsuccessful')
        //             console.log('failed transfers', failed.join(', '), failed.length)
        //             console.log('successful transfers', successful.join(', '), successful.length)
        //             ssh.dispose();
        //             res.status(200).send({ result: 'success' });
        //         },
        //         function(error) {
        //             console.log("Something's wrong")
        //             console.log(error)
        //         })
        .catch(function(err) {
            console.log(err);
            console.error(err);
            res.status(500).send({ result: 'failed!' });
        });
});
router.get('/:appName/overview', function(req, res) {
    let appName = req.params.appName;
    let filePath = path.join(basePath, appName, 'README.md');
    let contentType = 'text/html';

    // TODO combine logic from app results .
    fs.readFile(filePath, 'utf-8', function(error, content) {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': contentType });
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                res.end();
            }
        } else {
            res.writeHead(200);
            res.end(content, 'utf8');
        }
    });
});

module.exports = router;