


'use strict';

angular.module('app')
    .controller('adminChangeMembershipController', ['$mdDialog', '$log', 'userService', 'memberService', 'appNotificationService', 'config', 'currentItem'
        , function ($mdDialog, $log, userService, memberService, appNotificationService, config, currentItem) {

            var vm = this;
            vm.config = config;
            vm.currentItem = currentItem;
            vm.memberSearchText = "";
            vm.selectedMember;


            vm.memberSearch = function (searchText) {

                return memberService.getMembers(searchText).then(function (success) {
                    return success;
                });
            };

            vm.cancel = function () {
                $mdDialog.cancel();
            }

            vm.save = function () {

                memberService.mergeMember(vm.currentItem.userId, vm.selectedMember.memberId).then(function (success) {

                   vm.currentItem.userId = success.targetMemberId

                    appNotificationService.openToast("Merge complete!");

                    $mdDialog.hide(vm.currentItem);

                }, function (error) {
                    var err = "Error merging members:  " + (error | error.message);
                    $log.info(err);
                    appNotificationService.openToast(err);

                });
            }

            return vm;
        }]);