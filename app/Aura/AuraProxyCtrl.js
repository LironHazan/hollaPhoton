/**
 * Created by liron on 9/4/15.
 */

'use strict';

angular.module('Aura').controller('AuraProxyCtrl', function ($scope, LoginService, $state) {

// check if user is logged in - if so route him to /home if not route him to /login page

    LoginService.getLoggedUser().then(function logged() {
        $state.go('tabs-switch');
    }, function notLogged(){
        $state.go('login');
    });

});
