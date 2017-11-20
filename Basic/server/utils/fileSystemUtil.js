'use strict';
const exec = require('child_process').exec;
const fs = require('fs-extra');

// nfs for remote jupyterhub server mode
const privateNFS='/Users/zezhenjia/workSpace/auraDev/nfsShare';
const path = require('path');
// for local jupyter mode
const jupyterRootPath='/Users/zezhenjia/workSpace/auraDev/localJupyter';
const logger = require('../utils/log')('utils/fileSystemUtil.js');
const UUID = require('uuid');
class FileSystem{
  constructor(dataDir) {
    this.dataDir = dataDir;
  }

  /**
   *
   * @param templatePath
   * @param newFolerName
   * @returns {Promise}
   */
  copyFolder(templatePath,newFolerName){
    let comms = 'cp -r ' + templatePath + ' ' + newFolerName;
    console.log(comms);
    return new Promise((resolve,reject)=>{
        exec(comms,[''],(error,stdout) =>{
          if(error){
            console.log('error--->',error);
            reject(error);
          }else {
            resolve(stdout);
          }
        });
    });
  }
  /**
   *
   * @param templatePath
   * @param newFolerName
   * @returns {Promise}
   */
  copyFile(templatePath,newFolerName){
   //// let destPath = this.getUserDataPath(username)+'/' +newFolerName;
    let comms = 'mkdir '+newFolerName+' && cp -r ' + templatePath + ' ' + newFolerName;
    console.log(comms);
    return new Promise((resolve,reject)=>{
      exec(comms,[''],(error,stdout) =>{
        if(error){
          console.log('error--->',error);
          reject(error);
        }else {
          resolve(stdout);
        }
      });
    });

  }

  removeFiles(filePath){
    let comms ='rm -rf '+filePath;
    return new Promise((resolve,reject)=>{
      exec(comms,[''],(error,stdout) =>{
        if(error){
          console.log('error--->',error);
          reject(error);
        }else {
          resolve(stdout);
        }
      });
    });

  }

  /**
   *
   * @param templateType
   */
  getNewFolderName(templateType){
    return templateType+'_'+ UUID.v4();
  }

  /**
   * 获取jupyterhub用户文件路径
   * @param username
   * @returns {string}
   */
  getHubUserDataPath(username){

    return this.dataDir +'/'+'jupyterhub-user-'+username+'/_data'
  }

  /**
   *
   * @param username
   */
  getUserDataPath(username){

    let path= this.dataDir + '/' + 'user_' + username;
    fs.ensureDirSync(path);
    return path;
  }

  getAppFolderName(appId) {
    return `APP_${appId}`;
  }

  getUserAppFolderPath(username, appId) {
    return path.join(this.getUserDataPath(username),
      this.getAppFolderName(appId));
  }

  /**
   * 获取指定长度指定进制的UUID
   * @param len 长度
   * @param radix 进制
   * @returns {string}
   */
  getUuid(len, radix) {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

    let uuid = [], i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 || Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      let r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 || Math.random()*16;
          uuid[i] = chars[(i === 19) ? (r && 0x3) || 0x8 : r];
        }
      }
    }

    return uuid.join('');
  }


}

module.exports={FileSystem};
