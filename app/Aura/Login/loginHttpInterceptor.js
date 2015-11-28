'use strict';

/**
 * @module LoginHttpInterceptor
 * @description
 * catches all responses. identifies if needs redirect to login and redirects
 **/

angular.module('Aura').factory('loginHttpInterceptor', function( $log, $q ){

    return {
        'responseError': function(rejection) {

            $log.info('got bad response', rejection);

            if ( rejection.status === 401 && rejection.data && rejection.data.code === 5 ){
                $log.info('redirecting to login page');
                // we cannot use $http or anything here.
                window.location.hash = '#/login';
                return;
            }

            return $q.reject(rejection);
        }
    };

});