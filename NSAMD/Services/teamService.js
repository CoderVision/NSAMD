 
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

        // remove churchId hardcoded value of "3", Graham; and statusIds "49"
        //var uri = config.apiUrl + "/Members?churchId=3&statusIds=49";
        //http://localhost:62428/members/metadata?churchId=3
        var uri = config.apiUrl + "/teams/metadata/" + churchId;

        $http.get(uri).then(function (success) {

            localStorageService.set("memberConfig", { churchId: churchId, data: success.data });

            deferred.resolve(success.data);

        }, function (error) {

            $log.error("error in memberService.getConfig:  " + error);

            deferred.reject("Error retrieving config list");
        });

        return deferred.promise;
    };

    svc.saveTeam = function (team) {

        var deferred = $q.defer();

        var uri = config.apiUrl + "/teams";

        $http.post(uri, team).then(function (success) {

            deferred.resolve(success.data);

        }, function (error) {

            $log.error("error in teamService.saveTeam:  " + error.message);

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

            var msg = "Error removing teammate: /teams/" + teammate.teamId + "/" + teammate.memberId;

            $log.error(msg);

            deferred.reject(msg);
        });

        return deferred.promise;
    }

    return svc;
}]);