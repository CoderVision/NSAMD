'use strict';

angular.module('app')
    .controller('SimpleDialogController', ['$mdDialog', 'currentItem', function ($mdDialog, currentItem) {
        var vm = this;

        vm.currentItem = currentItem;

        vm.cancel = function () {
            $mdDialog.cancel();
        }

        vm.save = function () {
            $mdDialog.hide(vm.currentItem);
        }

        return vm;
}]);