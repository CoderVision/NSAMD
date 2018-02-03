


'use strict';

angular.module('app').controller('smsController',
    ['$scope', '$mdDialog', '$mdMedia', '$location', '$log', 'appNotificationService'
        , function ($scope, $mdDialog, $mdMedia, $location, $log, appNotificationService) {

            var vm = this;

            vm.message = "Hello from the smsController!";
           
            return vm;
        }]);