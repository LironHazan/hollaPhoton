/**
 * Created by liron on 9/12/15.
 */
'use strict';
var express = require('express');
var router = express.Router();
var handler = require('./handlers/DevicesHandler');
var sessionLoginMiddleware = require('../Login/SessionLoginMiddleware');
var logger = require('log4js').getLogger('aura');

// gets device data by its id
function getDeviceById(/*req,*/ res){
    handler.getDevice(device.id).then((device) => {
        logger.info('Device name: ' + device.name);
        var _device = {id: device.id, name: device.name, connected: device.connected, lastApp: device.lastApp};
        res.status(200).send({data: _device});

    }, (err) => {
        res.status(400).send({msg: err});

    });
}
router.post('/device', sessionLoginMiddleware.login, getDeviceById);

// get devices from spark and return new list of filtered objects
function getListOfDevices(/*req,*/ res){
    handler.getDevices().then(function(devices){
        var listOfDevices = handler.filteredListOfDevices(devices);
        res.send({listOfDevices:listOfDevices});
    });

}
router.get('/listDevices', sessionLoginMiddleware.login, getListOfDevices);

module.exports = router;
