"use strict";

var _services = require("@jupyterlab/services");

var _xmlhttprequest = require("xmlhttprequest");

var _ws = require("ws");

var _ws2 = _interopRequireDefault(_ws);

var _config = require("./../config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var env = _config2.default.env || 'dev';
global.XMLHttpRequest = _xmlhttprequest.XMLHttpRequest;
global.WebSocket = _ws2.default;

var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var fileName = "./uploads/dataFile.csv";
var storage = multer.diskStorage({
    destination: './uploads/',
    filename: function filename(req, file, cb) {
        cb(null, "dataFile.csv");
    }
});
var upload = multer({ storage: storage });

// The base url of the Jupyter server.
var BASE_URL = _config2.default[env].notebook;
var token = _config2.default[env].token;
var templatIpynbPath = '/dataProfile.ipynb';

var options = {
    baseUrl: BASE_URL,
    token: token
};

console.log('!!!!!!!!___________OPTIONS:', options);

var contents = new _services.ContentsManager(options);
var sourceCodes = new Array();
var notebookModel;
var notebookFilePath;
var kernel;
var dataFile;
//console.log('contents', contents, 'ipynbPath', ipynbPath);
contents.copy(templatIpynbPath, '/dataProfileFolder').then(function (model) {
    //console.log('contents.copy');
    //have a test
    notebookFilePath = model.path;
    contents.get(notebookFilePath).then(function (model1) {
        notebookModel = model1;
        var cellsLength = model1.content.cells.length;
        for(var i=0;i<cellsLength;i++){
          sourceCodes[i] =  model1.content.cells[i].source;
        }

        //连接到session(如果已经存在该ipynb对应的session,则直接使用;如果没有，则创建一个session
        //have a test
        options = {
          baseUrl: BASE_URL,
          token:token,
          kernelName: 'python',
          path:notebookFilePath
        };

        _services.Session.listRunning(options).then(function (sessionModels) {
            var sessionNums = sessionModels.length;
            var existSession = false;
            // console.log('sessionModels.length',sessionModels.length);
            for (var i = 0; i < sessionNums; i++) {
                var path = sessionModels[i].notebook.path;
                if (path === notebookFilePath) {
                    //存在session，直接连接
                    var sessionOptions = {
                        baseUrl: BASE_URL,
                        token: token,
                        kernelName: sessionModels[i].kernel.name,
                        path: sessionModels[i].notebook.path
                    };
                    _services.Session.connectTo(sessionModels[i].id, sessionOptions).then(function (session) {
                        console.log('connected to existing session');
                        kernel = session.kernel;
                        // return res.send({result:"Hey!"});
                    });
                    existSession = true;
                    break;
                }
            }
            if (!existSession) {
                //没有现有的session，新创建session
                console.log('start new session');
                _services.Session.startNew(options).then(function (session) {
                    kernel = session.kernel;
                });
            }
        });
    });
});

router.post('/upload', upload.single('file'), function (req, res) {
    res.status(200).send({ fileName: req.file.originalname });
});

router.get('/report', function (req, res) {
    console.log("RESULT fs.existsSync('./uploads/report.html')", fs.existsSync('./uploads/report.html'));
    if (fs.existsSync('./uploads/report.html')) {
        var html = fs.readFileSync('./uploads/report.html', 'utf8');
        res.writeHeader(200, { "Content-Type": "text/html" });
        res.write(html);
        res.end();
    } else {
        res.writeHeader(200, { "Content-Type": "text/html" });
        res.write('<div>!!!!!!!</div>');
        res.end();
    }
});

router.get('/step1', function (req, res) {
    var newpath = "filePath=\"" + path.join(__dirname, "../../uploads/dataFile.csv\"");
    // console.log('!!!!!!!!!!!!!!!!!!!newpath:', newpath);
    var fileCode = sourceCodes[0].replace(/filePath=/g, newpath);
    fileCode = fileCode.replace(/htmlFilePath=/g, "htmlFilePath=\"" + path.join(__dirname, "../../uploads/report.html\""));
    console.log('!!!!!!!!STEP1___________CODE:', fileCode);
    var future = kernel.requestExecute({ code: fileCode });
    future.onIOPub = function (msg) {
        if (msg.header.msg_type === "execute_result") {
            console.log('!!!!!!!!STEP1___________RESULT:', msg);
            return res.send({ result: msg });
        }
    };
});

router.get('/step2', function (req, res) {
    console.log('!!!!!!!!STEP2___________CODE:', sourceCodes[1]);
    var future = kernel.requestExecute({ code: sourceCodes[1] });
    future.onIOPub = function (msg) {
        if (msg.header.msg_type === "stream") {
            console.log('!!!!!!!!STEP2___________RESULT:', msg.content.text);
            return res.send({ result: msg.content.text });
        }
    };
});

///////apply
router.get('/step3', function (req, res) {
    //deleteCols 要删除的列，如果是多个列，以逗号分割
    var deleteCols = "deleteCols='petal length (cm)'";
    //   var unCheckedBoxs = $("input[name='corrValues']").not("input:checked");
    //   for(var i=0;i<unCheckedBoxs.length;i++){
    //     if(i!=0){
    //       deleteCols = deleteCols + ",";
    //     }
    //     deleteCols = deleteCols + unCheckedBoxs[i].value;
    //   }

    //imputerCols需要做空值处理的列，json格式，例如：{'petal width (cm)':'median','petal length (cm)':'mean','sepal width (cm)':'most_frequent','sepal length (cm)':'most_frequent'}
    var imputerCols = "imputerCols={'sepal width (cm)':'mean'}";
    //   var imputerSelectItems = $("select[name='imputerOpers']");
    //   for(var i=0;i<imputerSelectItems.length;i++){
    //       var varName = imputerSelectItems[i].id;
    //       var option = imputerSelectItems[i].value;
    //       if(option!='none'){
    //         if(imputerCols!='{'){
    //           imputerCols = imputerCols + ",";
    //         }
    //         imputerCols = imputerCols + "'" +varName+ "'" + ":" + "'" +option+ "'";
    //       }
    //   }
    //   imputerCols = imputerCols + "}";

    //standardCols需要做正则化处理的列，json格式，例如：{'petal width (cm)':'Standarded','petal length (cm)':'MinMax','sepal width (cm)':'MaxAbs','sepal length (cm)':'Robust'}
    var standardCols = "standardCols={'sepal length (cm)':'Standarded'}";
    //   var standardSelectItems = $("select[name='scalarOpers']");
    //   for(var i=0;i<standardSelectItems.length;i++){
    //       var varName = standardSelectItems[i].id;
    //       var option = standardSelectItems[i].value;
    //       if(option!='none'){
    //         if(standardCols!='{'){
    //           standardCols = standardCols + ",";
    //         }
    //         standardCols = standardCols + "'" +varName+ "'" + ":" + "'" +option+ "'";
    //       }
    //   }
    //   standardCols = standardCols + "}";

    var code = sourceCodes[2];

    code = code.replace("deleteCols=", deleteCols);
    code = code.replace("imputerCols=", imputerCols);
    code = code.replace("standardCols=", standardCols);
    console.log('!!!!!!!!STEP3___________CODE:', code);
    var future = kernel.requestExecute({ code: code });

    future.onIOPub = function (msg) {

        console.log('!!!!!!!!STEP3___________RESULT:', msg);
    };
    return res.send({ result: "Hey" });
});

//////


router.get('/step4', function (req, res) {
    console.log('!!!!!!!!STEP4___________CODE:', sourceCodes[3]);
    var future = kernel.requestExecute({ code: sourceCodes[3] });
    future.onIOPub = function (msg) {
        if (msg.header.msg_type === "execute_result") {
            console.log('!!!!!!!!STEP4___________RESULT:', msg);
            return res.send({ result: msg });
        }
    };
});

router.get('/step5', function (req, res) {
    var newpath = "outputFilePath=\"" + path.join(__dirname, "../../uploads/dataFileNew.csv\"");
    var fileCode = sourceCodes[4].replace(/outputFilePath=/g, newpath);
    console.log('!!!!!!!!STEP5___________CODE:', fileCode);
    var future = kernel.requestExecute({ code: fileCode });
    future.onIOPub = function (msg) {
        if (msg.header.msg_type === "execute_result") {
            console.log('!!!!!!!!STEP5___________RESULT:', msg);
            return res.send({ result: "Hey" });
        }
    };
});
module.exports = router;
