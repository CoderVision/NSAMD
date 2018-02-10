

'use strict';

//'messageService'
angular.module('app').controller('messagesController',
    ['$scope', '$mdDialog', '$mdMedia', '$log', 'appNotificationService', 'appService', '$state'
        , function ($scope, $mdDialog, $mdMedia, $log, appNotificationService, appService, $state) {

            var vm = this;

            vm.isLoading = false;
            vm.config = {};
            vm.appService = appService;


            // handle add item event from root scope
            $scope.$emit('enableAddItemEvent', { enabled: false });
            //$scope.$emit('enableAddItemEvent');
            //$scope.$on('addItemEvent', function (event) {
            //    vm.addItem(event);
            //});


            vm.init = function () {

                if ($state.current.url == "/messages") {
                    $state.go('messages.sms');
                }

                appService.title = "Messages";
                appService.menuItems = [{ text: "Email", do: vm.openMail }, { text: "SMS", do: vm.openSms }];

                if (vm.appService.isLoggedIn === false)
                    return;

               // vm.isLoading = true;

                //memberService.getConfig(vm.churchId).then(function (success) {

                //    vm.config = success;

                //    loadMemberList();

                //}, function (error) {

                //    vm.isLoading = false;
                //    appNotificationService.openToast("Error loading member config ");
                //    $log.log(error);
                //});
            }

            vm.openSms = function()
            {
                //$state.go('.sms', { memberId: memberId });
                $state.go('messages.sms');
            }

            vm.openMail = function()
            {
                $state.go('messages.mail');
            }

            function loadMemberList() {
                memberService.getList(vm.churchId, vm.statusIds).then(function (success) {

                    vm.gridOptions.data = success;

                    vm.paginationOptions.totalItems = success.length;

                }, function (error) {
                    $log.error(error);
                }).then(function () {
                    vm.isLoading = false;
                });
            }


            return vm;
        }]);