

'use strict';

angular.module('app').controller('memberActivityController',
    ['$scope', '$mdDialog', '$routeParams', '$mdMedia', '$location', '$log', 'memberService', 'appNotificationService', 'appService'
    , function ($scope, $mdDialog, $routeParams, $mdMedia, $location, $log, memberService, appNotificationService, appService) {

        var vm = this;
        vm.churchId = $routeParams.churchId;
        vm.statusIds = "49-50";
        vm.memberList = [];
        vm.selectedTeamId = 0; // do a watch on this

        vm.isLoading = false;
        vm.config = {};

        // handle add item event from root scope
        $scope.$emit('enableAddItemEvent', { enabled: false });


        $scope.$watch('mac.selectedTeamId', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                // filter list by team
                //vm.loadData();
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

        vm.load = function () {

            appService.title = "Members";

            vm.isLoading = true;

            memberService.getConfig(vm.churchId).then(function (success) {

                vm.config = success;

            }, function (error) {
                appNotificationService.openToast("Error loading member config ");
            });

            loadMemberList();
        }

        function loadMemberList() {
            memberService.getList(vm.churchId, vm.statusIds).then(function (success) {

                vm.memberList = success;

                //vm.paginationOptions.totalItems = success.length;

            }, function (error) {
                $log.error(error);
            }).then(function () {
                vm.isLoading = false;
            });
        }

        vm.searchText = "";

        //vm.openProfile = function (memberId) {
        //    $location.path('/member').search({ memberId: memberId });
        //}


        vm.selectedMembers = [];
        vm.selectMember = function (member) {

            var isNew = true;
            for (var i = 0; i < vm.selectedMembers.length; i++) {
                if (vm.selectedMembers[i].id == member.id) {
                    isNew = false;
                    break;
                }
            }

            // if not in list, then add it
            if (isNew === true)
                vm.selectedMembers.push(angular.copy(member));

        }

        vm.resetMember = function (member) {

            for (var i = 0; i < vm.selectedMembers.length; i++) {

                if (vm.selectedMembers[i].id == member.id) {

                    for (var i2 = 0; i2 < vm.memberList.length; i2++) {

                        if (vm.memberList[i2].id == member.id) {
                            vm.memberList[i2] = angular.copy(vm.selectedMembers[i]);
                            vm.selectedMembers.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        }

        vm.saveMember = function(member){

        }

        return vm;
    }]);