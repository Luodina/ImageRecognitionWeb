/**
 * Controller
 */

"use strict";

angular.module('basic')
  .controller('DataProcessingCtrl',['$rootScope', '$scope','$http','$sce','Notification', '$timeout', '$filter','openPreview', function ($rootScope, $scope, $http, $sce, Notification, $timeout, $filter,openPreview) {
  //$scope.data = "DataProcessingCtrl";
  $scope.resultPreview = "Preview";
  $scope.$on('tab',function(el, num){
    console.log("num:", num);
    if (num ===2) {
      $http.get('/api/jupyter/step2').success(function(data){
        // $scope.data = data.result;
        // console.log("DataProcessingCtrl data:",  $scope.data);
        $scope.dataHighCorr = JSON.parse(data.result).highCorr;
        console.log("$scope.dataHighCorr:", $scope.dataHighCorr);
        $scope.dataImputer= JSON.parse(data.result).imputer;
        // dataItemTwo.forEach(function(element) { 
        //   element["status"] = "none";  
        // }, this);
        // console.log("dataItemTwo:", dataItemTwo);
        console.log("$scope.dataImputer:", $scope.dataImputer);
        $scope.dataScalar = JSON.parse(data.result).scalar;
        console.log("$scope.dataScalar :", $scope.dataScalar);
      });
    }
  });

  // $scope.apply = function(){

  // };
  
  $scope.preview = function () {
     $http.get('/api/jupyter/step4').success(function(data){
      console.log("DataProcessingCtrl preview:", data.result.content.data["text/html"]);
      $timeout(function(){
        $scope.resultPreview = $sce.trustAsHtml(data.result.content.data["text/html"])
        openPreview.open($scope.resultPreview);
        Notification.success('Success!!!');
      }, 1000);     
    });   
  };

  $scope.apply =function(newDataDel, newDataImputer, newDataScalar){
    var dataDel = "", dataImputer = "", dataScalar = "";
    // "deleteCols='petal length (cm)'"
    if (newDataDel){
      //console.log("newDataImputer :", newDataImputer);
      newDataDel.forEach(function(el) { 
        console.log("el", el,"dataDel:", dataDel);
        if (!el.varNameStatus || el.varNameStatus!==true){
          if(dataDel !== "") { dataDel = dataDel + "," }
          dataDel =  dataDel + "'" + el.varName + "':'" + el.status + "'";
        } 
        if (!el.corrVarNameStatus || el.corrVarNameStatus!==true){
           if(dataDel !== "") { dataDel + "," }
          dataDel =  dataDel + "'" + el.corrVarName + "'";
        } 
      }, this);
      dataDel = "\"" + "deleteCols=" + dataDel +"\""
      console.log("dataDel:", dataDel);
    };
    //"imputerCols={'sepal width (cm)':'mean'}"
    if (newDataImputer){
      //console.log("newDataImputer :", newDataImputer);
      newDataImputer.forEach(function(el) { 
        if (el.status){
          if(dataImputer !== "") { dataImputer = dataImputer + "," }
          dataImputer =  dataImputer + "'" + el.varName + "':'" + el.status + "'";
        } 
      }, this);
      dataImputer = "\"" +'imputerCols={' + dataImputer + "}"
      console.log("dataImputer:", dataImputer);
    };
    // "standardCols={'sepal length (cm)':'Standarded'}"
    if (newDataScalar){
      //console.log("newDataScalar :", newDataScalar);
      newDataScalar.forEach(function(el) { 
        if (el.status){
           if(dataScalar !== "") { dataScalar = dataScalar + ","}
          dataScalar =  dataScalar + "'" + el.varName + "':'" + el.status + "'";
        } 
      }, this);
      dataScalar = "\"" +'standardCols={' + dataScalar + "}"
      console.log("dataScalar:", dataScalar);
    };

    console.log("Apply!!!");
    // $http.post('/api/jupyter/step3/', { deleteCols: dataDel, imputerCols: dataImputer, standardCols: dataScalar, }).success(function(data){
    //   $timeout(function(){
    //     Notification.success('Success!!!');
    //   }, 1000);   
    // });
  };

  }])
  .directive('processing', function() {
    return {
      templateUrl: 'views/directive/dataProcessing.html'
    };
  });
