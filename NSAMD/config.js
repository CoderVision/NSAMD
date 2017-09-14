
//https://www.jvandemo.com/how-to-configure-your-angularjs-application-using-environment-variables/
(function (window) {

    window.__config = window.__env || {};

    window.__config.apiUrl = 'http://localhost:62428';

    window.__config.baseUrl = '/';

    window.__config.enableDebug = true;

})(this);