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
var logger = require('log4js').getLogger('aura');

function getPhotoresistorMetrics(req, res){
    var device = req.body;
    if(req.creds){
        var passwd = sessionLoginMiddleware.getUserPass();
        spark.login({ username: req.creds, password: passwd}).then(function success(){

            spark.getVariable(device.id, 'volts', function(err, data) {
                if (err) {
                    res.status(404).send({msg:err});
                } else {
                    var timestamp = new Date().getTime();//.toString();
                    var date = new Date();
                    var day = date.getDate();
                    var month = date.getMonth()+1;
                    var year = date.getFullYear();
                    var hour = date.getHours();
                    var minutes = date.getMinutes();
                    if(hour < 10){
                        hour = '0'+hour;
                    }
                    if(minutes <10){
                        minutes = '0'+minutes;
                    }
                    var time = year + '-' + month + '-' + day +'T' + hour + ':' + minutes;

                    var savedData = {timestamp:timestamp, time:time, deviceId:device.id, volts:data.result};
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


function getLastHourData(req, res){
    var date = new Date().getTime();

    photoresistorDao.Photoresistor.findEntries({
        timestamp: { // 60 minutes ago (from now)
            $gt: date - 1000 * 60 * 60
        }
    }).then(function success(data){

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
            //d.timestamp
            var newDate = d.time;//new Date(d.time);

            sendData.push({x:d.timestamp/*d.timestamp*/, value:d.volts})
        });

        res.status(200).send(sendData);
    });
}

router.get('/lastHour', /*sessionLoginMiddleware.getUserAndCreds,*/ getLastHourData);

module.exports = router;