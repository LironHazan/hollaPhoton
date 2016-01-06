/**
 * Created by liron on 9/4/15.
 */
'use strict';

angular.module('Aura').controller('chartsCtrl', function ($scope, DevicesService, ChartsService, toastr, $http, $log,  /*$localStorage,*/ $timeout) {

    var toastrOpts={closeButton: true, extendedTimeOut: 3000, tapToDismiss: false, positionClass: 'toast-bottom-right'};

    $scope.dust = 0; //init value for justgage directive
    $scope.devicesNameList = []; // dynamic list for dropdown
    $scope.devicesMap = {}; // device name mapped to id
    $scope.lineChartdata = [];

    // returns true or false according to checkbox
    //$scope.$storage = $localStorage; //should use to fix refresh
    //$scope.collectMetrics = function(){
    //    $scope.$storage.collect = $scope.collect;
    //
    //    //emit event
    //    $scope.$broadcast('collectChange', $scope.collect);
    //   // return $scope.collect;
    //};


    //$scope.$on('collectChange', function(event, isCollecting) {
    //    console.log(isCollecting);
    //    // when selecting a device strting to collect and save its metrics in the backend
    //    if($scope.$storage.deviceid){
    //        $http.post('/backend/dust/collect',  {id: $scope.$storage.deviceid, collect:isCollecting});
    //    }
    //});

    //todo: need to fetch the metrics constatnly once started - use local-storage? or move logic to backend to save data all the time.
    //todo: drop down should display only connected devices

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

    //todo: put in external service
    function fetchDustDensityById(device){
        return  $http.post('/backend/dust/dustDensity', {id: device});

    }

    // currently not generic, collecting dustDensity only.
    function getMetric(id){

        fetchDustDensityById(id).then(function success(data){
            if(data.status===200){
                var dust = parseFloat(data.data.data.result);
                dust = dust.toFixed(2);
                $scope.dust = dust;

            }
        }, function error(err){
            toastr.error(err.data, 'Error While Trying To read dust density, Device is not connected' , toastrOpts);

        });
    }

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };

// sample the selected device according to its Id and get the metric every 3 secs.
    $scope.sampleSelectedDeviceMetric = function(device){
        $log.log('device is now: ', device);
        // dust density val for gauge
        var id = $scope.devicesMap[device];
        $scope.$storage.deviceid = id;
        // when selecting a device strting to collect and save its metrics in the backend
        //$http.post('/backend/dust/collect',  {id: id});

        setInterval(function (){
            $scope.$apply(function() {
                getMetric(id);
            });
        }, 3000);

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

            timeoutPromise = $timeout(getDataForLineChart, 1000); // polling the server for data

        });
    };

    $scope.$on('$destroy',function(){
        $timeout.cancel(timeoutPromise)
    });

    getDataForLineChart();

    //$scope.getLineChartData = function(){
    //    getDataForLineChart();
    //};

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
        tooltip: {mode: 'scrubber', formatter: function(/*x, y, series*/) {return 'dustDensity';}},
        drawLegend: true,
        drawDots: true,
        hideOverflow: false,
        columnsHGap: 7
    };

});
