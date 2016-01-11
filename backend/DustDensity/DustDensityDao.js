/**
 * Created by liron on 9/10/15.
 */

'use strict';

var logger = require('log4js').getLogger('aura');
var AbstractModel = require('../Models/AbstractModel');
var _ = require('lodash');

function DustDensity ( data){
    this.data = data;
}

DustDensity.collectionName = 'dustDensity';
AbstractModel.enhance(DustDensity);

DustDensity.createEntryPerDevice = function(entry){
    return new Promise((resolve, reject)=>{
        DustDensity.connect(function(collection){
            collection.dustDensity.insert(entry, function (err, doc) {
                if (err) {
                    logger.error('error creating node types :' , JSON.stringify(doc), err.toString());
                    reject(err);
                    return;
                }
                doc = _.compact([].concat(doc));
                resolve(doc);

            });
        });
    });
};

DustDensity.findEntries = function (projection) {
    return new Promise((resolve, reject)=> {
        DustDensity.connect(function (collection) { // projection = object like: {userId: userid,'fileName': fileName}
            collection.dustDensity.find(projection, function (err, entry) {
                if (err) {
                    logger.error('error finding user node types :' + err.toString());
                    reject(err);
                    return;
                }
                resolve(entry);

            });
        });
    });
};

/**
 *
 * @param newEntry
 * @param {object} projection
 * @param {function} callback --> (err, numberOfEntries)
 */
DustDensity.updateEntries = function (newEntry, projection, callback) {
    DustDensity.connect(function (collection) {
        collection.dustDensity.update(projection, newEntry, callback);
    });
};

DustDensity.deleteData = function (projection, ops) {
    return new Promise((resolve, reject) => {
        DustDensity.connect(function(collection) { // projection = object like: {userId: userid,'fileName': fileName}
            collection.dustDensity.remove(projection, ops, function (err, numRemoved) {
                if (err) {
                    reject(err);
                    return;
                }
                logger.info('removed: ' + numRemoved + ' entries');
                resolve(numRemoved);
            });
        });
    });
};


exports.DustDensity = DustDensity;