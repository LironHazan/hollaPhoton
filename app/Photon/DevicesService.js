/**
 * Created by liron on 9/5/15.
 */

'use strict';
angular.module('Photon').service('DevicesService', function ( $http ) {

    function getListDevices(){

        return $http.get('/backend/led/listDevices');
    }

    this.getListDevices = getListDevices;
});
