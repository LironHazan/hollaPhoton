'use strict';

/**
 * @module SessionMiddleware
 */
var user = require('./User');
var logger = require('log4js').getLogger('aura');
var handlers = require('./handlers');
var sessionLoginDao = require('../Login/User');

//caching the user passwd
var cache = {
     userPass : '',
     getUserPass: function(){
            return this.userPass;
        }
};

//returns the user passwd
exports.getUserPass = function(){
 return cache.getUserPass();
};

exports.login = function( req, res, next ){

    let userCreds = req.body;
    cache.userPass = userCreds.passwd; // populating cache

    let particleLoginObj = new handlers.login.LoginHandler(userCreds);
    particleLoginObj.login().then(() => { //calling login to particle
        logger.info('Was able to login to particle');

        req.session.creds = userCreds.email;

        //save user in db
        sessionLoginDao.User.storeAndSignUser(userCreds).then((user)=> {
                // put the userId on session
                if (user._id) {
                    req.session.userId = user._id.toString();
                }
                next();
            },
            (err) => {
                logger.error('Error while storing user: ' + err);
            });

    }, (err) => {
        logger.error('Error [' + JSON.stringify(err, null, 4) + ']');
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
    cache.userPass = '';
    req.session.creds = null;
    req.sessionUser = null;
    req.userSessionId = null;
    next();

};
