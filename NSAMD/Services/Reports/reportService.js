


'use strict'

angular.module('app').factory('reportService', ['$http', '$log', '$q', 'config'
    , function ($http, $log, $q, config) {

        var svc = {};

        // load configuration info (enums, etc.)
        svc.getConfig = function (churchId) {

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
            var uri = config.apiUrl + "/reports/metadata/" + churchId;

            $http.get(uri).then(function (success) {

                //localStorageService.set("reportsConfig", { churchId: churchId, data: success.data });

                deferred.resolve(success.data);

            }, function (error) {

                $log.error("error in reportService.getConfig:  " + error.data);

                deferred.reject("Error retrieving config list");
            });

            return deferred.promise;
        };

        svc.getReport = function (reportId, queryOptions)
        {
            var deferred = $q.defer();

            //http://localhost:62428/reports/1
            var uri = config.apiUrl + "/reports/" + reportId + queryOptions;

            $http.get(uri).then(function (success) {

                deferred.resolve(success.data);

            }, function (error) {

                var msg = "error in reportService.getReport for reportId: " + reportId + " churchId: " + churchId + ":  " + error.data;
                $log.error(msg);

                deferred.reject(msg);
            });

            return deferred.promise;
        }

        //svc.getList = function (churchId) {

        //    var deferred = $q.defer();

        //    //http://localhost:62428/teams/metadata/3
        //    var uri = config.apiUrl + "/church/" + churchId + "/teams";

        //    $http.get(uri).then(function (success) {

        //        localStorageService.set("teamConfig", { churchId: churchId, data: success.data });

        //        deferred.resolve(success.data);

        //    }, function (error) {

        //        $log.error("error in teamService.getConfig:  " + error.data);

        //        deferred.reject("Error retrieving config list");
        //    });

        //    return deferred.promise;
        //}


        return svc;
    }]);