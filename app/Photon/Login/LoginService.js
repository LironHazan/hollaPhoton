/**
 * Created by liron on 9/4/15.
 */

'use strict';
angular.module('Photon').service('LoginService', function ( $http ) {

    //todo: save data in cookie so it will be persist

    var cache = null;

    function login(userDetails){
        cache = null;
        return $http.post('/backend/led/login', userDetails);
    }

    function storeLoginDetails(creds){
        cache = creds;
    }

    function getLoginCache(){

        return cache;
    }

    function getLoggedUser() {
        return $http.get('/backend/session/user');
    }

    this.getLoginCache = getLoginCache;
    this.storeLoginDetails = storeLoginDetails;
    this.login = login;
    this.getLoggedUser = getLoggedUser;
});
