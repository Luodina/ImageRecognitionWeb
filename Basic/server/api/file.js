"use strict";
let express = require('express');
let router = express.Router();
let multer  = require('multer');
let fs = require('fs');
const fileName = "./uploads/tmpCodeFile.py";
let storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, "tmpCodeFile.py");
  }
});
let upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), function(req, res){
    fs.renameSync(fileName, './uploads/' + req.file.originalname);
    res.status(200).send({fileName: req.file.originalname}); 
});

module.exports = router;