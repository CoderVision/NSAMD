
'use strict';

angular.module('app').controller('churchController',
    ['$mdDialog', '$mdMedia', '$mdBottomSheet', '$location', '$log', 'churchService'
    , function ($mdDialog, $mdMedia, $mdBottomSheet, $location, $log, churchService) {

        var vm = this;

        vm.churchId = $routeParams.churchId;
        vm.church = {};
        vm.isLoading = true;

        vm.load = function () {
            vm.isLoading = true;

            // get meta data
            churchService.getConfig(vm.churchId).then(function (success) {
                vm.memberList = success.memberList;
                vm.teamList = success.teamList;
                vm.churchList = success.churchList;
                vm.contactInfoTypeList = success.contactInfoTypeList;
                vm.contactInfoLocationTypeList = success.contactInfoLocationTypeList;
                vm.phoneTypeList = success.phoneTypeList;
                vm.memberStatusChangeTypeList = success.memberStatusChangeTypeList;
                vm.memberStatusList = success.memberStatusList;
                vm.memberTypeList = success.memberTypeList;

                // get member profile   
                memberService.get(vm.memberId, vm.churchId).then(function (success) {
                    vm.member = success;

                    // create selected
                    //vm.selectedSponsors = success.sponsorList;
                    vm.selectedSponsors = vm.memberList.filter(function (member) {
                        for (var i = 0; i < vm.member.sponsorList.length; i++) {
                            if (member.id == vm.member.sponsorList[i].sponsorId) {
                                return true;
                            }
                        }
                        return false;
                    });

                    //vm.selectedTeams = success.teamList;
                    vm.selectedTeams = vm.teamList.filter(function (team) {
                        for (var i = 0; i < vm.member.teamList.length; i++) {
                            if (team.id == vm.member.teamList[i].teamId) {
                                return true;
                            }
                        }
                        return false;
                    });

                    //appNotificationService.openToast("success");
                }, function (error) {
                    appNotificationService.openToast("Error loading member " + vm.memberId + ":  " + error);
                }).then(function () {
                    vm.isLoading = false;
                });
            }, function (error) {
                appNotificationService.openToast("Error loading member config ");
            });
        };

    return vm;
}]);
