"use strict";
let express = require('express');
let router = express.Router();

let fs = require('fs');
router.get('/', function(req, res){
  fs.readFile('./uploads/test.html', function (err, html) {
      if (err) {
          throw err; 
      }
      res.writeHeader(200, {"Content-Type": "text/html"});  
      res.write(html);  
      res.end(); 
  });      
});

module.exports = router; 