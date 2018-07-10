
'use strict';

angular.module('app').controller('memberListController',
    ['$scope', '$mdDialog', '$mdMedia', '$log', 'memberService', 'appNotificationService', 'appService', '$state', 'localStorageService'
        , function ($scope, $mdDialog, $mdMedia, $log, memberService, appNotificationService, appService, $state, localStorageService) {

        var vm = this;
        vm.churchId = 0; // default to the first one that they have access to
        vm.statusIds = "49-50";

        vm.isLoading = false;
        vm.config = {};
        vm.appService = appService;

        // handle add item event from root scope
        $scope.$emit('enableAddItemEvent');
        $scope.$on('addItemEvent', function (event) {
            vm.addItem(event);
        });

       // required, because the async call causes the member list to load below before the token is parsed.
        $scope.$on('tokenParsed', function (event) {
            vm.loadData();
        });

        $scope.$watch('mlc.churchId', function (newValue, oldValue) {
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

            appService.title = "Members";
            appService.menuItems = [{ text: "Activity", do: vm.openActivity }];

            if (vm.appService.isLoggedIn === false)
                return;

            vm.isLoading = true;

            if (vm.churchId == 0) {
                var id = localStorageService.get("memberListChurchId");
                if (id !== null)
                    vm.churchId = id;
            } 

            memberService.getConfig(vm.churchId).then(function (success) {

                vm.config = success;

                var found = false;
                for (var i = 0; i < vm.config.userChurches.length; i++) {
                    if (vm.config.userChurches[i].id == vm.churchId) {
                        found = true;
                        break;
                    }
                }

                if (found == false)
                    vm.churchId = m.config.userChurches[0].id;

                localStorageService.set("memberListChurchId", vm.churchId);

                loadMemberList();

            }, function (error) {

                vm.isLoading = false;
                appNotificationService.openToast("Error loading member config ");
                $log.log(error);
            });
        }

        function loadMemberList() {
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
            $state.go('member', { memberId: memberId, churchId: vm.churchId });
        }

        vm.openActivity = function () {
            $state.go('activity', { churchId: vm.churchId });
        }

        vm.addItem = function ($event) {

            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));

            var member = {
                dateCame: new Date(),
                churchId: vm.churchId,
                isNew: true
            };
            config = {
                memberList: vm.config.memberList
            };

            $mdDialog.show({
                locals: { currentItem: member, config: config },
                templateUrl: './views/Members/addMember.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                controller: 'addMemberController',
                controllerAs: 'dc', // dc = dialog controller
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            }).then(function (editedItem) {

                // reload list
                loadMemberList();

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