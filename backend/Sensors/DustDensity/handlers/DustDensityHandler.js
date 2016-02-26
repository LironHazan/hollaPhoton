/**
 * Created by liron on 12/19/15.
 */
'use strict';

var logger = require('log4js').getLogger('aura');
var dustDensityService = require('./../DustDensityService');
var spark = require('spark');

exports.getDustDensityMetrics = function(credentials, deviceId){
return new Promise( (resolve, reject) => {
    spark.login(credentials).then(() => {
        spark.getVariable(deviceId, 'dustDensity', (err, data) => {
            if (err) {
                logger.error('Error while getting variable data: ' + err);
                reject(err);
                return;
            }
            resolve(data);

        });

    }, (err) => {
        logger.info('Error while login: ' + err);
        reject(err);
    });

});
};

function formatTime(){
    // return current time in a format used by the client
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
    return year + '-' + month + '-' + day + 'T' + hour + ':' + minutes;
}

exports.collectAndStoreMetrics = function(credentials, deviceId){
    // saving new entry every 60000 sec
    setInterval(() => {
        logger.info('collecting dust density');
                exports.getDustDensityMetrics(credentials, deviceId).then((data) => {
                    // get current time and save entry
                    var timestamp = new Date().getTime();
                    var time = formatTime();

                    var savedData = {timestamp: timestamp, time: time, deviceId: deviceId, dustDensity: data.result};

                    // saving dust density in db
                    dustDensityService.createNewEntry(savedData).then((doc) => {
                        logger.info('entry was saved: ' + JSON.stringify(doc));
                    }, (err) => {
                        logger.error('could not save entry: ', err);
                    });
                });

    }, 6000); //todo: change interval to every sec instead - changed from 60000 to 6000

};

