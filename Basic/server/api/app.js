'use strict';
const sequelize = require('../sequelize');
const Sequelize = require('sequelize');
const App = require('../model/APP_INFO')(sequelize, Sequelize);
const Model = require('../model/MODEL_INFO')(sequelize, Sequelize);
const MakeFile = require('../model/APP_MAKEFILE')(sequelize, Sequelize);
const AppSchedule = require('../model/APP_MAKESCHEDULE')(sequelize, Sequelize);
const AppResults = require('../model/APP_RESULTS')(sequelize, Sequelize);

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
        workspace.strategy.createApp('APP_INIT', 'APP', app.APP_ID, req.user.username);
        res.send({ result: 'success', app: app });
      })
      .catch(err => {
        logger.error(`create app [${appName}]: ${err}`);
      });
  });
});

router.put('/delete', function (req, res) {
  // Model.belongsTo(App);
  // MakeFile.belongsTo(App);
  // AppSchedule.belongsTo(App);
  // AppResults.belongsTo(App);
  let item = req.body.item;
  let user = req.body.user;
  if (item !== null) {
    let q = `DELETE FROM APP_INFO WHERE APP_INFO.APP_NAME = '${item}' AND APP_INFO.USER_NAME = '${user}'`;
    sequelize.query(q, {type: sequelize.QueryTypes.DELETE})
      .then((result) => {
        logger.debug(`delete app: ${result} `);
        res.send({result: result, msg: 'success'});
      })
      .catch(err => {
        logger.error(`delete app [${item}]: ${err}`);
        res.send({msg: 'failed'});
      });
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
