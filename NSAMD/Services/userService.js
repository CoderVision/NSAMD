


'use strict'

angular.module('app').factory('userService', ['$http', '$log', '$q', 'config'
    , function ($http, $log, $q, config) {

        var svc = {};

      
        svc.getList = function () {

            var deferred = $q.defer();

            var uri = config.apiUrl + "/account/GetUsers";

            $http.get(uri).then(function (success) {

                deferred.resolve(success.data);

            }, function (error) {

                var err = error | err.message;

                $log.error("error in memberService.getList:  " + err);

                deferred.reject("error in memberService.getList:  " + err);
            });

            return deferred.promise;
        };

        //svc.patch = function (memberId, churchId, fieldName, fieldValue) {

        //    var deferred = $q.defer();

        //    var uri = config.apiUrl + "/Members?id=" + memberId + "&churchId=" + churchId;
        //    var patchDocument = [{
        //        "op": "replace",
        //        "path": "/" + fieldName,
        //        "value": fieldValue
        //    }];

        //    $http.patch(uri, patchDocument).then(function (success) {

        //        deferred.resolve(success.data);

        //    }, function (error) {

        //        $log.error("error in memberService.get:  " + error | error.message);

        //        deferred.reject("Error retrieving member id " + memberId);
        //    });

        //    return deferred.promise;
        //}

        //svc.save = function (addy) {
        //    var deferred = $q.defer();

        //    var uri = config.apiUrl + "/Members/" + addy.identityId + "/" + addy.type;

        //    $http.post(uri, addy).then(function (success) {

        //        deferred.resolve(success.data);

        //    }, function (error) {

        //        $log.error("error in memberService.saveAddy:  " + error);

        //        deferred.reject("Error retrieving address id " + addy.id);
        //    });

        //    return deferred.promise;
        //}

        return svc;
    }]);