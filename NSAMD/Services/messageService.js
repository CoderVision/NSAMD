

'use strict'

angular.module('app').factory('messageService', ['$http', '$log', '$q', 'config', 'errorService'
    , function ($http, $log, $q, config, errorService) {

        var svc = {};

        // load configuration info (enums, etc.)
        svc.getConfig = function () {

            var deferred = $q.defer();

            //var cfg;
            //if (localStorageService.isSupported) {
            //    cfg = localStorageService.get("reportsConfig");

            //    if (cfg && cfg.churchId == churchId)
            //    {
            //        deferred.resolve(cfg.data);
            //        return deferred.promise;
            //    }
            //}

            //http://localhost:62428/reports/metadata/0
            var uri = config.apiUrl + "/message/metadata";

            $http.get(uri).then(function (success) {

                //localStorageService.set("reportsConfig", { churchId: churchId, data: success.data });

                deferred.resolve(success.data);

            }, function (error) {

                var err = errorService.getErrorMessage(error);

                $log.error(err);

                deferred.reject(err);
            });

            return deferred.promise;
        };

        svc.getRecipientGroups = function (churchId, messageTypeEnumId) {
            var deferred = $q.defer();

            ////https://localhost:44352/message/recipientGroups?churchId=3&messageTypeEnumId=47
            var uri = config.apiUrl + "/message/recipientGroups?churchId=" + churchId + "&messageTypeEnumId=" + messageTypeEnumId;

            $http.get(uri).then(function (success) {

                deferred.resolve(success.data);

            }, function (error) {

                var err = errorService.getErrorMessage(error);

                $log.error(err);

                deferred.reject(err);
            });

            return deferred.promise;
        }

        svc.saveRecipientGroups = function (recipientGroup) {
            var deferred = $q.defer();

            ////https://localhost:44352/message/recipientGroups
            var uri = config.apiUrl + "/message/recipientGroups";

            $http.post(uri, recipientGroup).then(function (success) {

                deferred.resolve(success.data);

            }, function (error) {

                var err = errorService.getErrorMessage(error);

                $log.error(err);

                deferred.reject(err);
            });

            return deferred.promise;
        }


        return svc;
    }]);