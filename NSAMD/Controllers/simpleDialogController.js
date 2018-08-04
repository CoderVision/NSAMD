'use strict';


        
    function SimpleDialogController($mdDialog, currentItem, config) {
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
};

SimpleDialogController.$inject = ['$mdDialog', 'currentItem', 'config'];

angular.module('app').controller('simpleDialogController', SimpleDialogController);


