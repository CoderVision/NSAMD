﻿
'use strict';

angular.module('app').controller('reportsController',
    ['$scope', '$window', '$routeParams', '$mdDialog', '$mdMedia', '$mdBottomSheet', '$location', '$log', 'reportService', 'appNotificationService'
    , function ($scope, $window, $routeParams, $mdDialog, $mdMedia, $mdBottomSheet, $location, $log, reportService, appNotificationService) {

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

                vm.loadReportList();
            }
        }, false);

        vm.load = function () {

            // load config data, such as churches, teams, sponsors, statuses, etc.
            reportService.getConfig(vm.churchId).then(function (success) {

                vm.config = success;

            }, function (error) {
                appNotificationService.openToast("Error loading report config ");
            }).then(function () {
                vm.isLoading = false;
            });
        }

        vm.loadReportList = function () {
            vm.reportList = [];
            vm.reportList.push({ id: 1, name: 'Active Guest List', desc: 'A lists of members for follow-up; filtered by team, sponsor, and status.', open: vm.openActiveGuestList })
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

            vm.config.filterSponsors = function(sponsor){
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
            }).then(function (editedItem) {

                vm.churchId = editedItem.churchId;

                var uri = "/print.html#!/activeGuestList/churchId/" + vm.churchId;

                $window.open(uri, '_blank');

            }, function () {
                //$log.info("Edit item cancelled");
            });
        }

        return vm;
    }]);