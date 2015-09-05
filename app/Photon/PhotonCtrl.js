/**
 * Created by liron on 9/4/15.
 */
'use strict';

angular.module('Photon').controller('PhotonCtrl', function ($scope, $modal, DevicesService) {

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

    $scope.getDevices = function(){
        DevicesService.getListDevices().then(function success(list){

        }, function error(err){

        });
    }

});
