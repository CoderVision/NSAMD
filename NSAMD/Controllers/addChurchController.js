
'use strict';

        function AddChurchController($mdDialog, $log, churchService, appNotificationService, currentItem, config, configService) {

            var vm = this;
            vm.config = config;
            vm.currentItem = currentItem;

            vm.load = function () {
                vm.config.timeZones = configService.getTimeZones();
            }

            vm.cancel = function () {
                $mdDialog.hide();
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
                    vm.currentItem = { };

                }, function (error) {
                    $log.info("Error saving new church");
                });

                //$mdDialog.hide(vm.currentItem);
            }

            return vm;
};

AddChurchController.$inject = ['$mdDialog', '$log', 'churchService', 'appNotificationService', 'currentItem', 'config', 'configService'];

angular.module('app').controller('addChurchController', AddChurchController);

