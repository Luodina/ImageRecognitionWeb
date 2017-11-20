'use strict';
const sequelize = require('../sequelize');
const Sequelize = require('sequelize');
const App = require('../model/APP_INFO')(sequelize, Sequelize);
const isEmpty = require('is-empty');

const express = require('express');
const router = express.Router();
const config = require('./../config');
let env = config.env || 'dev';
let logger = require('../utils/log')('api/app.js');
import {getUserWorkspace} from '../workspace';


router.get('/', (req, res) => {
  App.findAll({raw: true})
    .then(app => {
      res.send({app});
    })
    .catch(err => {
      logger.error(`error in listing app ${err}`);
    });
});


router.get('/:appName', function (req, res) {
  let appName = req.params.appName;
  logger.debug(`get app detail: [${appName}]`);
  let workspace = getUserWorkspace(req.user.username, config[env]);
  if (appName !== null) {
    App.findOne({
      where: {APP_NAME: appName},
      raw: true
    })
      .then(app => {
        // logger.debug(app);
        if (app !== null) {
          app.FILES =  workspace.strategy.scanProjectFolder(req.user.username, app.APP_ID);
        }
        res.send({result: app});
      })
      .catch(err => {
        logger.error(`get app [${appName}]: ${err}`);
        res.status(400).send();
      });
  }
});

router.put('/delete', function (req, res) {
  let item = req.body.item;
  let user = req.body.user;
  if (item !== null) {
    // let q = "DELETE FROM APP_INFO WHERE APP_INFO.APP_NAME = '" + item + "' AND APP_INFO.USER_NAME = '" + user + "'";
    let q = 'DELETE FROM APP_INFO WHERE APP_INFO.APP_NAME = "' + item + '" AND APP_INFO.USER_NAME = "' + user + '"';
    sequelize.query(q, {type: sequelize.QueryTypes.DELETE})
      .then((result) => {
        console.log('result', result);
        res.send({result: result, msg: 'success'});
      })
      .catch(err => {
        console.log('err', err);
        res.send({msg: 'failed'});
      });
  }
});

router.post('/:appName', function (req, res) {
  let appName = req.body.APP_NAME;
  let userName = req.body.USER_NAME;
  logger.debug('creating app');

  let workspace = getUserWorkspace(req.user.username, config[env]);
  sequelize.transaction(t => {
    return App.create({
      APP_ID: t.id,
      APP_NAME: appName,
      USER_NAME: userName,
      NOTEBOOK_PATH: '/',
      //config[env].appPath,
      isNewRecord: true
    })
      .then(app => {
        // logger.debug(app);
        workspace.strategy.createApp('APP', app.APP_ID, req.user.username);
        res.send({ result: 'success', app: app });
      })
      .catch(err => {
        logger.error(`create app [${appName}]: ${err}`);
      });
  });
});

router.delete('/:appId/files', function (req, res) {
  let appId = req.params.appId;
  let file = req.query.file;
  let user = req.user.username;
  if ( file !== null) {
    let workspace = getUserWorkspace(user, config[env]);
    workspace.strategy.deleteFile(user, appId, file).then(result => {
      logger.debug(`delete app file: ${result} `);
      res.send({result: result, msg: 'success'});

    }).catch(err => {
      logger.error(`delete app file [${file}]: ${err}`);
      res.send({msg: 'failed'});
    });
  } else {
    res.status(400).send({msg: 'failed'});
  }
});

router.post('/:appId/files', function(req, res) {
  let appId = req.params.appId;
  const name = req.body.name;
  const template = req.body.template || 0;

  if (isEmpty(appId) || isEmpty(name)) {
    res.send({msg: 'failed'});
  } else {
    let workspace = getUserWorkspace(req.user.username, config[env]);
    let newfileName = workspace.strategy.createModel(template,
      appId, req.user.username, name);
    res.send({result: newfileName, msg:'success'});
  }
});

router.get('/:appName/files', function(req, res) {
  let appName = req.params.appName;
  const filePath = req.query.path;
  logger.debug(filePath);

  // let fileType = req.params.type;
  // let filePath = req.params.path;
  let contentType = 'text/html';
  if (appName !== null) {
    App.findOne({where:{APP_NAME: appName, USER_NAME: req.user.username}, raw: true})
      .then(app => {
        logger.debug(req.user);
        let workspace =
          getUserWorkspace(req.user.username, config[env]);
        workspace.strategy.readFile(req.user.username, app.APP_ID,filePath)
          .then(content => {
            //TODO be smart about the type
            if (filePath.endsWith('.md')) {
              contentType = 'text/html';
            } else if (filePath.endsWith('.csv')) {
              contentType = 'application/json';
              content = JSON.stringify(content);
              // logger.debug(content);
            }
            res.setHeader('Content-Type', contentType);
            res.end(content, 'utf8');
          })
          .catch(err => {
            logger.debug(`error in reading file ${err}`);
            res.end(404);
          });
      })
      .catch(err => {
        logger.error(`get app [${appName}]: ${err}`);
        res.end(404);
      });
  }
});

module.exports = router;
