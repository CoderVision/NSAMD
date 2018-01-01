
'use strict'

angular.module('app').factory('appService', ['$q'
    , function ($q) {

        var svc = {};

        svc.title = "Members";

       return svc;
    }]);