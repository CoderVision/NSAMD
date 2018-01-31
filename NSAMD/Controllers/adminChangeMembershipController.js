


'use strict';

angular.module('app')
    .controller('adminChangeMembershipController', ['$mdDialog', '$log', 'userService', 'appNotificationService', 'config', 'currentItem'
        , function ($mdDialog, $log, userService, appNotificationService, config, currentItem) {

            var vm = this;
            vm.config = config;
            vm.currentItem = currentItem;
            vm.memberSearchText = "";
            vm.selectedMember;
            vm.mergeMember = true;
            vm.changeMember = false;

            vm.memberSearch = function (searchText) {

                return userService.getMembers(searchText).then(function (success) {
                    return success;
                });
                //return $http
                //    .get(BACKEND_URL + '/items/' + searchText)
                //    .then(function (data) {
                //        // Map the response object to the data object.
                //        return data;
                //    });
            };


            vm.load = function () {
        
            }

            vm.cancel = function () {
                $mdDialog.cancel();
            }

            vm.save = function () {

                var saveItem = angular.copy(vm.currentItem);

                // add remainder of timezone offset
                saveItem.timeZoneOffset += ":00";

                // save member and reset form so it can be used to enter the next member
                churchService.saveNew(saveItem).then(function (success) {

                    $log.info("new church saved");
                    appNotificationService.openToast("Save success");

                    // reset form
                    vm.currentItem = {};

                }, function (error) {
                    $log.info("Error saving new church");
                });

                //$mdDialog.hide(vm.currentItem);
            }

            return vm;
        }]);