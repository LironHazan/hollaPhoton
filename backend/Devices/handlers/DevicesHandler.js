/**
 * Created by liron on 1/7/16.
 */

'use strict';

var spark = require('spark');
var _ = require('lodash');
var logger = require('log4js').getLogger('aura');



exports.getConnectedDevices = function (userName, passwd) {
    return new Promise((resolve, reject) => {
            spark.login({username: userName, password: passwd}).then(() => {
                spark.listDevices().then((devices) => {
                    let listOfConnectedDevices = [];
                    _.each(devices, (device) => {
                        if (device.connected) { // if true add to listOfConnectedDevices
                            listOfConnectedDevices.push(device.id);
                        }
                    });
                    resolve(listOfConnectedDevices);
                });
            }, (err) =>{
                logger.error('Error while trying to login: ' , err);
                reject(err);
            });

        }
    );
};
