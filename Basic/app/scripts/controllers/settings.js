'use strict';
angular.module('basic')
  .controller('SettingsCtrl', ['$scope', function ($scope) {
    $scope.msg = 'SettingsCtrl';
    // $http.get('/api/getsmth').success(function(data) {
    //     $scope.msg = data.msg;
    //     console.log("$scope.msg:", data);
    // });
    // console.log('CodeMirror', CodeMirror)
    //document.getElementById("code").value = 'hehe';
    // CodeMirror.modes = "python";
    let tmpArr = ['print（"1");', 'print（"2");'];
    $scope.model = {};
    $scope.model.sourceCells = tmpArr;
    // $scope.sourceCells = tmpArr;

    console.log(tmpArr);
    console.log($scope.model.sourceCells);

    $scope.modes = ['Scheme', 'XML', 'Javascript'];
    $scope.mode = $scope.modes[0];
    $scope.cmOption = {
      lineNumbers: false,
      indentWithTabs: true,
      lineWrapping: true,
      theme: 'duotone-light'
    };
  }]);


