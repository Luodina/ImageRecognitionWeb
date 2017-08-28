const Client = require('node-ssh');
// The config passed to the Client constructor should match the config required by ssh2 
const config = {
        host: '10.1.236.83',
        port: 22,
        username: 'root',
        password: 'Ocai@131415'
    }
    // The Client constructor can also take an optional logger. 
    // This is any object which has both an info() and error() functions e.g. a bunyan logger. 
    // If a logger is not provided, console will be used. 
let logger = require('./utils/log')('ssh-promise');
let ssh = new Client(config, logger);
console.log('ssh', ssh)
module.exports = ssh;