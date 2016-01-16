/**
 * Created by liron on 9/5/15.
 */

'use strict';
angular.module('Aura').service('DevicesService', function ( $http ) {

    function getListDevices(){

        return $http.get('/backend/devices/listDevices');
    }

    function getDevice(id){

        return $http.post('/backend/devices/device', {id:id});
    }

    this.getListDevices = getListDevices;
    this.getDevice = getDevice;
});
