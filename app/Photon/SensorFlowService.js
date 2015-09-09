/**
 * Created by liron on 9/9/15.
 */

'use strict';
angular.module('Photon').service('SensorFlowService', function ( $http ) {

    function getPhotoresistorVolts(device){

        return $http.post('/backend/photoresistor/volts', device);
    }

    this.getPhotoresistorVolts = getPhotoresistorVolts;
});