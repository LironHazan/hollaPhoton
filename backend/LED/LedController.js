/**
 * Created by liron on 9/2/15.
 */

var express = require('express');
var router = express.Router();
var ledDao = require('./LedDoa');
var spark = require('spark');
var _ = require("lodash");
var sessionLoginMiddleware = require('../Login/SessionLoginMiddleware');
var logger = require('log4js').getLogger('LedController');


var timestamp = new Date().getTime().toString();
var credsCache = null;

function addNewLedService(req, res){

    var mockedLedEntry = {timestamp:timestamp, deviceID:'a123', volume:3};

    ledDao.Leds.createLedEntryPerDevice(mockedLedEntry).then(function success(doc){
        res.send({msg:'new added led: ' + JSON.stringify(doc)});
    }, function error(err){
        res.send({msg:err});
    });

}
router.get('/add', addNewLedService);

function fetchLedService(req, res){

    ledDao.Leds.findLedsEntries({deviceID:'a123'}).then(function success(doc){
        res.send({msg:'all led results: ' + JSON.stringify(doc)});
    }, function error(err){
        res.send({msg:err});
    });

}
router.get('/find', fetchLedService);

function updateLedService(req, res){
    var mockedLedEntry = {timestamp:timestamp, deviceID:'b234', volume:7};
    ledDao.Leds.updateTypes(mockedLedEntry, {_id:'sMgai6ws8U4ghxlj'}).then(function success(doc){
        res.send({msg:'num of updated records: ' + JSON.stringify(doc)});
    }, function error(err){
        res.send({msg:err});
    });

}
router.get('/update', updateLedService);

// list of devices flow
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
