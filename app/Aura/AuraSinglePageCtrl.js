/**
 * Created by liron on 12/10/15.
 */

'use strict';

angular.module('Aura').controller('auraSingleCtrl', function ($scope, $state, LoginService, DevicesService, ChartsService, toastr, $timeout, $log) {


    // using https://github.com/angular-ui/ui-router/wiki + bootstrap ui (tabset)

    var toastrOpts={closeButton: true, extendedTimeOut: 3000, tapToDismiss: false, positionClass: 'toast-bottom-right'};

    $scope.dust = 0; //init value for justgage directive
    $scope.devicesNameList = []; // dynamic list for dropdown
    $scope.devicesMap = {}; // device name mapped to id
    $scope.lineChartdata = [];

    $scope.devicesList = [];

    DevicesService.getListDevices().then(function success(list){

        $scope.devicesList = list.data.listOfDevices;

        if( $scope.devicesList.length === 0){
            $scope.emptyList = true;

        }

    });

    //fetch devices and populate devicesMap and devicesNameList
    DevicesService.getListDevices().then(function success(list){

        // handle an empty list state - no registered devices
        if( list.data.listOfDevices.length === 0){
            return;
        }
        _.each(list.data.listOfDevices, function(device){
            if(device.connected === true){ // show only connected device in dropdown list
                $scope.devicesNameList.push(device.name);
            }
            // map name to id
            $scope.devicesMap[device.name] = device.id;
        });

    }, function error(err){
        console.log(err);
    });

    // currently not generic, collecting dustDensity only.
    function fetchDustDensity(id){

        ChartsService.fetchDustDensityById(id).then(function success(data){
            if(data.status===200){
                var dust = parseFloat(data.data.data.result);
                dust = dust.toFixed(2);
                $scope.dust = dust;

            }
        }, function error(err){
            toastr.error(err.data, 'Error While Trying To read dust density, Device is not connected', toastrOpts);

        });
    }

    // sample the selected device according to its Id and get the metric every 6 secs.
    $scope.sampleSelectedDeviceMetric = function(device){
        $log.log('device is now: ', device);
        // dust density val for gauge
        var id = $scope.devicesMap[device];
        // when selecting a device strting to collect and save its metrics in the backend
        setInterval(function (){
            $scope.$apply(function() {
                fetchDustDensity(id);
            });
        }, 6000);

    };


    var timeoutPromise;
    var getDataForLineChart = function(){

        ChartsService.getLastHourData().then(function success(data){

            var timeset = [];

            _.each(data.data, function(date){
                var entry = {};
                // var format = d3.time.format('%H:%M');
                entry.x =  new Date(date.x);//format(new Date(date.x))
                entry.value = date.value;
                timeset.push(entry);
            });

            $scope.lineChartdata = timeset;

            timeoutPromise = $timeout(getDataForLineChart, 3000); // polling the server for data

        });
    };

    $scope.$on('$destroy',function(){
        $timeout.cancel(timeoutPromise)
    });

    getDataForLineChart();


    //linechart options
    $scope.options = {
        axes: {
            x: {
                key: 'x',
                type: 'date'//'date' //linear
            },
            y: {type: 'linear'}
        },
        series: [
            {y: 'value', color: '#009688', thickness: '2px', type: 'linear', striped: true, label: 'Dust-Density'}
        ],
        lineMode: 'linear',
        tension: 0.7,
        tooltip: {mode: 'scrubber', formatter: function(x, y, series) {return y;}},
        drawLegend: true,
        drawDots: true,
        hideOverflow: true,
        columnsHGap: 7
    };


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

        }, function err(/*err*/){

        });
    };



    //$scope.tabs = [
    //    { heading: 'My Devices', route:'tabs-switch.devices', active:false },
    //    { heading: 'Charts', route:'tabs-switch.charts', active:false }
    //];
    //
    //$scope.go = function(route){ // gets tabs.route (wanted state)
    //    $state.go(route);
    //};
    //
    //$scope.active = function(route){
    //    return $state.is(route); // checks for the full state name and returns boolean
    //};
    //
    //$scope.$on("$stateChangeSuccess", function() { // broadcast from rootScope and fired once the state transition is complete
    //    $scope.tabs.forEach(function(tab) {
    //        tab.active = $scope.active(tab.route);
    //    });
    //});
});
