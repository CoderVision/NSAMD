
'use strict';

angular.module('app')
    .controller('messageGroupDialogController', ['$scope', '$mdDialog', '$q', '$log', 'messageService', 'appNotificationService', 'currentItem',
        function ($scope, $mdDialog, $q, $log, messageService, appNotificationService, currentItem) {

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

                vm.currentItem.messageTypeEnumID = vm.messageType == 1 ? 46 : 47;

                vm.currentItem.recipients = []; // clear array

                for (var i = 0; i < vm.selectedRecipients.length; i++) {
                    var recipient = vm.selectedRecipients[i];
                    recipient.messageRecipientGroupId = vm.currentItem.id;
                    vm.currentItem.recipients.push(recipient);
                }

                messageService.saveRecipientGroups(vm.currentItem).then(function (success) {

                    $mdDialog.hide(success);

                }, function (failure) {

                    var errMsg = "error saving group:  " + failure
                    $log.error(errMsg);

                    // show error notification
                    appNotificationService.openToast(errMsg);
                });
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