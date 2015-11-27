/**
 * Created by liron on 9/4/15.
 */
'use strict';

angular.module('Photon', [
    'ngAnimate',
    'toastr',
    'ngCookies',
    'ngResource',
    'ui.router',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap'
]);


angular.module('Photon').config(function($stateProvider) {

    $stateProvider.state('Photon', {
        url: '/home',
        templateUrl: 'Photon/Photon.html',
        controller: 'PhotonCtrl'
    }).state('Photon.graphs', {
        url: '/graphs',
        templateUrl: 'Photon/Graphs/graphs.html'
    });

/*    $routeProvider
        .when('/graphs/', {
            templateUrl: 'Photon/Graphs/graphs.html'
        });*/


});
