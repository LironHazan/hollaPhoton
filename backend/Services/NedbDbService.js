'use strict';
/**
 * @module NedbDbService
 * DbService implementation with nedb
 */
//var logger = require('log4js').getLogger('NedbDbService');
var Datastore = require('nedb');
var db = {};
var path = require('path');
var config = require(path.join(__dirname, '../conf'));


exports.connect = function (collectionName, callback) {

    if ( !db.hasOwnProperty(collectionName)){
        db[collectionName] = new Datastore({ filename: path.resolve(config.nedb + '/data/' + collectionName + '.txt'), autoload: true });
    }
    callback(db, db[collectionName]);
};

exports.toObjectId = function (id) {
    return id;
};

exports.id = function (id) {
    return exports.toObjectId(id);
};
