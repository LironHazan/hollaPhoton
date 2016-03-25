/**
 * Created by liron on 9/12/15.
 */
'use strict';
var express = require('express');
var router = express.Router();
var handler = require('./handlers/DevicesHandler');
var loginHandler = require('../Login/handlers');
var sessionLoginMiddleware = require('../Login/SessionLoginMiddleware');
var logger = require('log4js').getLogger('aura');

var particleLoginObj;
// gets device data by its id
function getDeviceById(req, res){
    var device = req.body;
    if(!req.creds) {
        res.status(401).send({msg:'pls login'});
        return;
    }
    particleLoginObj = new loginHandler.login.LoginHandler({email:req.creds, passwd:sessionLoginMiddleware.getUserPass()});
    particleLoginObj.login().then(() => {
            handler.getDevice(device.id).then((device) => {
                logger.info('Device name: ' + device.name);
                var _device = {id: device.id, name: device.name, connected: device.connected, lastApp: device.lastApp};
                res.status(200).send({data: _device});

            }, (err) => {
                res.status(400).send({msg: err});

            });

        }, (err) => {
            res.status(401).send({msg: err});
        });
}
router.post('/device', sessionLoginMiddleware.getUserAndCreds, getDeviceById);

// get devices from spark and return new list of filtered objects
function getListOfDevices(req, res){

    if(req.creds){ // creds = email
        particleLoginObj = new loginHandler.login.LoginHandler({email:req.creds, passwd:sessionLoginMiddleware.getUserPass()});
        particleLoginObj.login().then(()=>{
            handler.getDevices().then(function(devices){
                var listOfDevices = handler.filteredListOfDevices(devices);
                res.send({listOfDevices:listOfDevices});
            });
        }, (err) =>{
            logger.error('login error' , err);
        });

    }else{
        res.status(401).send({msg:'pls login'});
    }


}
router.get('/listDevices', sessionLoginMiddleware.getUserAndCreds, getListOfDevices);

module.exports = router;
