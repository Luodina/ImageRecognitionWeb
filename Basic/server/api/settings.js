"use strict";
let express = require('express');
let router = express.Router();

router.get('/', function(req, res){
    res.send({msg:"Hey hey"});
});
module.exports = router;  