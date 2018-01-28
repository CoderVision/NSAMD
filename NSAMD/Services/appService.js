
'use strict'

angular.module('app').factory('appService', ['$q'
    , function ($q) {

        var svc = {};

        svc.title = "Members";
        svc.isLoggedIn = false;

        svc.menuItems = [];

       return svc;
    }]);