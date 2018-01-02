

'use strict';

angular.module('app')
    .controller('addTeamController', ['$mdDialog', '$log', 'memberService', 'appNotificationService', 'currentItem', 'config'
        , function ($mdDialog, $log, memberService, appNotificationService, currentItem, config) {

            var vm = this;
            vm.config = config;
            vm.currentItem = currentItem;


            vm.cancel = function () {
                $mdDialog.cancel();
            }

            vm.save = function () {

                // save member and reset form so it can be used to enter the next member
                teamService.saveNewTeam(vm.currentItem).then(function (success) {

                    $log.info("new team saved");
                    appNotificationService.openToast("Save success");

                    var teamId = vm.currentItem.teamId;

                    vm.currentItem = {
                        dateCame: new Date(),
                        teamId: teamId
                    };

                }, function (error) {
                    $log.info("Error saving new member");
                });

                //$mdDialog.hide(vm.currentItem);
            }

            return vm;
        }]);