
'use strict';

angular.module('app').controller('rootController',
    ['$scope', '$mdSidenav', '$mdToast', '$mdDialog', '$mdMedia', '$mdBottomSheet', '$location', '$log'
    , function ($scope, $mdSidenav, $mdToast, $mdDialog, $mdMedia, $mdBottomSheet, $location, $log) {

    var vm = this;
    vm.mdSidenav = $mdSidenav;
    vm.currentTitle = "Members";
    vm.isLoggedIn = false;
    vm.isAddItemEventEnabled = false;

    vm.toggleSideNav = function () {

        vm.mdSidenav('left').toggle();
    };

    vm.init = function () {

        //userService.loadAllUsers().then(function (users) {
        //    vm.users = users;
        //    vm.selected = users[0];
        //    userService.selectedUser = vm.selected;
        //    console.log(vm.users);
        //});

        $location.path("member");
    };

    vm.logIn = function () {
        vm.isLoggedIn = !vm.isLoggedIn;
    };

    vm.addItem = function ($event) {
        $scope.$broadcast('addItemEvent');
    }

    $scope.$on('enableAddItemEvent', function (event) {

        vm.isAddItemEventEnabled = true;
    });

    vm.navigateTo = function (routeName, title) {
        $location.path(routeName);
        vm.currentTitle = title;

        var sidenav = $mdSidenav('left');
        if (sidenav.isOpen())
            sidenav.close();
    };

    vm.formScope = null;

    vm.setFormScope = function (scope) {
        vm.formScope = scope;
    };

    vm.openToast = function (message) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(message)
                .position('bottom right')
                .hideDelay(3000)
        );
    };

    return vm;
}]);
