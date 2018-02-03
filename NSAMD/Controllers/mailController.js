

'use strict';

angular.module('app').controller('mailController',
    ['$scope', '$mdDialog', '$mdMedia', '$location', '$log', 'appNotificationService'
        , function ($scope, $mdDialog, $mdMedia, $location, $log, appNotificationService) {

            var vm = this;

            vm.message = "Hello from the mailController!";

            return vm;
        }]);