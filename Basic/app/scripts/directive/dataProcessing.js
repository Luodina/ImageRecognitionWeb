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

  $scope.$on('tab',function(el, num){
    console.log("num:", num, '$scope.isNew', $scope.isNew);
    if (num ===2) {      
        $http.get('/api/jupyter/step2').success(function(data){
         // $scope.model.USER_INPUT_ITEMS=[];
          $scope.dataHighCorr = JSON.parse(data.result).highCorr;
         // $scope.model.USER_INPUT_ITEMS[0] = JSON.parse(data.result).highCorr;
          console.log("$scope.dataHighCorr:", $scope.dataHighCorr);
          $scope.dataImputer= JSON.parse(data.result).imputer;
         // $scope.model.USER_INPUT_ITEMS[1] =JSON.parse(data.result).imputer;
          console.log("$scope.dataImputer:", $scope.dataImputer);
          $scope.dataScalar = JSON.parse(data.result).scalar;
         // $scope.model.USER_INPUT_ITEMS[2] = JSON.parse(data.result).scalar;
          console.log("$scope.dataScalar :", $scope.dataScalar);

        });
      if (!$scope.isNew) {
        console.log('$scope.model.USER_INPUT_ITEMS ', $scope.model.USER_INPUT_ITEMS); 
      }
    }
  });
       
  $scope.$on('model',function(el, dataModel){
      $scope.model = dataModel;
      console.log('model in DP:', $scope.model);
      if (Object.keys($scope.model).length == 0) {
        $scope.isNew = true;
      }
  });
 
  
  $scope.preview = function () {
     $http.get('/api/jupyter/step4').success(function(data){
      console.log("DataProcessingCtrl preview:", data.result.content.data["text/html"]);
      $timeout(function(){
        $scope.resultPreview = $sce.trustAsHtml(data.result.content.data["text/html"])
        openPreview.open($scope.resultPreview, $scope.model);
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
          dataDel =  dataDel + "'" + el.varName  + "'";
        } 
        if (!el.corrVarNameStatus || el.corrVarNameStatus!==true){
          
          if(dataDel !== "") {  dataDel =  dataDel + "," }
          dataDel =  dataDel + "'" + el.corrVarName + "'";
        } 
      }, this);
      if(dataDel === "") { dataDel =  "''" }
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
      newDataScalar.forEach(function(el) { 
        if (el.status){
           if(dataScalar !== "") { dataScalar = dataScalar + ","}
          dataScalar =  dataScalar + "'" + el.varName + "':'" + el.status + "'";
        } 
      }, this);
      dataScalar = "\"" +'standardCols={' + dataScalar + "}"
      console.log("dataScalar:", dataScalar);
    };

    $scope.model.MODEL_NAME = $location.path().split(/[\s/]+/).pop();
    $scope.model.USER_INPUT_ITEMS = dataDel +"/"+ dataImputer +"/" + dataScalar;
    $scope.model.VIEW_MENU_ID= "01";
  
    console.log(" $scope.model",  $scope.model);

    console.log("Apply!!!", dataDel, dataImputer, dataScalar);
    $http.post('/api/jupyter/step3/', { deleteCols: dataDel, imputerCols: dataImputer, standardCols: dataScalar }).success(function(data){
      $timeout(function(){
        Notification.success('Success!!!');
      }, 1000);   
    });

  };
  }])
  .directive('processing', function() {
    return {
      templateUrl: 'views/directive/dataProcessing.html'
    };
  });
