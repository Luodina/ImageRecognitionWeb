'use strict';
angular.module('basic')
    .controller('ExpertCtrl', ['copyName', '$cookies', '$sce', '$location', '$rootScope', '$scope', '$http',
        function(copyName, $cookies, $sce, $location, $rootScope, $scope, $http) {
            $scope.model = {
                // sourceCells: {
                //     execution_count: 0
                // }
            };
            $scope.init = function() {
                $http.post('/api/jupyter/initNotebook', {
                        params: {}
                    })
                    .then(data => {
                        if (data.data.cells !== null && data.data.cells !== '') {
                            let tmpArr = data.data.cells;
                            tmpArr.forEach(function(cell) {
                                if (cell.outputs) {
                                    if (cell.outputs.data) {
                                        if (cell.outputs.data['text/html'] !== null) {
                                            cell.outputs.data['text/html'] = $sce.trustAsHtml(cell.outputs.data['text/html']);
                                        }
                                        if (cell.outputs.data['image/png'] !== null) {
                                            cell.outputs.data['image/png'] = 'data:image/png;base64,' + cell.outputs.data['image/png'];
                                        }

                                    }
                                }
                            }, this);
                            $scope.model.sourceCells = tmpArr;
                            console.log('data', data.data.cells);
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

                            $scope.cmOption = {
                                lineNumbers: false,
                                indentWithTabs: true,
                                lineWrapping: true,
                                theme: 'default',
                                mode: 'Python'
                            };
                            $scope.handleGlobalClick = () => {
                              $scope.model.sourceCells.forEach((item, idx) => {
                                $scope.model.sourceCells[idx].isShow = false;
                                document.getElementsByClassName(' CodeMirror')[idx].style.background='#fff';

                              });
                            };
                            $scope.openToolTip = ($index) => {

                              $scope.model.sourceCells.forEach((item ,idx)=> {
                                document.getElementsByClassName(' CodeMirror')[idx].style.background='#fff';
                                item.isShow = false;
                              });
                                $scope.model.sourceCells[$index].isShow = true;
                              document.getElementsByClassName(' CodeMirror')[$index].style.background='#999';

                              console.log('openToolTip', $scope.model.sourceCells);
                            };
                            $scope.aaa = ($index) => {
                                $scope.model.sourceCells[$index].isShow = false;
                                console.log('sddsds', $scope.model.sourceCells);
                            };
                            $scope.run = function(index) {
                                $scope.model.sourceCells[index].isShowCode = true;
                                $scope.model.sourceCells[index].execution_count = $scope.model.sourceCells[index].execution_count + 1;
                                //$scope.model.sourceCells[index].result = 1;
                                console.log($scope.model.sourceCells[index]);
                                $http.post('/api/jupyter/run', { sourceCodes: $scope.model.sourceCells[index].code })
                                    .then(data => {
                                        if (data !== null && data !== '') {
                                            console.log("$scope.model.sourceCells[index].outputs",
                                                $scope.model.sourceCells[index].outputs);
                                            let tmp = data.data.result;
                                            tmp.output_type = data.data.type;
                                            $scope.model.sourceCells[index].outputs = [tmp];
                                            //$scope.model.sourceCells[index].outputs.output_type = data.data.type;
                                            console.log("$scope.model.sourceCells[index].outputs",
                                                $scope.model.sourceCells[index].outputs);
                                        }
                                    })
                            };
                            $scope.runAll = function() {
                                console.log("runAll")
                                let tmpArr = $scope.model.sourceCells;
                                tmpArr.forEach(function(cell) {
                                    cell.isShowCode = true;
                                    cell.execution_count = cell.execution_count + 1;
                                    //$scope.model.sourceCells[index].result = 1;
                                    console.log('cell', cell);
                                    $http.post('/api/jupyter/run', { sourceCodes: cell.code })
                                        .then(data => {
                                            if (data !== null && data !== '') {
                                                console.log("cell.outputs",
                                                    cell.outputs);
                                                let tmp = data.data.result;
                                                tmp.output_type = data.data.type;
                                                cell.outputs = [tmp];
                                                //$scope.model.sourceCells[index].outputs.output_type = data.data.type;
                                                console.log("$scope.model.sourceCells[index].outputs",
                                                    cell.outputs);
                                            }
                                        })
                                });
                                $scope.model.sourceCells = tmpArr;
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
                        }
                    })
                    .catch(err => { console.log('err', err); })
            };
            $scope.init();
            $scope.saveAll = function() {
                $http.post('/api/jupyter/saveNotebook', {
                        newContent: $scope.model.sourceCells
                    })
                    .then(data => {
                        if (data !== null && data !== '') {
                            console.log('data', data)
                        }
                    })
            }

        }
    ]);
