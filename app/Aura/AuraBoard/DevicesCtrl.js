/**
 * Created by liron on 9/4/15.
 */
'use strict';

angular.module('Aura').controller('devices', function ($scope, DevicesService) {

    // add loading table notification

    $scope.devicesList = [];

    DevicesService.getListDevices().then(function success(list){

            $scope.devicesList = list.data.listOfDevices;

            if( $scope.devicesList.length === 0){
                $scope.emptyList = true;

            }

        });


});
