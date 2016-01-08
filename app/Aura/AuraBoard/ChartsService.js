/**
 * Created by liron on 9/5/15.
 */

'use strict';
angular.module('Aura').service('ChartsService', function ( $http ) {

    this.getLastHourData = function () {

        return $http.get('/backend/dust/lastHour')
    };


});
