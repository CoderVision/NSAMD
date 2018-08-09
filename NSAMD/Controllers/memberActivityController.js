

'use strict';

        function MemberActivityController($scope, $mdDialog, $stateParams, $mdMedia, $state, $log, memberService, appNotificationService, appService) {

        var vm = this;
        vm.churchId = $stateParams.churchId;
        vm.statusIds = "49-50";
        vm.memberList = [];
        vm.selectedTeamId = 0; // do a watch on this
        vm.searchText = "";
        vm.isLoading = false;
        vm.config = {};

        // handle add item event from root scope
        $scope.$emit('enableAddItemEvent', { enabled: false });

        vm.load = function () {

            appService.title = "Members";

            vm.isLoading = true;

            memberService.getConfig(vm.churchId).then(function (success) {

                vm.config = success;

            }, function (error) {
                appNotificationService.openToast("Error loading member config ");
            });

            loadMemberList();
        }

        function loadMemberList() {
            memberService.getList(vm.churchId, vm.statusIds).then(function (success) {

                vm.memberList = success;

            }, function (error) {
                $log.error(error);
            }).then(function () {
                vm.isLoading = false;
            });
        }

        //vm.openProfile = function (memberId) {
        //    $location.path('/member').search({ memberId: memberId });
        //}

        vm.filterMembers = function (member) {

            if (member === undefined)
                return;

            var criteria = vm.searchText.toLowerCase().trim();

            return ((criteria == "" || member.fullName.toLowerCase().indexOf(criteria) > -1) 
                && (vm.selectedTeamId === 0 || member.teamId == vm.selectedTeamId))
        }

        vm.selectedMembers = [];
        vm.selectMember = function (member) {

            var isNew = true;
            for (var i = 0; i < vm.selectedMembers.length; i++) {
                if (vm.selectedMembers[i].id == member.id) {
                    isNew = false;
                    break;
                }
            }

            // if not in list, then add it
            if (isNew === true)
                vm.selectedMembers.push(angular.copy(member));
        }

        vm.resetMember = function (member) {

            for (var i = 0; i < vm.selectedMembers.length; i++) {

                if (vm.selectedMembers[i].id == member.id) {

                    for (var i2 = 0; i2 < vm.memberList.length; i2++) {

                        if (vm.memberList[i2].id == member.id) {
                            vm.memberList[i2] = angular.copy(vm.selectedMembers[i]);
                            vm.selectedMembers.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        }

        vm.saveMember = function (member) {

            var originalMember = undefined;
            for (var i = 0; i < vm.selectedMembers.length; i++) {
                if (vm.selectedMembers[i].id == member.id) {
                    originalMember = vm.selectedMembers[i];
                    break;
                }
            }

            var activity = {
                // make sure the date has changed before saving it, or else use the original date.
                id: member.activityId !== undefined ? member.activityId : 0,
                ActivityDate: new Date(member.newActivityDate).toISOString(),
                ChurchId: vm.churchId,
                SourceId: member.sponsorId,
                TargetId: member.id,
                MemberStatusEnumId: member.statusId,
                MemberStatusChangeTypeEnumId: member.statusChangeTypeId,
                ActivityTypeEnumID: member.activityTypeEnumID,
                ActivityResponseTypeEnumID: member.activityResponseTypeEnumID,
                Note: member.comments,
                CreatedDate: new Date().toISOString()
            }

            memberService.saveMemberActivity(activity).then(function (success) {

                member.activityId = success.id;

                // remove from selected list
                for (var i = 0; i < vm.selectedMembers.length; i++) {
                    if (vm.selectedMembers[i].id == member.id) {
                        vm.selectedMembers.splice(i, 1);
                        break;
                    }
                }

                // update copy in list (hopefully this will cause the save button to disappear
                for (var i2 = 0; i2 < vm.memberList.length; i2++) {
                    if (vm.memberList[i2].id == member.id) {
                        vm.memberList[i2] = angular.copy(member);
                        break;
                    }
                }

                // try resetting the form - may need to change form name from using an index to using the member's id.
                //https://stackoverflow.com/questions/21571370/resetting-form-after-submit-in-angularjs

                appNotificationService.openToast(member.fullName + " saved");

            }, function (error) {
                appNotificationService.openToast("Error saving activity for " + member.fullName);
            })
        }

        vm.formatDate = function (utcDate) {
            return moment.tz(utcDate, moment.tz.guess()).format("L LT");
        }

        return vm;
};


MemberActivityController.$inject = ['$scope', '$mdDialog', '$stateParams', '$mdMedia', '$state', '$log', 'memberService', 'appNotificationService', 'appService'];

angular.module('app').controller('memberActivityController', MemberActivityController);

