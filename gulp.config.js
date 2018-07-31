
module.exports = function () {
    var src = './NSAMD'
    let config = {
        temp: './tmp/',
        alljs: [
            src + '/config.js', 
            src + '/app.js', 
            src + '/Services/appService.js',
            src + '/Services/appNotificationService.js',
            src + '/Services/errorService.js',
            src + '/Services/configService.js',
            src + '/Services/churchService.js',
            src + '/Services/memberService.js',
            src + '/Services/teamService.js',
            src + '/Services/reportService.js',
            src + '/Services/authService.js',
            src + '/Services/userService.js',
            src + '/Services/messageService.js',
            src + '/Controllers/**/*.js',
            src + '/Filters/**/*.js'
        ],
        css: src + '/Content/app.css',
        sass: src + '/Content/appSass.scss',
        dist: './dist/'
    };
    return config;
};
