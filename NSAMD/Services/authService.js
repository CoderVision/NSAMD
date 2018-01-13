﻿
'use strict'

angular.module('app').factory('authService', ['$q', 'config'
    , function ($q, config) {

        var svc = {};
        //svc.redirect_uri = "https://localhost:44363/#!/callback?",
        svc.redirect_uri = "https://localhost:44363/",

            svc.config = {
            client_id: "NtccStewardImplicit",
            //redirect_uri: window.location.protocol + "//" + window.location.host + "/callback",   // "https://localhost:44363/callback.html",
            redirect_uri: svc.redirect_uri,
            response_type: "id_token token",
            scope: "openid profile",
            authority: config.stsUrl + "identity"
            //filterProtocolClaims: true,
            //loadUserInfo: true
        };


        svc.OidcTokenManager = new OidcTokenManager(svc.config);

        // load configuration info (enums, etc.)
        svc.processTokenCallbackAsync = function () {

            var deferred = $q.defer();

            var config = {
                client_id: "NtccStewardImplicit",
                //redirectUri: window.location.protocol + "//" + window.location.host + "/callback",
                redirect_uri: svc.redirect_uri,
                authority: window.__config.stsUrl + "identity",
                load_user_profile: false
            };

            var mgr = new OidcTokenManager(config);

            mgr.processTokenCallbackAsync().then(function () {


                deferred.resolve();
            },
                function (error) {
                    deferred.reject("Problem Getting Token : " + (error.message || error));
                });

            return deferred.promise;
        };

        return svc;
    }]);
