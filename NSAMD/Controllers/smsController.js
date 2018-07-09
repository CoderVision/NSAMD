


'use strict';

angular.module('app').controller('smsController',
    ['$scope', '$mdDialog', '$mdMedia', '$location', '$log', 'appNotificationService', 'messageService', '$stateParams'
        , function ($scope, $mdDialog, $mdMedia, $location, $log, appNotificationService, messageService, $stateParams) {

            var vm = this;

            vm.message = "Hello from the smsController!";
            vm.correspondences = [];
            vm.selectedItem;
            vm.selectedIndex = 0;
            vm.correspondencesOrdered = [];
            vm.smsContent = "";
            vm.churchId = $stateParams.churchId;
            vm.maxRows = 20;
            vm.config = {};
            vm.messageTypeEnumId = 47; //47 = text messages
            vm.searchText;
            vm.useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));

            $scope.$on('addMessageGroup', function (event, params) {
                vm.editGroup(params.event, params.group);
            });

            /*
                8	MessageType		    46	Email Message
                8	MessageType		    47	Text Message
                8	MessageType		    48	Application Message
                11	MessageDirection	53	Received
                11	MessageDirection	54	Sent
            */

            // order the list when it changes and set it to the array
            $scope.$watch("smc.correspondences | orderBy : '-LastMessageDate'", function (newValue) {

                //if (vm.selectedItem === undefined) {
                    vm.correspondencesOrdered = newValue;
                    vm.viewMessages(0, vm.correspondencesOrdered[0]);
               // }
            }, true);

            // message controller churchId
            $scope.$watch('mc.churchId', function (newValue, oldValue) {
                if (newValue !== oldValue
                    && vm.churchId !== newValue) {
                    vm.churchId = newValue;
                    vm.selectedItem = undefined;
                    vm.loadData();
                }
            }, false);

            $scope.$watch('mc.searchText', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    vm.searchText = newValue;
                }
            }, false);

            // have to think about how we are going to handle this
            vm.editGroup = function ($event, group) {
                var config = {};

                $mdDialog.show({
                    locals: { currentItem: group, config: config },
                    templateUrl: './views/Messages/messageGroupDialog.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    controller: 'messageGroupDialogController',
                    controllerAs: 'dc', // dc = dialog controller
                    clickOutsideToClose: false,
                    fullscreen: vm.useFullScreen
                }).then(function (editedItem) {

                    vm.correspondences.push(editedItem);

                }, function () {
                    $log.info("Edit item cancelled");
                });
            }

            vm.filterMessageGroups = function (grp) {

                if (vm.searchText === undefined) {
                    vm.searchText = "";
                }

                var criteria = vm.searchText.toLowerCase().trim();

                return (criteria == "" || grp.description.toLowerCase().indexOf(criteria) > -1);
            }

            vm.init = function () {
         
                vm.loadData();
            }

            vm.loadData = function () {
                if (vm.churchId === undefined) {
                    return;
                }

                messageService.getRecipientGroups(vm.churchId, vm.messageTypeEnumId).then(function (data) {

                    vm.correspondences = data;
                }
                , function (error) {
                    vm.error = error;
                    appNotificationService.openToast(error);
                });
            }

            vm.viewMessages = function (index, correspondence) {

                vm.selectedIndex = index;
                vm.selectedItem = correspondence;

                // get messages for this correspondence, then append it to it.
                if (correspondence !== undefined) { 
                    messageService.getMessages(correspondence.id, vm.maxRows)
                        .then(function (data) {
                            vm.selectedItem.messages = data;
                        },
                        function (error) {
                            correspondence.error = error;
                            appNotificationService.openToast(error);
                        });
                }
            }

            vm.sendSms = function () {

                var msg = CreateMessage(vm.smsContent);

                messageService.sendMessage(msg).then(function (success) {

                    if (vm.selectedItem.messages === undefined)
                        vm.selectedItem.messages = [];

                    vm.selectedItem.messages.push(msg);

                    vm.smsContent = '';

                }, function (error) {
                    msg.error = error;
                    appNotificationService.openToast(error);
                })
            }

            function CreateMessage(content) {
                var msg = {};
                msg.id = 0;
                msg.recipientGroupId = vm.selectedItem.id;
                msg.messageDate = new Date().toISOString();
                msg.messageDirectionEnumID = 54; // 54=sent,53=received
                msg.subject = '';
                msg.body = content;
                msg.error = null;
                return msg;
            }

            return vm;
        }]);