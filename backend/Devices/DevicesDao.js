/**
 * Created by liron on 9/10/15.
 */

'use strict';

var logger = require('log4js').getLogger('aura');
var AbstractModel = require('../Models/AbstractModel');
var _ = require('lodash');

function Devices ( data){
    this.data = data;
}

//devices model

Devices.collectionName = 'device';
AbstractModel.enhance(Devices);

Devices.createDeviceEntry = function(device){
    return new Promise((resolve, reject) => {
        Devices.connect(function(collection){
            collection.device.insert(device, function (err, doc) {
                if (err) {
                    logger.error('error creating Devices :' , JSON.stringify(doc), err.toString());
                    reject(err);
                    return;
                }
                doc = _.compact([].concat(doc));
                resolve(doc);

            });
        });
    });
};

Devices.findDevice= function (projection) {
    return new Promise((resolve, reject) => {
        Devices.connect(function(collection) { // projection = object like: {userId: userid,'fileName': fileName}
            collection.device.find(projection, function (err, entry) {
                if (err) {
                    logger.error('error finding user node types :' + err.toString());
                    reject(err);
                    return;
                }
                if (entry) {
                    resolve(entry);
                    return;
                }
                else { // if ledEntry null
                    resolve(null);
                }
            });
        });

    });
};

Devices.updateEntries = function (newEntry, projection) {
    return new Promise((resolve, reject) => {
        Devices.connect(function (collection) {
            collection.device.update(projection, newEntry, function(err, numReplaced){
                if(err){
                    reject(err);
                    return;
                }
                    resolve(numReplaced);

            } );
        });
    });
};

exports.Devices = Devices;