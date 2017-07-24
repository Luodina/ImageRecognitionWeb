"use strict";
angular.module('basic')
  .controller('TaskPlanCtrl', ['$rootScope', '$filter', '$http', '$scope', 'createTaskPlan',
    ($rootScope, $filter, $http, $scope, createTaskPlan) => {
      // $scope.openTaskPlan = ()=>{
      //   createTaskPlan.open()
      // }
      $scope.openTaskPlan = (createOrEdit) => {
        createTaskPlan.open(createOrEdit, $scope.currentEditSchedule).then(function (schedule) {
          var time = {hour: schedule.hour, minute: schedule.minute};
          if (schedule.choice == "每周") {
            schedule.dayOfWeek == "周一" ? schedule.dayOfWeek = 1 : schedule.dayOfWeek == "周二" ? schedule.dayOfWeek = 2 : schedule.dayOfWeek == "周三" ? schedule.dayOfWeek = 3 : schedule.dayOfWeek == "周四" ? schedule.dayOfWeek = 4 : schedule.dayOfWeek == "周五" ? schedule.dayOfWeek = 5 : schedule.dayOfWeek == "周六" ? schedule.dayOfWeek = 6 : schedule.dayOfWeek == "周日" ? schedule.dayOfWeek = 0 :schedule.dayOfWeek= 0;
            time.dayOfWeek = parseInt(schedule.dayOfWeek);
          } else if (schedule.choice == "每月") {
            time.date = schedule.date;
          }
          schedule.appId = $scope.appName;
          if (createOrEdit === "create") {
            //the scheduleName is unique
            $scope.getScheduleByName(schedule.name, function (data) {
              console.log("count data.countSchedule ==========>", data.countSchedule);
              if (data.countSchedule == 0) {
                $scope.createSchedule(schedule.appId, schedule.name, schedule.command, time, schedule.state);
              } else {
                console.log("该计划已存在，请换个名称试试", data.countSchedule)
              }
            });
            //end create
          } else if (createOrEdit === "edit") {
            $scope.updateScheduleByName(schedule.name, schedule.command, time, schedule.state);
          }


        })
      }

      // get app_name
      var location = window.location.href;
      var appIndex = location.lastIndexOf("/");
      $scope.appName =location.substring(appIndex+1);



      /**
       * get schedule list by app_id
       * @param app_id
       */
      $scope.getScheduleById = function (app_id) {
        $http.get('/api/testSchedule/getScheduleListById/' + app_id).success(function (data) {
          console.log("schedule list====>", data);
          $scope.scheduleList = data.makeSchedule;
          $scope.scheduleList.forEach(function (schedule) {
            schedule.DAYOFWEEK == 1 ? schedule.DAYOFWEEK ="周一" : schedule.DAYOFWEEK == 2 ? schedule.DAYOFWEEK ="周二" : schedule.DAYOFWEEK == 3 ? schedule.DAYOFWEEK ="周三" : schedule.DAYOFWEEK == 4 ? schedule.DAYOFWEEK ="周四" : schedule.DAYOFWEEK == 5 ? schedule.DAYOFWEEK ="周五" : schedule.DAYOFWEEK == 6 ? schedule.DAYOFWEEK ="周六" : schedule.DAYOFWEEK == 7 ? schedule.DAYOFWEEK ="周日" :schedule.DAYOFWEEK;
          })

        })
      };
      // get schedule list by appName
      $scope.getScheduleById($scope.appName);
      /**
       * get schedule count by scheduleName
       * @param scheduleName
       */
      $scope.getScheduleByName = function (scheduleName, callback) {
        $http.get('/api/testSchedule/getScheduleListByName/' + scheduleName).success(function (data) {
          console.log("schedule count====>", data.count)
          callback({countSchedule: data.count ? data.count : 0});
        })
      };

      /**
       * create schedule
       * @param app_id
       * @param scheduleName
       * @param target
       * @param time
       * @param state
       */
      $scope.createSchedule = function (app_id, scheduleName, target, time, state) {

        $http.post('/api/testSchedule/createSchedule', {
          'APP_ID': app_id,
          'SCHEDULE_NAME': scheduleName,
          'COMMAND': target,
          'TIME': time,
          'STATE': state
        }).success(function (data) {
          console.log("createSchedule success====>", data)

        }).error(function (error) {
          console.log("createSchedule error====X ", error)
        })

      };
      //$scope.createSchedule("App2","TT1","test0",{second:2},'RUNNING');


      /**
       * update  schedule ty scheduleName
       * @param app_id
       * @param scheduleName
       * @param target
       * @param time
       * @param state
       */
      $scope.updateScheduleByName = function (scheduleName, target, time, state) {
        $http.post('/api/testSchedule/updateScheduleByName', {
          'SCHEDULE_NAME': scheduleName,
          'COMMAND': target,
          'TIME': time,
          'STATE': state
        }).success(function (data) {
          console.log("editSchedule success====>", data)
        }).error(function (error) {
          console.log("editSchedule error====X ", error)
        })
      };

      /**
       * delete schedule by scheduleName
       * @param scheduleName
       */
      $scope.deleteSchedule = function (scheduleName) {
        console.log("deleteSchedule", scheduleName);
        $http.post('/api/testSchedule/deleteScheduleByName', {
          'SCHEDULE_NAME': scheduleName
        }).success(function (data) {
          console.log("delete schedule====>", data)
        });
      }

      /**
       * pause or continue Schedule by scheduleName
       * @param scheduleName
       * @param state :pause or running
       */
      $scope.pauseSchedule = function (scheduleName, state) {
        console.log("pauseSchedule", scheduleName, state);
        if (state == "RUNNING") {
          state = "SUSPEND"
        } else if (state == "SUSPEND") {
          state = "RUNNING"
        }
        $http.post('/api/testSchedule/updateStateByName', {
          'SCHEDULE_NAME': scheduleName,
          'STATE': state
        }).success(function (data) {
          console.log("pause or running schedule====>", data)
        });
      }

      /**
       * edit Schedule by scheduleName
       * @param scheduleName
       */
      $scope.editSchedule = function (scheduleName, schedule) {
        $scope.currentEditSchedule = schedule;
        console.log("editSchedule", scheduleName);
        $scope.openTaskPlan("edit");
      };


      //end
    }])
  .directive('task', () => {
    return {
      templateUrl: 'views/dataApp/appModel/taskPlan.html'
    };
  });

