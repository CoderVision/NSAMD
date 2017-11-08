
'use strict';

angular.module('app')
    .controller('MessageDialogController', ['$mdDialog', 'currentItem', function ($mdDialog, currentItem) {
        var vm = this;

        vm.currentItem = currentItem;

        vm.messageType = currentItem.messageType;  // 1 = Email, 2 = Sms

        vm.cancel = function () {
            $mdDialog.cancel();
        }

        vm.save = function () {
            $mdDialog.hide(vm.currentItem);
        }

        

        return vm;
    }]);