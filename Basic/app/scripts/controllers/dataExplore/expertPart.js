'use strict';
angular.module('basic')
    .controller('ExpertCtrl', ['copyName', '$cookies', '$sce', '$location', '$rootScope', '$scope', '$http',
        function(copyName, $cookies, $sce, $location, $rootScope, $scope, $http) {
            $scope.init = function() {
                $http.post('/api/jupyter/initNotebook', {
                        params: {}
                    })
                    .then(data => {
                        if (data.data.cells !== null && data.data.cells !== '') {
                            let tmpArr = data.data.cells;
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
                            $scope.model = {};

                            $scope.model.sourceCells = tmpArr;

                            console.log('$scope.model.sourceCells', $scope.model.sourceCells);

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
                                //$scope.model.sourceCells[index].result = 1;
                                console.log($scope.model.sourceCells[index]);
                                $http.post('/api/jupyter/run', { sourceCodes: $scope.model.sourceCells[index].code })
                                    .then(data => {
                                        if (data !== null && data !== '') {
                                            console.log(data);
                                        }
                                    })
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

        }
    ]);