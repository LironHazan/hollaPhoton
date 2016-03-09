/**
 * Created by liron on 1/7/16.
 */

'use strict';

var spark = require('spark');
var _ = require('lodash');
var logger = require('log4js').getLogger('aura');


/**
 * @desc returns a list of connected devices
 * @param userName
 * @param passwd
 * @returns {Promise}
 */
exports.getConnectedDevices = function (userName, passwd) {
    return new Promise((resolve, reject) => {
            spark.login({username: userName, password: passwd}).then(() => {
                spark.listDevices().then((devices) => {
                    let listOfConnectedDevices = [];
                    _.each(devices, (device) => {
                        if (device.connected) { // if true add to listOfConnectedDevices
                            var _device = {id:device.id, name:device.name, connected:device.connected, lastApp:device.lastApp };
                           // listOfDevices.push(_device);
                            listOfConnectedDevices.push(_device);
                        }
                    });
                    resolve(listOfConnectedDevices);
                }, (err)=>{ logger.error('Error while trying to get list of devices: ' , err.message);
                    reject(err);
                });
            }, (err) =>{
                logger.error('Error while trying to login: ' , err);
                reject(err);
            });

        }
    );
};
