


'use strict'

angular.module('app').factory('userService', ['$http', '$log', '$q', 'config'
    , function ($http, $log, $q, config) {

        var svc = {};

      
        svc.getList = function (active) {

            var deferred = $q.defer();

            var uri = config.apiUrl + "/account/GetUsers/" + active;

            $http.get(uri).then(function (success) {

                deferred.resolve(success.data);

            }, function (error) {

                var err = "error in userService.getList:  " + (error | error.message);

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

                var msg = "error in userService.processAcctRequest:  " + (error | error.message);

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

                var x = "error in userService.patch:  " + error | error.message;

                $log.error(x);

                deferred.reject(x);
            });

            return deferred.promise;
        }


        svc.save = function (user) {
            var deferred = $q.defer();

            var uri = config.apiUrl + "/account";

            $http.post(uri, user).then(function (success) {

                deferred.resolve(success.data);

            }, function (error) {

                var err = "error in userService.save:  " + (error | error.message);

                $log.error(err);

                deferred.reject(err);
            });

            return deferred.promise;
        }

        return svc;
    }]);