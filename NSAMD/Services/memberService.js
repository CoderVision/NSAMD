
'use strict'

angular.module('app').factory('memberService', ['$http', '$log', '$q', 'config', function ($http, $log, $q, config) {

    var svc = {};

    svc.getList = function () {

        var deferred = $q.defer();

        var uri = config.apiUrl + "/Members?churchId=1,statusIds=1";

        $http.get(uri).then(function (success) {

            deferred.resolve(success.data);

        }, function (error) {

            $log.error("error in memberService.getList:  " + error);

            deferred.reject("Error retrieving member list");
        });
    };

    return svc;
}]);