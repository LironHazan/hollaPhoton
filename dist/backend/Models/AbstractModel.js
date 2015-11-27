'use strict';
/**
 * @module AbstractModel
 * @description
 * collection of functions frequently used with mongo and models.
 */
/*jshint -W079 */
var db = require('../Services/NedbDbService');
var logger = require('log4js').getLogger('AbstractModel');

// adds static functions and prototype functions on a class
function enhance( Class ) {

    if ( !Class.collectionName){
        logger.error(Class.name + ' has no collectionName defined');
        throw Class.name + ' has no collectionName defined';
    }

    Class.connect = function( callback ){
        db.connect(Class.collectionName, callback);
    };

    Class.findById = function (id, projection, callback ) {
        if ( typeof(projection) === 'function'){
            callback = projection;
            projection = {};
        }
        Class.findOne( {'_id' : db.id(id)} , projection, callback );
    };

    Class.findOne = function(filter, projection, callback ){

        if ( typeof(projection) === 'function'){ // projection must be the callback, replace with empty object
            callback = projection;
            projection = {};
        }

        Class.connect( function( db, collection ){
            collection.findOne(filter, projection,callback);
        });
    };

    Class.find = function (filter, projection, callback) {

        if ( typeof(projection) === 'function'){
            callback = projection;
            projection = {};
        }

        Class.connect( function (db, collection) {
            collection.find(filter, projection).toArray(callback);
        });
    };


    Class.prototype.update = function( callback ){
        logger.info('updating');
        var self = this;
        this.data._id = db.id(this.data._id);
        Class.connect(function (db, collection) {
            logger.info('connected. running update', self.data._id);
            collection.update({ '_id': self.data._id}, self.data, callback || function(){ logger.info('updated successfully'); });
        });
    };
}

module.exports.enhance = enhance;
