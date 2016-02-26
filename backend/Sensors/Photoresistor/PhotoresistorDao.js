/**
 * Created by liron on 9/10/15.
 */

'use strict';

var logger = require('log4js').getLogger('aura');
var AbstractModel = require('../../Models/AbstractModel');
var _ = require('lodash');
var Q = require('q');

function Photoresistor ( data){
    this.data = data;
}

Photoresistor.collectionName = 'photoresistor';
AbstractModel.enhance(Photoresistor);

Photoresistor.createEntryPerDevice = function(photoresistorEntry){
    var deferred = Q.defer();
    Photoresistor.connect(function(collection){
        collection.photoresistor.insert(photoresistorEntry, function (err, doc) {
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

Photoresistor.findEntries = function (projection) {
    var deferred = Q.defer();
    Photoresistor.connect(function(collection) { // projection = object like: {userId: userid,'fileName': fileName}
        collection.photoresistor.find(projection, function (err, entry) {
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


Photoresistor.updateEntries = function (newEntry, projection) {
    var deferred = Q.defer();
    Photoresistor.connect(function (collection) {
        collection.photoresistor.update(projection, newEntry, function(err, numReplaced){
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

exports.Photoresistor = Photoresistor;