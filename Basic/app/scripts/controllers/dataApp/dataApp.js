'use strict';
angular.module('basic')
  .controller('DataAppCtrl', ['createApp', '$rootScope', '$scope', '$filter', 'appList', 'deletePage',
    (createApp, $rootScope, $scope, $filter, appList, deletePage) => {
      $scope.projectType = ['web_common_data_app_02', 'web_common_data_app_03', 'web_common_data_app_04'];
      $scope.listAllApp = [[]];
      let handleSuccess = function (data, status) {
        let listAllApp = data.app;
        console.log("$scope.listAllApp", data.app);
        if (listAllApp !== null && listAllApp !== undefined) {
          listAllApp.forEach(function (app) {
            if (app.USER_NAME !== null && app.USER_NAME !== undefined) {
              app.mode = 'view';
              if (app.USER_NAME === $rootScope.getUsername()) {
                app.mode = 'update';
                $scope.listAllApp[0].push(app);
              }
              ;
              if ($scope.listAllApp[1] === undefined) {
                $scope.listAllApp[1] = [];
              }
              $scope.listAllApp[1].push(app);
            }
          }, this);
          console.log("$scope.listAllApp", $scope.listAllApp)
        }
      };
      $scope.delete = item => {
        deletePage.open(item);
      }

      $scope.thsinum = 0;
      $scope.tabClick = (num) => {
        $scope.thsinum = num;
        refresh(1);
        $scope.grid.total =  $scope.listAllApp[$scope.thsinum].length;
      }


      $scope.grid = {
        page: 1,
        txt: '',
        size: 4,
        total:10
      };
      let refresh = function(page) {
        $(document.body).animate({
          scrollTop: 0
        }, 200);
        let skip = (page - 1) * $scope.grid.size;
        $scope.items = $scope.listAllApp[$scope.thsinum].slice(skip, skip + $scope.grid.size);
      };

      $scope.$watch('grid.page', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          refresh(newVal);
        }
      });

      $scope.applysearch = function (event) {
        if (!$scope.grid.txt) {
          refresh(1);
          $scope.grid.page = 1;
          $scope.grid.total = $scope.listAllApp[$scope.thsinum].length;
          return;
        }else {
          let iarr = [];
          let str = $scope.grid.txt;
          str = str.toLocaleLowerCase();
          angular.forEach($scope.listAllApp[$scope.thsinum], function (item, i) {

            var nstr = item.APP_NAME;
            console.log(nstr);
            nstr = nstr.toLocaleLowerCase();
            if (nstr.indexOf(str) !== -1) {
              iarr.push(item)
            }
            //console.log(repo.instance_data, $scope.grid.txt);
          })
          $scope.items = iarr;
          console.log(' $scope.items', $scope.items);
          $scope.grid.total =  $scope.items
        }

      }

      //dataFactory.getAppList().success(handleSuccess);
      appList.get({}, function (res) {
        console.log('appList', res);
        handleSuccess(res);
      });

      $scope.newApp = function () {
        createApp.open();
        //createModel.open({'title': 'web_common_data_app_layer_01', 'content':'web_common_data_app_layer_02'}, 'appInfo');
      };
    }]);
