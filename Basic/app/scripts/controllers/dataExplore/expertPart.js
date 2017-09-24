'use strict';
angular.module('basic')
  .controller('ExpertCtrl', ['copyName', '$cookies', '$sce', '$location', '$rootScope', '$scope', '$http',
    function (copyName, $cookies, $sce, $location, $rootScope, $scope, $http) {
      $scope.model = {
        // sourceCells: {
        //     execution_count: 0
        // }
      };
      $scope.init = function () {
        $http.post('/api/jupyter/initNotebook', {
          // params: {}
        })
          .then(data => {
            console.log('----hghghhghh--->', data);
            if (data.data.cells) {
              // document.getElementsByClassName('CodeMirror')[$index].style.height = '100px';
              // document.getElementsByClassName('ipynb-left')[$index].style.height = document.getElementsByClassName('CodeMirror')[$index].style.height;

              let tmpArr = data.data.cells;
              tmpArr.forEach(function (cell) {
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
              let runIndex = 0;
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
                changestatus: '选择语言',
                status: ['Python', 'R'],
              };
              $scope.kernels = {
                changestatus: '选择运行环境',
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
                  document.getElementsByClassName(' CodeMirror')[idx].style.borderColor = '#fff';
                });
              };
              $scope.openToolTip = ($index) => {
                runIndex = $index;
                $scope.model.sourceCells.forEach((item, idx) => {
                  document.getElementsByClassName('CodeMirror')[idx].style.borderColor = '#fff';
                  item.isShow = false;
                });
                $scope.model.sourceCells[$index].isShow = true;
                $scope.model.sourceCells[$index].execution_count = $scope.model.sourceCells[$index].execution_count + 1;
                document.getElementsByClassName(' CodeMirror')[$index].style.borderColor = '#CFF3D4';
                console.log('openToolTip', $scope.model.sourceCells);
                if($scope.isShow == true){
                  $scope.model.sourceCells[$index].isShow = true;
                  $scope.model.sourceCells[$index].execution_count = $scope.model.sourceCells[$index].execution_count + 1;
                  document.getElementsByClassName(' CodeMirror')[$index].style.borderColor = '#CFF3D4';
                }
              };

              $scope.runCell = () => {
                console.log('runIndex--->', runIndex);
                $http.post('/api/jupyter/run', {sourceCodes: $scope.model.sourceCells[runIndex].code})
                  .then(data => {
                    if (data) {
                      $scope.model.sourceCells[runIndex].isShowCode = true;
                      let tmp = data.data.result;
                      tmp.output_type = data.data.type;
                      $scope.model.sourceCells[runIndex].outputs = [tmp];
                      runIndex++;
                    }
                  })
              };

              $scope.run = function (index) {
                $scope.model.sourceCells[index].isShowCode = true;
                $scope.model.sourceCells[index].execution_count = $scope.model.sourceCells[index].execution_count + 1;
                //$scope.model.sourceCells[index].result = 1;
                // console.log($scope.model.sourceCells[index]);
                $http.post('/api/jupyter/run', {sourceCodes: $scope.model.sourceCells[index].code})
                  .then(data => {
                    console.log('-------->',data);
                    if (data !== null && data !== '') {
                      console.log("$scope.model.sourceCells[index].outputs",
                        $scope.model.sourceCells[index].outputs);
                      let tmp = data.data.result;
                      tmp.output_type = data.data.type;
                      $scope.model.sourceCells[index].outputs = [tmp];
                      //$scope.model.sourceCells[index].outputs.output_type = data.data.type;
                      // console.log("$scope.model.sourceCells[index].outputs", $scope.model.sourceCells[index].outputs);
                    }
                  })
              };
              $scope.runAll = function () {
                console.log("runAll");
                $scope.model.sourceCells.isShowCode = true;
                let tmpArr = $scope.model.sourceCells;
                tmpArr.forEach(function (cell) {
                  cell.isShowCode = true;
                  cell.execution_count = cell.execution_count + 1;
                  //$scope.model.sourceCells[index].result = 1;
                  // console.log('cell', cell);
                  $http.post('/api/jupyter/run', {sourceCodes: cell.code})
                    .then(data => {
                      if (data !== null && data !== '') {
                        // console.log("cell.outputs", cell.outputs);
                        let tmp = data.data.result;
                        tmp.output_type = data.data.type;
                        cell.outputs = [tmp];
                        //$scope.model.sourceCells[index].outputs.output_type = data.data.type;
                        // console.log("$scope.model.sourceCells[index].outputs", cell.outputs);
                      }
                    })
                });
                $scope.model.sourceCells = tmpArr;
              };
              $scope.upAdd = (index, item) => {
                $scope.model.sourceCells.splice(index, 0, {cell_type :'code'});
                // console.log('0011upupup', item);
              };
              $scope.downAdd = (index, item) => {
                $scope.model.sourceCells.splice(index + 1, 0, {cell_type :'code'});
                // console.log('0012122downdown')
              };
              $scope.codeMirrorDelete = (index, item) => {
                $scope.model.sourceCells.splice(index, 1);
                // console.log('0012122delete')
              };

              $scope.difUser = false;
              $scope.openProject = function () {
                copyName.open(modelName, modelType);
              }
            }
          })
          .catch(err => {
            console.log('err', err);
          })
      };
      $scope.init();
      $scope.saveAll = function () {
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
