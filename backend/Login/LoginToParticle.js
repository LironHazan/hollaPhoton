/**
 * Created by liron on 9/4/15.
 */
'use strict';

var spark = require('spark');
var Q = require('q');

class LoginAdapter {

    constructor(creds) {
        this._creds = creds;

    }

    getCreds() {
        return this._creds;
    }

    login(){

        var deffered = Q.defer();

        spark.login({username: this._creds.email, password: this._creds.passwd}).then(function success(token){
            deffered.resolve(token);
        }, function error(err){
            deffered.reject(err);
        });

        return deffered.promise;
    }

}

exports.LoginAdapter = LoginAdapter;





