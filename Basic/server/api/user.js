'use strict';
let sequelize = require('../sequelize');
let Sequelize = require('sequelize');
let User = require('../model/USER_INFO')(sequelize, Sequelize);
let express = require('express');
let router = express.Router();
let auth = require('../utils/auth');

// 用户登录，发放token
router.post('/login', function(req, res) {
    let username = req.body.username;
    let pass = req.body.password;
    if (username && pass) {
        User.findOne({
            attributes: ['USER_ID', 'USER_NAME', 'PASSWORD'],
            where: {
                USER_NAME: username
            },
            raw: true
        }).then(function(user) {
            if (!user) {
                res.status(403).send({ status: false, msg: 'Username not found' });
            } else {
                if (user.PASSWORD !== pass) {
                    res.status(403).send({ status: false, msg: 'Invalid password' });
                } else {
                    var token = auth.encode(user.USER_NAME);
                    res.setHeader('Set-Cookie', ['aura_token=' + token]);
                    res.status(200).send({ status: true, token: token });
                }
            }
        }).catch(err => {
            console.log('err', err);
            res.status(403).send({ status: true, msg: err });
        });
    } else {
        res.status(403).send({ status: true, msg: 'Username and password cannot be blank' });
    }
});

module.exports = router;