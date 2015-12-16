/**
 * Created by liron on 12/10/15.
 */

'use strict';

angular.module('Aura').controller('switchTabsCtrl', function ($scope, $state) {

    // using https://github.com/angular-ui/ui-router/wiki + bootstrap ui (tabset)
   // $scope.tabset = true;

    $scope.tabs = [
        { heading: 'Registered Devices', route:'aura', active:false },
        { heading: 'Charts', route:'aura.graphs', active:false }
    ];

    $scope.go = function(route){ // gets tabs.route (wanted state)
        $state.go(route);
    };

    $scope.active = function(route){
        return $state.is(route); // checks for the full state name and returns boolean
    };

    $scope.$on("$stateChangeSuccess", function() { // broadcast from rootScope and fired once the state transition is complete
        $scope.tabs.forEach(function(tab) {
            tab.active = $scope.active(tab.route);
        });
    });
});
