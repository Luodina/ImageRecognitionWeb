'use strict';
angular.module('basic.services', ['ui.bootstrap'])
    .service('copyName', ['$uibModal', function($uibModal) {
        this.open = (modelName, modelType) => {
            return $uibModal.open({
                backdrop: 'static',
                templateUrl: 'views/layer/createModel.html',
                size: 'size',
                controller: ['$rootScope', '$location', '$scope', '$filter', '$uibModalInstance', '$http', '$cookies',
                    ($rootScope, $location, $scope, $filter, $uibModalInstance, $http, $cookies) => {
                        $scope.title = $filter('translate')('web_common_copy_layer_01');
                        $scope.content = $filter('translate')('web_common_copy_layer_01');

                        $scope.cancel = function() {
                            $uibModalInstance.dismiss();
                        };
                        $scope.create = function() {
                            if ($scope.model.name) {
                                $http.get('/api/expert/copyExpertModel', {
                                    params: {
                                        modelName: modelName,
                                        newModelName: $scope.model.name,
                                        modelType: modelType,
                                        newUserName: $cookies.get('username')
                                    }
                                }).then(function(res) {
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
    .service('loginModel', ['$uibModal', function($uibModal) {
        this.open = () => {
            return $uibModal.open({
                backdrop: 'static',
                templateUrl: 'views/layer/loginModel.html',
                size: 'size',
                controller: ['$rootScope', '$location', '$scope', '$filter', '$uibModalInstance', 'hotkeys', 'ipCookie', '$http', '$cookies',
                    ($rootScope, $location, $scope, $filter, $uibModalInstance, hotkeys, ipCookie, $http, $cookies) => {
                        $scope.expires = 7;
                        $scope.expirationUnit = 'days';

                        let setMessage = function(message, messageStyle) {
                            $scope.message = message ? message : null;
                            $scope.messageStyle = messageStyle ? messageStyle : 'success';
                        };
                        $scope.saveCookie = function() {
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
                        $scope.deleteCookie = function() {
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
                                $http.post('/api/user/login/', { username, password }).success(function(user) {
                                    $rootScope.error_name = false;
                                    if (user.status) {
                                        console.log('LOGIN SUCCESS!');
                                        $cookies.put('username', username);
                                        //将token加入cookie
                                        $cookies.put('aura_token', user.token);
                                        $uibModalInstance.dismiss();
                                        $location.path('/expert/new').search({
                                            kernel: 'python2',
                                            name: 'XXX'
                                        });
                                        $rootScope.iflogin = true;
                                        $rootScope.username = $cookies.get("username");
                                    } else {
                                        $rootScope.error_name = true;
                                        //console.log('LOGIN FAILED!please, use login name:ocai and pass:123456');
                                    }
                                })
                            };
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
                                images[i].src = arguments[i]
                            }
                        };
                        preload(
                            "images/homeBag.png",
                            "images/logo.png"
                        );
                        $scope.cancel = function() {
                            $uibModalInstance.dismiss();
                        };
                    }
                ]
            }).result;
        };
    }]);
