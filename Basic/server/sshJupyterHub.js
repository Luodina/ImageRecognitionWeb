'use strict';
const node_ssh = require('node-ssh')

const sshJupyterHubOpts = {
    host: '10.1.236.83',
    port: 22,
    username: 'root',
    password: 'Ocai@131415'
};
const ssh = new node_ssh();
ssh.connect(sshJupyterHubOpts)
exports.ssh = ssh;