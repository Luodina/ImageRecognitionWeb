'use strict';
let sequelize = require('../sequelize');
let Sequelize = require('sequelize');
let User = require('../model/USER_INFO')(sequelize, Sequelize);
let express = require('express');
let router = express.Router();
let auth = require('../utils/auth');
const config = require('./../config');
let url = require('url');
let env = config.env || 'dev';
let isUUID = require('is-uuid');
import {getUserWorkspace} from '../workspace';
let logger = require('../utils/log')('./api/users.js');
// 用户登录，发放token
router.post('/login', function(req, res) {
    let username = req.body.username;
    let pass = req.body.password;
    if (username && pass) {
        User.findOne({
            attributes: ['USER_ID', 'USER_NAME', 'PASSWORD'],
            where: {
                USER_NAME: username
            },
            raw: true
        }).then(function(user) {
            if (!user) {
                res.status(403).send({ status: false, msg: 'Username not found' });
            } else {
                if (user.PASSWORD !== pass) {
                    res.status(403).send({ status: false, msg: 'Invalid password' });
                } else {
                    var token = auth.encode(user.USER_NAME);
                    res.setHeader('Set-Cookie', ['aura_token=' + token]);
                    res.status(200).send({ status: true, token: token });
                }
            }
        }).catch(err => {
            console.log('err', err);
            res.status(403).send({ status: false, msg: err });
        });
    } else {
        res.status(403).send({ status: false, msg: 'Username and password cannot be blank' });
    }
});

router.get('/server', function(req, res) {
  let username = req.user.username;
  let app = req.query.app;
  let file = req.query.file;
  let workspace = getUserWorkspace(username, config[env]);
  workspace.getConnSetting().then((setting) => {
      // console.log(server);
      let final_url = url.resolve(setting.baseUrl, `/tree/user_${username}`);

      logger.debug(app);

      logger.debug(isUUID.v4(app));

      if (app !== null && isUUID.v4(app)) {
        final_url +=  `/APP_${app}`;
      }
      if (file != null ) {
        final_url +=  `/${file}`;
      }

      final_url += `?token=${setting.token}`;
      res.status(200).send(final_url);

  }).catch( err => {
    logger.debug(err);
    res.status(500).send('');
  });

});

module.exports = router;
