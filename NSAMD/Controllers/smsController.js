


'use strict';

angular.module('app').controller('smsController',
    ['$scope', '$mdDialog', '$mdMedia', '$location', '$log', 'appNotificationService'
        , function ($scope, $mdDialog, $mdMedia, $location, $log, appNotificationService) {

            var vm = this;

            vm.message = "Hello from the smsController!";
            vm.correspondences = [];
            vm.selectedItem = null;
            vm.selectedIndex = 0;
            vm.correspondencesOrdered = [];

            // order the list when it changes and set it to the array
            $scope.$watch("smc.correspondences | orderBy : '-LastMessageDate'", function (newValue) {

                vm.correspondencesOrdered = newValue;
                vm.viewMessages(0, vm.correspondencesOrdered[0]);

            }, true);

            vm.init = function () {
                var correspondence1 = {
                    id: 1,
                    Name: 'Gary Lima',
                    LastMessageDate: '01/27/2018',
                    LastMessageText: 'Hi there!  this is a test.  :)',
                    Read: true,                                                     // does this message have any unread messages?
                    Messages: [{ id: 1, content: 'Hi there!  this is a test.  :)', direction: 'Received' }]
                };
                var correspondence2 = {
                    id: 2,
                    Name: 'Wei Lima',
                    LastMessageDate: '01/28/2018',
                    LastMessageText: 'Hi!!!  Hope youre having fun!',
                    Read: true,
                };
                var correspondence3 = {
                    id: 3,
                    Name: 'Jeff Malone',
                    LastMessageDate: '02/01/2018',
                    LastMessageText: 'Hows the site going?',
                    Read: true
                };
                var correspondence4 = {
                    id: 4,
                    Name: 'David Bean',
                    LastMessageDate: '02/02/2018',
                    LastMessageText: 'Bless you sir!',
                    Read: true
                };
                var correspondence5 = {
                    id: 5,
                    Name: 'Chris Hayes',
                    LastMessageDate: '02/03/2018',
                    LastMessageText: 'Just checking in',
                    Read: false
                };


                vm.correspondences = [correspondence1, correspondence2, correspondence3, correspondence4, correspondence5];
            }

            vm.viewMessages = function (index, correspondence) {
                vm.selectedIndex = index;
                vm.selectedItem = correspondence;
            }


            return vm;
        }]);