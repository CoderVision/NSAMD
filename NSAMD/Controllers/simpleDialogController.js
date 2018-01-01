'use strict';

angular.module('app')
    .controller('simpleDialogController', ['$mdDialog', 'currentItem', 'config', function ($mdDialog, currentItem, config) {
        var vm = this;

        vm.currentItem = currentItem;
        vm.config = config;

        vm.cancel = function () {
            $mdDialog.cancel();
        }

        vm.save = function () {
            $mdDialog.hide(vm.currentItem);
        }

        return vm;
}]);