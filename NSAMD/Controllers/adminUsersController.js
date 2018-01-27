

'use strict';

angular.module('app').controller('adminUsersController',
    ['$mdDialog', '$mdMedia', '$mdBottomSheet', '$location', '$log', 'userService', 'appNotificationService'
        , function ($mdDialog, $mdMedia, $mdBottomSheet, $location, $log, userService, appNotificationService) {

            var vm = this;

            vm.message = "Hello from users controller!";
            vm.acctRequests = [];
            vm.config = {};
            vm.users = [];

            vm.load = function ()
            {
                userService.getList().then(function (success) {

                    vm.config = success.config;
                    vm.acctRequests = success.acctRequests;  
                    vm.users = success.users;

                }, function (error) {
                    appNotificationService.openToast("Error loading member config:  " + error);
                });
            }

            return vm;
        }]);