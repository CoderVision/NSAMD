

'use strict';

angular.module('app').controller('memberController',
    ['$routeParams', '$mdMedia', '$mdBottomSheet', '$location', '$log', 'memberService', 'appNotificationService'
    , function ($routeParams, $mdMedia, $mdBottomSheet, $location, $log, memberService, appNotificationService) {

        var vm = this;
        
        vm.memberId = $routeParams.memberId;

        vm.member = {};

        vm.loadMember = function () {
            memberService.get(vm.memberId).then(function (success) {
                vm.member = success;
                appNotificationService.openToast("success");
            }, function (error) {
                appNotificationService.openToast("Error loading member " + vm.memberId + ":  " + error);
            });
        };

        return vm;
    }]);