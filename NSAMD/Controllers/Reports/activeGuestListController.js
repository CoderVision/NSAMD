


'use strict';

angular.module('print').controller('activeGuestListController',
    ['$http', '$routeParams', '$log', 'perspectivesService'
    , function ($http, $routeParams, $log, perspectivesService) {

        var vm = this;

        vm.churchId = $routeParams.churchId;
        vm.memberList = [];
        vm.Title = "Hello World!";
        vm.memberList = [];

        vm.load = function()
        {
            var reportId = 1;  // active guest list report id
            perspectivesService.getReport(reportId, vm.churchId).then(function (success) {
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