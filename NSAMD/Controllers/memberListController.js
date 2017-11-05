﻿
'use strict';

angular.module('app').controller('memberListController',
    ['$mdDialog', '$mdMedia', '$mdBottomSheet', '$location', '$log', 'memberService', 'appNotificationService'
    , function ($mdDialog, $mdMedia, $mdBottomSheet, $location, $log, memberService, appNotificationService) {

        var vm = this;
        vm.churchId = 3; // default to the first one that they have access to
        vm.statusIds = "49-50";

        vm.isLoading = false;
        vm.config = {};

        vm.gridOptions = {
            data: [], //required parameter - array with data
            //optional parameter - start sort options
            sort: {
                predicate: 'Name',
                direction: 'asc'
            }
        };

        //vm.gridActions = {
        //    sort: function () { $log.info("sort"); },
        //    filter: function () { $log.info("filter"); },
        //    refresh: function () { $log.info("refresh"); }
        //};

        vm.paginationOptions = {
            //maxSize: 5,       //Limit number for pagination size
            totalItems: 0,    // Total number of items in all pages.
            itemsPerPage: 25,  // Maximum number of items per page. A value less than one indicates all items on one page.
            currentPage: 1,
        };

        vm.loadData = function () {

            vm.isLoading = true;

            memberService.getConfig(vm.churchId).then(function (success) {

                vm.config = success;

            }, function (error) {
                appNotificationService.openToast("Error loading member config ");
            });

            memberService.getList(vm.churchId, vm.statusIds).then(function (success) {

                vm.gridOptions.data = success;

                vm.paginationOptions.totalItems = success.length;

            }, function (error) {
                $log.error(error);
            }).then(function () {
                vm.isLoading = false;
            });
        }

        vm.searchText = "";

        vm.openProfile = function (memberId) {
            $location.path('/member').search({ memberId: memberId });
        }

        vm.addItem = function ($event) {

            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));

            var member = {
                dateCame: new Date(),
                churchId: vm.churchId
            };
            config = {
                memberList: vm.config.memberList
            };

            $mdDialog.show({
                locals: { currentItem: member, config: config },
                templateUrl: './views/Members/addMember.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                controller: 'AddMemberController',
                controllerAs: 'dc', // dc = dialog controller
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            }).then(function (editedItem) {

                memberService.saveNewMember(editedItem).then(function (success) {

                    vm.gridOptions.data.push(success);

                    $log.info("new member saved");
                    appNotificationService.openToast("Save success");

                }, function (error) {
                    $log.info("Error saving new member");
                });

            }, function () {
                $log.info("Edit item cancelled");
            });
        }

        return vm;
    }]);