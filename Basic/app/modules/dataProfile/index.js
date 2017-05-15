
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
      var filePath = $('#filePath').val();
      filePath=filePath.replace(/\\/g,"\\\\\\\\");

      var code = 'f = open("'+pyFilePath+'dataPreview.py", "r")\ncontent = f.read()\nf.close()\ncontent=content.replace("filePath=","filePath=\\\"'+filePath+'\\\"")\nexec(content)';

      var future = kernel.requestExecute({ code: code });

      future.onIOPub = function (msg) {
        if(msg.header.msg_type=='stream'){
          var a = JSON.parse(JSON.stringify(msg.content)).text;
          var b = JSON.parse(a);
          var c = b[0];
          var $th = "<tr>";

          for(var k in c) {
            $th = $th + "<th>"+k+"</th>"
          }

          $th = $th + "</tr>";

          for(var i=0;i<b.length;i++){
            var item = b[i];
            $th = $th + "<tr>"
            for(var k in item) {
                $th = $th + "<td>"+item[k]+"</td>"
            }
            $th = $th +"</tr>";
          }

          var $table = $("#previewDatas");
          $table.append($th);
        }
      };

      future.onReply = function (reply) {
      };

      future.onDone = function () {
      };
    });

    $('#displayReport').click(function () {
        var filePath = $('#filePath').val();
        filePath=filePath.replace(/\\/g,"\\\\\\\\");
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


    $('#getProcessSuggestions').click(function () {
          var code = 'f = open("'+pyFilePath+'getProcessSuggestions.py", "r")\ncontent = f.read()\nf.close()\nexec(content)';
          //var code = 'execfile("'+pyFilePath+'getProcessSuggestions.py")';
          var future = kernel.requestExecute({ code: code });

          future.onIOPub = function (msg) {
              console.log('Got IOPub:', msg);
              console.log(msg.header.msg_type)
              console.log(JSON.stringify(msg.content))
              //alert(123);
              if(msg.header.msg_type=='stream'){

                var a = JSON.parse(JSON.stringify(msg.content)).text;
                var dd = JSON.parse(a);
                //相关性
                var b = dd.highCorr;
                var $t1 = "";

                for(var i=0;i<b.length;i++){
                  var item = b[i];
                  $t1 = $t1 + "<tr>"
                  $t1 = $t1 + "<td>相关性"+item["corrValu"]+"</td>";
                  $t1 = $t1 + "<td><input name='corrValues' type='checkbox' value='"+item["varName"]+"' />"+item["varName"]+"</td>";
                  $t1 = $t1 + "<td><input name='corrValues' type='checkbox' value='"+item["corrVarName"]+"' />"+item["corrVarName"]+"</td>";
                  $t1 = $t1 +"</tr>";
                }

                //alert($t1);

                var $table = $("#t1");
                $table.append($t1);

                //空值处理
                var c = JSON.parse(a).imputer;

                var $t2 = "";

                for(var i=0;i<c.length;i++){
                  var item = c[i];
                  $t2 = $t2 + "<tr>"

                  $t2 = $t2 + "<td>变量名:"+item["varName"]+"</td>";
                  $t2 = $t2 + "<td>空值比例:"+item["imputerRatio"]+"</td>";
                  $t2 = $t2 + "<td><select name='imputerOpers' id='"+item["varName"]+"'><option value='none'>不处理</option><option value='mean' >mean</option><option value='median' >median</option><option value='most_frequent' >most_frequent</option></select></td>";
                  $t2 = $t2 +"</tr>";
                }

                var $table2 = $("#t2");
                $table2.append($t2);

                //标准化处理
                var d = JSON.parse(a).scalar;

                var $t3 = "";

                for(var i=0;i<d.length;i++){
                  var item = d[i];
                  $t3 = $t3 + "<tr>"
                  $t3 = $t3 + "<td>变量名:"+item["varName"]+"</td>";
                  $t3 = $t3 + "<td>标准差:"+item["stdValue"]+"</td>";
                  //TODO 图片处理
                  /*$t3 = $t3 + "<td>图片"+item["miniHistogram"]+"</td>";*/
                  $t3 = $t3 + "<td><select name='scalarOpers' id='"+item["varName"]+"'><option value='none'>不处理</option><option value='Standarded' >Standarded</option><option value='MaxAbs' >MaxAbs</option><option value='Robust' >Robust</option><option value='MinMax' >MinMax</option></select></td>";
                  $t3 = $t3 +"</tr>";
                }

                var $table3 = $("#t3");
                $table3.append($t3);
              }
          };

          future.onReply = function (reply) {
          };

          future.onDone = function () {
            $("#reportDiv").css({display:"none"})
            $("#thirdPage").css({display:"block"})
          };
    });

    $('#highCorrProcess').click(function () {
        var deleteCols = "";
        var unCheckedBoxs = $("input[name='corrValues']").not("input:checked");
        for(var i=0;i<unCheckedBoxs.length;i++){
          if(i==0){
            deleteCols = deleteCols + unCheckedBoxs[i].value;
          }else{
            deleteCols = deleteCols + ","+ unCheckedBoxs[i].value;
          }
        }
        var code = 'f = open("'+pyFilePath+'highCorrProcess.py", "r")\ncontent = f.read()\nf.close()\ncontent=content.replace("deleteCols=","deleteCols=\\\"'+deleteCols+'\\\"")\nexec(content)';
        var future = kernel.requestExecute({ code: code });

        future.onIOPub = function (msg) {
          console.log('Got IOPub:', msg);
          console.log(msg.header.msg_type)
          console.log(JSON.stringify(msg.content))
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
          alert(imputerCols);
          var code = 'f = open("'+pyFilePath+'imputerProcess.py", "r")\ncontent = f.read()\nf.close()\ncontent=content.replace("imputerCols=","imputerCols='+imputerCols+'")\nexec(content)';
          console.log(code);
          var future = kernel.requestExecute({ code: code });

          future.onIOPub = function (msg) {
            console.log('Got IOPub:', msg);
            console.log(msg.header.msg_type)
            console.log(JSON.stringify(msg.content))
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
        alert(standardCols);
        var code = 'f = open("'+pyFilePath+'standardProcess.py", "r")\ncontent = f.read()\nf.close()\ncontent=content.replace("standardCols=","standardCols='+standardCols+'")\nexec(content)';
        var future = kernel.requestExecute({ code: code });

        future.onIOPub = function (msg) {
          console.log('Got IOPub:', msg);
          console.log(msg.header.msg_type);
          console.log(JSON.stringify(msg.content));
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
          console.log('Got IOPub:', msg);
          console.log(msg.header.msg_type)

          console.log(JSON.stringify(msg.content))
        };

        future.onReply = function (reply) {

        };

        future.onDone = function () {
          alert("保存成功");
        };
    });
  });
});
