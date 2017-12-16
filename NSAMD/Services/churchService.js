

'use strict'

angular.module('app').factory('churchService', ['$http', '$log', '$q', 'config', 'localStorageService'
    , function ($http, $log, $q, config, localStorageService) {

        var svc = {};

        // load configuration info (enums, etc.)
        svc.getConfig = function (churchId) {

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

            var uri = config.apiUrl + "/Churches/" + churchId + "/metadata";

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
            var uri = config.apiUrl + "/Churches?showAll=" + showAll;

            $http.get(uri).then(function (success) {

                deferred.resolve(success.data);

            }, function (error) {

                $log.error("error in churchService.getList:  " + error);

                deferred.reject("Error retrieving church list");
            });

            return deferred.promise;
        };

        svc.get = function (id) {

            var deferred = $q.defer();

            var uri = config.apiUrl + "/Churches?id=" + id;

            $http.get(uri).then(function (success) {

                deferred.resolve(success.data);

            }, function (error) {

                $log.error("error in churchService.get:  " + error);

                deferred.reject("Error retrieving church id " + id);
            });

            return deferred.promise;
        };

        svc.patch = function (churchId, fieldName, fieldValue) {

            var patchDocument = [{
                "op": "replace",
                "path": "/" + fieldName,
                "value": fieldValue
            }];

            return svc.patchDoc(churchId, patchDocument);
        }


        svc.patchDoc = function (churchId, patchDocument) {

            var deferred = $q.defer();

            var uri = config.apiUrl + "/Churches?id=" + churchId;

            $http.patch(uri, patchDocument).then(function (success) {

                deferred.resolve(success.data);

            }, function (error) {

                $log.error("error in churchService.get:  " + error);

                deferred.reject("Error patching church id " + churchId);
            });

            return deferred.promise;

        }

        // setup address save in church controller or use it in the church controller, as it should work the same.
        svc.saveAddy = function (addy) {
            var deferred = $q.defer();

            var uri = config.apiUrl + "/Churches/" + addy.identityId + "/" + addy.type;

            $http.post(uri, addy).then(function (success) {

                deferred.resolve(success.data);

            }, function (error) {

                $log.error("error in churchService.saveAddy:  " + error);

                deferred.reject("Error saving address id " + addy.id);
            });

            return deferred.promise;
        }

        svc.removeAddy = function (addy) {
            var deferred = $q.defer();

            var uri = config.apiUrl + "/Churches/" + addy.identityId + "/" + addy.contactInfoId;

            $http.delete(uri).then(function (success) {

                deferred.resolve();

            }, function (error) {

                $log.error("error in churchService.saveAddy:  " + error);

                deferred.reject("Error remove address " + addy.id);
            });

            return deferred.promise;
        }

        svc.saveNew = function (church) {
            var deferred = $q.defer();

            var uri = config.apiUrl + "/Churches";

            $http.post(uri, church).then(function (success) {

                deferred.resolve(success.data);

            }, function (error) {

                $log.error("error in churchService.saveNew:  " + error);

                deferred.reject("Error saving church: " + church.name);
            });

            return deferred.promise;
        }

        return svc;
    }]);