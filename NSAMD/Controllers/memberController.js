

'use strict';

angular.module('app').controller('memberController',
    ['$routeParams', '$mdMedia', '$mdDialog', '$mdBottomSheet', '$location', '$log', 'memberService', 'appNotificationService'
    , function ($routeParams, $mdMedia, $mdDialog, $mdBottomSheet, $location, $log, memberService, appNotificationService) {

        var vm = this;
        
        vm.memberId = $routeParams.memberId;
        vm.churchId = 3;

        vm.member = {};

        vm.isLoading = false;

        vm.loadMember = function () {
            vm.isLoading = true;
            memberService.get(vm.memberId, vm.churchId).then(function (success) {
                vm.member = success;
                //appNotificationService.openToast("success");
            }, function (error) {
                appNotificationService.openToast("Error loading member " + vm.memberId + ":  " + error);
            }).then(function () {
                vm.isLoading = false;
            });
        };

        vm.patch = function (fieldName, fieldValue) {
            memberService.patch(vm.memberId, vm.churchId, fieldName, fieldValue).then(function (success) {
               // vm.member = success;
                appNotificationService.openToast("Save success");
            }, function (error) {
                appNotificationService.openToast("Error saving member " + vm.memberId + ":  " + error);
            }).then(function () {
                vm.isLoading = false;
            });
        }

        vm.editAddress = function (type, addy, $event) {

            var config = GetEditConfiguration(type);

            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));

            $mdDialog.show({
                locals: { currentItem: addy },
                templateUrl: config.template,
                parent: angular.element(document.body),
                targetEvent: $event,
                controller: config.controller,
                controllerAs: 'dc', // dc = dialog controller
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            }).then(function (editedItem) {

                config.push(editedItem);

                $log.info("Edit item saved");

            }, function () {
                $log.info("Edit item cancelled");
            });
        }

        function GetEditConfiguration(type) {
            var config = {};
            config.controller = "SimpleDialogController";
            if (type == "email") {
                config.template = './views/app/emailDialog.html';
                config.push = function (item) {
                    vm.member.emailList.push(item);
                }
            }
            else if (type == "phone") {
                config.template = './views/app/phoneDialog.html';
                config.push = function (item) {
                    vm.member.phoneList.push(item);
                }
            }
            else {
                config.template = './views/app/addressDialog.html';
                config.push = function (item) {
                    vm.member.addressList.push(item);
                }
            }
            return config;
        }

        return vm;
    }]);