/**
 * Created by JiYi on 17/8/9.
 */
'use strict';
angular.module('basic')
  .controller('ExpertCtrl', ['copyName','$cookies', '$sce', '$location', '$rootScope', '$scope', '$http',
    function (copyName,$cookies, $sce, $location, $rootScope, $scope, $http) {
      $scope.init = function () {
        $scope.difUser = false;
        $scope.openProject=function () {
          copyName.open();
        }
        // let savePath = $location.search()['savePath'];
        let modelTemplate = $location.search()['modelTemplate'];
        let modelType = $location.search()['type'];
        console.log('eeeeeeeee', modelTemplate)
        let path_list = $location.path().split(/[\s/]+/);
        console.log('path_list', path_list);
        let modelName = path_list.pop();
        let model = path_list.pop();
        console.log('modelNm11111111', modelName, model, modelType);
        $scope.notebookPath = '';
        let ipyPath = '';
        let typeMenu = '00';
        let appName;
        let path;
        if (model === 'new') {

          $http.get('/api/expert/pathNoteBook', {
            params: {
              modelTemplate: modelTemplate,
              modelName: modelName,
              modelType: modelType
            }
          }).then(function (response) {
            if (modelType === 'explore') {
              typeMenu = '01';
              path = modelName;
            }
            if (modelType !== 'explore') {
              appName = modelType;
              typeMenu = '00';
              path = modelType;
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
            $http.post('/api/model/new', savaData).success(function (data) {
              console.log('Expert MODE save:', data.msg);
            });
          });
        } else if (model === 'update' || model === 'view') {
          console.log('chooseModelUpdate', model)
          $scope.isShow = true;

          let type = path_list[1];
          let url = '/api/expert/notebook/open/' + modelName + '/';

          if (type == 'app') {
            //TODO app中点击文件过来的url是 app/notebook/APP_ID/FILE
            url += model;
          } else {
            url += 'explore'
          }

          $http.get(url, {
            params: {
              userName: $cookies.get('username')
            }
          })
            .success(data => {
              console.log('dataModel===update', data);
              if (data !== null && data !== undefined) {
                if (data.difUser) {
                  $scope.difUser = true;
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
      $scope.init();
    }]);
