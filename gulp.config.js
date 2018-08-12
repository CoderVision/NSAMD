
module.exports = function () {

    let config = {
        isProductionPublish: false,

        getConfig: () => {
    
            let src = './NSAMD/';
            let server = './server/';    // he did ./src/server/

            let configFile = this.isProductionPublish ? 'config.publish.js' : 'config.js';

            let cfg = {
                temp: './tmp/',
                isProductionPublish: this.isProductionPublish,
                // temp: './dist/',
                alljs: [
                 //   src + configFile,
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
                silentRefresh: src + 'silentRefresh.html',
                src: src,

                printjs: [
                    src + this.isProductionPublish ? 'config.publish.js' : 'config.js',
                    src + 'print.js',
                    src + 'Services/injectCSS.js',
                    src + 'Services/Reports/reportService.js',
                    src + 'Services/authService.js',
                    src + 'Controllers/Reports/activeGuestListController.js',
                    src + 'Filters/**/*.js'
                ],

                // node settings
                defaultPort: 44363,
                nodeServer: './server/app.js',
                server: server,
                

                // replace bower with Yarn 
                //yarn: {
                //    json: require('./bower.json'),
                //    directory: './bower_components',
                //    ignorePath: '../..'
                //}
            }

            return cfg;
        }
    };

    // replace these bower options with Yarn
    //config.getWiredepOptions = function () {
    //    var options = {
    //        bowerJson: config.bower.json,
    //        directory: config.bower.directory,
    //        ignorePath: config.bower.ignorePath
    //    };
    //    return options;
    //};

    return config;
};


/*
   // gulp.publish.config.js contents 
   module.exports = function () {
        return {
            username: ''
            password:  ''
        };
    };
 */