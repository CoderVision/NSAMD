


'use strict';

var config = {};

if (window) {
    Object.assign(config, window.__config);
}

var app = angular.module('app', ['ngRoute']);  // , 'md-date-picker' - not using

app.constant('config', config);

app.config(function ($routeProvider, $httpProvider) {

    $httpProvider.interceptors.push(function (config, authService) {
        return {
            'request': function (requestConfig) {

                var mgr = authService.oidcManager;

                // if access token is expired, redirect to login page
                //if (mgr.expired) {
                //    mgr.redirectForToken();
                //}

                // if it's a request to the api, we need to provide the access token as bearer token
                if (requestConfig.url.indexOf(config.apiUrl) === 0) {
                    requestConfig.headers.Authorization = "Bearer " + mgr.access_token;
                }
                return requestConfig;
            }
        };
    });

    $routeProvider.when('/activeGuestList/churchId/:churchId/period/:period/date/:date/statusIds/:statusIds/teamId/:teamId/sponsorId/:sponsorId', {
        templateUrl: './Views/Reports/activeGuestList.html',
        controller: 'activeGuestListController',
        controllerAs: 'c', // controller,
        resolve: {
            load: ['injectCSS', function (injectCSS) {
                return injectCSS.set("appReportActiveGuestList", "Content/appReportActiveGuestList.css");
            }]
        }
    });
});


