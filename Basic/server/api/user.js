'use strict';
let sequelize = require('../sequelize');
let Sequelize = require('sequelize');
let User = require('../model/USER_INFO')(sequelize, Sequelize);
let express = require('express');
let router = express.Router();

router.post('/login', function(req, res){
  let username = req.body.username;
  let pass = req.body.password;
  // console.log('username',username);
  // console.log('pass',pass);
  if (username !== null && pass !== null ){
    User.findOne({
      attributes: ['USER_ID', 'USER_NAME', 'PASSWORD'],
      where: {
        USER_NAME: username
      },
      raw: true
    }).then(function(user){
      //console.log('users',user);
      if (user === null){
        res.send({status: false});
      }else{
        if (user.PASSWORD === pass){
          res.send({status: true});
        }else{
          res.send({status: false});
        }
      }
    }).catch(err =>{
      console.log('err',err);
    });
  }else{

  }
});

// router.get('/enter',function (req, res) {
//   if (username!==null&& pass !==null){
//     let path = 'http://10.1.50.43:9000/#/expert/new/v?name=aa&kernel=python3&user=cc&modelTemplate=%E5%88%86%E7%B1%BB%E9%A2%84%E6%B5%8B&type=explore'
//     res.send({path:path})
//   }
// });

module.exports = router;
