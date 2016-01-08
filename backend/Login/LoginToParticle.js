/**
 * Created by liron on 9/4/15.
 */
'use strict';

var spark = require('spark');

class LoginAdapter {

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
                reject(err);
            });

        });
    }

}

exports.LoginAdapter = LoginAdapter;





