 
'use strict'

angular.module('app').factory('teamService', ['$http', '$log', '$q', 'config', 'localStorageService'
    , function ($http, $log, $q, config, localStorageService) {

    var svc = {};

        // load configuration info (enums, etc.)
    svc.getConfig = function (churchId) {

        var deferred = $q.defer();

        //var cfg;
        //if (localStorageService.isSupported) {
        //    cfg = localStorageService.get("teamConfig");

        //    if (cfg && cfg.churchId == churchId)
        //    {
        //        deferred.resolve(cfg.data);
        //        return deferred.promise;
        //    }
        //}

        //http://localhost:62428/teams/metadata/3
        var uri = config.apiUrl + "/church/" + churchId + "/teams/metadata";

        $http.get(uri).then(function (success) {

            localStorageService.set("teamConfig", { churchId: churchId, data: success.data });

            deferred.resolve(success.data);

        }, function (error) {

            $log.error("error in teamService.getConfig:  " + error.data);

            deferred.reject("Error retrieving config list");
        });

        return deferred.promise;
    };

    svc.getList = function(churchId){

        var deferred = $q.defer();

        //http://localhost:62428/teams/metadata/3
        var uri = config.apiUrl + "/church/" + churchId + "/teams";

        $http.get(uri).then(function (success) {

            localStorageService.set("teamConfig", { churchId: churchId, data: success.data });

            deferred.resolve(success.data);

        }, function (error) {

            $log.error("error in teamService.getConfig:  " + error.data);

            deferred.reject("Error retrieving config list");
        });

        return deferred.promise;
    }

    svc.getTeam = function (teamId) {

        var deferred = $q.defer();

        //http://localhost:62428/teams/3/profile
        var uri = config.apiUrl + "/teams/" + teamId + "/profile";

        $http.get(uri).then(function (success) {

            deferred.resolve(success.data);

        }, function (error) {

            $log.error("error in teamService.getTeam:  " + error.data);

            deferred.reject("Error retrieving config list");
        });

        return deferred.promise;
    }

    svc.saveTeam = function (team) {

        var deferred = $q.defer();

        var uri = config.apiUrl + "/teams";

        $http.post(uri, team).then(function (success) {

            deferred.resolve(success.data);

        }, function (error) {

            $log.error("error in teamService.saveTeam:  " + error.data);

            deferred.reject("Error saving team id " + team.id);
        });

        return deferred.promise;
    }

    svc.saveTeammate = function (teammmate) {

        var deferred = $q.defer();

        var uri = config.apiUrl + "/teams/" + teammmate.teamId + "/teammates";

        $http.post(uri, teammmate).then(function (success) {

            deferred.resolve(success.data);

        }, function (error) {

            $log.error("error in teamService.saveTeammate:  " + error.data);

            deferred.reject("Error saving team id " + teammmate.id);
        });

        return deferred.promise;
    }

    svc.removeTeammate = function (teammate) {

        var deferred = $q.defer();

        var uri = config.apiUrl + "/teams/" + teammate.teamId + "/teammates/" + teammate.memberId;

        $http.delete(uri).then(function (success) {

            deferred.resolve();

        }, function (error) {

            var msg = "Error removing teammate: /teams/" + teammate.teamId + "/" + teammate.memberId + ":  " + error.data;

            $log.error(msg);

            deferred.reject(msg);
        });

        return deferred.promise;
    }

    svc.patch = function (teamId, fieldName, fieldValue) {

        var deferred = $q.defer();

        var uri = config.apiUrl + "/teams/" + teamId;
        var patchDocument = [{
            "op": "replace",
            "path": "/" + fieldName,
            "value": fieldValue
        }];

        $http.patch(uri, patchDocument).then(function (success) {

            deferred.resolve(success.data);

        }, function (error) {

            $log.error("error in teamService.patch:  " + error.data);

            deferred.reject("Error patching team id " + teamId);
        });

        return deferred.promise;
    }

    return svc;
}]);