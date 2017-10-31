'use strict';
angular.module('basic')
    .controller('ExpertCtrlTwo', ['copyName', '$cookies', '$sce', '$location', '$rootScope', '$scope', '$http', '$timeout', 'Notification',
        function(copyName, $cookies, $sce, $location, $rootScope, $scope, $http, $timeout, Notification) {
            $scope.model = $location.search();
            $scope.model.mode = $location.path().split('/')[2];
            console.log('$scope.model', $scope.model);
            //validation
            function isParamValid() {
                return new Promise((resolve, reject) => {
                    //check kernel
                    $http.get('/api/jupyter/kernels', {
                            params: { token: $scope.model.token }
                        }).success(data => {
                            let val = false;
                            if (data) {
                                if (data.msg === 'success') {
                                    let tmpArr = [];
                                    data.kernellist.kernelspecs.forEach(kernel => {
                                        tmpArr.push(kernel.name);
                                    });
                                    if (tmpArr.indexOf($scope.model.kernel) > -1) {
                                        $http.get('/api/jupyter/projects/' + $scope.model.name, {
                                                params: { token: $scope.model.token }
                                            })
                                            .success(project => {
                                                if (project.msg === 'success') {
                                                    if (project.result.length !== 0) {
                                                        if ($location.path().split('/')[2] === 'edit') {
                                                            $scope.model.MODEL_ID = project.result[0].MODEL_ID;
                                                            console.log('$scope.model.MODEL_ID:', $scope.model.MODEL_ID);
                                                            val = true;
                                                            resolve(val, project.result[0].MODEL_ID);
                                                        } else {
                                                            console.log('project with name:', project.result[0].MODEL_NAME, 'exists');
                                                            resolve(val);
                                                        };
                                                    } else {
                                                        if ($scope.model.mode === 'new') {
                                                            val = true;
                                                            resolve(val);
                                                        } else {
                                                            console.log('project with name:', $scope.model.name, 'do not exists');
                                                            resolve(val);
                                                        };
                                                    }
                                                } else {
                                                    console.log(project.msg);
                                                    resolve(val);
                                                }
                                            })
                                            .catch(err => {
                                                console.log('err in /api/jupyter/projects/', err);
                                                reject(err);
                                            });
                                    } else {
                                        console.log('Chosen kernel', $scope.model.kernel, ' is not in i the availabe kernel list ', tmpArr);
                                        resolve(val);
                                    }
                                } else {
                                    console.log('ERROR data.msg !== success:');
                                    resolve(val);
                                }
                            } else {
                                console.log('ERROR data:');
                                resolve(val);
                            }
                        })
                        .catch(err => {
                            console.log('ERROR /api/jupyter/kernels:');
                            reject(err);
                        });
                });
            }

            isParamValid().then(isKerneValid => {
                console.log('isKerneValid', isKerneValid);
                if (isKerneValid) {
                    if ($scope.model.mode === "new") {
                        createNotebook();
                    } else {
                        init();
                    }
                }
            }).catch(err => {
                console.log('err in isParamValid', err);
            });

            function createNotebook() {
                let date = new Date();
                $http.post('/api/model/' + $scope.model.name, {
                        APP_ID: $scope.model.name,
                        //USER_ID: $scope.model.user,
                        TYPE_MENU_ID: "01",
                        VIEW_MENU_ID: "06",
                        COMMENT: "heyyyy",
                        FILE_PATH: "FILE_PATH",
                        UPDATED_TIME: date.getTime(),
                        KERNEL: $scope.model.kernel,
                        token: $scope.model.token
                    }).success(data => {
                        if (data.result === 'success') {
                            $scope.model.MODEL_ID = data.model.MODEL_ID;
                            $http.post('/api/appFile/' + data.model.MODEL_NAME, {
                                    userName: data.model.USER_NAME, //$rootScope.getUsername(),
                                    modelTemplate: "自由模式", //$scope.urlcontent.content,
                                    itemType: "expert",
                                    itemID: data.model.MODEL_ID,
                                    token: $scope.model.token
                                }).success(data => {
                                    if (data.result === 'success') {
                                        console.log('success');
                                        init();
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }

            function isValidCodeModel(cell) {
                return cell.cell_type === 'code' && !!cell.code;
            }

            function init() {
                $http.post('/api/jupyter/initNotebook', {
                        modelName: $scope.model.name,
                        token: $scope.model.token
                    }).then(data => {
                        if (data.data.cells) {
                            let tmpArr = data.data.cells;
                            let runIndex = 0;
                            $scope.model.sourceCells = tmpArr;
                            $scope.codeStyle = ['code', 'markdown'];
                            $scope.selectStyle = $scope.codeStyle[0];
                            $scope.cmOption = {
                                lineNumbers: false,
                                indentWithTabs: true,
                                lineWrapping: true,
                                theme: 'default',
                                mode: 'python',
                                styleActiveLine: true,
                                matchBrackets: true
                                    // autofocus: true
                            };
                            tmpArr.forEach(function(cell) {
                                if (cell.outputs) {
                                    if (cell.outputs.data) {
                                        cell.outputs.data.forEach(item => {
                                            if (item['text/html'] !== null) {
                                                item['text/html'] = $sce.trustAsHtml(item['text/html']);
                                            }
                                            if (item['image/png'] !== null) {
                                                item['image/png'] = 'data:image/png;base64,' + item['image/png'];
                                            }
                                            // if (cell.outputs.data['text/html'] !== null) {
                                            //     cell.outputs.data['text/html'] = $sce.trustAsHtml(cell.outputs.data['text/html']);
                                            // }
                                            // if (cell.outputs.data['image/png'] !== null) {
                                            //     cell.outputs.data['image/png'] = 'data:image/png;base64,' + cell.outputs.data['image/png'];
                                            // }
                                        })

                                    }
                                }
                            }, this);
                            $scope.handleGlobalClick = () => {
                                $scope.model.sourceCells.forEach((item, idx) => {
                                    $scope.model.sourceCells[idx].isShow = false;
                                    document.getElementsByClassName('content')[idx].style.background = '#fff';
                                });
                            };
                            $scope.initSelectCell = index => {
                                runIndex = index;
                                $scope.model.sourceCells.forEach((item, idx) => {
                                    document.getElementsByClassName('content')[idx] && (document.getElementsByClassName('content')[idx].style.background = '#fff');
                                });
                                document.getElementsByClassName('content')[index] && (document.getElementsByClassName('content')[index].style.background = '#f3f3f3');
                                if ($scope.model.sourceCells[index].cell_type === 'markdown') {
                                    $scope.selectStyle = $scope.codeStyle[1];
                                } else if ($scope.model.sourceCells[index].cell_type === 'code') {
                                    $scope.selectStyle = $scope.codeStyle[0];
                                }
                            };
                            $scope.initSelectCell(0);
                            $scope.openToolTip = index => {
                                runIndex = index;
                                $scope.model.sourceCells.forEach((item, idx) => {
                                    document.getElementsByClassName('content')[idx] && (document.getElementsByClassName('content')[idx].style.background = '#fff');
                                    item.isShow = false;
                                });
                                $scope.model.sourceCells[index].isShow = true;
                                document.getElementsByClassName('content')[index] && (document.getElementsByClassName('content')[index].style.background = '#f3f3f3');
                                $scope.selectStyle = $scope.model.sourceCells[index].cell_type;
                                $scope.model.sourceCells[index].metadata = {};
                                $scope.model.sourceCells[index].execution_count = '';

                            };
                            $scope.changeSelectType = selectType => {
                                // console.log(111000,selectType);
                                $scope.model.sourceCells[runIndex].cell_type = selectType;
                                if (selectType === 'markdown') {
                                    $scope.model.sourceCells[runIndex].outputs = null;
                                    document.getElementsByClassName('content')[runIndex].style.color = '#666';
                                }
                            };
                            $scope.runCell = () => {
                                if ($scope.model.sourceCells.length === 0) return;
                                if (runIndex >= $scope.model.sourceCells.length) {
                                    runIndex = 0;
                                }
                                if (!isValidCodeModel($scope.model.sourceCells[runIndex])) {
                                    $scope.openToolTip(++runIndex);
                                    return;
                                }
                                $scope.run(runIndex);
                            };

                            $scope.run = index => {
                                if (!isValidCodeModel($scope.model.sourceCells[index])) {
                                    return;
                                }
                                $scope.model.sourceCells[index].isShowCode = true;
                                $scope.model.sourceCells[index].execution_count ++;


                                if (index === $scope.model.sourceCells.length - 1) {
                                    $scope.downAdd(index);
                                }
                                $http.post('/api/jupyter/run', { sourceCodes: $scope.model.sourceCells[index].code, token: $scope.model.token })
                                    .then(data => {
                                        if (data !== null && data !== '') {
                                            let arrTmp = data.data;
                                            $scope.model.sourceCells[index].outputs = [];
                                            arrTmp.forEach(item => {
                                                let tmp = item.result;
                                                tmp.output_type = item.output_type;
                                                $scope.model.sourceCells[index].outputs.push(tmp);
                                            })
                                        }
                                    })
                                    .catch(err => {
                                        console.log('/api/jupyter/run err', err);
                                    });
                            };
                            $scope.runAll = () => {
                                $scope.model.sourceCells.isShowCode = true;
                                const a = $scope.model.sourceCells.length;
                                for (let i = 0; i < a; i++) {
                                    $scope.run(i);
                                }
                            };
                            $scope.upAdd = (index, item) => {
                                $scope.model.sourceCells.splice(index, 0, { cell_type: 'code' });
                                $scope.openToolTip(index + 1);
                            };
                            $scope.downAdd = (index, item) => {
                                $scope.model.sourceCells.splice(index + 1, 0, { cell_type: 'code' });
                                $scope.openToolTip(index + 1);
                            };
                            $scope.codeMirrorDelete = (index, item) => {
                                if (index < 1) {
                                    return;
                                }
                                $scope.model.sourceCells.splice(index, 1);
                            };
                        } else {
                            console.log('ERROR', data, data.data.msg.xhr.responseText);
                        }
                    })
                    .catch(err => {
                        console.log('err', err);
                    })
            }

            $scope.saveAll = () => {
                console.log('$scope.model.MODEL_ID', $scope.model.MODEL_ID);
                $http.post('/api/jupyter/saveNotebook', {
                        modelID: $scope.model.MODEL_ID,
                        newContent: $scope.model.sourceCells,
                        token: $scope.model.token
                    })
                    .then(data => {
                        console.log('data', data);
                        if (data.data.result === 'success') {
                            Notification.success("Saved successfully!");
                        } else {
                            Notification.error('An unexpected error occurred in save file!');
                        }
                    }).catch(() => {
                        Notification.error('Error in /api/jupyter/saveNotebook !');
                    })
            }

        }
    ]);
