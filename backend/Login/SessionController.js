'use strict';
//var services = require('../Services');
var user = require('./User');
var express = require('express');
var router = express.Router();
var logger = require('log4js').getLogger('SessionController');
var _ = require('lodash');
var middleware = require('./SessionLoginMiddleware');


/**
 * @module SessionController
 * @description
 * handles session activities
 *
 * when the client sends one of the following requests (GET/POST) should include session
 * in the url: http://localhost:3000/session/isLoggedIn
 */



router.get('/user',middleware.loggedIn, function(req,res){
    res.status(200).send({name: req.sessionUser.email});
});

function logout(req, res){

    res.status(200).send({msg:'logged out'});
}
router.get('/logout',middleware.logOut, logout);

module.exports = router;
