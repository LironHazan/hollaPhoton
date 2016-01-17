'use strict';

var express = require('express');
var router = express.Router();
var logger = require('log4js').getLogger('aura');
var middleware = require('./SessionLoginMiddleware');
var sessionLoginDao = require('../Login/User');

var loginEmitter = require('./LoginEventEmitter').LoginEventEmitter;

function login (req, res) {

    var email = req.creds;
    logger.info('Emitting login event');
    loginEmitter.emit('logIn', { username: req.creds, password: middleware.getUserPass()});

    res.status(200).send({msg: 'Hey ' + email + ' you are currently logged in to the particle cloud'});

    //sessionLoginDao.User.storeAndSignUser({email: email/*, pass: creds.password*/}).then(
    //    function success(user) {
    //
    //        req.session.userId = user._id.toString();
    //        logger.info('Emitting login event');
    //        loginEmitter.emit('logIn', { username: req.creds, password: middleware.getUserPass()});
    //
    //        res.status(200).send({msg: 'Hey ' + email + ' you are currently logged in to the particle cloud'});
    //
    //    }, function error(err) {
    //        logger.error('Error: ' +err);
    //        res.status(404).send(err);
    //    }
    //);

}

router.post('/login', middleware.login, middleware.getUserAndCreds, login);

router.get('/user',middleware.getUserAndCreds, function(req,res){
    res.status(200).send({name: req.sessionUser.email});
});

function logout(req, res){
    req.session = null;
    res.send({msg:'logged out'});
    //res.status(200).send({msg:'logged out'});
}
router.get('/logout',middleware.logOut, logout);

module.exports = router;
