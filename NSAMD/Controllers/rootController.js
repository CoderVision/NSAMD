
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

    var path = $location.url();
    var tokenIndex = path.indexOf("id_token");
    if (tokenIndex > -1) {

        //var config = {
        //    client_id: "NtccStewardImplicit",
        //    //redirectUri: window.location.protocol + "//" + window.location.host + "/callback",
        //    redirect_uri: svc.redirect_uri,
        //    authority: window.__config.stsUrl + "identity",
        //    load_user_profile: false
        //};

        //var mgr = new OidcTokenManager(config);

        //mgr.processTokenCallbackAsync().then(function () {


        //    deferred.resolve();
        //},
        //    function (error) {
        //        deferred.reject("Problem Getting Token : " + (error.message || error));
        //    });

        var query = path.substring(tokenIndex-1, path.length - tokenIndex + 1);
        authService.oidcManager.processTokenCallbackAsync(query).then(function (success) {

            vm.isLoggedIn = true;
            $location.url($location.path());

        }, function (error) {

            vm.isLoggedIn = false;
            vm.openToast("Error logginng in:  " + error);
            //alert(error);
        });
    }
    else {
        var mgr = authService.oidcManager;
        if (mgr.expired) {
            mgr.redirectForToken();
            }

        vm.isLoggedIn = true;
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
        authService.oidcManager.redirectForLogout();
        //vm.oidcMgr.removeToken();
        //vm.isLoggedIn = false;
        //window.location = "index.html";
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
