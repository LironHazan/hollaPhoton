/**
 * Created by liron on 9/4/15.
 */
'use strict';
angular.module('Photon').controller('LoginCtrl', function ( $rootScope, $scope, item, $modalInstance, $log, LoginService,toastr) {
//modal

    var toastrOpts={closeButton: true, extendedTimeOut: 3000, tapToDismiss: false, positionClass: 'toast-bottom-right'};

    $scope.item = item;
    $scope.isLogin = false;

    $scope.login = function () {

        if ($scope.item && $scope.item.email && $scope.item.passwd) {
            $scope.isLogin = true;
            LoginService.login({email:$scope.item.email, passwd:$scope.item.passwd}).then( function success (){
                LoginService.storeLoginDetails({email:$scope.item.email, passwd:$scope.item.passwd});
                $modalInstance.dismiss('login');
                $rootScope.$emit('userLoggedIn');
            }, function error(err){
                $scope.isLogin = false;
                toastr.error(err.data, 'Error While Trying To Login' , toastrOpts);
            });

          }
        };
});
