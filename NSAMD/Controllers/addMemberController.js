
'use strict';

angular.module('app')
    .controller('AddMemberController', ['$mdDialog', 'currentItem', 'config', function ($mdDialog, currentItem, config) {

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

            $mdDialog.hide(vm.currentItem);
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