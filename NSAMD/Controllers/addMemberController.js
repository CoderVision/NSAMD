
'use strict';

angular.module('app')
    .controller('addMemberController', ['$mdDialog', '$log', 'memberService', 'appNotificationService', 'currentItem', 'config'
        , function ($mdDialog, $log, memberService, appNotificationService, currentItem, config) {

        var vm = this;
        vm.config = config;
        vm.currentItem = currentItem;

        vm.selectedSponsors = [];
        vm.selectedSponsor = null;
        vm.sponsorSearchText = null;

        vm.cancel = function () {
            $mdDialog.cancel();
        }

        vm.save = function () {

            var list = [];
            if (vm.selectedSponsors.length > 0) {
                for (var i = 0; i < vm.selectedSponsors.length; i++) {
                    var s = {
                        SponsorId: vm.selectedSponsors[i].id,
                        MemberId: 0, // a new member doesn't have a member id yet.
                        FirstName: "",
                        LastName: ""
                    };
                    list.push(s);
                }
            }
            vm.currentItem.sponsorList = list;

            vm.currentItem.dateCame = new Date(vm.currentItem.dateCame).toISOString(); // convert to datetimeoffset

            // save member and reset form so it can be used to enter the next member
            memberService.saveNewMember(vm.currentItem).then(function (success) {

                $log.info("new member saved");
                appNotificationService.openToast("Save success");

                var churchId = vm.currentItem.churchId;

                vm.currentItem = {
                    dateCame: new Date(),
                    churchId: churchId
                };

                vm.selectedSponsors = [];
                vm.selectedSponsor = null;
                vm.sponsorSearchText = null;

            }, function (error) {
                $log.info("Error saving new member");
            });

            //$mdDialog.hide(vm.currentItem);
        }

        // Sponsors
        vm.sponsorSearch = function (sponsorSearchText) {
            var result = vm.config.memberList.filter(sponsorFilter);
            return result;
        }
        function sponsorFilter(member) {
            var lowercase = angular.lowercase(vm.sponsorSearchText);
            return (member.desc.toLowerCase().indexOf(lowercase) === 0);
        }

        return vm;
    }]);