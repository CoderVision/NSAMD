

'use strict';

        function AddTeamController($mdDialog, $log, teamService, appNotificationService, currentItem, config) {

            var vm = this;
            vm.config = config;
            vm.currentItem = currentItem;
            vm.isSaving = false;

            vm.cancel = function () {
                $mdDialog.cancel();
            }

            vm.save = function () {

                // debounce 
                if (vm.isSaving == true)
                    return;

                vm.isSaving = true;

                // save member and reset form so it can be used to enter the next member
                teamService.saveTeam(vm.currentItem).then(function (success) {

                    $log.info("new team saved");
                    appNotificationService.openToast("Save success");

                    $mdDialog.hide(success);

                }, function (error) {
                    $log.info("Error saving new member");
                }).then(function () {
                    vm.isSaving = false;
                });
            }

            return vm;
};


AddTeamController.$inject = ['$mdDialog', '$log', 'teamService', 'appNotificationService', 'currentItem', 'config'];

angular.module('app').controller('addTeamController', AddTeamController);


