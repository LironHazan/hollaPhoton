/**
 * Created by liron on 12/10/15.
 */

'use strict';

angular.module('Aura').controller('switchTabsCtrl', function ($scope, $state, LoginService) {

    // using https://github.com/angular-ui/ui-router/wiki + bootstrap ui (tabset)

    LoginService.getLoggedUser().then(function (data) {
        $scope.greeting = 'Hey! you are connected as: ' + data.data.name;
        $scope.loggedIn = true;
        $scope.showChart = true;
        $scope.devicesTable = true;
        // $scope.showGauge = true;

    });

    $scope.logout = function(){

        LoginService.logout().then(function success(/*data*/){
            //todo: this is ugly - fix it
            // $scope.showGauge = false;
            $scope.showChart = false;
            $scope.devicesTable = false;
            $scope.tabset = false;

            $state.go('login'); //back to login page when logged out

            //DevicesService.getListDevices().then(function success(/*list*/){
            //
            //}, function error(/*err*/){
            //    $scope.loginBtn = true;
            //    $scope.logOut =false;
            //    $scope.loggedIn = false;
            //    //  $scope.devicesList = list.data.listOfDevices;
            //});

        }, function err(/*err*/){

        });
    };


    $scope.tabs = [
        { heading: 'My Devices', route:'tabs-switch.devices', active:false },
        { heading: 'Charts', route:'tabs-switch.charts', active:false }
    ];

    $scope.go = function(route){ // gets tabs.route (wanted state)
        $state.go(route);
    };

    $scope.active = function(route){
        return $state.is(route); // checks for the full state name and returns boolean
    };

    $scope.$on("$stateChangeSuccess", function() { // broadcast from rootScope and fired once the state transition is complete
        $scope.tabs.forEach(function(tab) {
            tab.active = $scope.active(tab.route);
        });
    });
});
