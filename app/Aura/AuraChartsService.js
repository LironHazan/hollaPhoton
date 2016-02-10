/**
 * Created by liron on 9/5/15.
 */

'use strict';
angular.module('Aura').service('ChartsService', function ( $http , $q) {

    this.getLastHourData = function () {

        return $http.get('/backend/dust/lastHour')
    };


    this.fetchDustDensityById = function(device){
        return  $http.post('/backend/dust/dustDensity', {id: device});

    };

});
