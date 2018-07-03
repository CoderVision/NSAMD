

'use strict';

angular.module('app').controller('mailController',
    ['$scope', '$mdDialog', '$mdMedia', '$location', '$log', 'appNotificationService', '$stateParams'
        , function ($scope, $mdDialog, $mdMedia, $location, $log, appNotificationService, $stateParams) {

            var vm = this;

            vm.message = "Hello from the mailController!";
            vm.correspondences = [];
            vm.churchId = $stateParams.churchId;

            vm.useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));

            $scope.$on('addMessageGroup', function (event, params) {
                vm.editGroup(params.event, params.group);
            });

            // have to think about how we are going to handle this
            vm.editGroup = function ($event, group) {
                var config = {};

                $mdDialog.show({
                    locals: { currentItem: group, config: config },
                    templateUrl: './views/Messages/messageGroupDialog.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    controller: 'messageGroupDialogController',
                    controllerAs: 'dc', // dc = dialog controller
                    clickOutsideToClose: false,
                    fullscreen: vm.useFullScreen
                }).then(function (editedItem) {

                    // notify either the sms or email controller that an item has been edited, or added
                    vm.correspondences.push(editedItem);

                }, function () {
                    $log.info("Edit item cancelled");
                });
            }

            return vm;
        }]);