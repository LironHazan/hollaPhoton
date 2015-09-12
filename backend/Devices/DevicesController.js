/**
 * Created by liron on 9/12/15.
 */
var express = require('express');
var router = express.Router();
var spark = require('spark');
var _ = require("lodash");
var sessionLoginMiddleware = require('../Login/SessionLoginMiddleware');
var logger = require('log4js').getLogger('DevicesController');

function getDeviceById(req, res){
    var device = req.body;
    if(req.creds){
        var passwd = sessionLoginMiddleware.getUserPass();
        spark.login({ username: req.creds, password: passwd}).then(function success(){

            spark.getDevice(device.id, function(err, device) {
                logger.info('Device name: ' + device.name);
                var _device = {id:device.id, name:device.name, connected:device.connected, lastApp:device.lastApp };
                res.status(200).send({data:_device});
            });

        }, function error(err){
            res.status(401).send({msg:err});
        });

    }else{
        res.status(401).send({msg:'pls login'});
    }


}
router.post('/device', sessionLoginMiddleware.getUserAndCreds, getDeviceById);

function getListOfDevices(req, res){

    if(req.creds){ // instead getUserCreds no need for cache
        var passwd = sessionLoginMiddleware.getUserPass();
        spark.login({ username: req.creds, password: passwd}).then(function success(){
            spark.listDevices().then(function(devices){
                var listOfDevices = [];
                _.each(devices, function(device){
                    var _device = {id:device.id, name:device.name, connected:device.connected, lastApp:device.lastApp };
                    listOfDevices.push(_device);
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
router.get('/listDevices', sessionLoginMiddleware.getUserAndCreds, getListOfDevices);


module.exports = router;
