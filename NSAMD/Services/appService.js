
'use strict'

angular.module('app').factory('appService', ['$q'
    , function ($q) {

        var svc = {};

        svc.title = "Members";
        svc.isLoggedIn = false;
        svc.roleId = 0;

        svc.menuItems = [];

       return svc;
    }]);