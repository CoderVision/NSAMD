


'use strict';

angular.module('app').controller('callbackController',
    ['$scope', '$mdSidenav', '$mdToast', '$mdDialog', '$mdMedia', '$mdBottomSheet', '$location', '$log', 'appService', 'authService', 'config'
        , function ($scope, $mdSidenav, $mdToast, $mdDialog, $mdMedia, $mdBottomSheet, $location, $log, appService, authService, config) {

            var vm = this;
            vm.mdSidenav = $mdSidenav;
            vm.currentTitle = appService.title;
            vm.isLoggedIn = false;
            vm.isAddItemEventEnabled = false;
            vm.appService = appService;
            vm.menuItems = [];
            vm.oidcMgr = authService.OidcTokenManager;
            vm.config = config;

            vm.init = function () {

                authService.processTokenCallbackAsync().then(function (success) {

                    alert("You have succeeded Jedi!");

                   // window.location = window.location.protocol + "//" + window.location.host + "/";;

                    $location.path("member");



                }, function (error) {

                    alert(error);
                });
            };


            return vm;
        }]);
