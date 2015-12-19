/**
 * Created by liron on 9/10/15.
 */

'use strict';

var logger = require('log4js').getLogger('aura');
var AbstractModel = require('../Models/AbstractModel');
var _ = require('lodash');
var Q = require('q');

function DustDensity ( data){
    this.data = data;
}

DustDensity.collectionName = 'dustDensity';
AbstractModel.enhance(DustDensity);

DustDensity.createEntryPerDevice = function(entry){
    var deferred = Q.defer();
    DustDensity.connect(function(collection){
        collection.dustDensity.insert(entry, function (err, doc) {
            if (err) {
                logger.error('error creating node types :' , JSON.stringify(doc), err.toString());
                deferred.reject(err);
                return;
            }
            doc = _.compact([].concat(doc));
            deferred.resolve(doc);

        });
    });
    return deferred.promise;
};

DustDensity.findEntries = function (projection) {
    var deferred = Q.defer();
    DustDensity.connect(function(collection) { // projection = object like: {userId: userid,'fileName': fileName}
        collection.dustDensity.find(projection, function (err, entry) {
            if (err) {
                logger.error('error finding user node types :' + err.toString());
                deferred.reject(err);
                return;
            }
            if (entry) {
                deferred.resolve(entry);
                return;
            }
            else { // if ledEntry null
                deferred.resolve(null);
            }
        });
    });
    return deferred.promise;
};


DustDensity.updateEntries = function (newEntry, projection) {
    var deferred = Q.defer();
    DustDensity.connect(function (collection) {
        collection.dustDensity.update(projection, newEntry, function(err, numReplaced){
            if(err){
                deferred.reject(err);
            }
            else {
                deferred.resolve(numReplaced);
            }
        } );
    });
    return deferred.promise;
};

exports.DustDensity = DustDensity;