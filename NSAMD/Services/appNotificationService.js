
angular.module('app').factory('appNotificationService', ['$mdToast', '$mdDialog', function ($mdToast, $mdDialog) {

    var svc = {};

    svc.openToast = function (message) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(message)
                .position('bottom right')
                .hideDelay(30000)
        );
    }

    return svc;
}]);