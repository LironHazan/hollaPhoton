/**
 * Created by liron on 12/19/15.
 */
'use strict';

var dustDensityDao = require('./DustDensityDao');

exports.findLastHourEntries = function(){
    var date = new Date().getTime();
    return dustDensityDao.DustDensity.findEntries({
        timestamp: { // 60 minutes ago (from now)
            $gt: date - 1000 * 60 * 60
        }
    });
};

exports.findLast24HrEntries = function(){
    var date = Date.now()*1000;
    return dustDensityDao.DustDensity.findEntries({
        timestamp: { // 60 minutes ago (from now)
            $gt: date - 24*60*60
        }
    });
};

exports.createNewEntry = function(savedData){
    return dustDensityDao.DustDensity.createEntryPerDevice(savedData);
};

exports.deleteOldData = function(){ // delete data older than 1hr
    var date = Date.now()*1000;
    return dustDensityDao.DustDensity.deleteData({timestamp: { // remove all less than 1hr
        $lt: date - 1000*60*60
    }},{ multi: true }); // multi options set to true for removing multiple docs
};