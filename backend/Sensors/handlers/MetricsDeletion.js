/**
 * Created by liron on 12/24/15.
 */

'use strict';

//todo: continue
//var CronJob = require('cron').CronJob;

//new CronJob('* * 3 * * 0-6', function() { //run everyday once in 3 hours
//    console.log('You will see this message every second');
//}, null, true, 'America/Los_Angeles');


var dustDensityService = require('../DustDensity/DustDensityService');
var logger = require('log4js').getLogger('aura');

//todo: register other sensors data for deletion

/**
 * Simple continues way to delete dustdensity is to setInterval and remove data every 3 hours
 */

exports.deleteOldEntries = function(){
    logger.info('deleteOldEntries was invoked');

    dustDensityService.deleteOldData(); // upon server restart

    setInterval(() => {
        //schedules the repeating execution of dust density deletion, won't be stopped since didn't call clearInterval()
        logger.info('old dust density deletion is on');
        dustDensityService.deleteOldData().then((resolve)=>{
            logger.info('Number of removed entries: ' + resolve);

        }, (err) =>{
            logger.error('Error while trying to remove old entries' , err);
        });
    }, 10800000); // run every 3 hours

};