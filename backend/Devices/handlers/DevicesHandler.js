/**
 * Created by liron on 1/7/16.
 */

'use strict';

var spark = require('spark');
var _ = require('lodash');
var logger = require('log4js').getLogger('aura');
var deviceDao = require('../DevicesDao');
var EventEmitter = require('events');

/**
 * @desc wrapped the particle listDevices
 * @returns {Promise}
 */
exports.getDevices = function(){
    return spark.listDevices();
};

/**
 * @desc get device by its id
 * @param deviceId
 * @returns {Promise}
 */
exports.getDevice = function(deviceId){
    return spark.getDevice(deviceId);
};

class DevicesHandler extends EventEmitter{

    constructor() {
        super();
    }

}
DevicesHandler.Events = {
    SAVE: 'save',
    ERROR: 'error'

};
exports.DevicesHandler = DevicesHandler;

/**
 * @desc saves the device in db if not exists
 * @param device {Object}
 * @returns {Promise}
 */
exports.saveDeviceInDb = function(device) {
    return new Promise((resolve, reject) => {

        deviceDao.Devices.findDevice({id:device.id}).then((data) => {
            if (data.length !== 0) {
                resolve('device with same id already exists');
                return;
            }
            return deviceDao.Devices.createDeviceEntry(device);

        }, (e)=> {
            logger.error('error while tracing device', e);
            reject(e);
        });
    });
};

/**
 * @desc creates a new device object and stores in new list of devices
 * @param devices
 * @returns {Array}
 */
exports.filteredListOfDevices = function(devices){
    let _devices = [];
    _.each(devices, (device) => {
            var _device = {id:device.id, name:device.name, connected:device.connected, lastApp:device.lastApp };
        _devices.push(_device);
    });
    return _devices;
};

/**
 * @desc returns the list of connected devices
 * @param userName
 * @param passwd
 * @returns {Promise}
 */
exports.getConnectedDevices = function (userName, passwd) {
    return new Promise((resolve, reject) => {
            exports.getDevices().then((devices) => {
                let listOfConnectedDevices=   _.filter(exports.filteredListOfDevices(devices) , (device) =>  {
                        return device.connected; // filter by connected===true
                    });
                    resolve(listOfConnectedDevices);
                }, (err)=>{ logger.error('Error while trying to get list of devices: ' , err.message);
                    reject(err);
                });
        }
    );
};
