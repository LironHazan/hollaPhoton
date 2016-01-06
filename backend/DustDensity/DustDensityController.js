/**
 * Created by liron on 9/9/15.
 */

'use strict';
var express = require('express');
var router = express.Router();
var dustDensityService = require('./DustDensityService');
var dustDensityHandler = require('./DustDensityHandler');

//var dustDensityCollector = require('./DustDensityCollector').DustDensityCollector;
//var _dustDensityCollector = new dustDensityCollector();
//_dustDensityCollector.testThis();


var spark = require('spark');
var _ = require('lodash');
var sessionLoginMiddleware = require('../Login/SessionLoginMiddleware');
var logger = require('log4js').getLogger('aura');

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
router.get('/lastHour', /*sessionLoginMiddleware.getUserAndCreds,*/ getLastHourData);

//todo: function which constantly collecting the dustDensity
//todo: function will get flag - for start collecting and for stop collecting

var loginEmitter = require('../Login/LoginEventEmitter').LoginEventEmitter;
loginEmitter.on('logIn', (creds) =>{
    logger.info(creds);
    //todo: I need to pass the deviceId - maybe get it from selected?
    dustDensityHandler.collectAndStoreMetrics(creds, device.id, device.collect);
});

function toggleDustDensityCollection(req, res){
    try{
        var device = req.body;
        if(req.creds){
            var passwd = sessionLoginMiddleware.getUserPass();
            var credentials = { username: req.creds, password: passwd} ;
            dustDensityHandler.collectAndStoreMetrics(credentials, device.id, device.collect);
            res.status(200).send({msg:'ok'});

        }else{
            res.status(401).send({msg:'pls login'});
        }

    }
    catch(exception){
    logger.info('caught exception: ' , exception);
    }
}
//router.post('/collect', sessionLoginMiddleware.getUserAndCreds, toggleDustDensityCollection);

module.exports = router;