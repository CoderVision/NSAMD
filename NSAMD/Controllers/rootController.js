
'use strict';
    
 function RootController($scope, $mdSidenav, $mdToast, $mdDialog, $mdMedia, $mdBottomSheet, $location, $log, appService, authService, userService) {

    var vm = this;
    vm.mdSidenav = $mdSidenav;
    vm.currentTitle = appService.title;
    vm.isLoggedIn = false;
    vm.isAddItemEventEnabled = false;
    vm.appService = appService;
    vm.menuItems = [];
    vm.roleId = 0;

    var path = $location.url();
    var tokenIndex = path.indexOf("id_token");
    if (tokenIndex > -1) {

        var query = path.substring(tokenIndex-1, path.length - tokenIndex + 1);
        authService.oidcManager.processTokenCallbackAsync(query).then(function (success) {

            GetUserProfile();

        }, function (error) {

            vm.isLoggedIn = false;
            vm.appService.isLoggedIn = false;
            vm.openToast(error);
        });
    }
    else {
        var mgr = authService.oidcManager;
        if (mgr.expired) {
            mgr.redirectForToken();
            }

        GetUserProfile();
    }

    function GetUserProfile() {
        userService.get().then(function (success) {

            vm.isLoggedIn = true;
            vm.roleId = success.roleId;
            vm.appService.roleId = success.roleId;
            vm.appService.isLoggedIn = true;

            $scope.$broadcast('tokenParsed');

        }, function (error) {

            vm.openToast(error);
        });
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

        $location.path("member");
    };

    vm.logIn = function () {

        if (vm.isLoggedIn) {
            vm.logOut();
        }
        else {
            authService.oidcManager.redirectForToken();
        }
       
    };

    vm.logOut = function () {
        vm.appService.isLoggedIn = false; 
        authService.oidcManager.redirectForLogout();
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

        if (vm.isLoggedIn === false)
            return;

        $mdToast.show(
            $mdToast.simple()
                .textContent(message)
                .position('bottom right')
                .hideDelay(3000)
        );
    };

    return vm;
};

RootController.$inject = ['$scope', '$mdSidenav', '$mdToast', '$mdDialog', '$mdMedia', '$mdBottomSheet', '$location', '$log', 'appService', 'authService', 'userService'];

angular.module('app').controller('rootController', RootController);
