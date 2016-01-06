/**
 * Created by liron on 1/5/16.
 */
'use strict';

const util = require('util');
var EventEmitter = require('events');

function LoginEventEmitter() {
    EventEmitter.call(this);
}

util.inherits(LoginEventEmitter, EventEmitter);

var loginEmitter = new LoginEventEmitter();

exports.LoginEventEmitter = loginEmitter;
