/**
 * Created by liron on 9/4/15.
 */
'use strict';

angular.module('Photon').controller('PhotonCtrl', function ($rootScope, $scope, $modal, DevicesService, LoginService) {

    $rootScope.globals = {
        creds : {} //todo: check why in refresh the state wont be saved
    };
    $scope.devicesList = [];

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
    }

});
