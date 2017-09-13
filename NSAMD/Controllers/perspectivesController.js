
'use strict';

angular.module('app').controller('perspectivesController',
    ['$mdDialog', '$mdMedia', '$mdBottomSheet', '$location', '$log', 'memberService'
    , function ($mdDialog, $mdMedia, $mdBottomSheet, $location, $log, memberService) {

        var vm = this;

        vm.memberList = [];

        return vm;
    }]);