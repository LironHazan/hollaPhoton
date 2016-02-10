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
    'ngJustGage',
    'ngStorage'
]);


    angular.module('Aura').config(function($stateProvider, $httpProvider) {
    $stateProvider.state('aura', {
        url: '/aura',
        controller: 'AuraProxyCtrl'
    }).state('login', {
        url: '/login',
        templateUrl: 'Aura/Login/Login.html',
        controller: 'LoginCtrl'
    }).state('home', {
        url: '/home',
        templateUrl: 'Aura/AuraSinglePage.html'
    });

    $httpProvider.interceptors.push('loginHttpInterceptor'); //doesn't actually work
});
