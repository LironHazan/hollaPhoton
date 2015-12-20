/**
 * Created by liron on 12/19/15.
 */
'use strict';

var logger = require('log4js').getLogger('aura');
var dustDensityService = require('./DustDensityService');
var spark = require('spark');
var Q = require('q');

var refreshIntervalId = {id:null}; //save it cause service is singletone

exports.getDustDensityMetrics = function(credentials, deviceId){
    var deferred = Q.defer();
    spark.login(credentials).then(function success(){
        spark.getVariable(deviceId, 'dustDensity', (err, data) => {
            if (err) {
                logger.error('Error while getting variable data: ' + err);
                deferred.reject(err);
            } else {
                deferred.resolve(data);
            }
        });

    }, function error(err){
        logger.info('Error while login: ' + err);
        deferred.reject(err);
    });
    return deferred.promise;
};


exports.collectAndStoreMetrics = function(credentials, deviceId, isCollecting){

    if (!isCollecting) {
        logger.info('stop collecting metrics');
        clearInterval(refreshIntervalId.id);
        return;
    }

    refreshIntervalId.id = setInterval(function () {
        logger.info('collecting dust density');
        spark.login(credentials).then(function success() {
            spark.getVariable(deviceId, 'dustDensity', (err, data) => {
                if (err) {
                    logger.info('Error while getting variable data: ' + err);

                } else {
                    var timestamp = new Date().getTime();//.toString();
                    var date = new Date();
                    var day = date.getDate();
                    var month = date.getMonth() + 1;
                    var year = date.getFullYear();
                    var hour = date.getHours();
                    var minutes = date.getMinutes();
                    if (hour < 10) {
                        hour = '0' + hour;
                    }
                    if (minutes < 10) {
                        minutes = '0' + minutes;
                    }
                    var time = year + '-' + month + '-' + day + 'T' + hour + ':' + minutes;

                    var savedData = {
                        timestamp: timestamp,
                        time: time,
                        deviceId: deviceId,
                        dustDensity: data.result
                    };
                    // deferred.resolve(data);
                    dustDensityService.createNewEntry(savedData).then(function success(doc) {
                        logger.info('entry was saved: ' + JSON.stringify(doc));
                    }, function err(err) {
                        logger.error('could not save entry: ', err);
                    });
                }
            });

        }, function error(err) {
            logger.info('Error while login: ' + err);
        });

    }, 60000);

};

