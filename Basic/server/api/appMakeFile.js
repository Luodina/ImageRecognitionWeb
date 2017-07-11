/**
 * Created by zezhenjia on 2017/7/7.
 */
"use strict";
var query=require("./mysqlpool.js");
var fs = require("fs")

/**
 *
 * *      Tips          **
 * APP_MAKEFILE ID auto increment
 */



/**
 * save makefile to database
 * @param targetList
 * @param callback
 * target:makefile_id,app_id,targetName,prerequisites,flag
 */
var saveMakefile = function (targetList,callback) {
  //foreach the list
  targetList.forEach(function (target) {
    console.log("target-->",target);
    //insert to database
    var sql="";
    var base = "INSERT INTO APP_MAKEFILE(ID,MAKEFILE_ID,USER_ID,APP_ID,TARGET,FLAG";
    var sqlValues="VALUES(0,"+target.makefile_id+","+target.user_id+","+target.app_id+",'"+target.target+"','"+target.flag+"'";
    target.prerequisites?(base=base + ",PREREQUISITES",sqlValues=sqlValues+",'"+target.prerequisites+"'"):(base,sqlValues);
    base = base +")";
    sqlValues=sqlValues+")";
    sql = base+sqlValues;

    query(sql,function(err,results,fields){
      if(err){
        console.log("error message-->",err);
        callback("error",err)
      }else {
        console.log("insert APP_MAKEFILE list ok-->",sql)
        callback("success",results)
      }
    });

  })

}


/**
 * get makefile by makefile_id
 * @param makefile_id
 * @param callback
 */
var getByMakeFile_Id=function (makefile_id,callback) {
  var sql="SELECT * FROM APP_MAKEFILE WHERE MAKEFILE_ID = "+makefile_id;
  query(sql,function(err,results,fields){
    if(err){
      console.log("error message-->",err)
      callback("error",err)
    }else {
      console.log("get makefile success-->",sql);
      callback("success",results)
    }
  });
}

/**
 * write makefile to file
 * @param targetList
 */
var writeMakeFile = function (targetList,callback) {

  var content="";
  targetList.forEach(function (target) {
    content = content + target.target + ":";
    target.prerequisites?content = content + target.prerequisites:content;
    content = content + "\r\n";
    content = content +"\tjupyter notebook --execute " +target.target + " --output-dir=reports" + "\r\n";
  })
  fs.writeFile('input.txt',content,  function(err) {
    if (err) {
      console.error("error message-->",err);
      callback("error",err)

    }else{
      console.log("数据写入成功！");
      console.log("--------我是分割线-------------")
      console.log("读取写入的数据！");
      fs.readFile('input.txt', function (err, data) {
        if (err) {
          return console.error(err);
          callback("error",err);
        }
        console.log("异步读取文件数据: " + data.toString());
        callback("success",data.toString());
      });

    }

  });
}



////////////////////////////////////////////////////////  TEST  ////////////////////////////////////////////////////

/**
 * test function saveMakefile
 */
var test_saveMakefile=function () {

  //targetList=[[1,1,'target1','',''], [2,1,'target2','target1',''],[3,1,'target3','',''],[4,1,'target4','target2,target3','']];

  var targetList=[
    {
      id:1,
      makefile_id:1,
      user_id:1,
      app_id:1,
      target:"test1",
      prerequisites:"",
      flag:""
    },
    {
      id:2,
      makefile_id:1,
      user_id:1,
      app_id:1,
      target:"test2",
      prerequisites:"",
      flag:""
    },{
      id:3,
      makefile_id:1,
      user_id:1,
      app_id:1,
      target:"test3",
      prerequisites:"test1 test2",
      flag:""
    },{
      id:4,
      makefile_id:1,
      user_id:1,
      app_id:1,
      target:"test4",
      prerequisites:"test3",
      flag:""
    }

  ]
  saveMakefile(targetList,function (state,obj) {
    if(state=="success"){
      console.log("test_saveMakefile log",obj)
    }

  })
}
//test_saveMakefile()

/**
 * test funciton getByMakeFile_Id
 */
var test_getByMakeFile_Id = function () {
  getByMakeFile_Id(1,function (state,targetList) {
    if(state=="success"){
      targetList.forEach(function (target) {
        console.log("test_getByMakeFile_Id log",target);

      })
    }
  })
}
 //test_getByMakeFile_Id();

/**
 * test function writeMakeFile
 */
var test_writeMakeFile = function () {
  var targetList=[
    {
      id:1,
      makefile_id:1,
      user_id:1,
      app_id:1,
      target:"test1",
      prerequisites:"",
      flag:""
    },
    {
      id:2,
      makefile_id:1,
      user_id:1,
      app_id:1,
      target:"test2",
      prerequisites:"",
      flag:""
    },{
      id:3,
      makefile_id:1,
      user_id:1,
      app_id:1,
      target:"test3",
      prerequisites:"test1 test2",
      flag:""
    },{
      id:4,
      makefile_id:1,
      user_id:1,
      app_id:1,
      target:"test4",
      prerequisites:"test3",
      flag:""
    }
  ]
  writeMakeFile(targetList,function (state,data) {
    if(state=="success"){
      console.log("test write ok")
    }
  })

}
//test_writeMakeFile();
