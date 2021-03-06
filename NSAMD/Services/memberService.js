﻿
'use strict'

    function MemberService($http, $log, $q, config, localStorageService) {

    var svc = {};

    // load configuration info (enums, etc.)
    svc.getConfig = function (churchId) {

        var deferred = $q.defer();

        //var cfg;
        //if (localStorageService.isSupported) {
        //    cfg = localStorageService.get("memberConfig");

        //    if (cfg && cfg.churchId == churchId)
        //    {
        //        deferred.resolve(cfg.data);
        //        return deferred.promise;
        //    }
        //}

        // remove churchId hardcoded value of "3", Graham; and statusIds "49"
        //var uri = config.apiUrl + "/Members?churchId=3&statusIds=49";
        //http://localhost:62428/members/metadata?churchId=3
        var uri = config.apiUrl + "/members/metadata/" + churchId;
        
        $http.get(uri).then(function (success) {

            localStorageService.set("memberConfig", { churchId: churchId, data: success.data});

            deferred.resolve(success.data);

        }, function (error) {

            var err = error | error.message;

            $log.error("error in memberService.getConfig:  " + err);

            deferred.reject("Error retrieving config list" + err);
        });

        return deferred.promise;
    };

    // statusIds is a csv list of statuses
    svc.getList = function (churchId,statusIds) {

        var deferred = $q.defer();

        // remove churchId hardcoded value of "3", Graham; and statusIds "49"
        //var uri = config.apiUrl + "/Members?churchId=3&statusIds=49";
        var uri = config.apiUrl + "/Members?churchId=" + churchId + "&statusIds=" + statusIds;

        $http.get(uri).then(function (success) {

            deferred.resolve(success.data);

        }, function (error) {

            $log.error("error in memberService.getList:  " + error | error.message);

            deferred.reject("Error retrieving member list for church " + churchId);
        });

        return deferred.promise;
    };

    svc.getMembers = function (searchText) {

        var deferred = $q.defer();

        var uri = config.apiUrl + "/members/criteria/" + searchText;

        $http.get(uri).then(function (success) {

            deferred.resolve(success.data);

        }, function (error) {

            var ex = "error in userService.getMembers:  " + (error | error.message);

            $log.error(ex);

            deferred.reject(ex);
        });

        return deferred.promise;
    };

    svc.get = function (id, churchId) {

        var deferred = $q.defer();

        var uri = config.apiUrl + "/Members?id=" + id + "&churchId=" + churchId;

        $http.get(uri).then(function (success) {

            deferred.resolve(success.data);

        }, function (error) {

            $log.error("error in memberService.get:  " + error | error.message);

            deferred.reject("Error retrieving member id " + id);
        });

        return deferred.promise;
    };

    svc.patch = function (memberId, churchId, fieldName, fieldValue) {

        var deferred = $q.defer();

        var uri = config.apiUrl + "/Members?id=" + memberId + "&churchId=" + churchId;
        var patchDocument = [{
            "op": "replace",
            "path": "/" + fieldName,
            "value": fieldValue
        }];

        $http.patch(uri, patchDocument).then(function (success) {

            deferred.resolve(success.data);

        }, function (error) {

            $log.error("error in memberService.get:  " + error | error.message);

            deferred.reject("Error retrieving member id " + memberId);
        });

        return deferred.promise;
    }

    svc.mergeMember = function (sourceMemberId, targetMemberId) {

        var deferred = $q.defer();

        var uri = config.apiUrl + "/members/merge";

        var item = 
        {
            "SourceMemberId": sourceMemberId,
            "TargetMemberId": targetMemberId
        }

        $http.post(uri, item).then(function (success) {

            deferred.resolve(success.data);

        }, function (error) {

            $log.error("error in memberService.mergeMember:  " + error | error.message);

            deferred.reject("Error merging members. Target: " + targetMemberId, ", Source:" + sourceMemberId);
        });

        return deferred.promise;
    }

    svc.saveAddy = function(addy)
    {
        var deferred = $q.defer();

        var uri = config.apiUrl + "/Members/" + addy.identityId + "/" + addy.type;

        $http.post(uri, addy).then(function (success) {

            deferred.resolve(success.data);

        }, function (error) {

            $log.error("error in memberService.saveAddy:  " + error);

            deferred.reject("Error retrieving address id " + addy.id);
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

            deferred.reject("Error retrieving member id " + addy.id);
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

            deferred.reject("Error saving member:  " + member.firstName);
        });

        return deferred.promise;
    }


    svc.saveMemberActivity = function (activity) {
        var deferred = $q.defer();

        var uri = config.apiUrl + "/members/activity";

        $http.post(uri, activity).then(function (success) {

            deferred.resolve(success.data);

        }, function (error) {

            $log.error("error in memberService.saveMemberActivity:  " + error);

            deferred.reject("Error saving member activity:  " + activity.targetId);
        });

        return deferred.promise;
    }

    return svc;
};

angular.module('app').factory('memberService', MemberService);

MemberService.$inject = ['$http', '$log', '$q', 'config', 'localStorageService'];