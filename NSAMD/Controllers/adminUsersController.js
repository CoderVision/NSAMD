

'use strict';

angular.module('app').controller('adminUsersController',
    ['$mdDialog', '$mdMedia', '$mdBottomSheet', '$location', '$log', 'userService', 'appNotificationService'
        , function ($mdDialog, $mdMedia, $mdBottomSheet, $location, $log, userService, appNotificationService) {

            var vm = this;

            vm.message = "Hello from users controller!";
            vm.acctRequests = [];
            vm.config = {};
            vm.users = [];
            vm.isLoading = true;

            vm.load = function ()
            {
                userService.getList().then(function (success) {

                    vm.config = success.config;
                    vm.acctRequests = success.acctRequests;
                    vm.users = success.users;

                }, function (error) {
                    appNotificationService.openToast("Error loading member config:  " + error);
                    }).then(function () {
                        vm.isLoading = false;
                });
            }

            vm.expand = function (item)
            {
                if (!item.isExpanded)
                    item.isExpanded = true; 
                else
                    item.isExpanded = false;
            }

            vm.formatDate = function (utcDate) {
                return moment.tz(utcDate, moment.tz.guess()).format("L LT");
            }

            vm.submitRequest = function (acctReq, isApproved)
            {
                acctReq.isApproved = isApproved;

                userService.processAcctRequest(acctReq).then(function (success) {

                    const index = vm.acctRequests.indexOf(acctReq);
                    vm.acctRequests.splice(index, 1);

                }, function (error) {
                    appNotificationService.openToast("Error processing account request:  " + error);
               });
            }

            return vm;
        }]);