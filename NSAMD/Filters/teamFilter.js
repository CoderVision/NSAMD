

angular.module('app').filter('teamFilter', function () {
    return function (items, team) {
        var filtered = [];
        for (var i = 0; i < items.length; i++) {
            if (items[i].teamId == team.teamId) {
                filtered.push(items[i]);
            }
        }
        return filtered;
    };
});

