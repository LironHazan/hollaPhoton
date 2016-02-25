/**
 * Created by liron on 1/5/16.
 */
'use strict';

var EventEmitter = require('events');

/**
 * creating login event emitter for emitting events on login
 */
class Login extends EventEmitter {

    constructor() {
        super();
    }
}

var loginEmitter = new Login();

exports.LoginEventEmitter = loginEmitter;
