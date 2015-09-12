/**
 * Created by liron on 9/9/15.
 */

'use strict';
var express = require('express');
var router = express.Router();
var photoresistorDao = require('./PhotoresistorDao');
var spark = require('spark');
var _ = require("lodash");
var sessionLoginMiddleware = require('../Login/SessionLoginMiddleware');
var logger = require('log4js').getLogger('PhotoresistorController');

var timestamp = new Date().getTime().toString();

function getPhotoresistorMetrics(req, res){
    var device = req.body;
    if(req.creds){
        var passwd = sessionLoginMiddleware.getUserPass();
        spark.login({ username: req.creds, password: passwd}).then(function success(){

            spark.getVariable(device.id, 'volts', function(err, data) {
                if (err) {
                    res.status(404).send({msg:err});
                } else {
                    var savedData = {timestamp:timestamp, deviceId:device.id, volts:data.result};
                    photoresistorDao.Photoresistor.createEntryPerDevice(savedData).then(function success(doc){
                        logger.info('entry was saved: ' + JSON.stringify(doc));
                    }, function err(err){
                        logger.error('could not save entry: ' ,  err);
                    });

                    res.status(200).send({data:data});
                }
            });


        }, function error(err){
            res.status(401).send({msg:err});
        });

    }else{
        res.status(401).send({msg:'pls login'});
    }


}
router.post('/volts', sessionLoginMiddleware.getUserAndCreds, getPhotoresistorMetrics);

module.exports = router;