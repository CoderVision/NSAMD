

'use strict';

angular.module('app').controller('memberController',
    ['$routeParams', '$mdMedia', '$mdBottomSheet', '$location', '$log', 'memberService', 'appNotificationService'
    , function ($routeParams, $mdMedia, $mdBottomSheet, $location, $log, memberService, appNotificationService) {

        var vm = this;
        
        vm.memberId = $routeParams.memberId;

        vm.member = {};

        vm.isLoading = false;

        vm.loadMember = function () {
            vm.isLoading = true;
            memberService.get(vm.memberId).then(function (success) {
                vm.member = success;
                //appNotificationService.openToast("success");
            }, function (error) {
                appNotificationService.openToast("Error loading member " + vm.memberId + ":  " + error);
            }).then(function () {
                vm.isLoading = false;
            });
        };

        return vm;
    }]);