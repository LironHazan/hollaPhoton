
'use strict';


var AbstractModel = require('../Models/AbstractModel');
var _ = require('lodash');
var logger = require('log4js').getLogger('User');
var Q = require('q');

function User( data ){
    this.data = data;
}

User.collectionName = 'users';
AbstractModel.enhance(User);

User.getPublicUserDetails = function (user) {
    return {'email': user.email};
};

//if user is not exists create.
User.storeAndSignUser = function (user) {
    var deffered = Q.defer();

    if (_.isEmpty(user.email)) {
        callback('invalid user');
        return;
    }

    else{
        User.connect(function (collection) {
            collection.users.findOne({email: new RegExp('^' + user.email + '$', 'i')}, function (err, doc) {
                if (err) {
                    logger.error(err);
                    deffered.reject(err);
                }
                if (doc) {
                    logger.info('user already exists');
                   return deffered.resolve(doc); // user Id
                }
                else {
                    collection.users.count({ 'email': user.email }, function (err, count) {
                        if (count > 0) {
                            logger.error('user with email ' + user.email + ' already exists');
                            deffered.reject('user with email ' + user.email + ' already exists');
                         //   return;
                        } else {
                            collection.users.insert(user, function (err, doc) {
                                if (err) {
                                    logger.error('error storing user :' + err.message);
                                    deffered.reject('error storing user :' + err.message);
                           //         return;
                                } else {
                                    logger.info('user was stored successfully');
                                    deffered.resolve(doc);
                             //       return;
                                }

                            });
                        }
                    });


                }

            });

        });
    }

    return deffered.promise;
};


module.exports.User = User;
