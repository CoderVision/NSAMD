
'use strict';

angular.module('app').controller('rootController',
    ['$mdSidenav', '$mdToast', '$mdDialog', '$mdMedia', '$mdBottomSheet', '$location', '$log'
    , function ($mdSidenav, $mdToast, $mdDialog, $mdMedia, $mdBottomSheet, $location, $log) {

    var vm = this;
    vm.mdSidenav = $mdSidenav;
    vm.currentTitle = "Members";
    vm.isLoggedIn = false;

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
