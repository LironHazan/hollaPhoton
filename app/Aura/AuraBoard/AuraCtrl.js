/**
 * Created by liron on 9/4/15.
 */
'use strict';

angular.module('Aura').controller('AuraCtrl', function ($rootScope, $scope, DevicesService, LoginService,toastr, $http, $state, $log) {

    var toastrOpts={closeButton: true, extendedTimeOut: 3000, tapToDismiss: false, positionClass: 'toast-bottom-right'};

    $rootScope.globals = {
        creds : {}
    };
    $scope.devicesList = [];
    $scope.logOut =false;
    $scope.volts = 0;
    $scope.deviceName = 'deviceName';

  /*  $scope.tabs = [
        { title:'Charts', content:'Dynamic content 1' }
    ];*/

//for dropdown
    $scope.devices = [];

    $scope.status = {
        isopen: false
    };

    $scope.toggled = function(/*open*/) {
      //  $log.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };

    $scope.getSelectedDevice = function(device){
        $log.log('device is now: ', device);
        $http.post('/backend/devices/device-id', {name:device}).then(function success(data){
            var id = data.data.id;
            $log.log('device id is now: ', id);
          //  var getVolts =
                setInterval(function (){
                $scope.$apply(function() {
                    getReading(id).then(function success(data){
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

        });
    };

    $scope.$state = $state;

    LoginService.getLoggedUser().then(function (data) {
        $scope.greeting = 'Hey! you are connected as: ' + data.data.name;
        $scope.loggedIn = true;
        $scope.showChart = true;
        $scope.devicesTable = true;
        $scope.showGauge = true;

    });



    //fetch devices on refresh (user details are on session)
    DevicesService.getListDevices().then(function success(list){

        //$scope.loginBtn = false;
        //$scope.logOut =true;
        $scope.tabset = true;
        $scope.showGauge = true;


        $scope.devicesList = list.data.listOfDevices;
        if( $scope.devicesList.length === 0){
            $scope.emptyList = true;

        }
        _.each($scope.devicesList, function(device){
            $scope.devices.push(device.name);
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

    //$scope.open = function () {
    //
    //    $modal.open({
    //        animation: $scope.animationsEnabled,
    //        templateUrl: 'Photon/Login/LoginModal.html',
    //        controller: 'LoginCtrl',
    //        windowClass: 'center-modal',
    //        size:'sm',
    //        resolve: {
    //            item: function () {
    //                return $scope.item;
    //            }
    //        }
    //    });
    //    $scope.toggleAnimation = function () {
    //        $scope.animationsEnabled = !$scope.animationsEnabled;
    //    };
    //
    //};

    $rootScope.$on('userLoggedIn',function() {
        var creds = LoginService.getLoginCache();
        $rootScope.globals.creds = creds;
        $scope.loggedIn = true;
       // $scope.loginBtn = false;
        $scope.logOut =true;
        $scope.greeting = 'Hello! you are connected as: ' + creds.email;
        $scope.showGauge = true;
        $scope.tabset = true;

        DevicesService.getListDevices().then(function success(list){

            $scope.showChart = true;

            $scope.devicesList = list.data.listOfDevices;
            if( $scope.devicesList.length === 0){
                $scope.emptyList = true;

            }
            _.each($scope.devicesList, function(device){
                $scope.devices.push(device.name);
            });
            $scope.devicesTable = true;


        }, function error(err){
            console.log(err);
            $scope.loginBtn = true;
            $scope.loggedIn = false;
        });



    });


    $scope.logout = function(){

        LoginService.logout().then(function success(/*data*/){
            //todo: this is ugly - fix it
            $scope.showGauge = false;
            $scope.showChart = false;
            $scope.devicesTable = false;
            $scope.tabset = false;
            $state.go('login');

            DevicesService.getListDevices().then(function success(/*list*/){

            }, function error(/*err*/){
                $scope.loginBtn = true;
                $scope.logOut =false;
                $scope.loggedIn = false;
              //  $scope.devicesList = list.data.listOfDevices;
            });

        }, function err(/*err*/){

        });
    };

    $scope.data = [ ];


    var getDataForLineChart = function(){
        $http.get('/backend/photoresistor/lastHour').then(function success(data){


                var timeset = [];

            _.each(data.data, function(date){
                var entry = {};
               // var format = d3.time.format('%H:%M');
                entry.x =  new Date(date.x);//format(new Date(date.x))
                entry.value = date.value;
                timeset.push(entry);
            });

            $scope.data = timeset;

        });
    };

    getDataForLineChart();
    $scope.getLineChartData = function(){
        getDataForLineChart();
    };

    $scope.options = {
        axes: {
            x: {
                key: 'x',
                type: 'date'//'date' //linear
            },
            y: {type: 'linear'}
        },
        series: [
            {y: 'value', color: 'steelblue', thickness: '2px', type: 'column', striped: true, label: 'Volts'}
        ],
        lineMode: 'linear',
        tension: 0.7,
        tooltip: {mode: 'scrubber', formatter: function(/*x, y, series*/) {return 'volts';}},
        drawLegend: true,
        drawDots: true,
        hideOverflow: false,
        columnsHGap: 7
    };
    //var device;

    function getReading(device){
        return  $http.post('/backend/photoresistor/volts', {id: device});
    }

/*    $scope.getId = function(){
     var deviceID =  $('#device-id').text();
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
        *//*
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
        *//*

    };*/



});
