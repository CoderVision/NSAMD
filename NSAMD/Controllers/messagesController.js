

'use strict';

//'messageService'

        function MessagesController($scope, $mdDialog, $mdMedia, $log, appNotificationService, appService, $state, messageService, localStorageService) {

            var vm = this;

            vm.isLoading = false;
            vm.config = {};
            vm.appService = appService;
            vm.searchText = "";
            vm.messageType = 2;    // 1 = Email, 2 = Sms
            vm.useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
            vm.churchId = 0;

            // handle add item event from root scope
            $scope.$emit('enableAddItemEvent', { enabled: false });
            //$scope.$emit('enableAddItemEvent');
            //$scope.$on('addItemEvent', function (event) {
            //    vm.addItem(event);
            //});

            $scope.$watch('mc.churchId', function (newValue, oldValue) {
                if (newValue !== oldValue) {

                    localStorageService.set("messagesChurchId", newValue);

                    vm.loadData();
                }
            }, false);


            vm.init = function () {

                appService.title = "Messages";
                appService.menuItems = [{ text: "Email", do: vm.openMail }, { text: "SMS", do: vm.openSms }];

                if (vm.appService.isLoggedIn === false)
                    return;

                vm.isLoading = true;

                // Always load the list of churches
                messageService.getConfig().then(function (data) {

                    vm.config = data;

                    var id = localStorageService.get("messagesChurchId");
                    for (var i = 0; i < vm.config.churches.length; i++) {
                        if (vm.config.churches[i].id == id) {
                            vm.churchId = id;
                            break;
                        }
                    }

                    if (vm.churchId === 0)
                        vm.churchId = vm.config.churches[0].id;

                    localStorageService.set("messagesChurchId", vm.churchId);

                    if ($state.current.url == "/messages") {
                        vm.openSms();
                    }
                },
                    function (error) {
                        vm.error = error;
                        appNotificationService.openToast(error);
                    }).then(function () {
                        vm.isLoading = false;
                })
            }

            vm.loadData = function () {

                if (vm.messageType == 2)
                    vm.openSms();
                else
                    vm.openMail();
            }


            vm.openSms = function () {
                //$state.go('.sms', { memberId: memberId });
                vm.messageType = 2; 
                $state.go('messages.sms', { churchId: vm.churchId });
            }

            vm.openMail = function () {
                vm.messageType = 1; 
                $state.go('messages.mail', { churchId: vm.churchId });
            }

            vm.formatDate = function (utcDate) {
                return moment.tz(utcDate, moment.tz.guess()).format("L LT");
            }

            vm.addGroup = function ($event) {

                var group = { id: 0, churchId: vm.churchId, messageType: vm.messageType, messages: [], recipients: [], isNew: true};
                var params = { event: $event, group: group }

                $scope.$broadcast('addMessageGroup', params);
            }

            return vm;
};

MessagesController.$inject = ['$scope', '$mdDialog', '$mdMedia', '$log', 'appNotificationService', 'appService', '$state', 'messageService', 'localStorageService'];

angular.module('app').controller('messagesController', MessagesController);



