
'use strict';

angular.module('app').controller('reportsController',
    ['$window', '$routeParams', '$mdDialog', '$mdMedia', '$mdBottomSheet', '$location', '$log', 'memberService', 'config'
    , function ($window, $routeParams, $mdDialog, $mdMedia, $mdBottomSheet, $location, $log, memberService, config) {

        var vm = this;

        vm.memberList = [];
        vm.type = $routeParams.type;
        vm.churchId = $routeParams.churchId;
        vm.config = config;

        vm.load = function () {

        }

        vm.openActiveGuestList = function ($event) {

            // temp.  add ddl to select church and remove this
            if (vm.churchId == undefined)
                vm.churchId = 3;

            var uri = "/print.html#!/activeGuestList/churchId/" + vm.churchId;

            $window.open(uri, '_blank');
        }

        return vm;
    }]);