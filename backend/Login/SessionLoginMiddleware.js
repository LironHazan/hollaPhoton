'use strict';

/**
 * @module SessionMiddleware
 */
var user = require('./User');
var logger = require('log4js').getLogger('aura');
var loginToParicale = require('../Login/LoginToParticle');

var userPass = null;

exports.getUserPass = function(){
 return userPass;

};


exports.login = function( req, res, next ){

    var creds = req.body;
    var adapter = new loginToParicale.LoginAdapter(creds);
    userPass = adapter.getCreds();
    adapter.login().then(function success(/*token*/) {


        req.creds = creds.email;
        req.session.creds =  creds.email;
        next();
//        res.status(200).send({msg: 'Hey ' + creds.email + ' you are currently logged in to the particle cloud'});

    }, function error(err) {
        res.status(404).send(err.message);
    });
};


exports.getUserAndCreds = function(req,res,next){

    if ( !req.session || !req.session.userId || !req.session.creds ){
        res.status(401).send('unauthorized');
        return;
    }

    user.User.findById(req.session.userId, function (err, user) {
        if (err) {
            logger.trace('error while verifying session',err);
            res.status(404).send(err);
            return;
        }

        //if (!user) {
        //    logger.trace('got session without user');
        //    res.status(302).send({msg:'got session without user'});
        //    return;
        //}

        logger.trace('got user. put user on request ' + JSON.stringify(user, null, 2));
        req.sessionUser = user;
        req.creds = req.session.creds; //.toString();
        next();
    });

};

exports.getUserSessionId = function(req,res,next){

    if ( !req.session || !req.session.userId ){
        res.status(401).send('unauthorized');
        return;
    }

    req.userSessionId = req.session.userId.toString();
    next();

};

exports.logOut = function( req, res, next ){
    //todo: fix logout - doen't work
    req.session.creds = null;
    req.sessionUser = null;
    req.userSessionId = null;
    next();

};
