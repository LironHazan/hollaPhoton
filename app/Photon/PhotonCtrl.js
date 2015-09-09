/**
 * Created by liron on 9/4/15.
 */
'use strict';

angular.module('Photon').controller('PhotonCtrl', function ($rootScope, $scope, $modal, DevicesService, LoginService, SensorFlowService) {

    $rootScope.globals = {
        creds : {} //todo: check why in refresh the state wont be saved
    };
    $scope.devicesList = [];
    $scope.logOut =true;

    LoginService.getLoggedUser().then(function (data) {
        $scope.greeting = 'Hello! you are connected as: ' + data.data.name;
        $scope.loggedIn = true;

    });

    //fetch devices on refresh (user details are on session)
    DevicesService.getListDevices().then(function success(list){

        $scope.loginBtn = false;
        $scope.logOut =true;

        $scope.devicesList = list.data.listOfDevices;
        if( $scope.devicesList.length === 0){
            $scope.emptyList = true;
        }
        _.each($scope.devicesList, function(device){
            if(device.connected){

                //todo: put in a function outside and fix ret result
                SensorFlowService.getPhotoresistorVolts(device).then(function success(data){
                $scope.volts = parseFloat(data.data.result);// parseFloat(data.data.result).toFixed(2);
                    if(data.status===200){

                    }

             /*       volts = parseFloat(data.result);

                    volts = volts.toFixed(2);*/
                });
            }
        });


    }, function error(err){
        console.log(err);
        $scope.loginBtn = true;
        $scope.loggedIn = false;
    });

    $scope.animationsEnabled = true;

    $scope.open = function () {

        $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'Photon/Login/LoginModal.html',
            controller: 'LoginCtrl',
            windowClass: 'center-modal',
            size:'sm',
            resolve: {
                item: function () {
                    return $scope.item;
                }
            }
        });
        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };

    };

    $rootScope.$on('userLoggedIn',function() {
        var creds = LoginService.getLoginCache();
        $rootScope.globals.creds = creds;
        $scope.loggedIn = true;
        $scope.loginBtn = false;
        $scope.logOut =true;
        $scope.greeting = 'Hello! you are connected as: ' + creds.email;
    });

    $scope.getDevices = function(){
        DevicesService.getListDevices().then(function success(list){
            $scope.devicesList = list.data.listOfDevices;
            if( $scope.devicesList.length === 0){
                $scope.emptyList = true;
            }
        }, function error(err){
            console.log(err);
        });
    };

    $scope.logout = function(){

        LoginService.logout().then(function success(data){
            //todo: this is ugly - fix it
            DevicesService.getListDevices().then(function success(list){

            }, function error(err){
                $scope.loginBtn = true;
                $scope.logOut =false;
                $scope.loggedIn = false;
                $scope.devicesList = list.data.listOfDevices;
            });

        }, function err(err){

        });
    };



    $scope.value1 = 42;
    $scope.value2 = 42;
    setInterval(function(){
        $scope.$apply(function() {
            $scope.value1 = getRandomInt(10, 90);
            $scope.value2 = getRandomInt(10, 90);
        });
    }, 1000);

});
