'use strict';

let express = require('express'),
  router = express.Router(),
  logger = require('../utils/log')('api/servers.js');

import {Workspace, SimpleServerStrategy} from '../workspace';
import {Kernel, ContentsManager} from '@jupyterlab/services';


router.get('/', (req, res) => {
  list_all_workspaces(req.user).then(kernels => {
    res.send(kernels);
  }).catch(err => {
    logger.info(err);
    res.send([]);
  });
});


exports.getUserWorkspace = function (username) {

  return new Workspace(new SimpleServerStrategy(), username);
};

exports.list_all_workspaces = function(user) {
  let baseUrl = 'http://localhost:8888';

  logger.debug('list workspace for user: ', user);
  let workspace = new Workspace(new SimpleServerStrategy(), user);
  if (!workspace.isActive()){
    let kernels = ['test'];
      return Kernel.getSpecs({ baseUrl: baseUrl,
        token: '88ee53e8e6b2f565d0425c17f781d3080400b36b035340b1'})
        .then(kernelSpecs => {
          logger.info('Default spec:', kernelSpecs.default);
          logger.info('Available specs', Object.keys(kernelSpecs.kernelspecs));
          logger.info('here');
          logger.info(kernelSpecs);
          kernels.append('hellp');
          return kernels;
        })
        .catch(err => {
          logger.debug(err);
          return ;
        });
    // });

  } else {
    logger.info('User doesn\'t have active server');
    return [];
  }
};

exports.create_a_workspace = function(req, res) {
};


