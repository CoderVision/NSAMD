


'use strict';

angular.module('print').controller('activeGuestListController',
    ['$http', '$routeParams', '$log', 'reportService'
    , function ($http, $routeParams, $log, reportService) {

        var vm = this;

        vm.memberList = [];

        vm.load = function()
        {
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
                    var activityDate = vm.memberList[i].lastActivityDate;
                    if (activityDate !== null)
                        vm.memberList[i].lastActivityDateFormatted = vm.formatDate(activityDate);
                }
            }, function (error) {
                $log.info(error);
            });
        }

        vm.formatDate = function (utcDate) {
            return moment.tz(utcDate, moment.tz.guess()).format("L");
        }

        return vm;
    }]);