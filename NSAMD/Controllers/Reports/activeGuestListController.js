


'use strict';

angular.module('app').controller('activeGuestListController',
    ['$http', '$routeParams', '$log', 'reportService'
    , function ($http, $routeParams, $log, reportService) {

        var vm = this;

        vm.memberList = [];
        vm.sponsorGroup = [];
        vm.teamGroup = [];
        vm.runDate = "";

        vm.load = function()
        {
            vm.runDate = vm.formatDate(new Date());

            var reportId = 1;
            var queryOptions = "?"
                    + "churchId=" + $routeParams.churchId
                    + "&period=" + $routeParams.period
                    + "&date=" + $routeParams.date
                    + "&statusIds=" + $routeParams.statusIds
                    + "&teamId=" + $routeParams.teamId
                    + "&sponsorId=" + $routeParams.sponsorId;

            reportService.getReport(reportId, queryOptions).then(function (success) {
                vm.memberList = success;

                for (var i = 0; i < vm.memberList.length; i++) {

                    var member = vm.memberList[i];

                    // format activity date
                    var activityDate = member.lastActivityDate;
                    if (activityDate !== null)
                        member.lastActivityDateFormatted = vm.formatDate(activityDate);

                    addSponsorToGroup(member);

                    addTeamToGroup(member);
                }

            }, function (error) {
                $log.info(error);
            });
        }

        function addSponsorToGroup(member) {
            var contains = false;
            for (var i = 0; i < vm.sponsorGroup.length; i++) {
                if (vm.sponsorGroup[i].sponsorId == member.sponsorId) {
                    contains = true;
                    break;
                }
            }
            if (contains === false) {
                vm.sponsorGroup.push({ sponsorId: member.sponsorId, sponsorName: member.sponsorName, teamId: member.teamId });
            }
        }

        function addTeamToGroup(member) {
            var contains = false;
            for (var i = 0; i < vm.teamGroup.length; i++) {
                if (vm.teamGroup[i].teamId == member.teamId) {
                    contains = true;
                    break;
                }
            }
            if (contains === false) {
                vm.teamGroup.push({ teamId: member.teamId, teamName: member.teamName });
            }
        }

        vm.filterBySponsorGroup = function (member, sponsor) {
            return member.sponsorId == sponsor.sponsorId;
        }

        vm.formatDate = function (utcDate) {
            return moment.tz(utcDate, moment.tz.guess()).format("L");
        }

        return vm;
    }]);