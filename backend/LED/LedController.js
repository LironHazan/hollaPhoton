/**
 * Created by liron on 9/2/15.
 */

var express = require('express');
var router = express.Router();
var ledDao = require('./LedDoa');
var loginToParicale = require('../Login/LoginToParticle');
var spark = require('spark');
var _ = require("lodash");
var sessionLoginDao = require('../Login/User');
var sessionLoginMiddleware = require('../Login/SessionLoginMiddleware');

//todo: may need to change to 'add or update'
var timestamp = new Date().getTime().toString();
var credsCache = null;

function addNewLedService(req, res){

    var mockedLedEntry = {timestamp:timestamp, deviceID:'a123', volume:3};

    ledDao.Leds.createLedEntryPerDevice(mockedLedEntry).then(function success(doc){
        res.send({msg:'new added led: ' + JSON.stringify(doc)});
    }, function error(err){
        res.send({msg:err});
    });

}
router.get('/add', addNewLedService);

function fetchLedService(req, res){

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

/*function login(req, res){
    var creds = req.body;
    credsCache = creds;

    loginToParicale.loginToSpark(creds).then(function success(token){
        res.send({msg: 'Hey '+ creds.email + ' you are currently logged in to the particle cloud'});
    }, function error(err){
        res.status(404).send(err.message);
    });
}
router.post('/login', login);*/

function login (req, res) {

    var creds = req.body;
    credsCache = creds;

    sessionLoginDao.User.storeAndSignUser({email: creds.email}).then(
        function success(user) {

            req.session.userId = user._id.toString();

            loginToParicale.loginToSpark(creds).then(function success(token) {
                res.status(200).send({msg: 'Hey ' + creds.email + ' you are currently logged in to the particle cloud'});

            }, function error(err) {
                res.status(404).send(err.message);
            });

        }, function error(err) {
            res.status(404).send(err);
        }
    );

}
router.post('/login', login);

function logout(req, res){
    credsCache = null;
    //todo add remove token
    res.status(200).send({msg:'logged out'});
}
router.post('/logout', logout); //or get

function parseListOfDevices(devices){



}

function getListOfDevices(req, res){

    if(credsCache){
        spark.login({ username: credsCache.email, password: credsCache.passwd}).then(function success(){
            spark.listDevices().then(function(devices){
                var listOfDevices = [];
                _.each(devices, function(device){
                    var _device = {id:device.id, name:device.name, connected:device.connected, lastApp:device.lastApp };
                    listOfDevices.push(_device);

                });
                res.send({listOfDevices:listOfDevices});
            });
        }, function error(err){
            logger.error(err);
        });


    }else{
        res.status(401).send({msg:'pls login'});
    }


}
router.get('/listDevices', sessionLoginMiddleware.getUserSessionId, getListOfDevices);


module.exports = router;
