
'use strict';

angular.module('app').controller('memberListController',
    ['$mdDialog', '$mdMedia', '$mdBottomSheet', '$location', '$log', 'memberService'
    , function ($mdDialog, $mdMedia, $mdBottomSheet, $location, $log, memberService) {

        var vm = this;
        vm.churchId = 3;
        vm.statusIds = 49;

        vm.isLoading = false;
        
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

        memberService.getList().then(function (success) {

            vm.gridOptions.data = success;

            vm.paginationOptions.totalItems = success.length;

        }, function (error) {
           $log.error(error);
        }).then(function () {
            vm.isLoading = false;
        });
    };

    vm.searchText = "";

    vm.openProfile = function(memberId)
    {
        $location.path('/member').search({ memberId: memberId });
    }

    return vm;
}]);