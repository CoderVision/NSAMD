
module.exports = function () {
    var src = './NSAMD'
    let config = {
        temp: './tmp/',
        alljs: [
            src + '/**/*.js', // was src
            './*.js'
        ],
        css: src + '/Content/app.css',
        sass: src + '/Content/appSass.scss'

    };
    return config;
};