/**
 * Created by liron on 9/4/15.
 */
'use strict';
angular.module('Aura').controller('LoginCtrl', function ( $rootScope, $scope, $state, $log, LoginService,toastr) {


    var toastrOpts={closeButton: true, extendedTimeOut: 3000, tapToDismiss: false, positionClass: 'toast-bottom-right'};


    $scope.isLogin = false;
    $scope.email;
    $scope.passwd;

    $scope.login = function () {
        LoginService.login({email:$scope.email, passwd:$scope.passwd}).then( function success (){
            $scope.isLogin = false;
            $state.go('aura'); // go to /home page on successful login
            LoginService.storeLoginDetails({email:$scope.email, passwd:$scope.passwd});
            $rootScope.$emit('userLoggedIn'); // post to the subscribers that user was logged in
        }, function error(err){
            $scope.isLogin = false;
            toastr.error(err.data, 'Error While Trying To Login' , toastrOpts);
        });
    };

});
