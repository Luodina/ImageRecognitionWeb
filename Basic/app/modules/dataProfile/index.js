require(['jquery', '@jupyterlab/services'], function ($, services) {
  'use strict';

  // The base url of the Jupyter server.
  var BASE_URL = 'http://localhost:8888';
  var token = '51d4aa80432f980c4cea818f5a60cc4b8f1d3cdbb4d7510d';
  var ipynbPath = '/dataProfile.ipynb';

  //连接到session(如果已经存在该ipynb对应的session,则直接使用;如果没有，则创建一个session)
  var options1 = {
    baseUrl: BASE_URL,
    token:token,
    kernelName: 'python',
    path:ipynbPath
  };
  var kernel;

  services.Session.listRunning(options1).then(sessionModels => {
    var sessionNums = sessionModels.length;
    var existSession = false;
    for(var i=0;i<sessionNums;i++){
      var path=sessionModels[i].notebook.path;
      if(path==ipynbPath){//存在session，直接连接
        var sessionOptions = {
           baseUrl: BASE_URL,
           token:token,
           kernelName: sessionModels[i].kernel.name,
           path: sessionModels[i].notebook.path
         };
         services.Session.connectTo(sessionModels[i].id, sessionOptions).then((session) => {
           console.log('connected to existing session');
           console.log(session.kernel.name);
           kernel=session.kernel;
         });
         existSession = true;
         break;
      }
    }
    if(!existSession){//没有现有的session，新创建session
      services.Session.startNew(options1).then(session => {
        kernel=session.kernel;
      });
    }
  });

  //获取ipynb文件中的source代码
  var options2 = {
      baseUrl: BASE_URL,
      token:token
  };

  var sourceCodes=new Array();

  var contents = new services.ContentsManager(options2);

  var newModel;
  var newFilePath;

  contents.copy(ipynbPath, '/dataProfileFolder').then((model) => {
      newModel = model;
      var filePath = model.path;
      newFilePath = filePath;
      //var newFilePath = filePath.replace(".ipynb","new.ipynb");
      //contents.delete(newFilePath);
      //contents.rename(filePath,newFilePath);

     //contents.get(newFilePath).then(
     contents.get(filePath).then(
          (model) => {
            var cellsLength = model.content.cells.length;
            for(var i=0;i<cellsLength;i++){
              sourceCodes[i] =  model.content.cells[i].source;
            }
            /*console.log('ipynb files----------------:', model.content);
            console.log('ipynb files----------------:', newFilePath);
            model.content.cells[0].source = 'print(45678)';
            var myArray=new Array();
            myArray[0]="45678";
            model.content.cells[0].outputs = myArray;
            contents.save(newFilePath,model);*/
          }
     );


  });

  $('#dataPreview').click(function () {
    var filePath = $('#dataFilePath').val();

    //TODO maxm ??
    filePath=filePath.replace(/\\/g,"\\\\\\\\");

    var code = sourceCodes[0];
    code = code.replace("filePath=",filePath);
    newmodel.content.cells[0].source=code;

    var future = kernel.requestExecute({ code: code });

    future.onIOPub = function (msg) {
      if(msg.header.msg_type=='stream'){
        var previewDatas = JSON.parse(JSON.parse(JSON.stringify(msg.content)).text);

        //添加标题
        var firstLineData = previewDatas[0];
        var htmlStr = "<tr>";

        for(var k in firstLineData) {
          htmlStr = htmlStr + "<th>"+k+"</th>"
        }

        htmlStr = htmlStr + "</tr>";

        //添加数据
        for(var i=0;i<previewDatas.length;i++){
          var item = previewDatas[i];
          htmlStr = htmlStr + "<tr>"
          for(var k in item) {
              htmlStr = htmlStr + "<td>"+item[k]+"</td>"
          }
          htmlStr = htmlStr +"</tr>";
        }

        //添加到table中
        var $table = $("#previewDatas");
        $table.append(htmlStr);
      }
    };

    future.onReply = function (reply) {
    };

    future.onDone = function () {
    };
  });

  $('#displayReport').click(function () {
      var filePath = $('#dataFilePath').val();
      //TODO maxm ??
      filePath=filePath.replace(/\\/g,"\\\\\\\\");
      //TODO maxm
      var htmlFilePath = "D:/ideaProjects/OCAI/Basic/app/modules/dataProfile/dataProfile.html"

      var code = sourceCodes[1];
      code = code.replace("filePath=",filePath);
      code = code.replace("htmlFilePath==",htmlFilePath);
      newmodel.content.cells[1].source=code;
      var future = kernel.requestExecute({ code: code });

      future.onIOPub = function (msg) {
        /*console.log('Got IOPub:', msg);
        console.log(msg.header.msg_type)
        console.log(JSON.stringify(msg.content))*/
      };

      future.onReply = function (reply) {
      };

      future.onDone = function () {
        $("#firstPage").css({display:"none"})
        $("#reportDiv").css({display:"block"})
        $("#refreshIframeB").click()
        $("#refreshIframeB").css({display:"none"})
      };
   });

  //查看预处理建议
  $('#getProcessSuggestions').click(function () {
        //TODO maxm var code = 'execfile("'+pyFilePath+'getProcessSuggestions.py")';
        var code = sourceCodes[2];

        var future = kernel.requestExecute({ code: code });

        future.onIOPub = function (msg) {
            console.log('Got IOPub:', msg);
            console.log(msg.header.msg_type);
            console.log(JSON.stringify(msg.content));

            if(msg.header.msg_type=='stream'){
              var suggestions = JSON.parse(JSON.parse(JSON.stringify(msg.content)).text);

              //相关性
              var varCorrSuggestions = suggestions.highCorr;
              var varCorrHtmlStr = "";

              for(var i=0;i<varCorrSuggestions.length;i++){
                var item = varCorrSuggestions[i];
                varCorrHtmlStr = varCorrHtmlStr + "<tr>"
                varCorrHtmlStr = varCorrHtmlStr + "<td>相关性"+item["corrValu"]+"</td>";
                varCorrHtmlStr = varCorrHtmlStr + "<td><input name='corrValues' type='checkbox' value='"+item["varName"]+"' />"+item["varName"]+"</td>";
                varCorrHtmlStr = varCorrHtmlStr + "<td><input name='corrValues' type='checkbox' value='"+item["corrVarName"]+"' />"+item["corrVarName"]+"</td>";
                varCorrHtmlStr = varCorrHtmlStr +"</tr>";
              }

              var varCorrTable = $("#varCorrTable");
              varCorrTable.append(varCorrHtmlStr);

              //空值处理
              var imputerSuggestions = suggestions.imputer;

              var imputerHtmlStr = "";

              for(var i=0;i<imputerSuggestions.length;i++){
                var item = imputerSuggestions[i];
                imputerHtmlStr = imputerHtmlStr + "<tr>"

                imputerHtmlStr = imputerHtmlStr + "<td>变量名:"+item["varName"]+"</td>";
                imputerHtmlStr = imputerHtmlStr + "<td>空值比例:"+item["imputerRatio"]+"</td>";
                imputerHtmlStr = imputerHtmlStr + "<td><select name='imputerOpers' id='"+item["varName"]+"'><option value='none'>不处理</option><option value='mean' >mean</option><option value='median' >median</option><option value='most_frequent' >most_frequent</option></select></td>";
                imputerHtmlStr = imputerHtmlStr +"</tr>";
              }

              var imputerTable = $("#imputerTable");
              imputerTable.append(imputerHtmlStr);

              //标准化处理
              var scalarSuggestions = suggestions.scalar;

              var scalarHtmlStr = "";

              for(var i=0;i<scalarSuggestions.length;i++){
                var item = scalarSuggestions[i];
                scalarHtmlStr = scalarHtmlStr + "<tr>"
                scalarHtmlStr = scalarHtmlStr + "<td>变量名:"+item["varName"]+"</td>";
                scalarHtmlStr = scalarHtmlStr + "<td>标准差:"+item["stdValue"]+"</td>";
                scalarHtmlStr = scalarHtmlStr + "<td><img src='"+item["miniHistogram"]+"'></td>";
                scalarHtmlStr = scalarHtmlStr + "<td><select name='scalarOpers' id='"+item["varName"]+"'><option value='none'>不处理</option><option value='Standarded' >Standarded</option><option value='MaxAbs' >MaxAbs</option><option value='Robust' >Robust</option><option value='MinMax' >MinMax</option></select></td>";
                scalarHtmlStr = scalarHtmlStr +"</tr>";
              }

              var scalarTable = $("#scalarTable");
              scalarTable.append(scalarHtmlStr);
            }
        };

        future.onReply = function (reply) {
        };

        future.onDone = function () {
          $("#reportDiv").css({display:"none"})
          $("#processSuggestions").css({display:"block"})
        };
  });

  $('#highCorrProcess').click(function () {
      var deleteCols = "";
      var unCheckedBoxs = $("input[name='corrValues']").not("input:checked");
      for(var i=0;i<unCheckedBoxs.length;i++){
        if(i!=0){
          deleteCols = deleteCols + ",";
        }
        deleteCols = deleteCols + unCheckedBoxs[i].value;
      }

      var code = sourceCodes[3];
      code = code.replace("deleteCols=",deleteCols);
      newmodel.content.cells[3].source=code;

      var future = kernel.requestExecute({ code: code });

      future.onIOPub = function (msg) {
        /*console.log('Got IOPub:', msg);
        console.log(msg.header.msg_type)
        console.log(JSON.stringify(msg.content))*/
      };

      future.onReply = function (reply) {
      };

      future.onDone = function () {
         alert("成功");
      };
  });

  $('#imputerProcess').click(function () {
        //imputerCols需要做空值处理的列，json格式，例如：{'petal width (cm)':'median','petal length (cm)':'mean','sepal width (cm)':'most_frequent','sepal length (cm)':'most_frequent'}
        var imputerCols = "{";
        var selectItems = $("select[name='imputerOpers']");
        for(var i=0;i<selectItems.length;i++){
            var varName = selectItems[i].id;
            var option = selectItems[i].value;
            if(option!='none'){
              if(imputerCols!='{'){
                imputerCols = imputerCols + ",";
              }
              imputerCols = imputerCols + "'" +varName+ "'" + ":" + "'" +option+ "'";
            }
        }
        imputerCols = imputerCols + "}";

        var code = sourceCodes[4];
        code = code.replace("imputerCols=",imputerCols);
        newmodel.content.cells[4].source=code;
        var future = kernel.requestExecute({ code: code });

        future.onIOPub = function (msg) {
          /*console.log('Got IOPub:', msg);
          console.log(msg.header.msg_type)
          console.log(JSON.stringify(msg.content))*/
        };

        future.onReply = function (reply) {
        };

        future.onDone = function () {
            alert("成功");
        };
  });

  $('#standardProcess').click(function () {
      //standardCols需要做正则化处理的列，json格式，例如：{'petal width (cm)':'Standarded','petal length (cm)':'MinMax','sepal width (cm)':'MaxAbs','sepal length (cm)':'Robust'}
      var standardCols = "{";
      var selectItems = $("select[name='scalarOpers']");
      for(var i=0;i<selectItems.length;i++){
          var varName = selectItems[i].id;
          var option = selectItems[i].value;
          if(option!='none'){
            if(standardCols!='{'){
              standardCols = standardCols + ",";
            }
            standardCols = standardCols + "'" +varName+ "'" + ":" + "'" +option+ "'";
          }
      }
      standardCols = standardCols + "}";

      var code = sourceCodes[5];
      code = code.replace("standardCols=",standardCols);
      newmodel.content.cells[5].source=code;
      var future = kernel.requestExecute({ code: code });

      future.onIOPub = function (msg) {
        /*console.log('Got IOPub:', msg);
        console.log(msg.header.msg_type);
        console.log(JSON.stringify(msg.content));*/
      };

      future.onReply = function (reply) {
      };

      future.onDone = function () {
        alert("成功");
      };
  });

  $('#saveData').click(function () {
      var deleteCols = "";
      var unCheckedBoxs = $("input[name='corrValues']").not("input:checked");
      for(var i=0;i<unCheckedBoxs.length;i++){
        if(i!=0){
          deleteCols = deleteCols + ",";
        }
        deleteCols = deleteCols + unCheckedBoxs[i].value;
      }

      //imputerCols需要做空值处理的列，json格式，例如：{'petal width (cm)':'median','petal length (cm)':'mean','sepal width (cm)':'most_frequent','sepal length (cm)':'most_frequent'}
      var imputerCols = "{";
      var imputerSelectItems = $("select[name='imputerOpers']");
      for(var i=0;i<imputerSelectItems.length;i++){
          var varName = imputerSelectItems[i].id;
          var option = imputerSelectItems[i].value;
          if(option!='none'){
            if(imputerCols!='{'){
              imputerCols = imputerCols + ",";
            }
            imputerCols = imputerCols + "'" +varName+ "'" + ":" + "'" +option+ "'";
          }
      }
      imputerCols = imputerCols + "}";

      //standardCols需要做正则化处理的列，json格式，例如：{'petal width (cm)':'Standarded','petal length (cm)':'MinMax','sepal width (cm)':'MaxAbs','sepal length (cm)':'Robust'}
      var standardCols = "{";
      var standardSelectItems = $("select[name='scalarOpers']");
      for(var i=0;i<standardSelectItems.length;i++){
          var varName = standardSelectItems[i].id;
          var option = standardSelectItems[i].value;
          if(option!='none'){
            if(standardCols!='{'){
              standardCols = standardCols + ",";
            }
            standardCols = standardCols + "'" +varName+ "'" + ":" + "'" +option+ "'";
          }
      }
      standardCols = standardCols + "}";

      var outputFilePath = "E:/newDataFile.csv";
      var code = sourceCodes[3];
      code = code.replace("deleteCols=",deleteCols);
      code = code.replace("imputerCols=",imputerCols);
      code = code.replace("standardCols=",standardCols);
      code = code.replace("outputFilePath=",outputFilePath);
      newmodel.content.cells[3].source=code;
      var future = kernel.requestExecute({ code: code });

      future.onIOPub = function (msg) {
        /*console.log('Got IOPub:', msg);
        console.log(msg.header.msg_type)
        console.log(JSON.stringify(msg.content))*/
      };

      future.onReply = function (reply) {
      };

      future.onDone = function () {
        contents.save(newFilePath,newModel);
        alert("保存成功");
      };
  });
});
