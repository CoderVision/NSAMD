
var gulp = require('gulp');
var args = require('yargs').argv;
var merge = require('merge-stream');
var ftp = require('vinyl-ftp');
var print = require('gulp-print').default;
var config = require('./gulp.config')();
var configPublish = require('./gulp.publish.config')();
var log = require('fancy-log');
var colors = require('ansi-colors');
var del = require('del');
var uuid = require('uuid/v4');
var ngAnnotate = require('gulp-ng-annotate')
var fs = require('fs');

var appJsFileName = "";
var printJsFileName = "";
var configFileName = "";

// use $. with the name of the plugin without gulp- in front of it, e.g.:  $.print instead of gulp-print
var $ = require('gulp-load-plugins')({ lazy: true });


//// Instructions:
///     Set "config.isProductionPublish = false;" to the correct state
///     To Use:`Open command window, cd to C:\Source\Repos\NSAMD
///     To Build:  type "gulp build"  (outputs to dist folder)
///     To Serve the website:  type "gulp connect", then open https://localhost:44363 in Chrome, etc.
///     To Publish:  type "gulp publish"  (ftp's dist folder contents to website)

config.isProductionPublish = true;

// 
gulp.task('publish', ['build'], function () {

    log('Running publish...');

    var conn = ftp.create({
        host: 'ftp.smarterasp.net',
        user: configPublish.username,
        password: configPublish.password,
        parallel: 10,
        port: 21,
        log: log
      //  debug: log
    });


    var path = '/Site';  // <-- this worked!  It's case sensitive
   // var path = '/site/UploadTest';  // <- this one worked
    //var path = 'hissteward.com/site/UploadTest';

    return gulp.src('dist/**', { base: './dist/', buffer: false })
        .pipe($.if(config.isProductionPublish === false, $.exit()))
        .pipe($.plumber())  // gracefully handles errors
        .pipe(print())
        .pipe(conn.newer(path)) // only upload newer files
        .pipe(conn.dest(path));

    // this was his path:
    // theartboy.com/stuff/tests/webProject
});

gulp.task('connect', ['build'], function () {

    //var cert = {
    //    pfx: fs.readFileSync('localhost.pfx')
    //   // passphrase: 'sample'
    //};

    var options = {
        https: true,
       // https: cert,
        port: 44363,
        root: 'dist',
        //   livereload: true
    };

    $.connect.server(options);
});

gulp.task('build', ['clean-build', 'inject', 'libs'], function () {

    log('Running build.  Need to inject js into print.html');

    var cfg = config.getConfig();

    var temp = gulp.src(['tmp/**/*.*'])
        .pipe(gulp.dest(cfg.dist));

    // removed 'NSAMD/**/*.html', 'NSAMD/**/*.css', 
    var app = gulp
        .src([
            'NSAMD/**/*.html',
            'NSAMD/**/*.svg',
            'NSAMD/**/*.png',
            'NSAMD/Scripts/**/*.*',
            'tmp/**/*.*',
            '!NSAMD/index.html',
            '!NSAMD/print.html',
            '!NSAMD/silentRefresh.html',
            ], { base: 'NSAMD' })
        .pipe($.if(config.isProductionPublish === false, print()))
        .pipe(gulp.dest(cfg.dist));

    return merge(temp, app);
})

// test that injects JavaScript and css
gulp.task('inject', ['clean-html', 'scripts', 'styles'], function () {
    log("Wireup our custom css in the html and call wiredep")

    var mergedStream = merge();

    var cfg = config.getConfig();

    // addPrefix: '.'
    var injectOptions = {
        relative: false,
        addRootSlash: false,
        ignorePath: 'tmp/'
    };

    var appInject = gulp
        .src(cfg.index)
        .pipe($.inject(gulp.src(cfg.temp + 'Content/*.css', { read: false }), injectOptions))
        .pipe($.inject(gulp.src([cfg.temp + this.configFileName, cfg.temp + appJsFileName], { read: false }), injectOptions))
        .pipe($.if(config.isProductionPublish === false, print()))
        .pipe(gulp.dest(cfg.temp)); // he used client here (same as config.src)

    mergedStream.add(appInject);

    var silentRefresh = gulp
        .src(cfg.silentRefresh)
        .pipe(gulp.dest(cfg.temp));  // copy silent refresh html page

    mergedStream.add(silentRefresh);

    var printInject = gulp
        .src(cfg.printIndex)
        .pipe($.inject(gulp.src(cfg.temp + printJsFileName, { read: false }), injectOptions))
        .pipe($.if(config.isProductionPublish === false, print()))
        .pipe(gulp.dest(cfg.temp)); 

    mergedStream.add(printInject);

    return mergedStream;
});

// add gulp-polyfill also
gulp.task('scripts', ['clean-scripts'], function () {
    log('Compiling Javascript');

    var mergedStream = merge();

    var cfg = config.getConfig();

    // config script
    this.configFileName = config.isProductionPublish === true ? 'config.publish.js' : 'config.js';

    var configProcess = gulp
        .src('NSAMD/' + this.configFileName, { base: 'NSAMD' })
        .pipe($.plumber())  // gracefully handles errors
        .pipe($.if(config.isProductionPublish === false, print()))
        .pipe(gulp.dest(cfg.temp));

    mergedStream.add(configProcess);

    // app scripts
    appJsFileName = uuid() + '.min.js';

    var appProcess = gulp
        .src(cfg.alljs)
        .pipe($.plumber())  // gracefully handles errors
        .pipe($.if(config.isProductionPublish === false, print()))
        .pipe($.concat(appJsFileName))
        .pipe($.babel({ presets: ['es2015'] })) // #3. transpile ES2015 to ES5 using ES2015 preset
        .pipe(ngAnnotate())
        .pipe($.uglify())
        .pipe(gulp.dest(cfg.temp));

    mergedStream.add(appProcess);

    // print scripts
    printJsFileName = uuid() + '.min.js';

    var printProcess = gulp
        .src(cfg.printjs)
        .pipe($.plumber())  // gracefully handles errors
        .pipe($.if(config.isProductionPublish === false, print()))
        .pipe($.concat(printJsFileName))
        .pipe($.babel({ presets: ['es2015'] })) // #3. transpile ES2015 to ES5 using ES2015 preset
        .pipe(ngAnnotate())
        .pipe($.uglify())
        .pipe(gulp.dest(cfg.temp));

    mergedStream.add(printProcess);

    // vendor scripts (angular, etc.)
    var vendorScripts = gulp
        .src(['NSAMD/Scripts/**/*.min.js'], { base: 'NSAMD' })
        .pipe($.if(config.isProductionPublish === false, print()))
        .pipe(gulp.dest(cfg.temp));

    mergedStream.add(vendorScripts);

    return mergedStream;
});

gulp.task('libs', function () {
    var cfg = config.getConfig();
    return gulp
        .src([
            'node_modules/systemjs/dist/system.js',
            'node_modules/babel-polyfill/dist/polyfill.js',
        ])
        .pipe($.if(config.isProductionPublish === false, print()))
        .pipe(gulp.dest(cfg.temp + 'libs'))
})

gulp.task('styles', ['clean-styles'], function () {
    log('Compiling SASS -> CSS');
    var cfg = config.getConfig();

    var appCss = gulp
        .src([cfg.css, cfg.sass])
        .pipe($.plumber())  // gracefully handles errors
        .pipe($.if(config.isProductionPublish === false, print()))
        .pipe($.concat(uuid() + '.min.css'))
        .pipe($.sass())
        .pipe($.autoprefixer({ browsers: ['last 2 versions', '> 5%'] })) // get only the last 2 versions of browsers that have more than 5% of the market.
        .pipe($.csso())  // minify css output
        .pipe(gulp.dest(cfg.temp + 'Content/'));

    var vendorCss = gulp
        .src(['NSAMD/Content/**/*.css', '!NSAMD/Content/app.css', '!NSAMD/Content/appReportActiveGuestList.css'], { base: 'NSAMD' })
        .pipe($.if(config.isProductionPublish === false, print()))
        .pipe(gulp.dest(cfg.temp));

    return merge(appCss, vendorCss);
});

gulp.task('clean-build', function () {
    var cfg = config.getConfig();
    del.sync([cfg.dist + '**', '!' + cfg.dist]);
});

gulp.task('clean-html', function () {
    var cfg = config.getConfig();
    del.sync([cfg.temp + '**/*.html', '!' + cfg.temp]);
});

// this is a dependency of styles
gulp.task('clean-styles', function () { 
    var cfg = config.getConfig();
    del.sync([cfg.temp + '**/*.css', '!' + cfg.temp]);
});

gulp.task('clean-scripts', function () {
    var cfg = config.getConfig();
    del.sync([cfg.temp + '**/*.js', '!' + cfg.temp]);
});

gulp.task('sass-watcher', function () {
    var cfg = config.getConfig();
    gulp.watch([cfg.sass], ['styles']); // run the 'styles' task whenever sass files change.
});


function log(msg) {
    if (typeof (msg) === object) {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                log(colors.yellow(msg[item]));
            }
        }
    }
    else {
        log(colors.yellow(msg));
    }
}