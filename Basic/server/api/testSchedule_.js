/**
 * Created by zezhenjia on 2017/7/5.
 */
'use strict';

var schedule = require('node-schedule');
var query=require("./mysqlpool.js");


/**
 * Tips
 * schedule_name 要唯一
 * spec:{second:data.second,minute:data.minute,hour:data.hour,date:data.date,month:data.month,year:data.year,dayOfWeek:data.dayOfWeek}
 */

/**
 * 主方法
 * 查询数据库，并为新建任务创建调度任务
 * 监控任务，如果schedule挂掉，还可以在轮询的时候试着重启
 * spec={
 *      second:
 *      minute:
 *      hour:
 *      date:
 *      month:
 *      year:
 *      dayOfWeek:
 *      }
 */

var first=function () {
  //轮询数据库，判断有没有异常死掉的schedule，如果有，则自动重新创建他们
  query("select  * from APP_SCHEDULE",function(err,results,fields){
    if(err){
        console.log("error message-->",err)
    }else {
      results.forEach(function (data) {
        if(data.state=='RUNNING'&&!schedule.scheduledJobs[data.schedule_name]){
          schedule.scheduleJob(data.schedule_name,{second:data.second,minute:data.minute,hour:data.hour,date:data.date,month:data.month,year:data.year,dayOfWeek:data.dayOfWeek},function () {
            //每次周期性调度前判断当前状态是否是Running，如果是就正常调度，如果不是，视为暂停，什么也不做
            var curState='';
            query("select state,command from  APP_SCHEDULE where schedule_name='"+data.schedule_name+"'",function(err,results,fields){
              if(err){
                  console.log("error message-->",err)
              }else {
                console.log(data.schedule_name,"get state",results[0].state)
                curState=results[0].state;
                console.log("curState======",curState)
                if(curState=='RUNNING'){
                  // do something task
                  console.log("name:-----",data.schedule_name,'schedule:-----',data.second,'state---',curState);
                }
              }
            });


          })
          // 只是为了测试reschedule功能
          // var spec={second:50}
          // if(data.schedule_name=='TEST3'){
          //   reschedule('TEST3',spec)
          // }
        }


      })

    }
  });
  console.log("-----------");
  console.log("all schedules=====",  schedule.scheduledJobs);
  // //只是用来测试停止任务
  // if(schedule.scheduledJobs['TEST6']){
  //   cancelJob('TEST6')
  // }

}

/**
 * 更改任务计划状态
 * @param schedule_name
 * @param state
 */
var updateState = function (schedule_name,state) {
  var sql="update APP_SCHEDULE set state='"+state+"' where schedule_name='"+schedule_name+"'";
  query(sql,function(err,results,fields){
    if(err){
        console.log("error message-->",err)
    }else {
      console.log("update ok--->"+sql)
    }
  });

}

/**
 * 暂未使用
 * 获取当前计划的任务状态
 * @param schedule_name 计划名称
 */
var getState = function (schedule_name) {

  query("select state from  APP_SCHEDULE where schedule_name='"+schedule_name+"'",function(err,results,fields){
    //do something
    if(err){
        console.log("error message-->",err)
    }else {
      console.log(schedule_name,"get state",results[0].state)
      return results[0].state;
    }
  });

}

/**
 * 将新建任务计划，插入数据库
 * @param schedule_name 计划名称
 * @param spec 计划时间(json)
 *      spec={
 *      second:
 *      minute:
 *      hour:
 *      date:
 *      month:
 *      year:
 *      dayOfWeek:
 *      }
 * @param command 计划命令
 * @param app_id 计划所属应用
 */
var insertSchedule = function (schedule_name,spec,command,app_id,state) {
  //id是自增，故传0或null
  //var sql="insert into APP_SCHEDULE(id,app_id,schedule_name,state,command,second,minute,hour,date,month,year,dayOfWeek) values(0,"+app_id+","+schedule_name+","+state+","+command+","+spec.second+","+spec.minute+","+spec.hour+","+spec.date+","+spec.month+","+spec.year+","+spec.dayOfWeek;

  var sql="";
  var base = "insert into APP_SCHEDULE(id,app_id,schedule_name,state,command";
  var sqlValues="values(0,"+app_id+",'"+schedule_name+"','"+state+"','"+command+"'";
  spec.second?(base=base + ",second",sqlValues=sqlValues+","+spec.second):(base,sqlValues);
  spec.minute?(base=base + ",minute",sqlValues=sqlValues+","+spec.minute):(base,sqlValues);
  spec.hour?(base=base + ",hour",sqlValues=sqlValues+","+spec.hour):(base,sqlValues);
  spec.date?(base=base + ",date",sqlValues=sqlValues+","+spec.date):(base,sqlValues);
  spec.month?(base=base + ",month",sqlValues=sqlValues+","+spec.month):(base,sqlValues);
  spec.year?(base=base + ",year",sqlValues=sqlValues+","+spec.year):(base,sqlValues);
  spec.dayOfWeek?(base=base + ",dayOfWeek",sqlValues=sqlValues+","+spec.dayOfWeek):(base,sqlValues);
  base = base +")";
  sqlValues=sqlValues+")";
  sql = base+sqlValues;

  query(sql,function(err,results,fields){
    //do something
    if(err){
        console.log("error message-->",err)
    }else {
      console.log("insert ok-->",sql);
    }
  });
}

/**
 * 创建任务计划
 * @param schedule_name 计划名称
 * @param spec 计划时间
 *      spec={
 *      second:
 *      minute:
 *      hour:
 *      date:
 *      month:
 *      year:
 *      dayOfWeek:
 *      }
 * @param commmand 计划命令
 * @param app_id 计划所属应用
 */
var newSchedule = function (schedule_name,spec,commmand,app_id) {

  //1.写入数据库，注意要先写库，避免首次schedule中查库查不到
  //  创建即启动计划,状态为RUNNING
  query("select count(*) as count from  APP_SCHEDULE where schedule_name='"+schedule_name+"'",function(err,results,fields){
    //do something
    if(err){
      console.log("error message-->",err)
    }else {
      console.log(schedule_name,"get count",results[0].count)
      if(results[0].count>0){
        return "this schedule_name has exists!"
      }else{
        insertSchedule(schedule_name,spec,commmand,app_id,"RUNNING");
      }
    }
  });
  //2.创建schedule
  schedule.scheduleJob(schedule_name,spec,function () {
    //查库，任务状态是否为执行
    var curState="";
    query("select state,command from  APP_SCHEDULE where schedule_name='"+schedule_name+"'",function(err,results,fields){
      if(err){
        console.log("error message-->",err)
      }else {
        console.log(schedule_name,"get state",results[0].state)
        curState=results[0].state;
        console.log("curState======",curState);
        //如果当前计划状态，仍为RUNNING状态则继续执行，如果是SUSPEND状态，即为暂停，什么也不执行
        if(curState=='RUNNING'){
          //do something
          console.log("name:-----",schedule_name,'schedule:-----',spec.second,'state---',curState);
        }
      }
    });


  })


}

/**
 * 更新数据库  :根据schedule_name
 * @param schedule_name 计划名称
 * @param spec 计划时间
 *      spec={
 *      second:
 *      minute:
 *      hour:
 *      date:
 *      month:
 *      year:
 *      dayOfWeek:
 *      }
 * @param command 计划命令
 */
var updateSchedule = function (schedule_name,spec,command) {
  var sql="update APP_SCHEDULE set";
  command?sql = sql +"  command='"+command+"',":sql;
  spec.second?sql=sql + " second='"+spec.second +"',":sql;
  spec.minute?sql=sql + " minute='"+spec.minute+"',":sql;
  spec.hour?sql=sql + " hour='"+spec.hour+"',":sql;
  spec.date?sql=sql + " date='"+spec.date+"',":sql;
  spec.month?sql=sql + " month='"+spec.month+"',":sql;
  spec.dayOfWeek?sql=sql + " dayOfWeek='"+spec.dayOfWeek+"',":sql;
  //去掉最后的逗号
  sql = sql.substr(0,sql.length-1);
  //加上条件
  sql = sql +" where schedule_name='"+schedule_name+"'";
  console.log("sql==>",sql)

  query(sql,function(err,results,fields){
    //do something
    if(err){
      console.log("error message-->",err)
    }else {
      console.log("update ok-->",sql)
    }
  });
}

/**
 * 编辑任务计划
 * @param schedule_name 计划名称
 * @param spec 计划时间
 *      spec={
 *      second:
 *      minute:
 *      hour:
 *      date:
 *      month:
 *      year:
 *      dayOfWeek:
 *      }
 * @param command 计划命令
 */
var edieSchedule = function (schedule_name,spec,command) {
  //1.删除当前schedule
  if(schedule.scheduledJobs[schedule_name]){
    schedule.scheduledJobs[schedule_name].cancel();
  }else{
    return;
  }

  //2.更新库
  updateSchedule(schedule_name,spec,command);

  //3.创建同名的schedule
  schedule.scheduleJob(schedule_name,spec,function () {
    //查库，任务状态是否为执行
    var curState="";
    query("select state,command from  APP_SCHEDULE where schedule_name='"+schedule_name+"'",function(err,results,fields){
      if(err){
        console.log("error message-->",err)
      }else {
        console.log(schedule_name,"get state",results[0].state)
        curState=results[0].state;
        console.log("curState======",curState);
        //如果当前计划状态，仍为RUNNING状态则继续执行，如果是SUSPEND状态，即为暂停，什么也不执行
        if(curState=='RUNNING'){
          console.log("name:-----",schedule_name,'schedule:-----',spec.second,'state---',curState);
        }
      }
    });


  })


}

/**
 * 任务计划时间改变，重新调度任务
 * @param schedule_name 计划名称
 * @param spec 计划时间
 * spec={
 *      second:
 *      minute:
 *      hour:
 *      date:
 *      month:
 *      year:
 *      dayOfWeek:
 *      }
 */
var reschedule = function (schedule_name,spec) {
  schedule.scheduledJobs[schedule_name].reschedule(spec);

  //修改计划，在实际中触发该方法时，必然是数据库已经发生变化，再来触发重新发起计划，帮不再需要在这里重新写库
  //var sql="update APP_SCHEDULE set second='"+spec.second+"' where schedule_name='"+job+"'";
  var sql="update APP_SCHEDULE set";
  spec.second?sql=sql + " second='"+spec.second +"',":sql;
  spec.minute?sql=sql + " minute='"+spec.minute+"',":sql;
  spec.hour?sql=sql + " hour='"+spec.hour+"',":sql;
  spec.date?sql=sql + " date='"+spec.date+"',":sql;
  spec.month?sql=sql + " month='"+spec.month+"',":sql;
  spec.dayOfWeek?sql=sql + " dayOfWeek='"+spec.dayOfWeek+"',":sql;
  //去掉最后的逗号
  sql = sql.substr(0,sql.length-1);
  //加上条件
  sql = sql +" where schedule_name='"+schedule_name+"'";
  console.log("sql==>",sql)

  query(sql,function(err,results,fields){
    //do something
    if(err){
        console.log("error message-->",err)
    }else {
      console.log("update ok")
    }
  });

}

/**
 * 删除数据库指定名称任务计划
 * @param schedule_name 计划名称
 */
var deleteSchedule = function (schedule_name) {
  var sql="delete from APP_SCHEDULE where schedule_name='"+schedule_name+"'";
  query(sql,function(err,results,fields){
    //do something
    if(err){
      console.log("error message-->",err)
    }else {
      console.log("delete ok-->",sql)
    }
  });
}

/**
 * 停止计划
 * @param schedule_name 计划名称
 */
var cancelJob = function (schedule_name) {

  schedule.scheduledJobs[schedule_name].cancel();
  //updateState(schedule_name,"STOP")
  deleteSchedule(schedule_name);
}

/**
 * 暂停计划
 * @param schedule_name 计划名称
 */
var suspendSchedule = function (schedule_name) {
  updateState(schedule_name,"SUSPEND");
}

/**
 * 暂停计划后，继续运行计划
 * @param schedule_name
 */
var continueSchedule = function (schedule_name) {
  if(schedule.scheduledJobs[schedule_name]){
    updateState(schedule_name,"RUNNING");
  }else{
    return "this schedul have not restarting now!"
  }

}

/**
 * 获取任务计划列表 ：根据app_id
 * @param app_id 数据应用id
 */
var getSchedulesByAppId = function(app_id,callback){
  var sql="select *  from APP_SCHEDULE where app_id="+app_id;
  query(sql,function(err,results,fields){
    if(err){
      console.log("error message-->",err)
    }else {
      console.log("query schedule list ok-->",sql)
      callback(results)
    }
  });
}

setInterval(first,10000)

/*******************TEST***********************/
var test=function () {
  //spec:{second:data.second,minute:data.minute,hour:data.hour,date:data.date,month:data.month,year:data.year,dayOfWeek:data.dayOfWeek}

  //1.newSchedule = function (schedule_name,spec,commmand,app_id)
  newSchedule("new2",{second:3},"make train",1);

  //2.edieSchedule = function (schedule_name,spec,command)
  edieSchedule("new2",{second:5},null);


}
//test();

