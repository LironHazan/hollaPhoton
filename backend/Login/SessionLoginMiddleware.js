'use strict';

/**
 * @module SessionMiddleware
 */
var user = require('./User');
var logger = require('log4js').getLogger('SessionMiddlewares');

/**
 * @description
 * verifies user is logged in and continues.
 * If not - return unauthorized or internalError.
 * @param req
 * @param res
 * @param next
 */
exports.loggedIn = function( req, res, next ){

        if ( !req.session || !req.session.userId ){
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

            logger.trace('got user. put user on request');
            req.sessionUser = user;
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
