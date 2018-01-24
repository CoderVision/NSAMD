
'use strict';

angular.module('app').controller('adminController',
    ['$mdDialog', '$mdMedia', '$mdBottomSheet', '$location', '$log', '$state'
        , function ($mdDialog, $mdMedia, $mdBottomSheet, $location, $log, $state) {

    var vm = this;

    vm.init = function ()
    {
        if ($state.current.url == "/admin") {
            $state.go('admin.users');
        }
    }
    return vm;
}]);