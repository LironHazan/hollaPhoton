/**
 * Created by liron on 9/4/15.
 */
'use strict';

angular.module('Photon').controller('PhotonCtrl', function ($rootScope, $scope, $modal, DevicesService, LoginService) {

    $rootScope.globals = {
        creds : {} //todo: check why in refresh the state wont be saved
    };

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

    if($rootScope.globals.creds.email){
        $scope.loggedIn = true;
        $scope.loginBtn = true;
        $scope.greeting = 'Hello! you are connected as: ' + creds.email;
    }

    $rootScope.$on('userLoggedIn',function() {
        var creds = LoginService.getLoginCache();
        $rootScope.globals.creds = creds;
        $scope.loggedIn = true;
        $scope.loginBtn = true;
        $scope.greeting = 'Hello! you are connected as: ' + creds.email;
    });

    $scope.devicesList = [];
    $scope.getDevices = function(){
        DevicesService.getListDevices().then(function success(list){
            if(list.data.length === 0){
                $scope.emptyList = true;
            }
            else{
                $scope.devicesList = list;
            }
        }, function error(err){
            console.log(err);
        });
    }

});
