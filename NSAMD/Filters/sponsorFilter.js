
angular.module('app').filter('sponsorFilter', function () {
    return function (items, sponsor) {
        var filtered = [];
        for (var i = 0; i < items.length; i++) {
            if (items[i].sponsorId == sponsor.sponsorId) {
                filtered.push(items[i]);
            }
        }
        return filtered;
    };
});

