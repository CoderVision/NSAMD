
'use strict';

angular.module('app').controller('teamController',
    ['$scope', '$routeParams', '$mdDialog', '$mdMedia', '$log', 'teamService', 'appNotificationService', 'appService'
    , function ($scope, $routeParams, $mdDialog, $mdMedia, $log, teamService, appNotificationService, appService) {

        var vm = this;

        $scope.$emit('enableAddItemEvent', { enabled: false });

        vm.teamId = $routeParams.teamId;
        vm.churchId = $routeParams.churchId;
        vm.team = {};
        vm.config = {}
        vm.isLoading = true;

        vm.load = function () {

            appService.title = "Teams";
            appService.menuItems = [];

            teamService.getConfig(vm.churchId).then(function (success) {

                vm.config = success;

                loadTeam();

            }, function (error) {
                appNotificationService.openToast(error);
                vm.isLoading = false;
            });
        }

        function loadTeam() {

            vm.isLoading = true;

            teamService.getTeam(vm.teamId).then(function (success) {

                vm.team = success;

            }, function (error) {
                appNotificationService.openToast(error);
                $log.error(error);
            }).then(function () {
                vm.isLoading = false;
            });
        }

        vm.patch = function (fieldName, fieldValue) {
            teamService.patch(vm.teamId, fieldName, fieldValue).then(function (success) {
                appNotificationService.openToast("Save success");
            }, function (error) {
                appNotificationService.openToast(error);
            }).then(function () {
                vm.isLoading = false;
            });
        }

        vm.addTeammate = function ($event) {

            var newTeammate = { isNew: true, teamId: vm.teamId, churchId: vm.churchId, memberId: 0, teamPositionEnumId: 0 }; // 70=Pastor

            vm.editTeammate($event, newTeammate);
        }

        vm.editTeammate = function ($event, teammate) {

            var editTeammate = angular.copy(teammate);

            // populate teamPositionType[]
            var teamPositionType = [];
            if (vm.config.teamPositionType === undefined) {
                for (var i = 0; i < vm.config.teamEnums.length; i++) {
                    if (vm.config.teamEnums[i].optionsEnumTypeID == vm.team.teamPositionEnumTypeId) {
                        teamPositionType.push(vm.config.teamEnums[i]);
                    }
                }
            }
            else
                teamPositionType = vm.config.teamPositionType;


            // filter members so that members that area already in the list do not appear as an option
            var members = [];
            if (teammate.isNew == false) {

            }

            for (var iml = 0; iml < vm.config.memberList.length; iml++) {

                var found = false;
                for (var itl = 0; itl < vm.team.teammates.length; itl++) {
                    if (vm.config.memberList[iml].id == vm.team.teammates[itl].memberId) {

                        // if this teammate is not the one that is being edited
                        if (vm.team.teammates[itl].id != teammate.id) {
                            found = true;
                            break;
                        }
                    }
                }
                if (found == false)
                    members.push(vm.config.memberList[iml]);
            }

            $mdDialog.show({
                locals: { currentItem: editTeammate, config: { teamPositionType: teamPositionType, memberList: members } },
                templateUrl: './views/teams/addTeamMemberDialog.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                controller: "simpleDialogController",
                controllerAs: 'dc', // dc = dialog controller
                clickOutsideToClose: true,
                fullscreen: vm.useFullScreen
            }).then(function (editedItem) {

                saveTeammate(editedItem, teammate);

            }, function () {
                // $log.info("Edit item cancelled");
            });
        }

        function saveTeammate(editedItem, teammate) {

            editedItem.teamId = vm.teamId;

            teamService.saveTeammate(editedItem).then(function (success) {

                if (editedItem.isNew) {
                    success.isNew = false;
                    vm.team.teammates.push(success);
                }
                else
                    angular.copy(success, teammate);

                $log.info("teammate saved");
                appNotificationService.openToast("Save success");
            });
        }

        vm.removeTeammate = function (teammate, $event) {
            teamService.removeTeammate(teammate).then(function (success) {

                var ary = vm.team.teammates;
                for (var i = ary.length - 1; i >= 0; i--) {
                    if (ary[i].id == teammate.id)
                        ary.splice(i, 1);
                }

            }, function (error) {
                appNotificationService.openToast(error);
            });
        }

        return vm;
    }]);