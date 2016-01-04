/**
 * Created by liron on 12/24/15.
 */

var CronJob = require('cron').CronJob;

new CronJob('* * 3 * * 0-6', function() { //run everyday once in 3 hours
    console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');