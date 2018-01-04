
angular.module('print').factory("injectCSS", ['$q', function ($q) {
    var injectCSS = {};

    var createLink = function(id, url) {
        var link = document.createElement('link');
        link.id = id;
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = url;
        return link;
    }

    var checkLoaded = function (url, deferred, tries) {
        for (var i in document.styleSheets) {
            var href = document.styleSheets[i].href || "";
            if (href.split("/").slice(-1).join() === url) {
                deferred.resolve();
                return;
            }
        }
        tries++;
        setTimeout(function(){checkLoaded(url, deferred, tries);}, 50); 
    };

    injectCSS.set = function(id, url){
        var tries = 0,
          deferred = $q.defer(),
          link;

            link = createLink(id, url);
            link.onload = deferred.resolve;
            var head = document.getElementsByTagName("head");
            if (head != undefined)
                head[0].appendChild(link);

        checkLoaded(url, deferred, tries);

        return deferred.promise;
    };

    return injectCSS;
}])