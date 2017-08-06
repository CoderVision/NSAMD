
'use strict';

angular.module('app').controller('memberController',
    ['$mdDialog', '$mdMedia', '$mdBottomSheet', '$location', '$log', 'memberService'
    , function ($mdDialog, $mdMedia, $mdBottomSheet, $location, $log, memberService) {

    var vm = this;

    vm.memberList = [];

    return vm;
}]);