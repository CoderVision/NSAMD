
'use strict';

angular.module('app')
    .controller('addChurchController', ['$mdDialog', '$log', 'churchService', 'appNotificationService', 'currentItem', 'config'
        , function ($mdDialog, $log, churchService, appNotificationService, currentItem, config) {

            var vm = this;
            vm.config = config;
            vm.currentItem = currentItem;

            vm.load = function () {
                vm.config.timeZones = [
                  { name: "Samoa", offset: "-11" } // remove ending ":00" or Angular will throw errors.  We can add it below when we save.
                , { name: "Hawaii", offset: "-10" }
                , { name: "Alaska", offset: "-09" }
                , { name: "Pacific", offset: "-08" }
                , { name: "Mountain", offset: "-07" }
                , { name: "Central", offset: "-06" }
                , { name: "Eastern", offset: "-05" }
                , { name: "Atlantic", offset: "-04" }
                , { name: "Chamorro", offset: "+10" }
                ];
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
                    vm.currentItem = { };

                }, function (error) {
                    $log.info("Error saving new church");
                });

                //$mdDialog.hide(vm.currentItem);
            }

            return vm;
        }]);