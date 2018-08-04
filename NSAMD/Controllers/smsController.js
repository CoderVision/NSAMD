


'use strict';

        function SmsController($rootScope, $scope, $mdDialog, $mdMedia, $location, $log, appNotificationService, messageService, $state, $stateParams) {

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

                    vm.correspondences.unshift(editedItem);

                    vm.selectedItem = editedItem;

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

                //$state.go("main.products", {}, { reload: true })
               // var rootId = $rootScope.churchId;

                if (this.churchId === undefined)
                    $state.go('messages', {}, { reload: true });  // the church list is not loaded.  this occurs on refresh or if someone uses a bookmark to get here.
                else
                    vm.loadData();
            }

            vm.loadData = function () {
                if (vm.churchId === undefined) {
                    return;
                }

                messageService.getRecipientGroups(vm.churchId, vm.messageTypeEnumId).then(function (data) {

                    vm.correspondences = data;

                    if (data.length > 0) {

                        vm.viewMessages(0, data[0]);
                    }
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

            /// shuffle when sending and receiving messages
            vm.shuffleCorrespondence = function (itemZero) {

                if (vm.correspondences === undefined
                    || itemZero === undefined)
                    return;

                if (vm.correspondences.length === 0)
                    vm.correspondences.push(itemZero);

                else  {
                    var indexOfItem = -1;
                    for (var i = 0; i < vm.correspondences.length; i++) {
                        if (Object.is(itemZero, vm.correspondences[i])) {
                            indexOfItem = i;
                            break;
                        }
                    }

                    var swapItem = itemZero;
                    for (var i = 0; i < vm.correspondences.length; i++) {

                        var itm = vm.correspondences[i];
                        vm.correspondences[i] = swapItem;
                        swapItem = itm;

                        if (i === indexOfItem) // only shuffle up to the original index of the item
                            break;
                    }

                    vm.selectedIndex = 0;
                    vm.selectedItem = itemZero;
                }
            }

            vm.sendSms = function () {

                var msg = CreateMessage(vm.smsContent);

                messageService.sendMessage(msg).then(function (success) {

                    if (vm.selectedItem.messages === undefined)
                        vm.selectedItem.messages = [];

                    vm.selectedItem.messages.push(msg);

                    vm.smsContent = '';

                    vm.shuffleCorrespondence(vm.selectedItem);

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
};


SmsController.$inject = ['$rootScope', '$scope', '$mdDialog', '$mdMedia', '$location', '$log', 'appNotificationService', 'messageService', '$state', '$stateParams'];

angular.module('app').controller('smsController', SmsController);


