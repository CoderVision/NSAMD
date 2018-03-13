


'use strict';

angular.module('app').controller('smsController',
    ['$scope', '$mdDialog', '$mdMedia', '$location', '$log', 'appNotificationService', 'messageService'
        , function ($scope, $mdDialog, $mdMedia, $location, $log, appNotificationService, messageService) {

            var vm = this;

            vm.message = "Hello from the smsController!";
            vm.correspondences = [];
            vm.selectedItem;
            vm.selectedIndex = 0;
            vm.correspondencesOrdered = [];
            vm.smsContent = "";
            vm.churchId = 3; // 3 = Graham
            vm.maxRows = 20;
            vm.config = {};
            vm.messageTypeEnumId = 47; //47 = text messages
            vm.searchText;

            vm.formatDate = function (utcDate) {
                return moment.tz(utcDate, moment.tz.guess()).format("L LT");
            }

            /*
                8	MessageType		    46	Email Message
                8	MessageType		    47	Text Message
                8	MessageType		    48	Application Message
                11	MessageDirection	53	Received
                11	MessageDirection	54	Sent
            */

            // order the list when it changes and set it to the array
            $scope.$watch("smc.correspondences | orderBy : '-LastMessageDate'", function (newValue) {

                if (vm.selectedItem === undefined) {
                    vm.correspondencesOrdered = newValue;
                    vm.viewMessages(0, vm.correspondencesOrdered[0]);
                }
            }, true);

            // message controller churchId
            $scope.$watch('mc.churchId', function (newValue, oldValue) {
                if (newValue !== oldValue
                    && vm.churchId !== newValue) {
                    vm.churchId = newValue;
                    vm.loadData();
                }
            }, false);

            $scope.$watch('mc.searchText', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    vm.searchText = newValue;
                }
            }, false);

            vm.filterMessageGroups = function (grp) {

                if (vm.searchText === undefined) {
                    vm.searchText = "";
                }

                var criteria = vm.searchText.toLowerCase().trim();

                return (criteria == "" || grp.description.toLowerCase().indexOf(criteria) > -1);
            }

            vm.init = function () {

                vm.loadData();

                //var correspondence1 = {
                //    id: 1,
                //    Name: 'Gary Lima',
                //    LastMessageDate: '01/27/2018',
                //    LastMessageText: 'Hi there!  this is a test.  :)',
                //    Read: true,                                                     // does this message have any unread messages?
                //    messages: [{ id: 1, body: 'Hi there!  this is a test.  :)', directionEnumId: 53, messageDate: '2/9/18 6:45 PM' },
                //    { id: 2, body: 'Yes!  I got your test  Let me know if you receive mine from NtccSteward.', directionEnumId: 54, messageDate: '2/9/18 6:46 PM' },
                //    { id: 3, body: 'Yup, I got it!', directionEnumId: 53, messageDate: '2/9/18 6:47 PM' }]
                //};
                //var correspondence2 = {
                //    id: 2,
                //    Name: 'Wei Lima',
                //    LastMessageDate: '01/28/2018',
                //    LastMessageText: 'Hi!!!  Hope youre having fun!',
                //    Read: true,
                //};
                //var correspondence3 = {
                //    id: 3,
                //    Name: 'Jeff Malone',
                //    LastMessageDate: '02/01/2018',
                //    LastMessageText: 'Hows the site going?',
                //    Read: true
                //};
                //var correspondence4 = {
                //    id: 4,
                //    Name: 'David Bean',
                //    LastMessageDate: '02/02/2018',
                //    LastMessageText: 'Bless you sir!',
                //    Read: true
                //};
                //var correspondence5 = {
                //    id: 5,
                //    Name: 'Chris Hayes',
                //    LastMessageDate: '02/03/2018',
                //    LastMessageText: 'Just checking in',
                //    Read: false
                //};

                //vm.correspondences = [correspondence1, correspondence2, correspondence3, correspondence4, correspondence5];
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