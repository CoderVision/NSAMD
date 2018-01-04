


'use strict';

angular.module('print').controller('activeGuestListController',
    ['$http', '$routeParams', 'perspectivesService'
    , function ($http, $routeParams, perspectivesService) {

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
            }, function (error) {

            });
        }

        return vm;
    }]);