/**
 * Created by liron on 12/24/15.
 */

'use strict';
//var CronJob = require('cron').CronJob;
var dustDensityService = require('./DustDensityService');
var logger = require('log4js').getLogger('aura');


//todo: continue
//new CronJob('* * 3 * * 0-6', function() { //run everyday once in 3 hours
//    console.log('You will see this message every second');
//}, null, true, 'America/Los_Angeles');



/**
 * Simple quick way will be to setInterval and remove data every 3 hours
 */
exports.deleteOldEntries = function(){
    logger.info('deleteOldEntries was invoked');
    setInterval(() => {
        logger.info('old dust density deletion is on');
        dustDensityService.deleteOldData().then((resolve)=>{
            logger.info('Number of removed entries: ' + resolve);

        }, (err) =>{
            logger.error('Error while trying to remove old entries' , err);
        })
    }, 10800000); // run every 3 hours

};