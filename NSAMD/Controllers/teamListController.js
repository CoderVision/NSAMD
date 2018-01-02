
'use strict';

angular.module('app').controller('teamListController',
    ['$scope', '$mdDialog', '$mdMedia', '$mdBottomSheet', '$location', '$log', 'teamService', 'appNotificationService', 'appService'
    , function ($scope, $mdDialog, $mdMedia, $mdBottomSheet, $location, $log, teamService, appNotificationService, appService) {

        var vm = this;
        vm.churchId = 3; // default to the first one that they have access to

        vm.isLoading = false;
        vm.config = {};

        // handle add item event from root scope
        $scope.$emit('enableAddItemEvent');
        $scope.$on('addItemEvent', function (event) {
            vm.addItem(event);
        });

        $scope.$watch('tlc.churchId', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                vm.loadData();
            }
        }, false);

        vm.gridOptions = {
            data: [], //required parameter - array with data
            //optional parameter - start sort options
            sort: {
                predicate: 'Name',
                direction: 'asc'
            }
        };

        vm.paginationOptions = {
            //maxSize: 5,       //Limit number for pagination size
            totalItems: 0,    // Total number of items in all pages.
            itemsPerPage: 25,  // Maximum number of items per page. A value less than one indicates all items on one page.
            currentPage: 1,
        };

        vm.loadData = function () {

            appService.title = "Teams";

            vm.isLoading = true;

            teamService.getConfig(vm.churchId).then(function (success) {

                vm.config = success;

            }, function (error) {
                appNotificationService.openToast("Error loading team config ");
            });

            loadTeamList();
        }

        function loadTeamList() {
            teamService.getList(vm.churchId).then(function (success) {

                vm.gridOptions.data = success;

                vm.paginationOptions.totalItems = success.length;

            }, function (error) {
                $log.error(error);
            }).then(function () {
                vm.isLoading = false;
            });
        }

        vm.searchText = "";

        vm.openProfile = function (teamId) {
            $location.path('/team').search({ teamId: teamId });
        }

        vm.addItem = function ($event) {

            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));

            var team = {
                dateCame: new Date(),
                churchId: vm.churchId
            };
            config = {
                memberList: vm.config.memberList
            };

            $mdDialog.show({
                locals: { currentItem: team, config: config },
                templateUrl: './views/Teams/addTeamMemberDialog.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                controller: 'addTeamController',
                controllerAs: 'dc', // dc = dialog controller
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            }).then(function (editedItem) {

                // reload list
                loadTeamList();

            }, function () {
                $log.info("Edit item cancelled");
            });
        }

        return vm;
    }]);