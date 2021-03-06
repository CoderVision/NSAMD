﻿
'use strict';

        function ReportsController($scope, $window, $stateParams, $mdDialog, $mdMedia, $mdBottomSheet, $location, $log, reportService, appNotificationService, appService, localStorageService) {

        $scope.$emit('enableAddItemEvent', { enabled: false });

        var vm = this;

        vm.memberList = [];
        vm.churchId = 0;
        vm.config = {};
        vm.useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
        vm.reportList = [];
        vm.reportSearchText = "";
        vm.isLoading = true;

        $scope.$watch('rc.churchId', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                vm.load();
            }
        }, false);

        vm.load = function () {

            appService.title = "Perspectives";
            appService.menuItems = [];

            vm.loadReportList();

            if (vm.churchId == 0) {
                var id = localStorageService.get("reportListChurchId");
                if (id !== null)
                    vm.churchId = id;
            } 

            // load config data, such as churches, teams, sponsors, statuses, etc.
            reportService.getConfig(vm.churchId).then(function (success) {

                vm.config = success;

                var found = false;
                for (var i = 0; i < vm.config.churchList.length; i++) {
                    if (vm.config.churchList[i].id == vm.churchId) {
                        found = true;
                        break;
                    }
                }

                if (found == false)
                    vm.churchId = vm.config.churchList[0].id;

                localStorageService.set("reportListChurchId", vm.churchId);

            }, function (error) {
                appNotificationService.openToast("Error loading report config ");
            }).then(function () {
                vm.isLoading = false;
            });
        }

        vm.loadReportList = function () {
            vm.reportList = [];
            vm.reportList.push({ id: 1, name: 'Guest List', desc: 'A lists of members for follow-up; filtered by team, sponsor, and status.', open: vm.openActiveGuestList })
        }

        vm.filterReports = function (report) {
            if (report === undefined) return;

            var criteria = vm.reportSearchText.toLowerCase().trim();

            return (criteria == "" || report.name.toLowerCase().indexOf(criteria) > -1);
        }


        vm.openActiveGuestList = function ($event) {

            var item = {
                churchId: vm.churchId,
                period: 1
            }

            vm.config.dateFilter = function (date) {
                if (item.period === 1) {
                    var dayOfMonth = date.getDate();
                    return dayOfMonth === 1;  // 1st day of month
                }
                else if (item.period === 2) {
                    var dayOfWeek = date.getDay()
                    return dayOfWeek === 0; // 0=sunday, 6=saturday
                }
            }

            vm.config.filterSponsors = function (sponsor) {
                return sponsor.teamId == item.teamId;
            }

            $mdDialog.show({
                locals: { currentItem: item, config: vm.config },
                templateUrl: './views/Reports/activeGuestListParamsDialog.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                controller: 'simpleDialogController',
                controllerAs: 'dc', // dc = dialog controller
                clickOutsideToClose: true,
                fullscreen: vm.useFullScreen
            }).then(function (rpt) {

                var statusIds = "";
                var delimiter = "";
                for (var i = 0; i < rpt.statusIds.length; i++) {
                    statusIds += delimiter + rpt.statusIds[i];
                    delimiter = "-";
                }

                var uri = "/print.html#!/activeGuestList/churchId/" + vm.churchId
                    + "/period/" + rpt.period
                    + "/date/" + rpt.date
                    + "/statusIds/" + statusIds
                    + "/teamId/" + (rpt.teamId === undefined ? 0 : rpt.teamId)
                    + "/sponsorId/" + (rpt.sponsorId === undefined ? 0 : rpt.sponsorId);

                $window.open(uri, '_blank');

            }, function () {
                //$log.info("Edit item cancelled");
            });
        }

        return vm;
};

ReportsController.$inject = ['$scope', '$window', '$stateParams', '$mdDialog', '$mdMedia', '$mdBottomSheet', '$location', '$log', 'reportService', 'appNotificationService', 'appService', 'localStorageService'];

angular.module('app').controller('reportsController', ReportsController);



