


    function AppNotificationService($mdToast, $mdDialog, appService) {

    var svc = {};
    svc.appService = appService;

    svc.openToast = function (message) {

        if (svc.appService.isLoggedIn === false)
            return;

        $mdToast.show(
            $mdToast.simple()
                .textContent(message)
                .position('bottom right')
                .hideDelay(5000)
        );
    }

    return svc;
};

angular.module('app').factory('appNotificationService', AppNotificationService);

AppNotificationService.$inject = ['$mdToast', '$mdDialog', 'appService'];