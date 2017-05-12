
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

    $('#dataPreview').click(function () {
      var filePath = $('#filePath').val();
      alert(filePath)
      filePath=filePath.replace(/\\/g,"\\\\\\\\");
      alert(filePath)

      var code = 'f = open("E:/pycharm/OCAI/CodeIpnb/py/dataPreview.py", "r")\ncontent = f.read()\nf.close()\ncontent=content.replace("filePath=","filePath=\\\"'+filePath+'\\\"")\nexec(content)';

      var future = kernel.requestExecute({ code: code });

      future.onIOPub = function (msg) {
        if(msg.header.msg_type=='stream'){
          var result=JSON.parse(JSON.stringify(msg.content)).text;
          alert(result);
          //result为返回的预览数据
        }
      };

      future.onReply = function (reply) {
      };

      future.onDone = function () {
      };
    });

    $('#displayReport').click(function () {
        var htmlFilePath = "E:/pycharm/OCAI/OCAI/Basic/app/modules/dataProfile/dataProfile.html"
        var code = 'f = open("E:/pycharm/OCAI/CodeIpnb/py/displayReport.py", "r")\ncontent = f.read()\nf.close()\ncontent=content.replace("htmlFilePath=","htmlFilePath=\\\"'+htmlFilePath+'\\\"")\nexec(content)';

        var future = kernel.requestExecute({ code: code });

        future.onIOPub = function (msg) {
          /*if(msg.header.msg_type=='stream'){
            var result=JSON.parse(JSON.stringify(msg.content)).text;
            alert(result);
          }*/
        };

        future.onReply = function (reply) {
        };

        future.onDone = function () {
          //跳转到html页面
          //window.location.href="dataProfile.html";
          //$("#reportDiv").html("&lt iframe  src='./dataProfile.html' frameborder='0' width='100%' height='500px' &gt &lt/iframe &gt")
          //$("#reportFrame").reload()
          $("#reportDiv").css({display:"block"})
          $("#refreshIframeB").css({display:"block"})
          $("#refreshIframeB").click()
          $("#refreshIframeB").css({display:"none"})




        };
     });


    $('#getProcessSuggestions').click(function () {
          var code = 'execfile("E:/pycharm/OCAI/CodeIpnb/py/getProcessSuggestions.py")';
          var future = kernel.requestExecute({ code: code });

          future.onIOPub = function (msg) {
            if(msg.header.msg_type=='stream'){
              var result=JSON.parse(JSON.stringify(msg.content)).text;
              alert(result);
              //result为json数据，解析之后展示到第三个页面
            }
          };

          future.onReply = function (reply) {
          };

          future.onDone = function () {
          };
    });

    $('#highCorrProcess').click(function () {
        //deleteCols为要删除的列，多个列以逗号分隔
        var deleteCols = "";
        var code = 'f = open("E:/pycharm/OCAI/CodeIpnb/py/highCorrProcess.py", "r")\ncontent = f.read()\nf.close()\ncontent=content.replace("deleteCols=","deleteCols=\\\"'+deleteCols+'\\\"")\nexec(content)';
        var future = kernel.requestExecute({ code: code });

        future.onIOPub = function (msg) {
        };

        future.onReply = function (reply) {
        };

        future.onDone = function () {
        };
    });

    $('#imputerProcess').click(function () {
          //imputerCols需要做空值处理的列，json格式，例如：{'petal width (cm)':'median','petal length (cm)':'mean','sepal width (cm)':'most_frequent','sepal length (cm)':'most_frequent'}
          var imputerCols = "";
          var code = 'f = open("E:/pycharm/OCAI/CodeIpnb/py/imputerProcess.py", "r")\ncontent = f.read()\nf.close()\ncontent=content.replace("imputerCols=","imputerCols=\\\"'+imputerCols+'\\\"")\nexec(content)';
          var future = kernel.requestExecute({ code: code });

          future.onIOPub = function (msg) {
          };

          future.onReply = function (reply) {
          };

          future.onDone = function () {
          };
    });

    $('#standardProcess').click(function () {
        //standardCols需要做正则化处理的列，json格式，例如：{'petal width (cm)':'Standarded','petal length (cm)':'MinMax','sepal width (cm)':'MaxAbs','sepal length (cm)':'Robust'}
        var standardCols = "";
        var code = 'f = open("E:/pycharm/OCAI/CodeIpnb/py/standardProcess.py", "r")\ncontent = f.read()\nf.close()\ncontent=content.replace("standardCols=","standardCols=\\\"'+standardCols+'\\\"")\nexec(content)';
        var future = kernel.requestExecute({ code: code });

        future.onIOPub = function (msg) {
        };

        future.onReply = function (reply) {
        };

        future.onDone = function () {
        };
    });

    $('#saveData').click(function () {
        var outputFilePath = "";
        var code = 'f = open("E:/pycharm/OCAI/CodeIpnb/py/saveData.py", "r")\ncontent = f.read()\nf.close()\ncontent=content.replace("saveData=","saveData=\\\"'+saveData+'\\\"")\nexec(content)';
        var future = kernel.requestExecute({ code: code });

        future.onIOPub = function (msg) {
        };

        future.onReply = function (reply) {
        };

        future.onDone = function () {
        };
    });
  });
});
