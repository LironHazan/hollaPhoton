/**
 * Created by liron on 9/4/15.
 */
'use strict';

var spark = require('spark');
var logger = require('log4js').getLogger('aura');

class LoginHandler {

    constructor(creds) {
        this._creds = creds;

    }

    getCreds() {
        return this._creds.passwd;
    }

    login(){
        return new Promise((resolve, reject) => {
            spark.login({username: this._creds.email, password: this._creds.passwd}).then((token) =>{
                resolve(token);
            },(err) =>{
                logger.error('Error while trying to login to the Particle servers: ' , '[' + err.message + ']');
                reject(err);
            });

        });
    }

}

exports.LoginHandler = LoginHandler;





