/**
 * Created by liron on 9/4/15.
 */
'use strict';

angular.module('Aura', [
    'ngAnimate',
    'toastr',
    'ngCookies',
    'ngResource',
    'ui.router',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'ngJustGage'
]);


angular.module('Aura').config(function($stateProvider, $httpProvider) {
    $stateProvider.state('login', { // first state is login page
        url: '/login',
        templateUrl: 'Aura/Login/login.html',
        controller: 'LoginCtrl'
    }).state('home', {
        url: '/home',
        templateUrl: 'Aura/AuraBoard/aura.html' //controller inline AuraCtrl
    });

    $httpProvider.interceptors.push('loginHttpInterceptor'); //doesn't actually work
});
