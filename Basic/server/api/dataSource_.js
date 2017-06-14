"use strict";

let contents = require('../jupyter');//require("@jupyterlab/services");
// var _xmlhttprequest = require("xmlhttprequest");
// var _ws = require("ws");
// var _ws2 = _interopRequireDefault(_ws);
// var _config = require("./../config");
// var _config2 = _interopRequireDefault(_config);
// function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// var env = _config2.default.env || 'dev';
// global.XMLHttpRequest = _xmlhttprequest.XMLHttpRequest;
// global.WebSocket = _ws2.default;

var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var fileName ;//= "./uploads/dataFile.csv";
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function filename(req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });

// The base url of the Jupyter server.
// var BASE_URL = _config2.default[env].notebook;
// var token = _config2.default[env].token;

var templatIpynbPath = '/dataProfile.ipynb';
var templatFolderPath = '/dataProfileFolder';

// var options = {
//     baseUrl: BASE_URL,
//     token: token
// };

//console.log('!!!!!!!!___________OPTIONS:', options);

//var contents = new _services.ContentsManager(options);
var sourceCodes = new Array();
var notebookModel;
var notebookFilePath;
var kernel;
var dataFile;
var basePath =path.join(__dirname, "../../uploads/");

console.log('contents', contents, 'ipynbPath', templatIpynbPath);

contents.copy(templatIpynbPath, '/dataProfileFolder').then(function (model) {
    console.log('model', model);
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
    //console.log("RESULT fs.existsSync('./uploads/" + fileName.replace(/.csv/g, "_") + "report.html')", fs.existsSync('./uploads/report.html'));
    if (fs.existsSync("./uploads/" + fileName.replace(/.csv/g, "_") + "report.html")) {
        var html = fs.readFileSync("./uploads/" + fileName.replace(/.csv/g, "_") + "report.html", 'utf8');
        res.writeHeader(200, { "Content-Type": "text/html" });
        res.write(html);
        res.end();
    } else {
        res.writeHeader(200, { "Content-Type": "text/html" });
        res.write('<div>!!!!!!!</div>');
        res.end();
    }
});

router.post('/step1', function (req, res) {
    fileName = req.body.fileName;
    console.log('fileName', fileName);
    if (sourceCodes[0] !== null && sourceCodes[0] !== ""){
        console.log('!!!!!!!!!!!!!!!!!!!req.query.fileName:', fileName, 'sourceCodes[0]', sourceCodes[0]);
        var newpath = "filePath=\"" + basePath + fileName + "\"";// "dataFile.csv\"";
        if(process.platform =="win32"){
            newpath=newpath.replace(/\\/g, "/");
        }
        console.log('!!!!!!!!!!!!!!!!!!!newpath:', newpath);
        var fileCode = sourceCodes[0].replace(/filePath=/g, newpath);
        var bb="htmlFilePath=\"" + path.join(__dirname, "../../uploads/" + fileName.replace(/.csv/g, "_") + "report.html\"");
        if(process.platform=="win32"){
            bb=bb.replace(/\\/g, "/");
        }
        fileCode = fileCode.replace(/htmlFilePath=/g,bb);
        // fileCode = fileCode.replace(/htmlFilePath=/g, "htmlFilePath=\"" + basePath + "report.html\"");
        console.log('!!!!!!!!STEP1___________CODE:', fileCode);
        var future = kernel.requestExecute({ code: fileCode });
        future.onIOPub = function (msg) {
            if (msg.header.msg_type === "execute_result") {
                console.log('!!!!!!!!STEP1___________RESULT:', msg);
                return res.send({ result: msg });
            }
        };
    } else {
        console.log('sourceCodes[0]:', sourceCodes[0]);
        return res.send({ result: "" });
    }

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
router.post('/step3', function (req, res) {
    var imputerCols = req.body.imputerCols;//"imputerCols={'sepal width (cm)':'mean'}";
    var standardCols = req.body.standardCols;//"standardCols={'sepal length (cm)':'Standarded'}";
    var deleteCols = req.body.deleteCols; //"deleteCols='petal length (cm)'";
    console.log('!!!!!!!!deleteCols:', deleteCols);
    console.log('!!!!!!!!standardCols:', standardCols);
    console.log('!!!!!!!!imputerCols:', imputerCols);
    var code = sourceCodes[2];

    code = code.replace("deleteCols=", deleteCols);
    code = code.replace("imputerCols=", imputerCols);
    code = code.replace("standardCols=", standardCols);
    console.log('!!!!!!!!STEP3___________CODE:', code);
    var future = kernel.requestExecute({ code: code });
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
    console.log('fileName IN /step5', fileName);
    var newpath = "outputFilePath=\"" + basePath  + fileName.replace(/.csv/g, "_") +"result.csv\"";
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
