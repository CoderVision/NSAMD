
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

        return vm;
    }]);