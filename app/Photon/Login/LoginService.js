/**
 * Created by liron on 9/4/15.
 */

'use strict';
angular.module('Photon').service('LoginService', function ( $http ) {

    function login(userDetails){

        return $http.post('/backend/led/login', userDetails);
    }

    this.login = login;
});
