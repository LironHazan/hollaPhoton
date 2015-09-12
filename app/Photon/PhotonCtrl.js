/**
 * Created by liron on 9/4/15.
 */
'use strict';

angular.module('Photon').controller('PhotonCtrl', function ($rootScope, $scope, $modal, DevicesService, LoginService,toastr, /*SensorFlowService,*/ $http, $state) {

    var toastrOpts={closeButton: true, extendedTimeOut: 3000, tapToDismiss: false, positionClass: 'toast-bottom-right'};

    $rootScope.globals = {
        creds : {}
    };
    $scope.devicesList = [];
    $scope.logOut =true;
    $scope.volts = 0;
    $scope.deviceName = "deviceName";

    $scope.$state = $state;

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



                //_device = device;

              /*  setInterval(function(){
                    $scope.$apply(function() {
                        getReading(device).then(function success(data){
                            if(data.status===200){
                                var volts = parseFloat(data.data.data.result);
                                volts = volts.toFixed(2);
                                $scope.volts = volts;

                            }
                        });
                    });
                }, 3000);*/

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
        DevicesService.getListDevices();
    });

   /* $scope.getDevices = function(){
        DevicesService.getListDevices().then(function success(list){
            $scope.devicesList = list.data.listOfDevices;
            if( $scope.devicesList.length === 0){
                $scope.emptyList = true;
            }
        }, function error(err){
            console.log(err);
        });
    };*/

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

    //var device;

    function getReading(device){
        return  $http.post('/backend/photoresistor/volts', {id: device})
    }

    $scope.getId = function(){
     var deviceID =  $("#device-id").text();
       // return deviceID.trim();
        deviceID = deviceID.trim();
        var getVolts = setInterval(function (){
            $scope.$apply(function() {
                getReading(deviceID).then(function success(data){
                    if(data.status===200){
                        var volts = parseFloat(data.data.data.result);
                        volts = volts.toFixed(2);
                        $scope.volts = volts;

                    }
                }, function error(err){
                    toastr.error(err.data, 'Error While Trying To read volts, Device is not connected' , toastrOpts);

                });
            });
        }, 3000);

        //clearInterval(getVolts);
        /*
                DevicesService.getDevice(deviceID).then(function success(data){
                    setInterval(function(){
                        $scope.$apply(function() {
                            getReading(deviceID).then(function success(data){
                                if(data.status===200){
                                    var volts = parseFloat(data.data.data.result);
                                    volts = volts.toFixed(2);
                                    $scope.volts = volts;

                                }
                            });
                        });
                    }, 3000);
                }, function error(){

                });
        */

    };



});
