
angular.module('app').factory('configService', function () {

    var svc = {};

    svc.getTimeZones = function()
    {
        return [
                  { name: "Samoa", offset: "-11" } // remove ending ":00" or Angular will throw errors.  We can add it below when we save.
                , { name: "Hawaii", offset: "-10" }
                , { name: "Alaska", offset: "-09" }
                , { name: "Pacific", offset: "-08" }
                , { name: "Mountain", offset: "-07" }
                , { name: "Central", offset: "-06" }
                , { name: "Eastern", offset: "-05" }
                , { name: "Atlantic", offset: "-04" }
                , { name: "Chamorro", offset: "+10" }
        ];
    }
    return svc;
});