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
    'ui.bootstrap'
]);


    angular.module('Aura').config(function($stateProvider, $httpProvider) {
    $stateProvider.state('aura', {
        url: '/aura',
        controller: 'AuraProxyCtrl'
    }).state('login', {
        url: '/login',
        templateUrl: 'Aura/Login/login.html',
        controller: 'LoginCtrl'
    }).state('tabs-switch', {
        url: '/home',
        templateUrl: 'Aura/AuraBoard/auraTabsSwitch.html'
    });

    $httpProvider.interceptors.push('loginHttpInterceptor'); //doesn't actually work
});
