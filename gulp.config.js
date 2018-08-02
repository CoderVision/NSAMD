
module.exports = function () {

    var isProductionPublish = false;

    var src = './NSAMD/'
    let config = {
        temp: './tmp/',
        isProductionPublish: isProductionPublish
        // temp: './dist/',
        alljs: [
            src + isProductionPublish ? 'config.publish.js' : 'config.js',
            src + 'app.js',
            src + 'Services/appService.js',
            src + 'Services/appNotificationService.js',
            src + 'Services/errorService.js',
            src + 'Services/configService.js',
            src + 'Services/churchService.js',
            src + 'Services/memberService.js',
            src + 'Services/teamService.js',
            src + 'Services/reportService.js',
            src + 'Services/authService.js',
            src + 'Services/userService.js',
            src + 'Services/messageService.js',
            src + 'Controllers/**/*.js',
            src + 'Filters/**/*.js'
        ],
        css: src + 'Content/app.css',
        sass: src + 'Content/appSass.scss',
        dist: './dist/',
        index: src + 'index.html',
        printIndex: src + 'print.html',
        src: src,

        printjs: [
            src + isProductionPublish ? 'config.publish.js' : 'config.js',
            src + 'print.js',
            src + 'Services/injectCSS.js',
            src + 'Services/Reports/reportService.js',
            src + 'Services/authService.js',
            src + 'Controllers/Reports/activeGuestListController.js',
            src + 'Filters/**/*.js'
        ]

        // replace bower with Yarn 
        //yarn: {
        //    json: require('./bower.json'),
        //    directory: './bower_components',
        //    ignorePath: '../..'
        //}
    };

    // replace these bower options with Yarn
    config.getWiredepOptions = function () {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };

    return config;
};
