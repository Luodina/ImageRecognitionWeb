"use strict";
const Session = require('@jupyterlab/services').Session;
const Kernel = require('@jupyterlab/services').Kernel;
const config = require('./config');
const env = config.env || 'dev';
let sshutil = require('./utils/sshUtils');
let fileSystemUtil = require('./utils/fileSystemUtil');
let ssh2 = new sshutil.SSH2UTILS();
let fileSystem = new fileSystemUtil.FileSystem();

let templatePath='/Users/zezhenjia/workSpace/auraDev/OCAI/Basic/template';
const sshJupyterHubOpts = {
  host: '10.20.51.5', //'10.20.51.5'
  // port: 22,
  username: 'root', //'root',
  password: 'Asiainfo123456', //'Asiainfo123456'
};

class ServerStrategy {

  /**
   * 获取serverUrl
   * @param username
   * @returns {string}
   */
  getServerUrl(username) {
    return '';
  };

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
   * @param template
   * @param templateType
   * @param newName
   * @param username
   * @returns {string}
   */
  createApp(template,templateType,newName,username){
    return '';
  }

  /**
   * 创建数据探索模型
   * @param template
   * @param templateType
   * @param newName
   * @param username
   * @returns {string}
   */
  createModel(template,templateType,newName,username){
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

}


class SimpleServerStrategy extends ServerStrategy{

  getServerUrl(username) {
    return config[env].notebookUrl;
  }

  getToken(username) {
    return config[env].token;
  }

  /**
   * 创建数据应用或专家模式
   * @param template 模板
   * @param templateType 模板类型 如:app/model/expert01/expert02
   * @param newName 新建应用或模型名称
   * @param username
   * @returns {Promise}
   */
  createApp(template,templateType,newName,username){
    template=templatePath+'/'+template;
    if(newName===''||newName===null){
      newName=fileSystem.getNewFolderName(templateType);
    }
    let newFolderName = fileSystem.getUserDataPath(username)+'/' +newName;
    return fileSystem.copyFolder(template,newFolderName);
  }

  /**
   * 创建数据探索模型
   * @param template
   * @param templateType
   * @param newName
   * @param username
   * @returns {Promise}
   */
  createModel(template,templateType,newName,username){

    template = templatePath + '/' + template;
    if(newName===''||newName===null){
      newName=fileSystem.getNewFolderName(templateType);
    }
    let newFolerName = fileSystem.getUserDataPath(username)+'/' +newName;

    return fileSystem.copyFile(template,newFolerName)
  }

  /**
   * 删除应用或模型
   * @param fileName
   * @param username
   * @returns {*}
   */
  deleteit(fileName,username){
    let filePath=fileSystem.getUserDataPath(username)+'/'+fileName;
    return fileSystem.removeFiles(filePath);
  }

}

class HubServerStrategy extends  ServerStrategy {

  getServerUrl(username) {
    return config[env].huburl + username;
  };

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
   * @param template
   * @param templateType
   * @param newName
   * @param username
   * @returns {Promise}
   */
  createApp(template,templateType,newName,username){

    template=templatePath+'/'+template;
    if(newName===''||newName===null){
      newName=fileSystem.getNewFolderName(templateType);
    }
    let newFolerName = fileSystem.getHubUserDataPath(username)+'/' +newName;
    return fileSystem.copyFolder(template,newFolerName);
  }

  /**
   * 创建数据探索模型
   * @param template
   * @param templateType
   * @param newName
   * @param username
   * @returns {Promise}
   */
  createModel(template,templateType,newName,username){

    template = templatePath + '/' + template;
    if(newName===''||newName===null){
      newName=fileSystem.getNewFolderName(templateType);
    }
    let newFolerName = fileSystem.getHubUserDataPath(username)+'/' +newName;
    return fileSystem.copyFile(template,newFolerName)
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
  };

  /**
   * 创建session连接，或连接已有session
   * @param path :ipynb path 如,Untitled.ipynb
   * @param kernel :选择kernel
   * @returns {Promise}
   */
  startSession (path, kernel='python2') {
    return new Promise((resolve,reject)=>{

      if (this.server_url === null) {
        this.server_url = this.strategy.getServerUrl(this.user);
        console.log("server_url",this.server_url);
        //this.token = this.strategy.getToken(this.user);

        this.strategy.getToken(this.user).then(data=> {
          this.token = data.replace(/[\r\n]/g, "");
          let options = {
            baseUrl: this.server_url,
            token:this.token,
            kernelName: kernel,
            path: path,
          };

          Session.listRunning(options).then(sessionModels => {
            let sessionNums = sessionModels.length;
            let existSession = false;
            for (let i = 0; i < sessionNums; i++) {
              let sessionPath = sessionModels[i].notebook.path;
              if (sessionPath === path) {
                Session.connectTo(sessionModels[i].id, options).then(session => {
                  this.kernel = session.kernel;
                  this.session = session;
                  console.log('connected to running Jupyter Notebook session');
                  resolve({session:this.session,kernel:this.kernel})
                },err =>{
                  console.log("session connectTo err:",err);
                  reject(err)
                });
                existSession = true;
                break;
              }
            }

            //
            if (!existSession) {
              Session.startNew(options).then(session => {
                kernel = session.kernel;
                this.session = session;
                console.log('New Jupyter Notebook session started');
                resolve({session:this.session,kernel:this.kernel})
              },err =>{
                console.log("startNew Error:",err)
                reject(err)
              });
            }

            //

          }, err => {
            reject(err)

          })

        });

      }

    })

  };


  /**
   *
   * @param kernel
   * @param code
   * @param onIOPubHandler
   */
  executeCode (kernel, code, onIOPubHandler){
    let future = kernel.requestExecute({code:code});

    future.onIOPub = msg => {
      onIOPubHandler(msg)
    }
  };

  closeSession (session){
    console.log("close session",session)
    session.shutdown();
  };


  getKernelSpecs(options){
    return Kernel.getSpecs(options);
  }


}

module.exports={SimpleServerStrategy,HubServerStrategy,Workspace};





