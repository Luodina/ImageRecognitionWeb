//app.js
"use strict";
import express from 'express';
import bodyParser from 'body-parser';
import config from './config';
import path from 'path';
import favicon from 'serve-favicon';

let app = express();
let env = config.env || 'dev';

if(env === 'dev') {
  app.use(require('connect-livereload')());
  app.use("/fonts",express.static("app/bower_components/bootstrap/fonts"));
}

app.use(express.static(config[env].dist));
app.use(favicon(path.join(__dirname, '../', config[env].dist, '/favicon.ico')));

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//rest api
app.use('/api/jupyter', require('./api/dataSource'));
app.use('/api/user', require('./api/user'));
app.use('/api/model', require('./api/model'));
app.use('/api/app', require('./api/app'));
app.use('/api/expert', require('./api/expert'));
app.use('/api/appMakeFile', require('./api/appMakeFile'));
app.use('/api/testSchedule', require('./api/testSchedule'));
app.use('/api/appFile', require('./api/appFile'));
//
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../',config[env].dist,'/404.html'));// load the single view file (angular will handle the page changes on the front-end)
});

app.listen(config[env].port, function () {
  console.log('App listening on port ' + config[env].port + "!");
});

module.exports = app;
