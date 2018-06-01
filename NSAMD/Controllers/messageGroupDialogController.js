
'use strict';

angular.module('app')
    .controller('messageGroupDialogController', ['$scope', '$mdDialog', '$q', 'messageService', 'currentItem',
        function ($scope, $mdDialog, $q, messageService, currentItem) {

            var vm = this;

            vm.currentItem = currentItem;
            vm.members = []; // list of members
            vm.selectedRecipient = null;
            vm.selectedRecipients = [];
            vm.recipientSearchText;
            vm.isLoading = false;

            vm.messageType = currentItem.messageType;  // 1 = Email, 2 = Sms

            $scope.$watch("dc.selectedRecipients", function (sponsors) {

                if (vm.isLoading == true)
                    return;

                vm.recipientSearchText = '';

                // add list to vm.currentItem.recipients

                //var list = [];
                //if (sponsors.length > 0) {
                //    for (var i = 0; i < sponsors.length; i++) {
                //        var s = {
                //            SponsorId: sponsors[i].id,
                //            MemberId: vm.memberId,
                //            FirstName: "",
                //            LastName: ""
                //        };
                //        list.push(s);
                //    }
                //}
                //vm.patch("sponsorList", list);
            }, true);

            vm.cancel = function () {
                $mdDialog.cancel();
            }

            vm.save = function () {

                // call the message service to save this group with all of it's members.

                $mdDialog.hide(vm.currentItem);
            }

            vm.load = function () {
                return;
            }

            vm.recipientSearch = function (recipientSearchText) {

                var deferred = $q.defer();

                if (recipientSearchText == "") {
                    deferred.resolve([]);
                    return;
                }

                vm.isLoading = true;
                var messageTypeEnumId = vm.messageType == 2 ? 47 : 46;
                messageService.getRecipients(vm.currentItem.churchId, messageTypeEnumId, recipientSearchText).then(function (success) {

                    deferred.resolve(success);

                }, function (failure) {

                    $log.error("error searching parts:  " + failure);
                    deferred.reject();

                }).then(function () {
                    vm.isLoading = false;
                });

                return deferred.promise;
            }

            //vm.searchCustomers = function () {


            return vm;
        }]);