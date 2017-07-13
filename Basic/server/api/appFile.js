/**
 * Created by niuniu on 2017/7/14.
 */
'use strict';
let sequelize = require('../sequelize');
let Sequelize = require('sequelize');
// let MakeSchedule = require('../model/APP_MAKESCHEDULE')(sequelize, Sequelize);
let express = require('express');
let router = express.Router();
let moment = require('moment');
let path = require('path');
let fs = require( 'fs' );
const basePath = '/Users/niuniu/Desktop/userfile';
const templatePath = '/Users/niuniu/Desktop/data_apply_demo';
router.get('/init', function (request, response) {
  let appName = request.query.appName;
  console.log('initAppFile');
  let dirName = path.join(basePath, appName);
  copyDir(templatePath, dirName, function(err){
    if(err){
      console.log(err);
    }
  })
});

/*
 * 复制目录、子目录，及其中的文件
 * @param src {String} 要复制的目录
 * @param dist {String} 复制到目标目录
 */
function copyDir(src, dist, callback) {
  fs.access(dist, function(err){
    if(err){
      // 目录不存在时创建目录
      fs.mkdirSync(dist);
    }
    _copy(null, src, dist);
  });

  function _copy(err, src, dist) {
    if(err){
      callback(err);
    } else {
      fs.readdir(src, function(err, paths) {
        if(err){
          callback(err)
        } else {
          paths.forEach(function(path) {
            var _src = src + '/' +path;
            var _dist = dist + '/' +path;
            fs.stat(_src, function(err, stat) {
              if(err){
                callback(err);
              } else {
                // 判断是文件还是目录
                if(stat.isFile()) {
                  fs.writeFileSync(_dist, fs.readFileSync(_src));
                } else if(stat.isDirectory()) {
                  // 当是目录是，递归复制
                  copyDir(_src, _dist, callback)
                }
              }
            })
          })
        }
      })
    }
  }
}

module.exports = router;
