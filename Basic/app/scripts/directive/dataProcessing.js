/**
 * Controller
 */

"use strict";

angular.module('basic')
  .controller('DataProcessingCtrl', ['$rootScope', '$scope', '$http', '$sce', 'Notification', '$timeout', '$filter', 'openPreview', function ($rootScope, $scope, $http, $sce, Notification, $timeout, $filter, openPreview) {
    //$scope.data = "DataProcessingCtrl";
    $scope.resultPreview = "Preview";
    //$scope.haveCorr=false;
    $scope.$on('tab', function (el, num) {
      console.log("num:", num);
      //var haveCorr=false;
      if (num === 2) {
        $http.get('/api/jupyter/step2').success(function (data) {
          //去掉最外层单引号,否则不符合json格式化要求
          data = data.result.substring(1, data.result.length - 1);
          console.log("step2---------result--》",JSON.parse(data).varName)
          // window.alert(typeof(JSON.parse(data).highCorr)=="undefined");
          if(typeof(JSON.parse(data).highCorr)!=="undefined"){
            //$scope.haveCorr=true;
            $scope.dataHighCorr = JSON.parse(data).highCorr;
            console.log("$scope.dataHighCorr", $scope.dataHighCorr)
          }else{
            //$scope.haveCorr=false;
            $scope.getImputer();

          }


        });


      }
    });
    console.log("$scope.haveCorr:", $scope.haveCorr);

    //获取空值比率
    $scope.getImputer = function () {
      var dataDel = "deleteCols=" + "\"" + "\"";
      console.log("dataDel:", dataDel);
      //数据预处理请求：删除选择的相关特征列
      $http.post('/api/jupyter/step3/', {deleteCols: dataDel}).success(function (data) {
        data = data.result.substring(1, data.result.length - 1);
        console.log("dataImputer------------>", data)
        if(typeof(JSON.parse(data).p_missing)!=="undefined"){
          data = JSON.parse(data).p_missing
          var jsonObj = [];
          for (var key in data) {
            var arr =
              {
                "varName": key,
                "imputerRatio": data[key],
                "status": ""
              }
            jsonObj.push(arr)
          }
          $scope.dataImputer = jsonObj;
          document.getElementById("divCorr").style.display = "none";
          document.getElementById("divImputer").style.display = "block";
          console.log("$scope.dataImputer------------>", $scope.dataImputer);
        }else {
          $scope.getStandard();
          document.getElementById("divCorr").style.display = "none";
        }

      });
    }
    //获取标准差
    $scope.getStandard = function () {
      var dataImputer = 'col_input={}'
      $http.post('/api/jupyter/step4/', {imputerCols: dataImputer}).success(function (data) {
        data = data.result.substring(1, data.result.length - 1);
        console.log("dataScalar------------>", data)
        data = JSON.parse(data)
        var jsonObj = [];
        for (var key in data.std) {
          var mini_histogram = data.mini_histogram[key];
          //如果路径中有反斜杠要删除掉
          if(mini_histogram){
            mini_histogram = mini_histogram.replace(/[\\]/g, '');
          }
          console.log("mini_hist=====", mini_histogram);
          var arr =
            {
              "varName": key,
              "stdValue": data.std[key],
              "miniHistogram": mini_histogram,
              "status": ""
            }
          jsonObj.push(arr)
        }
        $scope.dataScalar = jsonObj;
        document.getElementById("divScalar").style.display = "block";
        console.log("$scope.dataScalar------------>", $scope.dataScalar)

      });

    }
    $scope.preview = function () {
      if ($scope.resultPreview) {
        openPreview.open($scope.resultPreview);
      }
    };

    $scope.apply = function (newDataDel, newDataImputer, newDataScalar) {
      var dataDel = "", dataImputer = "", dataScalar = "";
      // "deleteCols='petal length (cm)'"
      console.log("newDataDel=====",newDataDel);
      console.log("scope.datadel===",$scope.dataHighCorr)
      if (newDataDel) {
        newDataDel.forEach(function (el) {
          console.log("el", el, "dataDel:", dataDel);
          //if (!el.varNameStatus || el.varNameStatus!==true){//choose the features to reserve
          if (el.varNameStatus == true) { // choose the features to delete
            console.log("LOOOOKKKK!!!!dataDel:", dataDel);
            if (dataDel !== "") {
              dataDel = dataDel + ","
            }
            dataDel = dataDel + el.varName;
          }
          //if (!el.corrVarNameStatus || el.corrVarNameStatus!==true){
          if (el.corrVarNameStatus == true) {
            console.log("LOOOOKKKK!!!!dataDel:", dataDel);
            if (dataDel !== "") {
              dataDel = dataDel + ","
            }
            dataDel = dataDel + el.corrVarName;
          }
        }, this);
        if (dataDel === "") {
          dataDel = "''"
        }
        dataDel = "deleteCols=" + "\"" + dataDel + "\"";
        console.log("dataDel:", dataDel);
        //数据预处理请求：删除选择的相关特征列
        $http.post('/api/jupyter/step3/', {deleteCols: dataDel}).success(function (data) {
          $timeout(function () {
            data = data.result.substring(1, data.result.length - 1);
            console.log("dataImputer------------>", data)
            if(typeof(JSON.parse(data).p_missing)!=="undefined"){
              data = JSON.parse(data).p_missing
              var jsonObj = [];
              for (var key in data) {
                var arr =
                  {
                    "varName": key,
                    "imputerRatio": data[key],
                    "status": ""
                  }
                jsonObj.push(arr)
              }
              $scope.dataImputer = jsonObj;
              document.getElementById("divCorr").style.display = "block";
              document.getElementById("divImputer").style.display = "block";
              console.log("$scope.dataImputer------------>", $scope.dataImputer);
            }else{
              $scope.getStandard();
            }
            Notification.success('Success!!!');
          }, 1000);
        });
      }
      ;
      //"imputerCols={'sepal width (cm)':'mean'}"
      if (newDataImputer) {
        //console.log("newDataImputer :", newDataImputer);
        newDataImputer.forEach(function (el) {
          if (el.status) {
            if (dataImputer !== "") {
              dataImputer = dataImputer + ","
            }
            dataImputer = dataImputer + "'" + el.varName + "':'" + el.status + "'";
          }
        }, this);
        dataImputer = 'col_input={' + dataImputer + "}"
        console.log("dataImputer:", dataImputer);
        //空值处理并获取标准差
        $http.post('/api/jupyter/step4/', {imputerCols: dataImputer}).success(function (data) {
          $timeout(function () {
            data = data.result.substring(1, data.result.length - 1);
            console.log("dataScalar------------>", data)
            data = JSON.parse(data)
            var jsonObj = [];
            for (var key in data.std) {
              var mini_histogram = data.mini_histogram[key];
              //如果路径中有反斜杠要删除掉
              if(mini_histogram){
                mini_histogram = mini_histogram.replace(/[\\]/g, '');
              }
              console.log("mini_hist=====", mini_histogram);
              var arr =
                {
                  "varName": key,
                  "stdValue": data.std[key],
                  "miniHistogram": mini_histogram,
                  "status": ""
                }
              jsonObj.push(arr)
            }
            $scope.dataScalar = jsonObj;
            document.getElementById("divScalar").style.display = "block";
            console.log("$scope.dataScalar------------>", $scope.dataScalar)
            Notification.success('Success!!!');
          }, 1000);
        });
        //
      }
      ;
      // "standardCols={'sepal length (cm)':'Standarded'}"
      if (newDataScalar) {
        //console.log("newDataScalar :", newDataScalar);
        newDataScalar.forEach(function (el) {
          if (el.status) {
            if (dataScalar !== "") {
              dataScalar = dataScalar + ","
            }
            dataScalar = dataScalar + "'" + el.varName + "':'" + el.status + "'";
          }
        }, this);
        dataScalar = 'col_input ={' + dataScalar + "}"
        console.log("dataScalar:", dataScalar);
        //正则化
        $http.post('/api/jupyter/step5/', {standardCols: dataScalar}).success(function (data) {
          $timeout(function () {
            console.log("preview-------------->", data);
            $scope.resultPreview = $sce.trustAsHtml(data.result.content.data["text/html"]);
            //openPreview.open($scope.resultPreview);
            Notification.success('Success!!!');
          }, 1000);
        });
      }
      ;

    };

  }])
  .directive('processing', function () {
    return {
      templateUrl: 'views/directive/dataProcessing.html'
    };
  });
