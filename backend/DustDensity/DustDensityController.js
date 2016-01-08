/**
 * Created by liron on 9/9/15.
 */

'use strict';
var express = require('express');
var router = express.Router();
var dustDensityService = require('./DustDensityService');
var dustDensityHandler = require('./DustDensityHandler');

var devicesHandler = require('../Devices/DevicesHandler');
var spark = require('spark');
var _ = require('lodash');
var sessionLoginMiddleware = require('../Login/SessionLoginMiddleware');
var logger = require('log4js').getLogger('aura');
var promise = require('bluebird');
var loginEmitter = require('../Login/LoginEventEmitter').LoginEventEmitter;

function getDustDensityMetrics(req, res){
    var device = req.body;
    if(req.creds){
        var passwd = sessionLoginMiddleware.getUserPass();
        var credentials = { username: req.creds, password: passwd} ;
        dustDensityHandler.getDustDensityMetrics(credentials, device.id).then(
            function success(metric){
                res.status(200).send({data:metric});
            }, function error(err){
                res.status(500).send({msg:err});
            }
        );
    }else{
        res.status(401).send({msg:'pls login'});
    }
}
router.post('/dustDensity', sessionLoginMiddleware.getUserAndCreds, getDustDensityMetrics);

function getLastHourData(req, res){
    dustDensityService.findLastHourEntries().then(function success(data){

        var newData = _.uniq(data, 'time');
        var sortedData  = _.sortByOrder(newData, ['time'], ['asc', 'desc']);

        /* should send to line chart following structure:
         {x: 0, value: 4},
         {x: 1, value: 8},
         {x: 2, value: 15},
         {x: 3, value: 16},
         {x: 4, value: 23},
         {x: 5, value: 42}
         */

        var sendData = [];
        _.each(sortedData, function(d){

            sendData.push({x:d.timestamp/*d.timestamp*/, value:d.dustDensity});
        });

        res.status(200).send(sendData);
    });
}
router.get('/lastHour',  getLastHourData);

// when user logs in , start collecting his dust density
loginEmitter.on('logIn', (creds) =>{

    promise.coroutine(function* () {
        let connectedDevices = yield devicesHandler.getConnectedDevices(creds.username, creds.password);
        logger.debug(connectedDevices[0]);
        dustDensityHandler.collectAndStoreMetrics(creds, connectedDevices[0]);

    })();

});

module.exports = router;