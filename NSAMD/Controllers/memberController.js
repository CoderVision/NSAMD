

'use strict';

angular.module('app').controller('memberController',
    ['$routeParams','$mdDialog', '$mdMedia', '$mdBottomSheet', '$location', '$log', 'memberService'
    , function ($routeParams, $mdDialog, $mdMedia, $mdBottomSheet, $location, $log, memberService) {

        var vm = this;
        
        vm.memberId = $routeParams.memberId;

        return vm;
    }]);