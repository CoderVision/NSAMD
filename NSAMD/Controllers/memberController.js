
'use strict';

angular.module('app').controller('memberController',
    ['$mdDialog', '$mdMedia', '$mdBottomSheet', '$location', '$log', 'memberService'
    , function ($mdDialog, $mdMedia, $mdBottomSheet, $location, $log, memberService) {

    var vm = this;
        
    vm.gridOptions = {
        data: [], //required parameter - array with data
        //optional parameter - start sort options
        sort: {
            predicate: 'Name',
            direction: 'asc'
        }
    };

    vm.paginationOptions = {
        maxSize: 5,       //Limit number for pagination size
        totalItems: 15,    // Total number of items in all pages.
        itemsPerPage: 5,  // Maximum number of items per page. A value less than one indicates all items on one page.
        currentPage: 1,
    };

    vm.loadData = function () {
        vm.gridOptions.data = [{
            "Name": "Gary",
            "Status": "Active",
            "StatusDescription": "Coming Regularly",
            "LastAttendance": "09/04/2017",
            "Phone": "253-318-4015",
            "Email": "gl@msn.com",
            "Address": "8918 176th Street Ct E"
        },
        {
            "Name": "Gary",
            "Status": "Active",
            "StatusDescription": "Coming Regularly",
            "LastAttendance": "09/04/2017",
            "Phone": "253-318-4015",
            "Email": "gl@msn.com",
            "Address": "8918 176th Street Ct E"
        },
        {
            "Name": "Gary",
            "Status": "Active",
            "StatusDescription": "Coming Regularly",
            "LastAttendance": "09/04/2017",
            "Phone": "253-318-4015",
            "Email": "gl@msn.com",
            "Address": "8918 176th Street Ct E"
        },
        {
            "Name": "Gary",
            "Status": "Active",
            "StatusDescription": "Coming Regularly",
            "LastAttendance": "09/04/2017",
            "Phone": "253-318-4015",
            "Email": "gl@msn.com",
            "Address": "8918 176th Street Ct E"
        },
        {
            "Name": "Gary",
            "Status": "Active",
            "StatusDescription": "Coming Regularly",
            "LastAttendance": "09/04/2017",
            "Phone": "253-318-4015",
            "Email": "gl@msn.com",
            "Address": "8918 176th Street Ct E"
        }, {
            "Name": "Gary",
            "Status": "Active",
            "StatusDescription": "Coming Regularly",
            "LastAttendance": "09/04/2017",
            "Phone": "253-318-4015",
            "Email": "gl@msn.com",
            "Address": "8918 176th Street Ct E"
        }, {
            "Name": "Gary",
            "Status": "Active",
            "StatusDescription": "Coming Regularly",
            "LastAttendance": "09/04/2017",
            "Phone": "253-318-4015",
            "Email": "gl@msn.com",
            "Address": "8918 176th Street Ct E"
        }, {
            "Name": "Gary",
            "Status": "Active",
            "StatusDescription": "Coming Regularly",
            "LastAttendance": "09/04/2017",
            "Phone": "253-318-4015",
            "Email": "gl@msn.com",
            "Address": "8918 176th Street Ct E"
        }, {
            "Name": "Gary",
            "Status": "Active",
            "StatusDescription": "Coming Regularly",
            "LastAttendance": "09/04/2017",
            "Phone": "253-318-4015",
            "Email": "gl@msn.com",
            "Address": "8918 176th Street Ct E"
        }, {
            "Name": "Gary",
            "Status": "Active",
            "StatusDescription": "Coming Regularly",
            "LastAttendance": "09/04/2017",
            "Phone": "253-318-4015",
            "Email": "gl@msn.com",
            "Address": "8918 176th Street Ct E"
        }, {
            "Name": "Gary",
            "Status": "Active",
            "StatusDescription": "Coming Regularly",
            "LastAttendance": "09/04/2017",
            "Phone": "253-318-4015",
            "Email": "gl@msn.com",
            "Address": "8918 176th Street Ct E"
        }, {
            "Name": "Gary",
            "Status": "Active",
            "StatusDescription": "Coming Regularly",
            "LastAttendance": "09/04/2017",
            "Phone": "253-318-4015",
            "Email": "gl@msn.com",
            "Address": "8918 176th Street Ct E"
        }, {
            "Name": "Gary",
            "Status": "Active",
            "StatusDescription": "Coming Regularly",
            "LastAttendance": "09/04/2017",
            "Phone": "253-318-4015",
            "Email": "gl@msn.com",
            "Address": "8918 176th Street Ct E"
        }, {
            "Name": "Gary",
            "Status": "Active",
            "StatusDescription": "Coming Regularly",
            "LastAttendance": "09/04/2017",
            "Phone": "253-318-4015",
            "Email": "gl@msn.com",
            "Address": "8918 176th Street Ct E"
        }, {
            "Name": "Gary",
            "Status": "Active",
            "StatusDescription": "Coming Regularly",
            "LastAttendance": "09/04/2017",
            "Phone": "253-318-4015",
            "Email": "gl@msn.com",
            "Address": "8918 176th Street Ct E"
        }, {
            "Name": "Gary",
            "Status": "Active",
            "StatusDescription": "Coming Regularly",
            "LastAttendance": "09/04/2017",
            "Phone": "253-318-4015",
            "Email": "gl@msn.com",
            "Address": "8918 176th Street Ct E"
        }, {
            "Name": "Gary",
            "Status": "Active",
            "StatusDescription": "Coming Regularly",
            "LastAttendance": "09/04/2017",
            "Phone": "253-318-4015",
            "Email": "gl@msn.com",
            "Address": "8918 176th Street Ct E"
        }, {
            "Name": "Gary",
            "Status": "Active",
            "StatusDescription": "Coming Regularly",
            "LastAttendance": "09/04/2017",
            "Phone": "253-318-4015",
            "Email": "gl@msn.com",
            "Address": "8918 176th Street Ct E"
        }];

        vm.paginationOptions.totalItems = 18;

        $log.info("loadData called");
    };

    vm.searchText = "";

    //vm.gridActions = {
    //    sort: function () { $log.info("sort"); },
    //    filter: function () { $log.info("filter"); },
    //    refresh: function () { $log.info("refresh"); }
    //};

    return vm;
}]);