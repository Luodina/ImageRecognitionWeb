'use strict';
import express from 'express';
import bodyParser from 'body-parser';
import config from './config';
import path from 'path';
import favicon from 'serve-favicon';
import proxy from 'http-proxy-middleware';
import cookieParser from 'cookie-parser';

let app = express();
let env = config.env || 'dev';
// use logger.xxx instead of console.xxx
let logger = require('./utils/log')('app.js');
let auth = require('./utils/auth');

if (env === 'dev') {
    app.use(require('connect-livereload')());
    app.use('/fonts', express.static('app/bower_components/bootstrap/fonts'));
}
// web server full logs
//var log4js = require('log4js');
//app.use(log4js.connectLogger(logger,{level:log4js.levels.INFO}));
app.use(express.static(config[env].dist));
app.use(favicon(path.join(__dirname, '../', config[env].dist, '/favicon.ico')));

//proxy notebook request, has to above bodyparser to enable proxy post request
app.use('/lab', proxy({
    headers: { 'Authorization': 'token ' + config[env].token },
    target: config[env].notebookUrl,
    logLevel: 'debug',
    changeOrigin: true,
    ws: true
}));

app.use(cookieParser()); // to support cookie
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.json({ limit: '50mb' })); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    limit: '50mb',
    extended: true
}));

// 上游验证token
app.use(function(req, res, next) {
    console.log('---------------------------------->', req.path, req.body.token, req.query.token);
    var token = req.body.token || req.query.token || req.cookies.aura_token || req.headers['Authorization'];
    if (req.path.startsWith('/api/user/login')) {
        next();
    } else if (token) {
        try {
            var decoded = auth.decode(token);
            if (decoded) {
                req.user = decoded;
                next();
            } else {
                console.error('invalid token, return 403');
                res.status(403).send({ status: false, msg: 'invalid token' });
            }
        } catch (err) {
            console.error(err.name + ' caught, return 403');
            res.status(403).send({ status: false, msg: err.name });
        }
    } else {
        console.error('token not found, return 403');
        res.status(403).send({ status: false, msg: 'token not found' });
    }
});

//rest api
app.use('/api/jupyter', require('./api/jupyterService'));
// app.use('/api/jupyter', require('./api/dataSource'));
app.use('/api/user', require('./api/user'));
app.use('/api/model', require('./api/model'));
app.use('/api/app', require('./api/app'));
app.use('/api/expert', require('./api/expert'));
app.use('/api/appMakeFile', require('./api/appMakeFile'));
app.use('/api/testSchedule', require('./api/testSchedule'));
app.use('/api/appResults', require('./api/appResults'));
app.use('/api/appFile', require('./api/appFile'));
//app.use('/queryDS/all', proxy('http://10.20.51.3:5000/queryDS/all'));
app.use('/datasets', proxy({ target: 'http://10.20.51.3:5000', pathRewrite: { '^/datasets': '' } }));
//
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../', config[env].dist, '/404.html')); // load the single view file (angular will handle the page changes on the front-end)
});

app.listen(config[env].port, function() {
    //console.log('App listening on port ' + config[env].port + '!');
    logger.info('App listening on port ' + config[env].port + '!');
});

module.exports = app;