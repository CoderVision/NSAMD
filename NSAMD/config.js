
//https://www.jvandemo.com/how-to-configure-your-angularjs-application-using-environment-variables/
(function (window) {

    window.__config = window.__env || {};

    window.__config.apiUrl = 'https://localhost:44352';
    //window.__config.apiUrl = 'https://www.hissteward.com/api';

    window.__config.stsUrl = 'https://localhost:44316/';
    //window.__config.stsUrl = 'https://www.hissteward.com/sts/';

    window.__config.baseUrl = '/';

    window.__config.enableDebug = true;

})(this);