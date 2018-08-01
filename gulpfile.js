
var gulp = require('gulp');
var args = require('yargs').argv;
var merge = require('merge-stream');

var config = require('./gulp.config')();
var log = require('fancy-log');
var colors = require('ansi-colors');
var del = require('del');
var uuid = require('uuid/v4');
//var uglify = require('gulp-uglify'); // minify javascript:  $.uglify

var print = require('gulp-print').default;

var $ = require('gulp-load-plugins')({ lazy: true });
// use $. with the name of the plugin without gulp- in front of it, e.g.:  $.print instead of gulp-print

// .pipe(gulpPrint())  // see all of the files you are touching
// var gulpif = require('gulp-if');
//.pipe(gulpif(args.verbose, gulpPrint()))  // run gulp task with --verbose to trigger the gulpPrint


gulp.task('build', ['clean-build', 'inject', 'libs'], function () {

    log('Running build.  Need to inject js into print.html');

    var temp = gulp.src(['tmp/**/*.*'])
        .pipe(gulp.dest(config.dist));

    var app = gulp
        .src(['NSAMD/**/*.html', 'NSAMD/**/*.css', 'NSAMD/**/*.svg', 'NSAMD/**/*.png', 'NSAMD/Scripts/**/*.*', 'tmp/**/*.*'], { base: 'NSAMD' })
        .pipe(print())
        .pipe(gulp.dest(config.dist));

    return merge(temp, app);
})

gulp.task('serve', ['build'], function () {
    gulp.src('dist').pipe(webserver({ open: true }));
})

// test that injects JavaScript and css
gulp.task('inject', ['clean-html', 'scripts', 'styles'], function () {
    log("Wireup our custom css in the html and call wiredep")

    // addPrefix: '.'
    var injectOptions = {
        relative: false,
        addRootSlash: false,
        ignorePath: 'tmp/'
    };

    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.temp + 'Content/*.css', { read: false }), injectOptions))
        .pipe($.inject(gulp.src(config.temp + 'Scripts/*.js', { read: false }), injectOptions))
        .pipe(print())
        .pipe(gulp.dest(config.temp)); // he used client here (same as config.src)
});

// add gulp-polyfill also
gulp.task('scripts', ['clean-scripts'], function () {
    log('Compiling Javascript');

    return gulp
        .src(config.alljs)
        .pipe($.plumber())  // gracefully handles errors
        .pipe(print())      // #2. print each file in the stream
        .pipe($.concat(uuid() + '.min.js'))
        .pipe($.babel({ presets: ['es2015'] })) // #3. transpile ES2015 to ES5 using ES2015 preset
        .pipe($.uglify())
        .pipe(gulp.dest(config.temp + 'Scripts/'));
});

gulp.task('libs', function () {
    return gulp
        .src([
            'node_modules/systemjs/dist/system.js',
            'node_modules/babel-polyfill/dist/polyfill.js',
        ])
        .pipe(print())
        .pipe(gulp.dest(config.temp + 'libs'))
})

gulp.task('styles', ['clean-styles'], function () {
    log('Compiling SASS -> CSS');

    return gulp
        .src([config.css, config.sass])
        .pipe($.plumber())  // gracefully handles errors
        .pipe(print())
        .pipe($.concat(uuid() + '.min.css'))
        .pipe($.sass())
        .pipe($.autoprefixer({ browsers: ['last 2 versions', '> 5%'] })) // get only the last 2 versions of browsers that have more than 5% of the market.
        .pipe($.csso())  // minify css output
        .pipe(gulp.dest(config.temp + 'Content/'));
});

gulp.task('clean-build', function () {
    del.sync([config.dist + '**', '!' + config.dist]);
});

gulp.task('clean-html', function () {
    del.sync([config.temp + '**/*.html', '!' + config.temp]);
});

// this is a dependency of styles
gulp.task('clean-styles', function () { 
    del.sync([config.temp + '**/*.css', '!' + config.temp]);
});

gulp.task('clean-scripts', function () {
    del.sync([config.temp + '**/*.js', '!' + config.temp]);
});

//function clean(path) {
//    log('Cleaning ' + path);
//    del(path);
//}

gulp.task('sass-watcher', function () {
    gulp.watch([config.sass], ['styles']); // run the 'styles' task whenever sass files change.
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