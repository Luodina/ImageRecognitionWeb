/**
 * Created by JiYi on 17/8/9.
 */
'use strict';
angular.module('basic')
    .controller('ExpertCtrl', ['copyName', '$cookies', '$sce', '$location', '$rootScope', '$scope', '$http',
        function(copyName, $cookies, $sce, $location, $rootScope, $scope, $http) {
            $scope.init = function() {
                let modelTemplate = $location.search()['modelTemplate'];
                let modelType = $location.search()['type'];
                let appName = modelType == 'explore' ? '' : $location.search()['appName'];
                let path_list = $location.path().split(/[\s/]+/);
                let modelName = path_list.pop();
                let model = path_list.pop();
                $scope.notebookPath = '';
                let ipyPath = '';
                let typeMenu = '00';
                let path;

                $scope.changeMode = (lang) => {
                    $scope.cmOption.mode = 'r';
                    $scope.grids.changestatus = lang;
                };
                $scope.changeKernel = (sss) => {
                    console.log(sss);
                    $scope.cmOption.mode = sss;
                    $scope.kernels.changestatus = sss;
                };
                $scope.grids = {
                    changestatus: 'Python',
                    status: ['Python', 'R'],
                };
                $scope.kernels = {
                    changestatus: 'Kernel1',
                    status: ['Kernel1', 'Kernel2']
                };
                $scope.model = {};
                let tmpArr = [{ test: 'print（"1");' }, { test: 'print（"2");' }];

                $scope.model.sourceCells = tmpArr;
                $scope.sourceCells = tmpArr;

                console.log($scope.model.sourceCells);

                $scope.cmOption = {
                    lineNumbers: false,
                    indentWithTabs: true,
                    lineWrapping: true,
                    theme: 'default',
                    mode: 'Python'
                };
                $scope.openToolTip = ($index) => {
                    $scope.model.sourceCells[$index].isShow = true;
                    console.log('sddsds', $scope.model.sourceCells);
                };
                $scope.aaa = ($index) => {
                    $scope.model.sourceCells[$index].isShow = false;
                    console.log('sddsds', $scope.model.sourceCells);
                };
                $scope.run = function(index) {
                    $scope.model.sourceCells[index].isShowCode = true;
                    $scope.model.sourceCells[index].result = 1;
                    console.log($scope.model.sourceCells[index]);

                };
                $scope.upAdd = (index, item) => {

                    $scope.model.sourceCells.splice(index, 0, {});
                    console.log('0011upupup', item);
                };
                $scope.downAdd = (index, item) => {
                    $scope.model.sourceCells.splice(index + 1, 0, {});
                    console.log('0012122downdown')
                };
                $scope.codeMirrorDelete = (index, item) => {
                    $scope.model.sourceCells.splice(index, 1);
                    console.log('0012122delete')
                };
                $scope.difUser = false;
                $scope.openProject = function() {
                    copyName.open(modelName, modelType);
                }
                if (model === 'new') {
                    $http.get('/api/expert/pathNoteBook', {
                        params: {
                            modelName: modelName,
                            modelType: modelType,
                            modelTemplate: modelTemplate,
                            appName: appName
                        }
                    }).then(function(response) {
                        if (modelType === 'explore') {
                            typeMenu = '01';
                            path = 'modelPath';
                        } else {
                            typeMenu = '00';
                            path = 'appPath';
                        }
                        ipyPath = response.data.jpyPath;
                        $scope.notebookPath = $sce.trustAsResourceUrl(ipyPath);
                        $scope.outputPath = $sce.trustAsResourceUrl(ipyPath);
                        let date = new Date();
                        let savaData = {
                            MODEL_NAME: modelName,
                            USER_ID: $cookies.get('username'),
                            TYPE_MENU_ID: typeMenu,
                            VIEW_MENU_ID: '06',
                            UPDATED_TIME: date.getTime(),
                            NOTEBOOK_PATH: path,
                            FILE_PATH: modelName + '.ipynb',
                            COMMENT: 'Lets try it!',
                            APP_ID: appName
                        };
                        console.log('Data to DB savaData:', savaData);
                        $http.post('/api/model/new', savaData).success(function(data) {
                            console.log('Expert MODE save:', data.msg);
                        });
                    });
                } else if (model === 'update' || model === 'view') {
                    let url = '/api/expert/notebook/open/' + modelName + '/' + modelType;
                    $http.get(url, {
                            params: {
                                userName: $cookies.get('username')
                            }
                        })
                        .success(data => {
                            console.log('dataModel===update', data);
                            if (data) {
                                if (modelType === 'explore') {
                                    $scope.difUser = data.difUser;
                                    typeMenu = '01';
                                    path = 'modelPath';
                                } else {
                                    $scope.difUser = false;
                                    typeMenu = '00';
                                    path = 'appPath';
                                }
                                if (data.outputPath) {
                                    $scope.notebookPath = $sce.trustAsResourceUrl(data.outputPath);
                                } else {
                                    $scope.notebookPath = $sce.trustAsResourceUrl(data.jpyPath);
                                }
                            } else {
                                console.log('Error with Notebook init!');
                            }
                        })
                        .catch(err => {
                            console.log('err in initNotebook():', err);
                        });
                }
            };
            //$scope.init();
            console.log('Came here!!!!!!');

        }
    ]);