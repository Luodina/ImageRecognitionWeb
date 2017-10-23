'use strict';
angular.module('basic.services', ['ui.bootstrap'])
  .service('appService', ['$http', function ($http) {
    var app = null;
    const fetchApp = function (appName) {
      return $http.get('/api/app/' + appName)
        .then((res) => {
          app = res.data.result;
          return app;
        })
        .catch(err => {
          console.log('err', err);
        });
    };

    const setCurrentApp = function (newObj) {
      this.app = newObj;
    };

    const getApp = function () {
      return this.app;
    };


    return {
      fetchApp: fetchApp,
      getApp: getApp,
      setCurrentApp: setCurrentApp
      // setApp: setApp
    };
  }])
  .service('createApp', ['$uibModal', function ($uibModal) {
    this.open = (appName) => {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/layer/createModel.html',
        size: 'size',
        controller: ['$rootScope', '$location', '$scope', '$filter', '$uibModalInstance', '$http',
          ($rootScope, $location, $scope, $filter, $uibModalInstance, $http) => {
            $scope.title = $filter('translate')('web_common_data_app_layer_01');
            $scope.content = $filter('translate')('web_common_data_app_layer_02');
            $scope.url = 'app';
            $scope.cancel = function () {
              $uibModalInstance.dismiss();
            };
            $scope.create = function () {
              if ($scope.model.name) {
                //check in DB APP
                $rootScope.modelAppName = $scope.model.name;
                $http.get('/api/app/' + $scope.model.name).success(data => {
                  if (data.result !== null) {
                    $scope.model.name = '';
                    $scope.model.nameTip = 'Please use another name!!';
                  } else {
                    $http.post('/api/app/' + $scope.model.name, {
                      APP_NAME: $scope.model.name,
                      USER_NAME: $rootScope.getUsername()
                    })
                      .success(data => {
                        if (data.result === 'success') {
                          $uibModalInstance.dismiss();
                          $location.path('/app/new/' + $scope.model.name);
                        }
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  }
                });
              }
            };
          }
        ]
      }).result;
    };
  }])
  .service('createAppModel', ['$uibModal', function ($uibModal) {
    this.open = function (appName) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/layer/createAppModel.html',
        size: 'size',
        controller: ['$scope', '$uibModalInstance',
          function ($scope, $uibModalInstance) {
            $scope.items = [
              {img: 'pic1', content: 'modelType_01', url: 'data', name: 'data', isActive: false},
              {img: 'pic2', content: 'modelType_02', url: 't1', name: 'data2', isActive: false},
              {img: 'pic3', content: 'modelType_03', url: 't2', name: 'data3', isActive: false},
              {img: 'pic4', content: 'modelType_04', url: 't3', name: 'data4', isActive: false},
              {img: 'pic5', content: 'modelType_05', url: 't4', name: 'data5', isActive: false},
              {img: 'pic6', content: 'modelType_06', url: 'notebook', name: 'notebook', isActive: false}
            ];
            $scope.appName = appName;
            $scope.items[0].isActive = true;
            let type = 1;
            $scope.urlcontent = $scope.items[0];
            $scope.cancel = function () {
              $uibModalInstance.dismiss();
            };
            $scope.changeStyle = function (idx) {
              angular.forEach($scope.items, function (item) {
                item.isActive = false;
              });
              $scope.items[idx].isActive = true;
              type = idx + 1;
              $scope.urlcontent = $scope.items[idx];
            };
            $scope.create = function () {
              if ($scope.model.name) {
                $uibModalInstance.close({appName: appName, type: type, modelName: $scope.model.name});
              }
            };
          }
        ]
      }).result;
    };
  }])
  .service('appOperResult', ['$uibModal', function ($uibModal) {
    this.open = function (list) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/layer/appOperResult.html',
        size: 'lg',
        controller: ['$scope', '$uibModalInstance',
          function ($scope, $uibModalInstance) {
            $scope.viewList = list;
            $scope.changeView = function (item) {
              document.getElementById('ifm').setAttribute('src', item.path);
            };
            $scope.cancel = function () {
              $uibModalInstance.dismiss();
            };
          }
        ]
      }).result;
    };
  }])
  .service('deleteFile', [ '$uibModal', '$http', function ($uibModal, $http) {
    this.open = function (item) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/layer/deletePage.html',
        size: 'size',
        controller: ['$scope', '$uibModalInstance',
          function ($scope, $uibModalInstance) {
            $scope.cancel = () => {
              $uibModalInstance.dismiss();
            };
            if (item !== null && item !== undefined) {
              //TODO be smart here
              $scope.isOwner = true;
            } else {
              console.log('Del item === null && item === undefined');
            }
            $scope.ok = () => {
              $http.delete(`/api/app/${item.app}/files?file=${item.file}`)
                .success(data => {
                  if (data.msg === 'success') {
                    $uibModalInstance.dismiss();
                    window.location.reload();
                  }
                })
                .catch(err => {
                  console.log('error', data.msg);
                });
            };
          }
        ]
      }).result;
    };
  }])
  .service('deletePage', ['$rootScope', '$uibModal', '$http', function ($rootScope, $uibModal, $http) {
    this.open = function (item) {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/layer/deletePage.html',
        size: 'size',
        controller: ['$scope', '$uibModalInstance','$location',
          function ($scope, $uibModalInstance,$location) {
            $scope.cancel = () => {
              $uibModalInstance.dismiss();
            };
            let itemID, type, path, user;
            if (item !== null && item !== undefined) {
              user = $rootScope.getUsername();
              $scope.isOwner = (item.USER_NAME === user);
              if (item.MODEL_ID !== null && item.MODEL_ID !== undefined) {
                type = 'model';
                itemID = item.MODEL_ID;
                if (item.APP_ID) {
                  path = item.NOTEBOOK_PATH + '/' + item.APP_ID + '/' + item.MODEL_NAME + '.ipynb';
                } else {
                  path = item.NOTEBOOK_PATH + '/' + item.MODEL_NAME;
                }
              } else {
                path = item.NOTEBOOK_PATH + '/' + item.APP_NAME;
                itemID = item.APP_NAME;
                type = 'app';
              }
            } else {
              console.log('Del item === null && item === undefined');
            }
            $scope.ok = () => {
              $http.put(`/api/${type}/delete`, {item: itemID, user: user})
                .success(data => {
                  if (data.msg === 'success') {
                    $uibModalInstance.dismiss();
                    $location.path('/home');
                  }
                })
                .catch(err => {
                  console.log('error', data.msg);
                });
            };
          }
        ]
      }).result;
    };
  }])
  .service('copyName', ['$uibModal', function ($uibModal) {
    this.open = (modelName, modelType) => {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/layer/createModel.html',
        size: 'size',
        controller: ['$rootScope', '$location', '$scope', '$filter', '$uibModalInstance', '$http', '$cookies',
          ($rootScope, $location, $scope, $filter, $uibModalInstance, $http, $cookies) => {
            $scope.title = $filter('translate')('web_common_copy_layer_01');
            $scope.content = $filter('translate')('web_common_copy_layer_01');

            $scope.cancel = function () {
              $uibModalInstance.dismiss();
            };
            $scope.create = function () {
              if ($scope.model.name) {
                $http.get('/api/expert/copyExpertModel', {
                  params: {
                    modelName: modelName,
                    newModelName: $scope.model.name,
                    modelType: modelType,
                    newUserName: $cookies.get('username')
                  }
                }).then(function (res) {
                  console.log('save:expertPage', res);
                  $uibModalInstance.dismiss();
                  $location.path('/explore');
                });
              }
            };
          }
        ]
      }).result;
    };
  }])
  .service('loginModel', ['$uibModal', function ($uibModal) {
    this.open = () => {
      return $uibModal.open({
        backdrop: 'static',
        templateUrl: 'views/layer/loginModel.html',
        size: 'size',
        controller: ['$rootScope', '$location', '$scope', '$filter', '$uibModalInstance', 'hotkeys', 'ipCookie', '$http', '$cookies',
          ($rootScope, $location, $scope, $filter, $uibModalInstance, hotkeys, ipCookie, $http, $cookies) => {
            $scope.expires = 7;
            $scope.expirationUnit = 'days';

            let setMessage = function (message, messageStyle) {
              $scope.message = message ? message : null;
              $scope.messageStyle = messageStyle ? messageStyle : 'success';
            };
            $scope.saveCookie = function () {
              setMessage();
              $scope.messageStyle = 'success';
              // key, value, options
              console.log('saving cookie...');
              ipCookie('username', $scope.usermessage.username, {
                expires: $scope.expires,
                expirationUnit: $scope.expirationUnit
              });
              ipCookie('userpass', $scope.usermessage.password, {
                expires: $scope.expires,
                expirationUnit: $scope.expirationUnit
              });
              console.log('new cookie value...');
              console.log(ipCookie('username'));
              console.log(ipCookie('userpass'));
              setMessage("Cookie created. Use your browser cookie display to verify content or expiry.");
            };
            $scope.deleteCookie = function () {
              setMessage();
              console.log('removing cookie...');
              ipCookie.remove('username');
              ipCookie.remove('userpass');
              if (ipCookie() === undefined) {
                setMessage('Successfully deleted cookie.');
              } else {
                setMessage('Unable to delete cookie.', 'danger');
              }
            };
            $scope.username = $filter('translate')('web_common_010');
            $scope.password = $filter('translate')('web_common_011');
            $scope.signin = $filter('translate')('web_common_012');
            $scope.isForget = false;
            $scope.login = () => {
              if ($scope.usermessage.password !== undefined) {
                $rootScope.login($scope.usermessage.username, $scope.usermessage.password);
                //$uibModalInstance.dismiss();
              }
            };
            //登录接口
            $rootScope.login = (username, password) => {
              $http.post('/api/user/login/', {username, password}).success(function (user) {
                $rootScope.error_name = false;
                if (user.status) {
                  console.log('LOGIN SUCCESS!');
                  $cookies.put('username', username);
                  //将token加入cookie
                  $cookies.put('aura_token', user.token);
                  $uibModalInstance.dismiss();
                  // $location.path('/expert/new').search({
                  //   user: username,
                  //   kernel: 'python3',
                  //   name: 'vf11'
                  // });
                  // ;
                  $rootScope.iflogin = true;
                  $rootScope.username = $cookies.get("username");
                  $location.path('/home');
                } else {
                  $rootScope.error_name = true;
                  //console.log('LOGIN FAILED!please, use login name:ocai and pass:123456');
                }
              })
            }
            //enter 进入页面
            $scope.enterLogin = (e) => {
              if (e.keyCode == 13) {
                //$state.go('dataExplore');
                if ($scope.usermessage.password !== undefined) {
                  $rootScope.login($scope.usermessage.username, $scope.usermessage.password);
                  //$uibModalInstance.dismiss();
                }
              }
            };
            //图片预加载
            let images = new Array()

            function preload() {
              for (let i = 0; i < arguments.length; i++) {
                images[i] = new Image()
                images[i].src = arguments[i];
              }
            }
            preload("images/homeBag.png", "images/logo.png");
            $scope.cancel = function () {
              $uibModalInstance.dismiss();
            };
          }
        ]
      }).result;
    };
  }]);
