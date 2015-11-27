/**
 * Created by liron on 9/2/15.
 */

'user strict';

var express = require('express');
var router = express.Router();
var ledDao = require('./LedDao');
//var spark = require('spark');
//var _ = require('lodash');
//var logger = require('log4js').getLogger('aura');


function addNewLedService(/*req,*/ res){

    var mockedLedEntry = {timestamp:'1234', deviceID:'a123', volume:3};

    ledDao.Leds.createLedEntryPerDevice(mockedLedEntry).then(function success(doc){
        res.send({msg:'new added led: ' + JSON.stringify(doc)});
    }, function error(err){
        res.send({msg:err});
    });

}
router.get('/add', addNewLedService);

function fetchLedService(/*req,*/ res){

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

module.exports = router;
