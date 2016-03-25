'use strict';

/**
 * @module SessionMiddleware
 */
var user = require('./User');
var logger = require('log4js').getLogger('aura');
var handlers = require('./handlers');
var sessionLoginDao = require('../Login/User');
var _ = require('lodash');

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

/**
 * @desc middleware is used on login and when requesting anything from particle api
 * @param req
 * @param res
 * @param next
 */
exports.login = function( req, res, next ){
    let userCreds = req.body; // given by the user on first login

    if(_.isEmpty(req.body)){
        // creds are needed for authentication when requesting anything from spark
        userCreds = {email:req.session.creds, passwd:cache.userPass};
    }
    cache.userPass = userCreds.passwd; // populating cache when first login

    let particleLoginObj = new handlers.login.LoginHandler(userCreds);
    particleLoginObj.login().then(() => { //calling login to particle
        logger.info('Was able to login to particle');
        req.session.creds = userCreds.email; // put username on session

        //save user in db then put userId on session
        sessionLoginDao.User.storeAndSignUser(userCreds).then((user)=> {
                if (user._id) {
                    req.session.userId = user._id ; // put the userId on session
                }
                next();
            },
            (err) => {
                logger.error('Error while storing user: ' + err);
            });

    }, (err) => { // if creds are wrong invalid err will be invoked
        logger.error('Error [' + JSON.stringify(err.message, null, 4) + ']');
        res.status(404).send(err.message);
    });
};


