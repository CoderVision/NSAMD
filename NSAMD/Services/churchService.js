

'use strict'

angular.module('app').factory('churchService', ['$http', '$log', '$q', 'config', 'localStorageService'
    , function ($http, $log, $q, config, localStorageService) {

        var svc = {};

        // load configuration info (enums, etc.)
        svc.getConfig = function () {

            var deferred = $q.defer();

            var cfg;
            //if (localStorageService.isSupported) {
            //    cfg = localStorageService.get("churchConfig");

            //    if (cfg)
            //    {
            //        deferred.resolve(cfg.data);
            //        return deferred.promise;
            //    }
            //}

            var uri = config.apiUrl + "/churches/metadata";

            $http.get(uri).then(function (success) {

                localStorageService.set("churchConfig", { data: success.data });

                deferred.resolve(success.data);

            }, function (error) {

                $log.error("error in churchService.getConfig:  " + error);

                deferred.reject("Error retrieving config list");
            });

            return deferred.promise;
        };

        // statusIds is a csv list of statuses
        svc.getList = function (showAll) {

            var deferred = $q.defer();

            // remove churchId hardcoded value of "3", Graham; and statusIds "49"
            var uri = config.apiUrl + "/churches?showAll=" + showAll;

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

            var uri = config.apiUrl + "/churches?id=" + id;

            $http.get(uri).then(function (success) {

                deferred.resolve(success.data);

            }, function (error) {

                $log.error("error in churchService.get:  " + error);

                deferred.reject("Error retrieving church id " + id);
            });

            return deferred.promise;
        };

        svc.patch = function (churchId, fieldName, fieldValue) {

            var deferred = $q.defer();

            var uri = config.apiUrl + "/churches?id=" + churchId;
            var patchDocument = [{
                "op": "replace",
                "path": "/" + fieldName,
                "value": fieldValue
            }];

            $http.patch(uri, patchDocument).then(function (success) {

                deferred.resolve(success.data);

            }, function (error) {

                $log.error("error in churchService.get:  " + error);

                deferred.reject("Error patching church id " + memberId);
            });

            return deferred.promise;

        }

        // setup address save in church controller or use it in the member controller, as it should work the same.
        svc.saveAddy = function (addy) {
            var deferred = $q.defer();

            var uri = config.apiUrl + "/Members/" + addy.identityId + "/" + addy.type;

            $http.post(uri, addy).then(function (success) {

                deferred.resolve(success.data);

            }, function (error) {

                $log.error("error in memberService.saveAddy:  " + error);

                deferred.reject("Error saving address id " + addy.id);
            });

            return deferred.promise;
        }

        svc.removeAddy = function (addy) {
            var deferred = $q.defer();

            var uri = config.apiUrl + "/Members/" + addy.identityId + "/" + addy.contactInfoId;

            $http.delete(uri).then(function (success) {

                deferred.resolve();

            }, function (error) {

                $log.error("error in memberService.saveAddy:  " + error);

                deferred.reject("Error remove address " + addy.id);
            });

            return deferred.promise;
        }

        svc.saveNewMember = function (member) {
            var deferred = $q.defer();

            var uri = config.apiUrl + "/Members";

            $http.post(uri, member).then(function (success) {

                deferred.resolve(success.data);

            }, function (error) {

                $log.error("error in memberService.saveNewMember:  " + error);

                deferred.reject("Error saving member id " + member.id);
            });

            return deferred.promise;
        }

        return svc;
    }]);