

'use strict';

//'messageService'
angular.module('app').controller('messagesController',
    ['$scope', '$mdDialog', '$mdMedia', '$log', 'appNotificationService', 'appService', '$state', 'messageService'
        , function ($scope, $mdDialog, $mdMedia, $log, appNotificationService, appService, $state, messageService) {

            var vm = this;

            vm.isLoading = false;
            vm.config = {};
            vm.appService = appService;
            vm.searchText = "";


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

                vm.isLoading = true;

                messageService.getConfig().then(function (data) {

                    vm.config = data;

                    vm.churchId = data.churches[0].id; // get the first church in the list
                },
                function (error) {
                    vm.error = error;
                    appNotificationService.openToast(error);
                }).then(function () {
                    vm.isLoading = false;
                })
            }

            vm.openSms = function () {
                //$state.go('.sms', { memberId: memberId });
                $state.go('messages.sms');
            }

            vm.openMail = function () {
                $state.go('messages.mail');
            }

            vm.formatDate = function (utcDate) {
                return moment.tz(utcDate, moment.tz.guess()).format("L LT");
            }

            return vm;
        }]);