'use strict';

let express = require('express');
let router = express.Router();

let path = require('path');
//let fs = require('fs');
const fs = require('fs-extra')
const config = require('./../config');
let env = config.env || 'dev';
const basePath = config[env].dataAppPath;
const templatePath = path.join(__dirname, '../../template/data_apply_demo');



router.get('/:appName', function (req, res) {
  
    let appName = req.params.appName;
    console.log('initAppFile');
    console.log(appName);
    let destPath = path.join(basePath, appName);
    console.log('destPath',destPath);
    fs.copy(templatePath, destPath)
      .then(() => {
        console.log('success!');
        res.status(200).send({result:'success'});
      })
      .catch(err => {
        res.status(500).send({result:'failed!'});
        console.error(err);
      })
});

module.exports = router;