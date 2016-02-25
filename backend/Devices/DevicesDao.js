/**
 * Created by liron on 9/10/15.
 */

'use strict';

var logger = require('log4js').getLogger('aura');
var AbstractModel = require('../Models/AbstractModel');
var _ = require('lodash');
var Q = require('q');

function Devices ( data){
    this.data = data;
}

//devices model

Devices.collectionName = 'device';
AbstractModel.enhance(Devices);

Devices.createDeviceEntry = function(device){
    var deferred = Q.defer();
    Devices.connect(function(collection){
        collection.device.insert(device, function (err, doc) {
            if (err) {
                logger.error('error creating Devices :' , JSON.stringify(doc), err.toString());
                deferred.reject(err);
                return;
            }
            doc = _.compact([].concat(doc));
            deferred.resolve(doc);

        });
    });
    return deferred.promise;
};

Devices.findDevice= function (projection) {
    var deferred = Q.defer();
    Devices.connect(function(collection) { // projection = object like: {userId: userid,'fileName': fileName}
        collection.device.find(projection, function (err, entry) {
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

Devices.updateEntries = function (newEntry, projection) {
    var deferred = Q.defer();
    Devices.connect(function (collection) {
        collection.device.update(projection, newEntry, function(err, numReplaced){
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

exports.Devices = Devices;