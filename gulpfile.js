
var gulp = require('gulp');
var args = require('yargs').argv;
var config = require('./gulp.config')();
var log = require('fancy-log');
var colors = require('ansi-colors');
var del = require('del');
var uuid = require('uuid/v4');

var $ = require('gulp-load-plugins')({ lazy: true });
// use $. with the name of the plugin without gulp- in front of it, e.g.:  $.print instead of gulp-print

var gulpPrint = require('gulp-print');
// .pipe(gulpPrint())  // see all of the files you are touching
var gulpif = require('gulp-if');

//.pipe(gulpif(args.verbose, gulpPrint()))  // run gulp task with --verbose to trigger the gulpPrint



// add gulp-polyfill also

gulp.task('styles', ['clean-styles'], function () {
    log('Compiling SASS -> CSS');

    return gulp
        .src([config.css, config.sass])
        .pipe($.plumber())  // gracefully handles errors
        .pipe($.concat(uuid() + '.scss'))
        .pipe($.sass())
        .pipe($.autoprefixer({ browsers: ['last 2 versions', '> 5%']})) // get only the last 2 versions of browsers that have more than 5% of the market.
        .pipe(gulp.dest(config.temp));
});

// this is a dependency of styles
gulp.task('clean-styles', function () {
    var files = config.temp + '**/*.css';
    clean(files);
});

function clean(path) {
    log('Cleaning ' + path);
    del(path);
}

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