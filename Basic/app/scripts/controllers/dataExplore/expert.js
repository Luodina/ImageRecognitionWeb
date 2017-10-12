'use strict';
angular.module('basic')
  .controller('ExpertCtrlTwo', ['copyName', '$cookies', '$sce', '$location', '$rootScope', '$scope', '$http',
    function (copyName, $cookies, $sce, $location, $rootScope, $scope, $http) {

      $scope.model = $location.search();
      console.log($scope.model )
      function createNotebook() {
        if ($scope.model.name) {
          //check in DB APP
          //$rootScope.modelAppName = $scope.model.name;
          let date = new Date();
          $http.get('/api/model/' + $scope.model.name).success(data => {
            console.log(data);
            if (data.result !== null) {
              console.log("smth went wrong");
            } else {
              $http.post('/api/model/' + $scope.model.name, {
                APP_ID: $scope.model.name,
                USER_ID: $scope.model.user,
                TYPE_MENU_ID: "01",
                VIEW_MENU_ID: "06",
                COMMENT: "heyyyy",
                FILE_PATH: "FILE_PATH",
                UPDATED_TIME: date.getTime(),
                KERNEL: $scope.model.kernel
              })
                .success(data => {
                  if (data.result === 'success') {
                    console.log(data);
                    $http.post('/api/appFile/' + data.model.MODEL_NAME, {
                      userName: data.model.USER_NAME,//$rootScope.getUsername(),
                      modelTemplate: "自由模式",//$scope.urlcontent.content,
                      itemType: "expert",
                      itemID: data.model.MODEL_ID
                    })
                      .success(data => {
                        if (data.result === 'success') {
                          console.log('success');
                          init();
                          // $rootScope.exploreName = 'modelType_06';
                          // $rootScope.modelExpertName = $scope.model.name;
                          // $rootScope.nowActive = 6;
                          // $uibModalInstance.close({
                          //   modelTemplate: $scope.urlcontent.content,
                          //   modelName: $scope.model.name
                          // });
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
          });
        }
      }
      createNotebook();

      //function initNotebook() {
        function isValidCodeModel(cell) {
          return cell.cell_type === 'code' && !!cell.code;
        }
        function init() {
          $http.post('/api/jupyter/initNotebook', {
            modelName: $scope.model.name
          })
            .then(data => {
              console.log('data',data)
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
                };
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
                $scope.handleGlobalClick = () => {
                  $scope.model.sourceCells.forEach((item, idx) => {
                    $scope.model.sourceCells[idx].isShow = false;
                    document.getElementsByClassName('content')[idx].style.background = '#fff';
                  });
                };
                $scope.initSelectCell = (index) => {
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
                $scope.openToolTip = (index) => {
                  runIndex = index;
                  $scope.model.sourceCells.forEach((item, idx) => {
                    document.getElementsByClassName('content')[idx] && (document.getElementsByClassName('content')[idx].style.background = '#fff');
                    item.isShow = false;
                  });
                  $scope.model.sourceCells[index].isShow = true;
                  document.getElementsByClassName('content')[index] && (document.getElementsByClassName('content')[index].style.background = '#f3f3f3');
                  $scope.selectStyle = $scope.model.sourceCells[index].cell_type;
                };
                $scope.changeSelectType = (selectType) => {
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
                  $http.post('/api/jupyter/run', {sourceCodes: $scope.model.sourceCells[runIndex].code})
                    .then(data => {
                      // console.log('runIndexdatadatadata--->', data);
                      if (data) {
                        $scope.model.sourceCells[runIndex].isShowCode = true;
                        let tmp = data.data.result;
                        tmp.output_type = data.data.type;
                        // tmp.traceback = tmp.traceback.map(item => {
                        //   return item.replace(/\u001b\[\d{1,2}m?(;\d{1,2}m?)?/gi, '');
                        // })
                        // console.warn(tmp.traceback)
                        $scope.model.sourceCells[runIndex].outputs = [tmp];
                        $scope.openToolTip(++runIndex);
                        // console.log('runIndex--->', runIndex);
                      }
                    }).catch(err => {
                    console.log('dataErr', err);
                  })
                }

                $scope.run = function (index) {
                  if (!isValidCodeModel($scope.model.sourceCells[index])) {
                    return;
                  }
                  $scope.model.sourceCells[index].isShowCode = true;
                  $scope.model.sourceCells[index].execution_count = $scope.model.sourceCells[index].execution_count + 1;
                  $http.post('/api/jupyter/run', {sourceCodes: $scope.model.sourceCells[index].code})
                    .then(data => {
                      // console.log('-------->', data);
                      if (data !== null && data !== '') {
                        let tmp = data.data.result;
                        tmp.output_type = data.data.type;
                        $scope.model.sourceCells[index].outputs = [tmp];
                      }
                    })
                };
                $scope.runAll = function () {
                  // console.log("runAll");
                  $scope.model.sourceCells.isShowCode = true;
                  $scope.model.sourceCells.forEach(function (cell) {
                    if (!isValidCodeModel(cell)) return;
                    cell.isShowCode = true;
                    cell.execution_count = cell.execution_count + 1;
                    $http.post('/api/jupyter/run', {sourceCodes: cell.code})
                      .then(data => {
                        if (data) {
                          let tmp = data.data.result;
                          tmp.output_type = data.data.type;
                          cell.outputs = [tmp];
                        }
                      })
                  });
                };
                $scope.upAdd = (index, item) => {
                  $scope.model.sourceCells.splice(index, 0, {cell_type: 'code'});
                };
                $scope.downAdd = (index, item) => {
                  $scope.model.sourceCells.splice(index + 1, 0, {cell_type: 'code'});
                };
                $scope.codeMirrorDelete = (index, item) => {
                  $scope.model.sourceCells.splice(index, 1);
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

        $scope.saveAll = function () {
          $http.post('/api/jupyter/saveNotebook', {
            newContent: $scope.model.sourceCells
          })
            .then(data => {
              if (data) {
                console.log('data', data)
              }
            })
        }
      // }
      // initNotebook();
    }
  ]);
