
'use strict';

angular.module('app').controller('rootController',
    ['$scope', '$mdSidenav', '$mdToast', '$mdDialog', '$mdMedia', '$mdBottomSheet', '$location', '$log', 'appService', 'authService'
        , function ($scope, $mdSidenav, $mdToast, $mdDialog, $mdMedia, $mdBottomSheet, $location, $log, appService, authService) {

    var vm = this;
    vm.mdSidenav = $mdSidenav;
    vm.currentTitle = appService.title;
    vm.isLoggedIn = false;
    vm.isAddItemEventEnabled = false;
    vm.appService = appService;
    vm.menuItems = [];
    vm.oidcMgr = authService.OidcTokenManager;


    var path = $location.url();
    if (path.indexOf("id_token") > -1){

        authService.processTokenCallbackAsync().then(function (success) {

            $location.path("member");

        }, function (error) {

            vm.openToast("Error logginng in:  " + error);
            //alert(error);
        });
    }
    else {
        if (vm.oidcMgr.expired) {
            vm.oidcMgr.redirectForToken();
        }
    }
            

    $scope.$watch('rootCtrl.appService.title', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            vm.currentTitle = newValue;
        }
    }, true);

    $scope.$watch('rootCtrl.appService.menuItems', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            vm.menuItems = newValue;
        }
    }, true);

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
        vm.oidcMgr.redirectForToken();
        vm.isLoggedIn = !vm.isLoggedIn;
    };

    vm.logOut = function () {
        vm.mgr.removeToken();
        window.location = "index.html";
    }

    vm.logOutOfIdSrv = function () {
        debugger;
        vm.mgr.redirectForLogout();
    } 

    vm.addItem = function ($event) {
        $scope.$broadcast('addItemEvent');
    }

    $scope.$on('enableAddItemEvent', function (event, args) {
        if (args === undefined)
            vm.isAddItemEventEnabled = true;
        else
            vm.isAddItemEventEnabled = args.enabled;
    });

    vm.navigateTo = function (routeName, title) {
        $location.url(routeName);
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
