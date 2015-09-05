/**
 * Created by liron on 9/4/15.
 */

angular.module('Photon').controller('LoginCtrl', function ( $scope, item, $modalInstance, $log, LoginService,toastr) {
//modal

    var toastrOpts={closeButton: true, extendedTimeOut: 3000, tapToDismiss: false, positionClass: 'toast-bottom-right'};

    $scope.item = item;
    $scope.isLogin = false;

    $scope.login = function () {

        if ($scope.item && $scope.item.email && $scope.item.passwd) {
            $scope.isLogin = true;
            LoginService.login({email:$scope.item.email, passwd:$scope.item.passwd}).then( function success (){
                $modalInstance.dismiss('login');
            }, function error(data){
                toastr.error(data.msg, 'Error While Trying To Login' , toastrOpts);
            });

          }
        };
});
