


angular.module('app').filter('mapAddress', function () {
    return function (addy) {
        if (!addy) { return ''; }
 
        return addy.trim().replace(' ', '+');
    };
});