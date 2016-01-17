'use strict';

/**
 * @module SessionMiddleware
 */
var user = require('./User');
var logger = require('log4js').getLogger('aura');
var loginToParicale = require('../Login/LoginToParticle');
var sessionLoginDao = require('../Login/User');


var userPass = null;

exports.getUserPass = function(){
 return userPass;

};


exports.login = function( req, res, next ){

    var creds = req.body;
    var adapter = new loginToParicale.LoginAdapter(creds);
    userPass = adapter.getCreds();
    adapter.login().then(function success(/*token*/) {
        logger.info('Was able to login to particle');


        req.creds = creds.email;
        req.session.creds =  creds.email;
        //save user in db
        sessionLoginDao.User.storeAndSignUser(creds).then((user)=>{
            // put the userId on session
            if(user._id){
                req.session.userId = user._id.toString();
            }
            next();}, (err) => {
            logger.error('Error while storing user: ' + err);
        });

    }, function error(err) {
        logger.error('Error [' +  JSON.stringify(err, null, 4) + ']');
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

        if (!user) {
            logger.trace('got session without user');
            res.status(302).send({msg:'got session without user'});
            return;
        }

        logger.trace('got user. put user on request ' + user.email);
        req.sessionUser = user;
        req.creds = req.session.creds; //.toString();
        next();
    });

};

exports.getUserSessionId = function(req,res,next){

    if ( !req.session || !req.session.userId ){
        logger.error('req.session: [' +  JSON.stringify(req.session, null, 4) + '] req.session.userId [' + req.session.userId + '[ req.session.creds [' + req.session.creds +']');
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
