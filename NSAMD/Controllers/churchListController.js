
'use strict';

angular.module('app').controller('churchListController',
    ['$scope', '$mdDialog', '$mdMedia', '$mdBottomSheet', '$state', '$log', 'churchService', 'appNotificationService', 'appService'
        , function ($scope, $mdDialog, $mdMedia, $mdBottomSheet, $state, $log, churchService, appNotificationService, appService) {

        var vm = this;
        vm.churchId = 3; // default to the first one that they have access to
        vm.showAll = false; // true to show all, false to hide archived

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

        // handle add item event from root scope
        $scope.$emit('enableAddItemEvent');
        $scope.$on('addItemEvent', function (event) {
            vm.addItem(event);
        });

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

            appService.title = "Churches";
            appService.menuItems = [];

            vm.isLoading = true;

            //churchService.getConfig().then(function (success) {

            //    vm.config = success;

            //}, function (error) {
            //    appNotificationService.openToast("Error loading church config ");
            //});

            loadChurchList();
        }

        function loadChurchList() {
            churchService.getList(vm.showAll).then(function (success) {

                vm.gridOptions.data = success;

                vm.paginationOptions.totalItems = success.length;

            }, function (error) {
                $log.error(error);
            }).then(function () {
                vm.isLoading = false;
            });
        }

        vm.searchText = "";

        vm.openProfile = function (churchId) {
            ///$location.path('/church').search({ churchId: churchId });
            $state.go('church', { churchId: churchId });
        }

        vm.addItem = function ($event) {

            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));

            var church = {
                isNew: true
            };

            config = {
               // memberList: vm.config.memberList
            };

            $mdDialog.show({
                locals: { currentItem: church, config: config },
                templateUrl: './views/Churches/addChurch.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                controller: 'addChurchController',
                controllerAs: 'dc', // dc = dialog controller
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            }).then(function (editedItem) {

                // reload list
                loadChurchList();

                // moved to AddMemberController
                //memberService.saveNewMember(editedItem).then(function (success) {

                //    vm.gridOptions.data.push(success);

                //    $log.info("new member saved");
                //    appNotificationService.openToast("Save success");

                //}, function (error) {
                //    $log.info("Error saving new member");
                //});

            }, function () {
                $log.info("Edit item cancelled");
            });
        }

        return vm;
    }]);