/**
 * Created by liron on 9/9/15.
 */

'use strict';
var express = require('express');
var router = express.Router();
//var ledDao = require('./LedDoa');
var spark = require('spark');
var _ = require("lodash");
var sessionLoginMiddleware = require('../Login/SessionLoginMiddleware');

//todo: photoresistor flow

function getPhotoresistorMetrics(req, res){

    if(req.creds){ // instead getUserCreds no need for cache
        spark.login({ username: req.creds.email, password: req.creds.passwd}).then(function success(){
            //todo: instead list of devices pick a device from current displayed list
            spark.listDevices().then(function(devices){
                var listOfDevices = [];
                _.each(devices, function(device){
                    var _device = {id:device.id, name:device.name, connected:device.connected, lastApp:device.lastApp };
                    listOfDevices.push(_device);

                    // get var example
                    // todo set in ajax req with wait intervals
                     device.getVariable('volts', function(err, data) {
                     if (err) {
                     console.log('An error occurred while getting attrs:', err);
                     } else {
                     console.log('Device attr retrieved successfully:', data);
                     }
                     });

                });
                res.send({listOfDevices:listOfDevices});
            });
        }, function error(err){
            logger.error(err);
        });


    }else{
        res.status(401).send({msg:'pls login'});
    }


}
router.get('/listDevices', sessionLoginMiddleware.getUserAndCreds, getPhotoresistorMetrics); // should getUserCreds and getUserSessionId

module.exports = router;