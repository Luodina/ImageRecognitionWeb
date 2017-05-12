
require(['jquery', '@jupyterlab/services'], function ($, services) {
  'use strict';
  var startNewKernel = services.Kernel.startNew;

  var kernelOptions = {
    name: 'python'
  };


  // start a single kernel for the page
  startNewKernel(kernelOptions).then(function (kernel) {
    //console.log('Kernel started:', kernel);
    kernel.requestKernelInfo().then(function (reply) {
      var content = reply.content;
      //$('#kernel-info').text(content.banner);
      //console.log('Kernel info:', content);
    })
    $('#profile').click(function () {
      // alert('aaa');
      var filePath = $('#filePath').val();
      filePath=filePath.replace(/\\/g,"\\\\\\\\");
      alert(filePath);

      var htmlFilePath = "/Users/JiYi/Desktop/OCAI/Basic/app/modules/dataProfile/dataProfile.html"
      var code = 'f = open("/Users/JiYi/Desktop/step1.py", "r")\ncontent = f.read()\nf.close()\ncontent=content.replace("filePath=","filePath=\\\"'+filePath+'\\\"")\ncontent=content.replace("htmlFilePath=","htmlFilePath=\\\"'+htmlFilePath+'\\\"")\nexec(content)';
      //console.log('Executing:', code);
      // Execute and handle replies on the kernel.
      // alert('ccc');
      // alert(code);


      var future = kernel.requestExecute({ code: code });
      // alert('ddd');


      // record each IOPub message
      future.onIOPub = function (msg) {
        // alert(msg);
        console.log('Got IOPub:', msg);
        /*$('#output').append(
          $('<pre>').text('msg_type: ' + msg.header.msg_type)
        );
        $('#output').append(
          $('<pre>').text(JSON.stringify(msg.content))
        );*/
        if(msg.header.msg_type=='stream'){
          // alert('eeee');
          var result=JSON.parse(JSON.stringify(msg.content)).text;
          alert(result);
        }
      };

      future.onReply = function (reply) {
        //console.log('Got execute reply');
      };

      future.onDone = function () {
        //console.log('Future is fulfilled');
        //$('#output').append($('<pre>').text('Done!'));
        // window.location.href="dataProfile.html";
      };
    });


    $('#getProcessSuggestions').click(function () {
          var code = 'f = open("/Users/JiYi/Desktop/step2.py", "r")\ncontent = f.read()\nf.close()\nexec(content)';
          var future = kernel.requestExecute({ code: code });

          // record each IOPub message
          future.onIOPub = function (msg) {
            /*console.log('Got IOPub:', msg);
            $('#output').append(
              $('<pre>').text('msg_type: ' + msg.header.msg_type)
            );
            $('#output').append(
              $('<pre>').text(JSON.stringify(msg.content))
            );*/
            if(msg.header.msg_type=='stream'){
              var result=JSON.parse(JSON.stringify(msg.content)).text;
              alert(result);
            }
          };

          future.onReply = function (reply) {
            //console.log('Got execute reply');
          };

          future.onDone = function () {
            //console.log('Future is fulfilled');
            //$('#output').append($('<pre>').text('Done!'));
          };
    });
  });
});
