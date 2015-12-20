/**
 * Created by liron on 12/20/15.
 */
'use strict';

//todo: continue
class DustDensityCollector {

    constructor(creds, refreshIntervalId) {
        this._creds = creds;
        this._refreshIntervalId = refreshIntervalId;

    }


    collectAndStoreMetrics(credentials, deviceId, isCollecting) {
        if (!isCollecting) {
            logger.info('stop collecting metrics');
            clearInterval(this._refreshIntervalId.id);
            return;
        }

        this.refreshIntervalId.id = setInterval(function () {
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
    }


}

exports.DustDensityCollector = DustDensityCollector;