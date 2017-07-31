'use strict';
let express = require('express');
let router = express.Router();
let path = require('path');
const fs = require('fs-extra');
const config = require('./../config');
const env = config.env || 'dev';
const basePath = config[env].appPath;
const templatePath = path.join(__dirname, '../../template/data_apply_demo');

router.get('/:appName', function (req, res) {
    let appName = req.params.appName;
    let destPath = path.join(basePath, appName);
    fs.copy(templatePath, destPath)
    .then(() => {
      console.log('success!');
      res.status(200).send({result:'success'});
    })
    .catch(err => {
      res.status(500).send({result:'failed!'});
      console.error(err);
    });
});

router.get('/:appName/overview', function (req, res) {
  let appName = req.params.appName;
  let filePath = path.join(basePath, appName, 'README.md');
  let contentType = 'text/html';

  // TODO combine logic from app results .
  fs.readFile(filePath, 'utf-8', function(error, content) {
    if (error) {
      if(error.code === 'ENOENT'){
        res.writeHead(404, { 'Content-Type': contentType });
      }
      else {
        res.writeHead(500);
        res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
        res.end();
      }
    }
    else {
      res.writeHead(200);
      res.end(content, 'utf8');
    }
  });
});

module.exports = router;
