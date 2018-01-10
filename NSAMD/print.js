


'use strict';

var config = {};

if (window) {
    Object.assign(config, window.__config);
}

var app = angular.module('print', ['ngRoute']);  // , 'md-date-picker' - not using

app.constant('config', config);

app.config(function ($routeProvider) {

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


