'use strict';
angular.module('basic')
  .controller('ExpertCtrlTwo', ['copyName', '$cookies', '$sce', '$location', '$rootScope', '$scope', '$http',
    function (copyName, $cookies, $sce, $location, $rootScope, $scope, $http) {
      $scope.model = $location.search();
      $scope.model.mode = $location.path().split('/')[2];
      console.log('$scope.model', $scope.model);
      //validation
      function isParamValid() {
        return new Promise((resolve, reject) => {
          //check kernel
          $http.get('/api/jupyter/kernels', {
            params: {token: $scope.model.token}
          }).success(data => {
            console.log('$scope.model', $scope.model)
            let val = false;
            if (data.msg = 'success') {
              let tmpArr = [];
              data.kernellist.kernelspecs.forEach(kernel => {
                tmpArr.push(kernel.name);
              });
              // console.log('tmpArr', tmpArr, '$scope.model.kernel', $scope.model.kernel, tmpArr.includes($scope.model.kernel))
              if (tmpArr.indexOf($scope.model.kernel) > -1) {
                //check user
                // console.log("11111");
                $http.get('/api/jupyter/projects/' + $scope.model.name, {
                  params: {token: $scope.model.token}
                })
                  .success(project => {
                    // console.log('project:', project);
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
                        }
                      } else {
                        if ($scope.model.mode === 'new') {
                          val = true;
                          resolve(val);
                        } else {
                          console.log('project with name:', $scope.model.name, 'do not exists');
                          resolve(val);
                        }
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
              console.log('data', data.msg);
              resolve(val);
            }
          })
            .catch(err => {
              console.log('err', err);
              reject(err);
            });
        });
      }

      isParamValid().then(isKerneValid => {
        console.log('isKerneValid', isKerneValid);
        let done;
        if (isKerneValid) {
          if ($scope.model.mode === 'new') {
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
        })
          .success(data => {
            if (data.result === 'success') {
              console.log(data);
              $scope.model.MODEL_ID = data.model.MODEL_ID;
              $http.post('/api/appFile/' + data.model.MODEL_NAME, {
                userName: data.model.USER_NAME, //$rootScope.getUsername(),
                modelTemplate: "自由模式", //$scope.urlcontent.content,
                itemType: "expert",
                itemID: data.model.MODEL_ID,
                token: $scope.model.token
              })
                .success(data => {
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
        })
          .then(data => {
            // console.log('data', data)
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
                matchBrackets: true,
                autofocus: true
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
                $http.post('/api/jupyter/run', {
                  sourceCodes: $scope.model.sourceCells[runIndex].code,
                  token: $scope.model.token
                })
                  .then(data => {
                    if (data) {
                      $scope.model.sourceCells[runIndex].isShowCode = true;
                      let tmp = data.data.result;
                      tmp.output_type = data.data.type;
                      $scope.model.sourceCells[runIndex].outputs = [tmp];
                      if (runIndex === $scope.model.sourceCells.length - 1) {
                        return;
                      }
                      $scope.openToolTip(++runIndex);
                    }
                  }).catch(err => {
                  console.log('dataErr', err);
                })
              };
              $scope.run = (index) => {
                if (!isValidCodeModel($scope.model.sourceCells[index])) {
                  return;
                }
                $scope.model.sourceCells[index].isShowCode = true;
                $scope.model.sourceCells[index].execution_count = $scope.model.sourceCells[index].execution_count + 1;
                $scope.model.sourceCells.splice(index + 1, 0, {cell_type: 'code'});
                $http.post('/api/jupyter/run', {
                  sourceCodes: $scope.model.sourceCells[index].code,
                  token: $scope.model.token
                })
                  .then(data => {
                    // console.log('-------->', data);
                    if (data !== null && data !== '') {
                      let tmp = data.data.result;
                      tmp.output_type = data.data.type;
                      $scope.model.sourceCells[index].outputs = [tmp];
                      if (index === $scope.model.sourceCells.length - 1) {
                        return;
                      }
                      $scope.openToolTip(++index);
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
                  $http.post('/api/jupyter/run', {sourceCodes: cell.code, token: $scope.model.token})
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
                $scope.openToolTip(index);
              };
              $scope.downAdd = (index, item) => {
                $scope.model.sourceCells.splice(index + 1, 0, {cell_type: 'code'});
                $scope.openToolTip(index + 1);

              };
              $scope.codeMirrorDelete = (index, item) => {
                if (index < 1) {
                  return;
                }
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
      }

      $scope.saveAll = function () {
        console.log('$scope.model.MODEL_ID', $scope.model.MODEL_ID);

        $http.post('/api/jupyter/saveNotebook', {
          modelID: $scope.model.MODEL_ID,
          newContent: $scope.model.sourceCells,
          token: $scope.model.token
        })
          .then(data => {
            if (data) {
              console.log('data', data)
            }
          })
      }

    }
  ]);
