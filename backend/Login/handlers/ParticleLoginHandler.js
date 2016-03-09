/**
 * Created by liron on 9/4/15.
 */
'use strict';

var spark = require('spark');
//var logger = require('log4js').getLogger('aura');

class LoginHandler {

    constructor(creds) {
        this._creds = creds;

    }

// wrapping particle api
    login(){
        return spark.login({username: this._creds.email, password: this._creds.passwd});
    }

}

exports.LoginHandler = LoginHandler;





