/**
 * Created by JiYi on 17/7/5.
 */
'use strict';
angular.module('basic.services', ['ui.bootstrap'])
  .service('createModel', ['$uibModal', function ($uibModal) {
    this.open = function (obj,idx) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/layer/createModel.html',
        size: 'size',
        controller: ['$cookies', '$scope', '$filter', '$uibModalInstance', '$http',
          function ($cookies, $scope, $filter, $uibModalInstance, $http) {
            $scope.title = $filter('translate')(obj.title);
            $scope.content = $filter('translate')(obj.content);
            $scope.url = idx;
            console.log('222222',idx);
            if(idx ==='notebook'){
              $scope.UISref = false;
            }else{
              $scope.UISref = true;
            }
            $scope.userName = $cookies.get("username");
            $scope.cancel = function () {
              $uibModalInstance.dismiss();
            }
            $scope.create = function () {
              if(!$scope.UISref){
                $uibModalInstance.close($scope.model.name)
              }else{
                $uibModalInstance.dismiss();
              }
            }
          }]
      }).result;
    };
  }])
  .service('openPreview', ['$uibModal', '$http', function ($uibModal, $http) {
    this.open = function (resultPreview) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/layer/savePreview.html',
        size: 'size',
        //controllerUrl: 'scripts/layer/savePreview.js',
        controller: ['$scope', '$filter', '$uibModalInstance', '$location', '$cookies',
          function ($scope, $filter, $uibModalInstance, $location, $cookies) {
            $scope.resultPreview = resultPreview;
            $scope.save = function () {
              $http.get('/api/jupyter/save').success(function (data) {
                let date = new Date();
                let savaData = {
                  MODEL_NAME: $location.path().split(/[\s/]+/).pop(),
                  MODEL_INFO: data.modelInfo,
                  USER_ID: $cookies.get("username"),
                  TYPE_MENU_ID: "01",
                  VIEW_MENU_ID: "01",
                  UPDATED_TIME: date.getTime(),
                  FILE_PATH: data.dataFileName,
                  NOTEBOOK_PATH: data.notebookPath,
                  COMMENT: 'Lets try it!',
                }
                console.log("Data to DB savaData:", savaData);
                $http.post('/api/model/new', savaData).success(function (data) {
                  console.log("DataProcessingCtrl save:", data.msg);
                });
                $location.path("/explore");
              });
              $uibModalInstance.dismiss();
            };
            $scope.cancel = function () {
              $uibModalInstance.dismiss();
            };
          }]
      }).result;
    };
  }])
  .service('createApp', ['$uibModal', function ($uibModal) {
    this.open = function (obj,pic,idx) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/layer/createApp.html',
        size: 'size',
        controller: ['$scope', '$uibModalInstance', '$filter', '$state', '$location',
          function ($scope, $uibModalInstance, $filter, $state, $location) {
            $scope.items = [
              {img:'pic1',content:'modelType_01',url:'data',name:'data'},
              {img:'pic2',content:'modelType_02',url:'t1',name:'data2'},
              {img:'pic3',content:'modelType_03',url:'t2',name:'data3'},
              {img:'pic4',content:'modelType_04',url:'t3',name:'data4'},
              {img:'pic5',content:'modelType_05',url:'t4',name:'data5'},
              {img:'pic6',content:'modelType_06',url:'notebook',name:'notebook'}
            ]
            $scope.urlcontent = $scope.items[0];
            $scope.cancel = function () {
              $uibModalInstance.dismiss();
            }
            $scope.changeStyle = function(idx){
              $scope.urlcontent = $scope.items[idx];
              console.log('312312',$scope.urlcontent);
            }
            $scope.create = function () {
              $uibModalInstance.dismiss();
              $location.path("/"+$scope.urlcontent.url+'/new/'+$scope.urlcontent.name);
            }
          }]
      }).result;
    };
  }])
  .service('createArrange', ['$uibModal', function ($uibModal) {
    this.open = (ipynbNameList, appName, makeFileName) => {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/layer/createArrange.html',
        size: 'size',
        controller: ['$cookies', '$scope', '$filter', '$uibModalInstance', '$http',
          ($cookies, $scope, $filter, $uibModalInstance, $http) => {
            $scope.appName = appName;
            $scope.makeFileName = makeFileName;
            $scope.data = {
              targetModel: null,
              prereqModel:null,
              availableOptions: ipynbNameList
            };//
            $scope.list = [{value: ''}];
            // 点击+或x的事件
            $scope.action = (index) => {
              console.log(index, $scope.list.length)
              if (index == $scope.list.length - 1) {
                $scope.list.push({value: ''});
              }else {
                $scope.list.splice(index, 1)
              }
            }
            // 右侧option 值发生变化的事件
            $scope.change = (value, index) => {
              $scope.list[index].value = value;
            }
            $scope.cancel = function () {
              $uibModalInstance.dismiss();
            }
            $scope.save = function () {
              let savaData = {
                    MAKEFILE_ID: $scope.makeFileName,
                    USER_ID: $cookies.get("username"),
                    APP_ID: $scope.appName,
                    TARGET: $scope.data.targetModel,
                    PREREQUISITES: Object.values($scope.data.prereqModel).join(' ')
                  };
              $http.post('/api/appMakeFile/new', savaData).success((data)=> {
                console.log("MAKEFILE save:", data.msg);
                $uibModalInstance.close(data.msg);
              });
            }
          }]
      })
      .result;
    };
  }])
  .service('createTaskPlan', ['$uibModal', function ($uibModal) {
    this.open = function () {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/layer/createTaskPlan.html',
        size: 'size',
        controller: ['$cookies', '$scope', '$filter', '$uibModalInstance', '$http',
          function ($cookies, $scope, $filter, $uibModalInstance, $http) {

            //计划设置1
            $scope.grids = {
              changestatus:'每周',
              status:[{name:'每天'},{name:'每月'},{name:'每周'}]
            };

            //每周设置
            $scope.weeks = {
              changestatus:'周一',
              status:[{name:'周一'},{name:'周二'},{name:'周三'},{name:'周四'},{name:'周五'},{name:'周六'},{name:'周日'}]
            };
            console.log("1111",$scope.weeks)
            //每月设置
            $scope.months = {
              changestatus:'1',
              status:[{name:'1'},{name:'2'},{name:'3'},{name:'4'},{name:'5'},{name:'6'},{name:'7'},{name:'8'},{name:'9'},{name:'10'},{name:'11'}
                ,{name:'12'},{name:'13'},{name:'14'},{name:'15'},{name:'16'},{name:'17'},{name:'18'},{name:'19'},{name:'20'},{name:'21'},{name:'22'},{name:'23'}
                ,{name:'24'},{name:'25'},{name:'26'},{name:'27'},{name:'28'},{name:'29'},{name:'30'},{name:'31'}]
            };

            //每小时设置
            $scope.hours = {
              changestatus:'0',
              status:[{name:'0'},{name:'1'},{name:'2'},{name:'3'},{name:'4'},{name:'5'},{name:'6'},{name:'7'},{name:'8'},{name:'9'},{name:'10'},{name:'11'}
                ,{name:'12'},{name:'13'},{name:'14'},{name:'15'},{name:'16'},{name:'17'},{name:'18'},{name:'19'},{name:'20'},{name:'21'},{name:'22'},{name:'23'}
               ]
            };

            //每分钟设置
            $scope.minutes = {
              changestatus:'0',
              status:[{name:'0'},{name:'1'},{name:'2'},{name:'3'},{name:'4'},{name:'5'},{name:'6'},{name:'7'},{name:'8'},{name:'9'},{name:'10'},{name:'11'}
                ,{name:'12'},{name:'13'},{name:'14'},{name:'15'},{name:'16'},{name:'17'},{name:'18'},{name:'19'},{name:'20'},{name:'21'},{name:'22'},{name:'23'}
                ,{name:'24'},{name:'25'},{name:'26'},{name:'27'},{name:'28'},{name:'29'},{name:'30'},{name:'31'},{name:'32'},{name:'33'},{name:'34'},{name:'35'},{name:'36'}
                ,{name:'37'},{name:'38'},{name:'39'},{name:'40'},{name:'41'},{name:'42'},{name:'43'},{name:'44'},{name:'45'},{name:'46'},{name:'47'},{name:'48'},{name:'49'},{name:'50'}
                ,{name:'51'},{name:'52'},{name:'53'},{name:'54'},{name:'55'},{name:'56'},{name:'57'},{name:'58'},{name:'59'}
              ]
            };

            //初始值
            $scope.grids.changestatus='每天';

            $scope.isWeekOk=false;
            $scope.isMonthOk=false;
            $scope.$watch('grids.changestatus', function (n, o) {
              if (n == o) {
                return;
              }
              if (n === '每天') {
                $scope.isWeekOk=false;
                $scope.isMonthOk=false;
              }
              if (n === '每周') {
                $scope.isWeekOk=true;
                $scope.isMonthOk=false;
              }

              if (n === '每月') {
                $scope.isWeekOk=false;
                $scope.isMonthOk=true;
              }



            })





            $scope.cancel = function () {
              $uibModalInstance.dismiss();
            }
            $scope.save = function () {
              $uibModalInstance.dismiss();
            }
          }]
      })
      .result;
    };
  }])
  .service('createExpertModule',['$uibModal', function ($uibModal) {
    this.open = function (name) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/dataExplore/expertModule.html',
        size: 'lg',
        controller: ['$cookies', '$scope', '$filter', '$uibModalInstance', '$http','$location','$sce',
          function ($cookies, $scope, $filter, $uibModalInstance, $http,$location,$sce) {

            $scope.notebookPath = '';
            var ipyPath = '';
            $scope.init = function () {

              $http.get('/api/expert/pathNoteBook', {
                params: {
                  "modelName": name
                }
              }).then(function (response) {
                console.log('55555',response);
                ipyPath = response.data.jpyPath;
                $scope.notebookPath = $sce.trustAsResourceUrl(ipyPath);
                // $http.get('/api/jupyter/save').success(function (data) {
                var date = new Date();
                var savaData = {
                  MODEL_NAME: $location.path().split(/[\s/]+/).pop(),
                  USER_ID: $cookies.get("username"),
                  TYPE_MENU_ID: "01",
                  VIEW_MENU_ID: "06",
                  UPDATED_TIME: date.getTime(),
                  NOTEBOOK_PATH: response.data.notebookPath,
                  COMMENT: 'Lets try it!'
                };
                console.log("Data to DB savaData:", savaData);
                $http.post('/api/model/new', savaData).success(function (data) {
                  console.log("Expert MODE save:", data.msg);
                });
                // $location.path("/explore");
                // });
              });
            };
            $scope.init();

            $scope.cancel = function () {
              $uibModalInstance.dismiss();
            }
          }]
      }).result;
    };
  }])
