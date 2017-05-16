
require(['jquery', '@jupyterlab/services'], function ($, services) {
  'use strict';
  var startNewKernel = services.Kernel.startNew;

  var kernelOptions = {
    name: 'python'
  };


  // start a single kernel for the page
  startNewKernel(kernelOptions).then(function (kernel) {

    kernel.requestKernelInfo().then(function (reply) {
      var content = reply.content;
    })

    var pyFilePath = "E:/";

    $('#dataPreview').click(function () {
      var filePath = $('#dataFilePath').val();

      //TODO maxm ??
      filePath=filePath.replace(/\\/g,"\\\\\\\\");

      var code = 'f = open("'+pyFilePath+'dataPreview.py", "r")\ncontent = f.read()\nf.close()\ncontent=content.replace("filePath=","filePath=\\\"'+filePath+'\\\"")\nexec(content)';

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

        var code = 'f = open("'+pyFilePath+'displayReport.py", "r")\ncontent = f.read()\nf.close()\ncontent=content.replace("filePath=","filePath=\\\"'+filePath+'\\\"")\ncontent=content.replace("htmlFilePath=","htmlFilePath=\\\"'+htmlFilePath+'\\\"")\nexec(content)';
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
          var code = 'f = open("'+pyFilePath+'getProcessSuggestions.py", "r")\ncontent = f.read()\nf.close()\nexec(content)';

          var future = kernel.requestExecute({ code: code });

          future.onIOPub = function (msg) {
              /*console.log('Got IOPub:', msg);
              console.log(msg.header.msg_type)
              console.log(JSON.stringify(msg.content))*/

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

                  //TODO 图片处理
                  /*scalarHtmlStr = scalarHtmlStr + "<td>图片"+item["miniHistogram"]+"</td>";*/
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
        var code = 'f = open("'+pyFilePath+'highCorrProcess.py", "r")\ncontent = f.read()\nf.close()\ncontent=content.replace("deleteCols=","deleteCols=\\\"'+deleteCols+'\\\"")\nexec(content)';
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
          var code = 'f = open("'+pyFilePath+'imputerProcess.py", "r")\ncontent = f.read()\nf.close()\ncontent=content.replace("imputerCols=","imputerCols='+imputerCols+'")\nexec(content)';
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

        var code = 'f = open("'+pyFilePath+'standardProcess.py", "r")\ncontent = f.read()\nf.close()\ncontent=content.replace("standardCols=","standardCols='+standardCols+'")\nexec(content)';
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
        var outputFilePath = "E:/newDataFile.csv";
        var code = 'f = open("'+pyFilePath+'saveData.py", "r")\ncontent = f.read()\nf.close()\ncontent=content.replace("outputFilePath=","outputFilePath=\\\"'+outputFilePath+'\\\"")\nexec(content)';
        var future = kernel.requestExecute({ code: code });

        future.onIOPub = function (msg) {
          /*console.log('Got IOPub:', msg);
          console.log(msg.header.msg_type)
          console.log(JSON.stringify(msg.content))*/
        };

        future.onReply = function (reply) {
        };

        future.onDone = function () {
          alert("保存成功");
        };
    });
  });
});
