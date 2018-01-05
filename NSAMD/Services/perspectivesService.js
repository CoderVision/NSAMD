


'use strict'

angular.module('print').factory('perspectivesService', ['$http', '$log', '$q', 'config'
    , function ($http, $log, $q, config) {

        var svc = {};

        // load configuration info (enums, etc.)
        svc.getConfig = function (churchId) {

            var deferred = $q.defer();

            //var cfg;
            //if (localStorageService.isSupported) {
            //    cfg = localStorageService.get("perspectivesConfig");

            //    if (cfg && cfg.churchId == churchId)
            //    {
            //        deferred.resolve(cfg.data);
            //        return deferred.promise;
            //    }
            //}

            //http://localhost:62428/teams/metadata/3
            var uri = config.apiUrl + "/church/" + churchId + "/teams/metadata";

            $http.get(uri).then(function (success) {

                //localStorageService.set("teamConfig", { churchId: churchId, data: success.data });

                deferred.resolve(success.data);

            }, function (error) {

                $log.error("error in teamService.getConfig:  " + error.data);

                deferred.reject("Error retrieving config list");
            });

            return deferred.promise;
        };

        svc.getReport = function(reportId, churchId)
        {
            var deferred = $q.defer();

            //http://localhost:62428/reports/1/church/3
            var uri = config.apiUrl + "/reports/" + reportId + "/church/" + churchId;

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