
'use strict';

angular.module('app')
    .controller('messageDialogController', ['$mdDialog', '$q', 'currentItem',
        function ($mdDialog, $q, currentItem) {

        var vm = this;

        vm.currentItem = currentItem;

        vm.messageType = currentItem.messageType;  // 1 = Email, 2 = Sms

        vm.cancel = function () {
            $mdDialog.cancel();
        }

        vm.save = function () {
            $mdDialog.hide(vm.currentItem);
        }

        vm.querySearch = function (criteria)
        {
            var deferred = $q.defer();

            //deferred.resolve(success.data);
            //deferred.reject(err);

            return deferred.promise;
        }

        return vm;
    }]);