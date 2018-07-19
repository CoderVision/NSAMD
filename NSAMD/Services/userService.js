


'use strict'

angular.module('app').factory('userService', ['$http', '$log', '$q', 'config', 'errorService', 'localStorageService'
    , function ($http, $log, $q, config, errorService, localStorageService) {

        var svc = {};

        svc.getList = function (active) {

            var deferred = $q.defer();

            var uri = config.apiUrl + "/account/GetUsers/" + active;

            $http.get(uri).then(function (success) {

                deferred.resolve(success.data);

            }, function (error) {

                var err = "Error getting list:  " + errorService.getErrorMessage(error);

                $log.error(err);

                deferred.reject(err);
            });

            return deferred.promise;
        };

        svc.get = function () {

            var deferred = $q.defer();

            // don't store this in local storage because permissions may change and this won't update them (e.g., someone may lose access)
            //if (localStorageService.isSupported) {

            //    var cfg = localStorageService.get("user");

            //    if (cfg)
            //    {
            //        deferred.resolve(cfg);
            //        return deferred.promise;
            //    }
            //}

            var uri = config.apiUrl + "/account";

            $http.get(uri).then(function (success) {

                localStorageService.set("user", success.data);

                deferred.resolve(success.data);

            }, function (error) {

                var err = "Error getting user:  " + errorService.getErrorMessage(error);

                $log.error(err);

                deferred.reject(err);
            });

            return deferred.promise;
        };

        svc.processAcctRequest = function (acctReq) {
            var deferred = $q.defer();

            var uri = config.apiUrl + "/account/processAccountRequest";

            $http.post(uri, acctReq).then(function (success) {

                deferred.resolve(success.data);

            }, function (error) {

                var err = "Error processing account request:  " + errorService.getErrorMessage(error);

                $log.error(msg);

                deferred.reject(msg);
            });

            return deferred.promise;
        }

        svc.patch = function (userId, patchDocument) {

            var deferred = $q.defer();

            var uri = config.apiUrl + "/account/" + userId;

            $http.patch(uri, patchDocument).then(function (success) {

                deferred.resolve(success.data);

            }, function (error) {

                var err = "Error saving user:  " + errorService.getErrorMessage(error);

                $log.error(err);

                deferred.reject(err);
            });

            return deferred.promise;
        }


        svc.save = function (user) {
            var deferred = $q.defer();

            var uri = config.apiUrl + "/account";

            $http.post(uri, user).then(function (success) {

                deferred.resolve(success.data);

            }, function (error) {

                var err = "Error saving user:  " + errorService.getErrorMessage(error);

                $log.error(err);

                deferred.reject(err);
            });

            return deferred.promise;
        }

        return svc;
    }]);