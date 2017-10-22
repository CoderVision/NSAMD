
'use strict'

angular.module('app').factory('memberService', ['$http', '$log', '$q', 'config', function ($http, $log, $q, config) {

    var svc = {};

    // statusIds is a csv list of statuses
    svc.getList = function (churchId,statusIds) {

        var deferred = $q.defer();

        // remove churchId hardcoded value of "3", Graham; and statusIds "49"
        //var uri = config.apiUrl + "/Members?churchId=3&statusIds=49";
        var uri = config.apiUrl + "/Members?churchId=" + churchId + "&statusIds=" + statusIds;

        $http.get(uri).then(function (success) {

            deferred.resolve(success.data);

        }, function (error) {

            $log.error("error in memberService.getList:  " + error);

            deferred.reject("Error retrieving member list");
        });

        return deferred.promise;
    };

    svc.get = function (id, churchId) {

        var deferred = $q.defer();

        var uri = config.apiUrl + "/Members?id=" + id + "&churchId=" + churchId;

        $http.get(uri).then(function (success) {

            deferred.resolve(success.data);

        }, function (error) {

            $log.error("error in memberService.get:  " + error);

            deferred.reject("Error retrieving member id " + id);
        });

        return deferred.promise;
    };

    svc.patch = function (memberId, churchId, fieldName, fieldValue) {

        var deferred = $q.defer();

        var uri = config.apiUrl + "/Members?id=" + memberId + "&churchId=" + churchId;
        var patchDocument = [{
            "op": "replace",
            "path": "/" + fieldName,
            "value": fieldValue
        }];

        $http.patch(uri, patchDocument).then(function (success) {

            deferred.resolve(success.data);

        }, function (error) {

            $log.error("error in memberService.get:  " + error);

            deferred.reject("Error retrieving member id " + id);
        });

        return deferred.promise;

    }


    return svc;
}]);