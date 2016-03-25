
'use strict';


var AbstractModel = require('../Models/AbstractModel');
var _ = require('lodash');
var logger = require('log4js').getLogger('aura');

function User( data ){
    this.data = data;
}

User.collectionName = 'users';
AbstractModel.enhance(User);

User.getPublicUserDetails = function (user) {
    return {'email': user.email};
};

//if user does not exists create it.
User.storeAndSignUser = function (user) {
return new Promise((resolve, reject)=>{
    if (_.isEmpty(user.email)) {
        resolve();
        return;
    }
        User.connect(function (collection) {
            collection.users.findOne({email: new RegExp('^' + user.email + '$', 'i')}, function (err, doc) {
                if (err) {
                    logger.error(err);
                    reject(err);
                }
                if (doc) {
                    logger.info('user already exists');
                    resolve(doc); // user Id
                }
                else {
                    collection.users.count({ 'email': user.email }, function (err, count) {
                        if (count > 0) {
                            logger.info('user with email ' + user.email + ' already exists');
                            resolve(user);
                        } else {
                            collection.users.insert(user, function (err, doc) {
                                if (err) {
                                    logger.error('error storing user :' + err.message);
                                    reject('error storing user :' + err.message);
                                    //         return;
                                } else {
                                    logger.info('user was stored successfully');
                                    resolve(doc);
                                }

                            });
                        }
                    });


                }

            });

        });

    });
};


module.exports.User = User;
