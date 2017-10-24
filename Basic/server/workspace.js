'use strict';

import {Session, Kernel} from '@jupyterlab/services';
const config = require('./config');
const env = config.env ;
let sshutil = require('./utils/sshUtils');
let fs_utils = require('./utils/fileSystemUtil');
let ssh2 = new sshutil.SSH2UTILS();
const csv = require('csvtojson');
const fs = require('fs-extra'),
  isUUID = require('is-uuid'),
  http = require('http'),
  url  = require('url'),
  path = require('path');

const isEmpty = require('is-empty');
const templateUtil  = require('./template');
let logger = require('./utils/log')('workspace.js');


const sshJupyterHubOpts = {
  host: '10.20.51.5', //'10.20.51.5'
  // port: 22,
  username: 'root', //'root',
  password: 'Asiainfo123456', //'Asiainfo123456'
};


class ServerStrategy {


  /**
   * 判断用户服务器是否存在
   * @param username
   * @returns {boolean}
   */
  isActive(username) {
    return false;
  }

  /**
   * 获取serverUrl
   * @param username
   * @returns {string}
   */
  getServerUrl(username) {
    return '';
  }

  /**
   * 获取token
   * @param username
   * @returns {string}
   */
  getToken(username){
    return '';
  }

  /**
   * 创建数据应用或专家模式
   * @param templateType
   * @param newName
   * @param username
   * @returns {string}
   */
  createApp(templateType, newName, username){
    return '';
  }

  /**
   * 创建数据探索模型
   * @param templateType
   * @param appId
   * @param username
   * @param notebookName
   * @returns {string}
   */
  createModel(templateType, appId, username, notebookName){
    return '';
  }

  /**
   * 删除应用或模型
   * @param fileName
   * @param username
   * @returns {string}
   */
  deleteit(fileName,username){
    return '';
  }

  scanProjectFolder(username, app) {
    return {};
  }

  readFile(username, app, filepath) {}

  deleteFile(username, app, filepath) {}
}


class SimpleServerStrategy extends ServerStrategy{

  constructor(baseUrl, token, dataDir) {
    super();
    this.baseUrl = baseUrl;
    this.token = token;
    this.dataDir = dataDir;
    this.fileSystem = new fs_utils.FileSystem(dataDir);
  }

  isActive(user) {
    logger.info(`检查用户[${user}] 服务器是否启动`);

    let token = this.token;
    let baseUrl = new url.URL(this.baseUrl);
    // logger.debug(baseUrl);
    return new Promise(function(resolve, reject) {
      let options = {
        host: baseUrl.hostname,
        port: baseUrl.port,
        path: '/api/status',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'token ' + token
        }
      };

      let req = http.get(options, (res) => {
        let body = '';
        if (res.statusCode !== 200) {
          resolve(false);
        }
        res.on('data', data => {
          body += data;
        });
        res.on('end', () => {
          let data = JSON.parse(body);
          logger.info(body);
          resolve(data.started != null);
        });
      });
      req.on('error', (e) => {
        logger.error(`error message: ${e}`);
        resolve(false);
      });

    });

  }

  getServerUrl(username) {
    return new Promise((resolve, reject) => {
      resolve(this.baseUrl);
    });
  }

  getToken(username) {
    return new Promise((resolve, reject) => {
      resolve(this.token);
    });
  }

  listProjects(username) {
    let path = this.fileSystem.getUserDataPath(username) ;
    let folders = fs.readdirSync(path);

    let result = [];
    for (let i=0; i<folders.length; i++) {
      let parts =  folders[i].split('_');
      // logger.debug(parts);
      if (parts.length === 2 && parts[0] === 'APP' && isUUID.v4(parts[1])) {
        result.push(folders[i]);
      }
    }
    return result;
  }

  scanProjectFolder(username, app) {
    let user_folder = path.join(this.fileSystem.getUserDataPath(username),
      this.fileSystem.getAppFolderName(app));
    let result = {
      NOTEBOOKS: [],
      DATA: {},
      RESULTS:[],
      README: []
    };

    function scanFolderForType(scanpath, type) {
      let result = [];
      let folders = fs.readdirSync(scanpath);
      for (let i=0; i<folders.length; i++) {
        if (!folders[i].endsWith(type)) {
          continue;
        }
        let full_path = path.join(scanpath, folders[i]);
        let f = fs.statSync(full_path);
        result.push({
          'name': folders[i],
          // 'full_path': ,
          'size': f.size,
          'last_modified': f.mtime
        });
      }
      return result;
    }

    result.NOTEBOOKS = scanFolderForType(user_folder, '.ipynb');
    result.DATA.RAW = scanFolderForType(path.join(user_folder, 'data', 'raw'), '.csv');
    result.DATA.PROCESSED = scanFolderForType(path.join(user_folder, 'data', 'processed'), '.csv');
    result.DATA.MODEL_DATA = scanFolderForType(path.join(user_folder, 'data', 'model_data'), '.csv');


    // logger.debug(result);
    return result;
  }


  deleteFile(username, app, filepath) {
    let user_folder = path.join(this.fileSystem.getUserDataPath(username),
      this.fileSystem.getAppFolderName(app));
    let real_path = null;
    real_path = path.join(user_folder, filepath);
    logger.debug(`delete file ${real_path}`);
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(real_path)) {
        logger.debug(`${username}'s file ${filepath} in app[${app}] doesn't exsit`);
        reject('failed');
      }
      fs.remove(real_path).then(() => {
        resolve('success');
      }).catch(err => {
        logger.error(`remove file error ${err}`);
        reject('failed');
      });
    });
  }

  readFile(username, app, filepath, numofline = 100) {
    let user_folder = path.join(this.fileSystem.getUserDataPath(username),
      this.fileSystem.getAppFolderName(app));
    let real_path = null;
      real_path = path.join(user_folder, filepath);
      logger.debug(`reading file ${real_path}`);
    return new Promise((resolve, reject) => {
      if (filepath.endsWith('.csv')) {
        let line = numofline;
        let lines = [];
        let stream = csv({
          toArrayString: true
        }).fromStream(fs.createReadStream(real_path, 'utf-8'))
          stream.on('json', (json) => {
            // logger.debug(`${line}: ${json.head}`);
            if (line > 0) {
              lines.push(json);
              line -= 1;
            } else {
              stream.emit('end');
            }
          })
          .on('end_parsed', (jsonArrObj) =>{
            // logger.debug(jsonArrObj);
            resolve(jsonArrObj);
          })
          .on('done', () => {
            logger.debug(`end parsing csv: ${filepath}`);
            resolve(lines);
          });
      }else {
        fs.readFile(real_path, 'utf-8',
        function(error, content) {
          if (error) {
            reject(error.code);
          } else {
            resolve(content);
          }
        });
      }
    });
  }

  /**
   * 创建数据应用或专家模式
   * @param templateType 模板类型 如:app/model/expert01/expert02
   * @param appId 新建应用或模型名称
   * @param username
   * @returns {Promise}
   */
  createApp(templateType, appId, username){
    let source = templateUtil.getAppFolderTemplate();

    if(appId===''||appId===null){
      appId= this.fileSystem.getNewFolderName(templateType);
    } else {
      appId = `${templateType}_${appId}`;
    }
    let dest = path.join(this.fileSystem.getUserDataPath(username), appId);
    // logger.debug(source);
    // logger.debug(dest);
    return this.fileSystem.copyFolder(source ,dest);
  }

  /**
   * 创建数据探索模型
   * @param templateType
   * @param appId
   * @param username
   * @param notebookName
   * @returns {String}
   */
  createModel(templateType, appId, username, notebookName){
    let template = templateUtil.getTemplateNotebook(templateType);
    let dest = this.fileSystem.getUserAppFolderPath(username, appId);
    if (isEmpty(notebookName)) {
      notebookName = 'notebook.ipynb';
    }
    if (!notebookName.endsWith('.ipynb')) {
      notebookName += '.ipynb';
    }
    logger.debug(`notebook template path is ${template}`);
    fs.copySync(template, path.join(dest, notebookName));
    return notebookName;
  }

  /**
   * 删除应用或模型
   * @param fileName
   * @param username
   * @returns {*}
   */
  deleteit(fileName,username){
    let filePath= this.fileSystem.getUserDataPath(username)+'/'+fileName;
    return this.fileSystem.removeFiles(filePath);
  }


}

class HubServerStrategy extends ServerStrategy {

  constructor( ){
    super();
  }

  getServerUrl(username) {
    return config[env].huburl + username;
  }

  getToken(username) {
    // figure out how to get user token
    return new Promise((resolve,reject)=>{
      ssh2.connect(sshJupyterHubOpts,function () {
        let command = 'docker exec -i auradeploy_hub_1 sh -c "jupyterhub token ' + username + '"\nexit\n';
        ssh2.exec(command,function (err,data) {
          if(data)
            resolve(data);
          else
            reject(err)
        })
      })
      //
    })

    //
  };


  /**
   * 创建数据应用或专家模式
   * @param templateType
   * @param newName
   * @param username
   * @returns {Promise}
   */
  createApp(templateType, newName, username){
    let source = templateUtil.getAppFolderTemplate();
    if(newName===''||newName===null){
      newName=fileSystem.getNewFolderName(templateType);
    }
    let newFolerName = fileSystem.getHubUserDataPath(username)+'/' +newName;
    return fileSystem.copyFolder(source,newFolerName);
  }

  /**
   * 创建数据探索模型
   * @param templateType
   * @param appId
   * @param username
   * @param notebookName
   * @returns {Promise}
   */
  createModel(templateType, appId, username, notebookName){
    // let source = templateUtil.getTemplateNotebook(templateType);
    // if(newName===''||newName===null){
    //   newName=this.fileSystem.getNewFolderName(templateType);
    // }
    // let newFolerName = this.fileSystem.getHubUserDataPath(username)+'/' +newName;
    // return this.fileSystem.copyFile(source,newFolerName);
  }

  /**
   * 删除应用或模型
   * @param fileName
   * @param username
   * @returns {*}
   */
  deleteit(fileName,username){
    let filePath=fileSystem.getHubUserDataPath(username)+'/'+fileName;
    return fileSystem.removeFiles(filePath);
  }



}

class Workspace {

  constructor(strategy, user) {
    this.user = user;
    this.strategy = strategy;
    this.server_url = null;
    this.token = null;
    this.kernel = null;
    this.session = null;
  }


  isActive () {
    return this.strategy.isActive(this.user);
  }

  /**
   * 获取用户连接的信息
   * @returns {Promise}
   */
  getConnSetting() {
    return new Promise((resolve, reject)=>{
      if (this.server_url === null || this.token === null) {
        let username = this.user;
        let _parent = this;
        Promise.all([this.strategy.getServerUrl(username),
          this.strategy.getToken(username)])
          .then(([url, token]) => {
            logger.debug(`get user server url is: ${url}`);
            logger.debug(`get user server token is: ${token}`);
            _parent.server_url = url;
            _parent.token = token;
            resolve({baseUrl: url, token: token});
          });
        //TODO 添加reject的情况
      } else {
        resolve({baseUrl: this.url, token: this.token});
      }
    });
  }


  /**
   * 创建session连接，或连接已有session
   * @param path :ipynb path 如,Untitled.ipynb
   * @param kernel :选择kernel
   * @returns {Promise}
   */
  startSession (path, kernel='python') {
    return new Promise((resolve, reject) => {
      this.getConnSetting().then(setting => {
        Session.findByPath(path, setting).then(res => {
          // logger.debug(res);
          Session.connectTo(res.id, setting).then(sess => {
            logger.debug('connected to running Jupyter Notebook session');
            // logger.debug(sess);
            resolve({session: sess,kernel:sess.kernel});
          }).catch(err =>{
            logger.debug(`session connectTo err ${err}`);
            reject(err);
          });
        }).catch((err) => {
          logger.debug(`couldn't find running session for ${path} `);

          // 不存在指定路径的session，尝试新建一个
          let setting2 = JSON.parse(JSON.stringify(setting));
          setting2.path = path;
          Session.startNew(setting2)
            .then(session => {
              kernel = session.kernel;
              // logger.debug(kernel);
              if (kernel.status === 'unknown') {
                logger.debug(`无法启动Session, ${path} 不存在 `);
                session.shutdown().then(() => {
                  logger.debug(`关闭Session ${path} `);
                  reject(err);
                });
              } else {
                this.session = session;
                logger.debug('New Jupyter Notebook session started');
                resolve({session:this.session,kernel:this.kernel});
              }
            },err =>{
              logger.error(`session start error ${err}`);
              reject(err);
          });

        });
      }) ;
    });
  }

  listRunningSessions() {
    return new Promise((resolve, reject) => {
      this.getConnSetting().then(setting => {
        Session.listRunning(setting).then(sessions => {
          logger.debug(sessions);
          resolve(sessions);
        }).catch(err => {
          logger.error(`unable to list sessions from jupyter: ${err}`);
          reject(err);
        });
      });
    });
  }

  /**
   *
   * @param kernel
   * @param code
   * @param onIOPubHandler
   */
  executeCode (kernel, code, onIOPubHandler){
    let future = kernel.requestExecute({code:code});

    future.onIOPub = msg => {
      onIOPubHandler(msg);
    };
  }

  /**
   *
   * @param Session
   */
  closeSession(session){
    console.log('close session', session);
    session.shutdown();

  }

  listKernelSpec() {
    return new Promise((resolve, reject) => {
      this.getConnSetting().then(setting => {
        Kernel.getSpecs(setting).then(res => {
          // logger.debug(res);
          resolve(res);
        }).catch((err) => {
          logger.error(`error in list kernelspecs ${err}`);
          reject(err);
        });
      });
    });
  }
}

function getUserWorkspace(username, active_config) {
  logger.debug(active_config.serverType);

  if (active_config.serverType === 'notebook') {
    return new Workspace(new SimpleServerStrategy(
      active_config.notebookUrl,
      active_config.token,
      active_config.dataDir
    ), username);
  } else {
    return new Workspace(new HubServerStrategy(), username);
  }

}

module.exports= { getUserWorkspace,SimpleServerStrategy, HubServerStrategy, Workspace};


