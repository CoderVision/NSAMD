
'use strict'

angular.module('app').factory('authService', ['$q', 'config'
    , function ($q, config) {

        var svc = {};
        //svc.redirect_uri = "https://localhost:44363/#!/callback?",
        svc.redirect_uri = window.location.protocol + "//" + window.location.host + "/"; // "https://localhost:44363/",
        svc.silentredirect_uri = window.location.protocol + "//" + window.location.host + "/silentRefresh.html"; // "https://localhost:44363/",

        svc.config = {
                client_id: "NtccStewardImplicit",
                //redirect_uri: window.location.protocol + "//" + window.location.host + "/callback",   // "https://localhost:44363/callback.html",
                redirect_uri: svc.redirect_uri, 
                response_type: "id_token token",
                scope: "openid profile ApplicationAccess roles",
                authority: config.stsUrl + "identity",
                post_logout_redirect_uri: svc.redirect_uri, 
                silent_redirect_uri: svc.silentredirect_uri,
                silent_renew: true
         };


        svc.OidcTokenManager = new OidcTokenManager(svc.config);

        svc.callbackconfig = {
            client_id: "NtccStewardImplicit",
            redirect_uri: svc.redirect_uri,
            authority: window.__config.stsUrl + "identity",
            load_user_profile: false
        };

        //  NOTE:  The problem seems to be that there are 2 different token managers, and they do not share the local storage.
        svc.callbackOidcTokenMmanager = new OidcTokenManager(svc.callbackconfig);


        return svc;
    }]);
