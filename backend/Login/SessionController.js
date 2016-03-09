'use strict';

var express = require('express');
var router = express.Router();
var logger = require('log4js').getLogger('aura');
var middleware = require('./SessionLoginMiddleware');

var loginEmitter = require('./LoginEventEmitter').LoginEventEmitter;

/**
 * @description login to the particle service
 * @param req
 * @param res
 */
function login (req, res) {

    var email = req.creds;
    logger.info('Emitting login event');
    loginEmitter.emit('logIn', { username: req.creds, password: middleware.getUserPass()}); // passing the creds to the observer

    res.status(200).send({msg: 'Hey ' + email + ' you are currently logged in to the particle cloud'});

}

router.post('/login', middleware.login, middleware.getUserAndCreds, login);

/**
 * get the currently logged user email
 */
router.get('/user',middleware.getUserAndCreds, function(req,res){
    res.status(200).send({name: req.sessionUser.email});
});

/**
 * @description reset the req.session
 * @param req
 * @param res
 */
function logout(req, res){
    req.session = null;
    res.send({msg:'logged out'});
}
router.get('/logout',middleware.logOut, logout);

module.exports = router;
