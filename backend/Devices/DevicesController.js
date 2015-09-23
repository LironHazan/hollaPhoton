/**
 * Created by liron on 9/12/15.
 */
var express = require('express');
var router = express.Router();
var spark = require('spark');
var _ = require("lodash");
var sessionLoginMiddleware = require('../Login/SessionLoginMiddleware');
var logger = require('log4js').getLogger('DevicesController');
var deviceDao = require('./DevicesDao');

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
                    deviceDao.Devices.findDevice({id:device.id}).then(function success(data){
                        if(data.length === 0){
                            deviceDao.Devices.createDeviceEntry(_device).then(function success(){
                                logger.info('saved new device');
                            }, function error(){
                                logger.error('error saving device')
                            });
                        }
                    }, function error(){
                        logger.error('error finding device');
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
router.get('/listDevices', sessionLoginMiddleware.getUserAndCreds, getListOfDevices);

function getSelectedDeviceId (req, res){
    if(req.body.name){
        deviceDao.Devices.findDevice({name:req.body.name}).then(function success(data){
            if(data.length > 0){
                var id = data[0].id;
                res.status(200).send({id:id});
            }
        }, function error(){
            logger.error('error finding device');
            res.status(404).send({msg:'not found'});
        });

    }

}

router.post('/device-id', getSelectedDeviceId);

module.exports = router;
