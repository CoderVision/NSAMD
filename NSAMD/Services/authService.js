
'use strict'

    function AuthService($q, pConfig) {

        var svc = {};
        //svc.redirect_uri = "https://localhost:44363/#!/callback?",
        svc.redirect_uri = window.location.protocol + "//" + window.location.host + "/"; // "https://localhost:44363/",
        svc.silentredirect_uri = window.location.protocol + "//" + window.location.host + "/silentRefresh.html"; // "https://localhost:44363/",
        svc.config = pConfig;

        svc.createManager = function () {

            var config = {
                client_id: "NtccStewardImplicit",
                //redirect_uri: window.location.protocol + "//" + window.location.host + "/callback",   // "https://localhost:44363/callback.html",
                redirect_uri: svc.redirect_uri,
                response_type: "id_token token",
                scope: "openid profile ApplicationAccess roles",
                authority: svc.config.stsUrl + "identity",
                post_logout_redirect_uri: svc.redirect_uri,
                silent_redirect_uri: svc.silentredirect_uri,
                silent_renew: true
            };

            return new OidcTokenManager(config);
        }

        svc.oidcManager = svc.createManager();


        svc.createCallBackManager = function () {

            var callbackconfig = {
                client_id: "NtccStewardImplicit",
                redirect_uri: svc.redirect_uri,
                authority: svc.stsUrl + "identity",
                load_user_profile: false
            };

            return new OidcTokenManager(callbackconfig);
        }
 

        return svc;
    };

angular.module('app').factory('authService', AuthService);
AuthService.$inject = ['$q', 'config'];