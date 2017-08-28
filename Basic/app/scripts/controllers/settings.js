"use strict";
angular.module('basic')
    .controller('SettingsCtrl', ['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
        $scope.msg = "SettingsCtrl";
        // $http.get('/api/getsmth').success(function(data) {
        //     $scope.msg = data.msg;
        //     console.log("$scope.msg:", data);
        // });
        console.log('CodeMirror', CodeMirror)
            //document.getElementById("code").value = 'hehe';
            //CodeMirror.modes = "python";
        let editor = CodeMirror.fromTextArea(document.getElementById("code"), {
            lineNumbers: true,
            smartIndent: true,
            tabSize: 2,
            mode: "python",
            theme: "duotone-light"
        });

    }]);