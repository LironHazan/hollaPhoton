/**
 * Created by liron on 9/3/15.
 */
'use strict';

var logger = require('log4js').getLogger('LedDoa');
var AbstractModel = require('../Models/AbstractModel');
var _ = require('lodash');
var Q = require('q');

function Leds ( data){
    this.data = data;
}

Leds.collectionName = 'leds';
AbstractModel.enhance(Leds);

Leds.createLedEntryPerDevice = function(ledEntry){
    var deferred = Q.defer();
    Leds.connect(function(collection){
        collection.leds.insert(ledEntry, function (err, doc) {
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

Leds.findLedsEntries = function (projection) {
    var deferred = Q.defer();
    Leds.connect(function(collection) { // projection = object like: {userId: userid,'fileName': fileName}
        collection.leds.find(projection, function (err, ledEntry) {
            if (err) {
                logger.error('error finding user node types :' + err.toString());
                deferred.reject(err);
                return;
            }
            if (ledEntry) {
                deferred.resolve(ledEntry);
                return;
            }
            else { // if ledEntry null
                deferred.resolve(null);
            }
        });
    });
    return deferred.promise;
};


Leds.updateTypes = function (newLedEntry, projection) {
    var deferred = Q.defer();
    Leds.connect(function (collection) {
        collection.leds.update(projection, newLedEntry, function(err, numReplaced){
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

exports.Leds = Leds;
