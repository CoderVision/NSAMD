
'use strict';

var config = {};

if (window) {
    Object.assign(config, window.__config);
}

var app = angular.module('app', ['ngMaterial', 'ngMdIcons', 'ngMessages', 'ngRoute', 'dataGrid', 'pagination', 'ngMask', 'LocalStorageModule', 'ui.router']);  // , 'md-date-picker' - not using

app.constant('config', config);

app.config(function ($routeProvider, $mdThemingProvider, $mdIconProvider, $compileProvider, $httpProvider, localStorageServiceProvider, $stateProvider, $urlRouterProvider) {

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|callto|file|tel):/);

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

    // configuration options: https://www.npmjs.com/package/angular-local-storage
    localStorageServiceProvider.setPrefix('nsamd');
    localStorageServiceProvider.setStorageType('localStorage');
    localStorageServiceProvider.setDefaultToCookie(true);


    // new angular-ur-route is more flexible and supports nested routing
    $urlRouterProvider.otherwise("/Members");

    //https://ui-router.github.io/ng1/
    //https://stackoverflow.com/questions/26138140/angularjs-ui-router-location-or-state
    $stateProvider.state('churches', {
        url: '/churches',
        templateUrl: './Views/Churches/churchesIndex.html',
        controller: 'churchListController',
        controllerAs: 'clc'
    }).state('church', {
        url: '/church/:churchId',
        templateUrl: './Views/Churches/churchProfile.html',
        controller: 'churchController',
        controllerAs: 'cc'
    }).state('messages', {
        url: '/messages',
        templateUrl: './Views/Messages/messagesIndex.html',
        controller: 'messagesController',
        controllerAs: 'mc'
    }).state('teams', {
        url: '/teams',
        templateUrl: './Views/Teams/teamsIndex.html',
        controller: 'teamListController',
        controllerAs: 'tlc'
    }).state('team', {
        url: '/team/:teamId/:churchId',
        templateUrl: './Views/Teams/teamProfile.html',
        controller: 'teamController',
        controllerAs: 'tc'
    }).state('admin', {
        url: '/admin',
        templateUrl: './Views/Admin/adminIndex.html',
        controller: 'adminController',
        controllerAs: 'ac'
    }).state('admin.users', {
        url: '/users',
        templateUrl: './Views/Admin/users.html',
        controller: 'adminUsersController',
        controllerAs: 'uc'
    }).state('admin.settings', {
            url: '/settings',
            templateUrl: './Views/Admin/settings.html'
            //controller: 'adminUsersController',
            //controllerAs: 'uc'
    })
    .state('perspectives', {
        url: '/perspectives',
        templateUrl: './Views/Reports/perspectivesIndex.html',
        controller: 'reportsController',
        controllerAs: 'rc'
    })
    .state('member', {
        url: '/member/:memberId',
        templateUrl: './Views/Members/memberProfile.html',
        controller: 'memberController',
        controllerAs: 'mc'
    }).state('activity', {
        url: '/activity/:churchId',
        templateUrl: './Views/Members/memberActivity.html',
        controller: 'memberActivityController',
        controllerAs: 'mac'
    }).state("Members", {
        url: '/Members',
        templateUrl: './Views/Members/membersIndex.html',
        controller: 'memberListController',
        controllerAs: 'mlc'
    });


    $mdThemingProvider.definePalette('green', {
        '50': 'eaf0ec',
        '100': 'cbdad0',
        '200': 'a8c1b1',
        '300': '85a891',
        '400': '6b957a',
        '500': '518262',
        '600': '4a7a5a',
        '700': '406f50',
        '800': '376546',
        '900': '275234',
        'A100': '9affb7',
        'A200': '67ff93',
        'A400': '34ff6f',
        'A700': '1aff5d',
        'contrastDefaultColor': 'light',
        'contrastDarkColors': [
            '50',
            '100',
            '200',
            '300',
            '400',
            'A100',
            'A200',
            'A400',
            'A700'
        ],
        'contrastLightColors': [
            '500',
            '600',
            '700',
            '800',
            '900'
        ]
    });
    $mdThemingProvider.definePalette('gray', {
        '50': 'fefefe',
        '100': 'fcfcfc',
        '200': 'fafafa',
        '300': 'f8f8f8',
        '400': 'f7f7f7',
        '500': 'f5f5f5',
        '600': 'f4f4f4',
        '700': 'f2f2f2',
        '800': 'f0f0f0',
        '900': 'eeeeee',
        'A100': 'ffffff',
        'A200': 'ffffff',
        'A400': 'ffffff',
        'A700': 'ffffff',
        'contrastDefaultColor': 'light',
        'contrastDarkColors': [
            '50',
            '100',
            '200',
            '300',
            '400',
            '500',
            '600',
            '700',
            '800',
            '900',
            'A100',
            'A200',
            'A400',
            'A700'
        ],
        'contrastLightColors': []
    });
    $mdThemingProvider.definePalette('red', {
        '50': 'ffe0e0',
        '100': 'ffb3b3',
        '200': 'ff8080',
        '300': 'ff4d4d',
        '400': 'ff2626',
        '500': 'ff0000',
        '600': 'ff0000',
        '700': 'ff0000',
        '800': 'ff0000',
        '900': 'ff0000',
        'A100': 'ffffff',
        'A200': 'fff2f2',
        'A400': 'ffbfbf',
        'A700': 'ffa6a6',
        'contrastDefaultColor': 'light',
        'contrastDarkColors': [
            '50',
            '100',
            '200',
            '300',
            'A100',
            'A200',
            'A400',
            'A700'
        ],
        'contrastLightColors': [
            '400',
            '500',
            '600',
            '700',
            '800',
            '900'
        ]
    });

    $mdThemingProvider.theme('default')
        //.backgroundPalette('gray')
        .primaryPalette('green')
        .accentPalette('gray')
        .warnPalette('red');
    //.primaryPalette('grayprimary')
    //.accentPalette('greenaccent')
    //.warnPalette('redwarn');

    $mdIconProvider
        .iconSet("action", "/Content/angular-material-icons/action.svg")
        .iconSet("alert", "/Content/angular-material-icons/alert.svg")
        .iconSet("av", "/Content/angular-material-icons/av.svg")
        .iconSet("communication", "/Content/angular-material-icons/communication.svg")
        .iconSet("content", "/Content/angular-material-icons/content.svg")
        .iconSet("device", "/Content/angular-material-icons/device.svg")
        .iconSet("editor", "/Content/angular-material-icons/editor.svg")
        .iconSet("file", "/Content/angular-material-icons/file.svg")
        .iconSet("hardware", "/Content/angular-material-icons/hardware.svg")
        .iconSet("image", "/Content/angular-material-icons/image.svg")
        .iconSet("maps", "/Content/angular-material-icons/maps.svg")
        .iconSet("navigation", "/Content/angular-material-icons/navigation.svg")
        .iconSet("notification", "/Content/angular-material-icons/notification.svg")
        .iconSet("soclal", "/Content/angular-material-icons/soclal.svg")
        .iconSet("toggle", "/Content/angular-material-icons/toggle.svg");
});


