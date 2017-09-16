
'use strict'

angular.module('app').factory('memberService', ['$http', '$log', '$q', 'config', function ($http, $log, $q, config) {

    var svc = {};

    svc.getList = function () {

        var deferred = $q.defer();

        // remove churchId hardcoded value of "3", Graham; and statusIds "49"
        var uri = config.apiUrl + "/Members?churchId=3&statusIds=49";

        $http.get(uri).then(function (success) {

            deferred.resolve(success.data);

        }, function (error) {

            $log.error("error in memberService.getList:  " + error);

            deferred.reject("Error retrieving member list");
        });

        return deferred.promise;
    };

    svc.get = function (id) {

        var deferred = $q.defer();

        var uri = config.apiUrl + "/Members?id=" + id;

        $http.get(uri).then(function (success) {

            deferred.resolve(success.data);

        }, function (error) {

            $log.error("error in memberService.get:  " + error);

            deferred.reject("Error retrieving member id " + id);
        });

        return deferred.promise;
    };

    return svc;
}]);