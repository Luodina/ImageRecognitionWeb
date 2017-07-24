/**
 * Controller
 */

"use strict";

angular.module('basic')
  .controller('DataProcessingCtrl',['$rootScope','$location','$scope','$http','$sce','Notification', '$timeout', '$filter','openPreview', function ($rootScope,$location, $scope, $http, $sce, Notification, $timeout, $filter,openPreview) {
  //$scope.data = "DataProcessingCtrl";
  $scope.resultPreview = "Preview";
  //$scope.model = {};
  $scope.person = {};
  $scope.isShowImputer = true;
  $scope.isShowScalar = true;
  $scope.isNew = false;

    $scope.$on('model',function(el, dataModel){
      $scope.model = dataModel.model;
      $scope.notebook = dataModel.notebook;
      $scope.mode = dataModel.mode;
      if ($scope.mode !== 'new'&& $scope.notebook.outputs){
        //1.get highCorr
        console.log("$scope.notebook.outputs.length---------------->",$scope.notebook.outputs.length)
        let highCorrRes = $scope.notebook.outputs[2];
        if(highCorrRes){
          let data =highCorrRes["text/plain"][0]=="'"?highCorrRes["text/plain"]:highCorrRes["text/plain"][0];
          data = data.substring(1, data.length - 1);
          if(typeof(JSON.parse(data).highCorr)!=="undefined"){
            $scope.dataHighCorr = JSON.parse(data).highCorr;
          }
          //which one checked  "deleteCols="petal width (cm)"
          //var highCorrSource=$scope.notebook.sources[3][1];
          let highCorrSource=null;
          if(typeof($scope.notebook.sources[3])=='string'){
            let arr = $scope.notebook.sources[3].split("\n")
            highCorrSource = arr[1]
          }else{
            highCorrSource = $scope.notebook.sources[3][1];
          }
          let corrChecked =highCorrSource.substring(12,highCorrSource.length-2).split(",");
          if($scope.dataHighCorr){
            for(let i =0;i<$scope.dataHighCorr.length;i++){
              for(let j = 0;j<corrChecked.length;j++){
                if($scope.dataHighCorr[i].varName=corrChecked[j]){
                  $scope.dataHighCorr[i].varNameStatus=true;
                }

              }
            }
          }
        }
        //2.get imputer
        let imputerRes = $scope.notebook.outputs[4];
        if(imputerRes){
          let data = imputerRes["text/plain"][0]=="'"?imputerRes["text/plain"]:imputerRes["text/plain"][0];
          data = data.substring(1, data.length - 1);
          if(typeof(JSON.parse(data).p_missing)!=="undefined"){
            data = JSON.parse(data).p_missing
            let jsonObj = [];
            for (let key in data) {
              let arr =
                {
                  "varName": key,
                  "imputerRatio": data[key],
                  "status": ""
                }
              jsonObj.push(arr)
            }
            $scope.dataImputer = jsonObj;
            //document.getElementById("divCorr").style.display = "none";
            document.getElementById("divImputer").style.display = "block";
          }
          //imputer check   col_input={'petal length (cm)':'mean','sepal length (cm)':'median','sepal width (cm)':'min'}
          let imputerSource=null;
          if(typeof($scope.notebook.sources[5])=='string'){
            let arr = $scope.notebook.sources[5].split("\n")
            imputerSource = arr[4]
          }else{
            imputerSource = $scope.notebook.sources[5][4];
          }
          let imputerChecked =imputerSource.substring(10,imputerSource.length);
          let imputerJson = eval('('+imputerChecked+')');
          //var imputerJson = JSON.parse(imputerChecked);
          if($scope.dataImputer){
            for(let i =0;i<$scope.dataImputer.length;i++){
              let varName = $scope.dataImputer[i].varName;
              if(imputerJson[varName]){
                $scope.dataImputer[i].status=imputerJson[varName]
              }
            }
          }

        }

        //3.get dataScalar
        let scalaRes = $scope.notebook.outputs[6];
        if(scalaRes){
          //var data = scalaRes["text/plain"][0];
          let data = scalaRes["text/plain"][0]=="'"?scalaRes["text/plain"]:scalaRes["text/plain"][0];
          data = data.substring(1, data.length - 1);
          data = JSON.parse(data)
          let jsonObj = [];
          for (let key in data.std) {
            let mini_histogram = data.mini_histogram[key];
            //如果路径中有反斜杠要删除掉
            if(mini_histogram){
              mini_histogram = mini_histogram.replace(/[\\]/g, '');
            }
            let arr =
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

          //scalar check col_input ={'Unnamed: 0':'Standarded','petal length (cm)':'Robust','sepal length (cm)':'MaxAbs','sepal width (cm)':'Standarded'}
          let scalarSource=null;
          if(typeof($scope.notebook.sources[7])=='string'){
            let arr = $scope.notebook.sources[7].split("\n");
            scalarSource = arr[1];
          }else {
            scalarSource =$scope.notebook.sources[7][1];
          }
          console.log("-------scalarSource",scalarSource)
          let scalarChecked =scalarSource.substring(11,scalarSource.length);
          let scalarJson = eval('('+scalarChecked+')');
          //var scalarJson = JSON.parse(scalarChecked);
          if($scope.dataScalar){
            for(let i =0;i<$scope.dataScalar.length;i++){
              let varName = $scope.dataScalar[i].varName;
              if(scalarJson[varName]){
                $scope.dataScalar[i].status=scalarJson[varName]
              }
            }
          }

        }

      }
      console.log('DataProcessingCtrl: model in DB:', $scope.model, "notebook", $scope.notebook, "mode:", $scope.mode);
      $scope.$on('tab',function(el, num){
          if (num === 2) {
            $http.get('/api/jupyter/step2').success(function (data) {
              //去掉最外层单引号,否则不符合json格式化要求
              data = data.result.substring(1, data.result.length - 1);
              console.log("step2---------result--》",JSON.parse(data).varName)
              if(typeof(JSON.parse(data).highCorr)!=="undefined"){
                $scope.dataHighCorr = JSON.parse(data).highCorr;
                console.log("$scope.dataHighCorr", $scope.dataHighCorr)
              }else{
                  $scope.getImputer();

                }
            });
          }

        // if (num ===2) {
        //     console.log("num:", num, '$scope.isNew', $scope.isNew);

        //   if (!$scope.isNew) {
        //     console.log('$scope.model.USER_INPUT_ITEMS ', $scope.model.USER_INPUT_ITEMS);
        //   }
        // }
      });
    } );
  $scope.$on('model',function(el, dataModel){
      $scope.model = dataModel;
      // console.log('model in DP:', $scope.model);
      // if (Object.keys($scope.model).length == 0) {
      //   $scope.isNew = true;
      // }
  });
  //获取空值比率
  $scope.getImputer = function () {
    let dataDel = "deleteCols=" + "\"" + "\"";
    console.log("dataDel:", dataDel);
    //数据预处理请求：删除选择的相关特征列
    $http.post('/api/jupyter/step3/', {deleteCols: dataDel}).success(function (data) {
      console.log("dataImputer------------>", data)
      data = data.result.substring(1, data.result.length - 1);
      console.log("dataImputer------------>", data)
      if(typeof(JSON.parse(data).p_missing)!=="undefined"){
        data = JSON.parse(data).p_missing
        let jsonObj = [];
        for (let key in data) {
          let arr =
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
  };

  $scope.getStandard = function () {
    let dataImputer = 'col_input={}'
    $http.post('/api/jupyter/step4/', {imputerCols: dataImputer}).success(function (data) {
        data = data.result.substring(1, data.result.length - 1);
        console.log("dataScalar------------>", data)
        data = JSON.parse(data)
        let jsonObj = [];
        for (let key in data.std) {
          let mini_histogram = data.mini_histogram[key];
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

  };

  $scope.preview = function () {
    if ($scope.resultPreview) {
      $http.get('/api/jupyter/step6').success(function (data) {
        console.log("/api/jupyter/step6      data.result)=====",data.result);
        $timeout(function () {
          openPreview.open($scope.resultPreview);
          Notification.success('Success!!!');
        }, 1000);

      });
    }
  };

  $scope.apply = function (newDataDel, newDataImputer, newDataScalar) {
      let dataDel = "", dataImputer = "", dataScalar = "";
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
        $http.post('/api/jupyter/step3/', {deleteCols: dataDel}).success(function (data) {
          $timeout(function () {
            data = data.result.substring(1, data.result.length - 1);
            console.log("dataImputer------------>", data)
            if(typeof(JSON.parse(data).p_missing)!=="undefined"){
              data = JSON.parse(data).p_missing
              let jsonObj = [];
              for (let key in data) {
                let arr =
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
        //ø’÷µ¥¶¿Ì≤¢ªÒ»°±Í◊º≤Ó
        $http.post('/api/jupyter/step4/', {imputerCols: dataImputer}).success(function (data) {
          $timeout(function () {
            data = data.result.substring(1, data.result.length - 1);
            console.log("dataScalar------------>", data)
            data = JSON.parse(data)
            let jsonObj = [];
            for (let key in data.std) {
              let mini_histogram = data.mini_histogram[key];

              if(mini_histogram){
                mini_histogram = mini_histogram.replace(/[\\]/g, '');
              }
              console.log("mini_hist=====", mini_histogram);
              let arr =
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
        //’˝‘ÚªØ
        $http.post('/api/jupyter/step5/', {standardCols: dataScalar}).success(function (data) {
          $timeout(function () {
            console.log("preview-------------->", data);
            $scope.resultPreview = $sce.trustAsHtml(data.result.content.data["text/html"]);
            //openPreview.open($scope.resultPreview);
            Notification.success('Success!!!');
          }, 1000);
        });
      }
    };
  }])
  .directive('processing', function() {
    return {
      templateUrl: 'views/directive/dataProcessing.html'
    };
  });
