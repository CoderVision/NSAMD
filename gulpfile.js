
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
var express = require('express');
var https = require('https');
 
var port = process.env.PORT || config.defaultPort;

var appJsFileName = "";
var printJsFileName = "";
var configFileName = "";

// use $. with the name of the plugin without gulp- in front of it, e.g.:  $.print instead of gulp-print
var $ = require('gulp-load-plugins')({ lazy: true });


//// Instructions:
///     Set "config.isProductionPublish = false;" to the correct state
///     To Use:`Open command window, cd to C:\Source\Repos\NSAMD
///     To Build:  type "gulp build"  (outputs to dist folder)
///     To Serve the website:  type "gulp serve", then open https://localhost:44363 in Chrome, etc.
///     To Develop type "gulp dev", then open https://localhost:44363 in Chrome, etc.
///     To Publish:  type "gulp publish"  (ftp's dist folder contents to website)

config.isProductionPublish = false;
var printFiles = false;

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

    return gulp.src('dist/**', { base: './dist/', buffer: false })
        .pipe($.if(printFiles === true, $.exit()))
        .pipe($.plumber())  // gracefully handles errors
        .pipe(print())
        .pipe(conn.newer(path)) // only upload newer files
        .pipe(conn.dest(path));
});


gulp.task('dev', ['serve'], function () {
    var cfg = config.getConfig();
    gulp.watch([
         'NSAMD/**/*.html',
         'NSAMD/**/*.js',
         'NSAMD/**/*.css',
         'NSAMD/**/*.scss'
    ], ['build']); 
});


gulp.task('serve', ['build'], function () {
    var options = {
        pfx: fs.readFileSync('localhost-dev.pfx'),
        passphrase: 'journal'
    };
    var server = express();
    var path = __dirname + '/dist/';

    server.use(express.static(path));


    https.createServer(options, server).listen(44363);

    console.log("site running at:  https://localhost:44363")
});


// 'clean-build',
gulp.task('build', ['clean-build', 'inject', 'libs'], function () {

    log('Running build.');

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
     //   .pipe(fileCache.filter())
        .pipe($.if(printFiles === true, print()))
     //   .pipe(fileCache.cache())
        .pipe(gulp.dest(cfg.dist));

    return merge(temp, app);
})

// test that injects JavaScript and css
gulp.task('inject', ['clean-html', 'scripts', 'styles'], function () {
    log("Wireup our custom css in the html")

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
        .pipe($.inject(gulp.src([cfg.temp + '*.css'], { read: false }), injectOptions))
        .pipe($.inject(gulp.src([cfg.temp + this.configFileName, cfg.temp + appJsFileName], { read: false }), injectOptions))
        .pipe($.if(printFiles === true, print()))
        .pipe(gulp.dest(cfg.temp)); // he used client here (same as config.src)

    mergedStream.add(appInject);

    var silentRefresh = gulp
        .src(cfg.silentRefresh)
        .pipe(gulp.dest(cfg.temp));  // copy silent refresh html page

    mergedStream.add(silentRefresh);

    var printInject = gulp
        .src(cfg.printIndex)
        .pipe($.inject(gulp.src(cfg.temp + printJsFileName, { read: false }), injectOptions))
        .pipe($.if(printFiles === true, print()))
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
        .pipe($.if(printFiles === true, print()))
        .pipe(gulp.dest(cfg.temp));

    mergedStream.add(configProcess);

    // app scripts
    appJsFileName = uuid() + '.min.js';

    var appProcess = gulp
        .src(cfg.alljs)
        .pipe($.plumber())  // gracefully handles errors
        .pipe($.if(printFiles === true, print()))
        .pipe($.concat(appJsFileName))
        .pipe($.babel({ presets: ['es2015'] })) // #3. transpile ES2015 to ES5 using ES2015 preset
        .pipe(ngAnnotate())
        //.pipe($.uglify())
        .pipe($.if(config.isProductionPublish === true, $.uglify()))

        .pipe(gulp.dest(cfg.temp));

    mergedStream.add(appProcess);

    // print scripts
    printJsFileName = uuid() + '.min.js';

    var printProcess = gulp
        .src(cfg.printjs)
        .pipe($.plumber())  // gracefully handles errors
        .pipe($.if(printFiles === true, print()))
        .pipe($.concat(printJsFileName))
        .pipe($.babel({ presets: ['es2015'] })) // #3. transpile ES2015 to ES5 using ES2015 preset
        .pipe(ngAnnotate())
        .pipe($.uglify())
        .pipe(gulp.dest(cfg.temp));

    mergedStream.add(printProcess);

    // vendor scripts (angular, etc.)
    var vendorScripts = gulp
        .src(['NSAMD/Scripts/**/*.min.js'], { base: 'NSAMD' })
        .pipe($.cached('scripts'))
        .pipe($.if(printFiles === true, print()))
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
        .pipe($.cached('libs'))
        .pipe($.if(printFiles === true, print()))
        .pipe(gulp.dest(cfg.dist + 'libs'));
})

gulp.task('styles', ['clean-styles'], function () {
    log('Compiling SASS -> CSS');
    var cfg = config.getConfig();

    var appCss = gulp
        .src([cfg.css, cfg.sass])
        .pipe($.plumber())  // gracefully handles errors
        .pipe($.if(printFiles === true, print()))
        .pipe($.concat(uuid() + '.min.css'))
        .pipe($.sass())
        .pipe($.autoprefixer({ browsers: ['last 2 versions', '> 5%'] })) // get only the last 2 versions of browsers that have more than 5% of the market.
        .pipe($.csso())  // minify css output
        .pipe(gulp.dest(cfg.temp));

    var vendorCss = gulp
        .src(['NSAMD/Content/**/*.css', '!NSAMD/Content/app.css', '!NSAMD/Content/appReportActiveGuestList.css'], { base: 'NSAMD' })
        .pipe($.cached('css'))
        .pipe($.if(printFiles === true, print()))
        .pipe(gulp.dest(cfg.temp));

    return merge(appCss, vendorCss);
});

gulp.task('clean-build', function () {
    var cfg = config.getConfig();
    del.sync([cfg.dist + '**', '!./dist', 
        '!./dist/libs', '!./dist/libs/*.js',
        '!./dist/Content', '!./dist/Content/*.css',
        '!./dist/Scripts', '!./dist/Scripts/*.js'
    ]);
});

gulp.task('clean-html', function () {
    var cfg = config.getConfig();
    del.sync([cfg.temp + '**/*.html', '!' + cfg.temp]);
});

// this is a dependency of styles
gulp.task('clean-styles', function () { 
    var cfg = config.getConfig();
    del.sync([cfg.temp + '*.css']);
});

gulp.task('clean-scripts', function () {
    var cfg = config.getConfig();
    del.sync([cfg.temp + '*.js']);
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