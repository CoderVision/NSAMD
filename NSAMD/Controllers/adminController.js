
'use strict';

angular.module('app').controller('adminController',
    ['$scope', '$mdDialog', '$mdMedia', '$mdBottomSheet', '$location', '$log', '$state', 'appService'
        , function ($scope, $mdDialog, $mdMedia, $mdBottomSheet, $location, $log, $state, appService) {

    // handle add item event from root scope
            $scope.$emit('enableAddItemEvent', { enabled: false });
    $scope.$on('addItemEvent', function (event) {
        vm.addItem(event);
    });

    var vm = this;

    vm.init = function ()
    {
        if ($state.current.url == "/admin") {
            $state.go('admin.users');
        }

        appService.title = "Admin";
        appService.menuItems = [];
    }



    return vm;
}]);