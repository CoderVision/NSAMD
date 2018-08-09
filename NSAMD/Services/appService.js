
'use strict'

function AppService($q) {

        var svc = {};

        svc.title = "Members";
        svc.isLoggedIn = false;
        svc.roleId = 0;

        svc.menuItems = [];

       return svc;
};

angular.module('app').factory('appService', AppService); 

AppService.$inject = ['$q'];