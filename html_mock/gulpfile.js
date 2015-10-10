'use strict';

// gulp
var gulp = require('gulp');
var gutil = require('gulp-util');

// javascript processing
var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');  // buffer and source allow us to turn watchify into a gulp compatible interface
var source = require('vinyl-source-stream');
var watchify = require('watchify');  // makes browserify way faster by rebuilding only what was changed

// sass/css processing
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-ruby-sass');

// misc helpers
var assign = require('lodash.assign');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');
var notify = require('gulp-notify');
var process = require('child_process');
var sourcemaps = require('gulp-sourcemaps');


// gulp js
gulp.task('js', bundle);

var babelOpts = {}
var browserifyOpts = {
    entries: ['./src/js/app.js'],
    debug: true,
    transform: [[babelify, babelOpts]], // uses babel with browserify
};
var opts = assign({}, watchify.args, browserifyOpts);
var b = watchify(browserify(opts));
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
    return b.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))  // log errors if they happen
        .on('error', notify.onError(function (error) {
            return {title: 'Browserify Error', message: 'JS compilation failed :('};
        }))
        .pipe(source('bundle.js'))
        .pipe(buffer())  // optional, remove if you don't need to buffer file contents
        .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        // Add transformation tasks to the pipeline here.
        .pipe(sourcemaps.write('.')) // writes .map file
        .pipe(gulp.dest('./build/js'));
}


// gulp sass
gulp.task('sass', function() {
    return sass('./src/scss/**/*.scss', {
            sourcemap: true,
            emitCompileError: true
        })
        .on('error', sass.logError)
        .on('error', notify.onError(function (error) {
            return {title: 'SASS Error', message: 'SASS compilation failed :('};
        }))
        .pipe(sourcemaps.init())
        // .pipe(notify({message: 'Yolo!'}))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: 'source',
        }))
        .pipe(gulp.dest('./build/css'));
});


// gulp watch
gulp.task('watch', ['sass', 'js'], function() {
    // watch scss files
    gulp.watch('./src/scss/**/*.scss', ['sass']);
    // watch js files
    gulp.watch('./src/js/**/*.js', ['js']);

    // livereload
    livereload.listen();
    gulp.watch('./build/js/**/*.js').on('change', livereload.changed);
    gulp.watch('./build/css/**/*.css').on('change', livereload.changed);
    gulp.watch('./*.html').on('change', livereload.changed);
});


// gulp server
gulp.task('server', function(){
    var spawn = process.spawn;
    var PIPE = {stdio: 'inherit'};
    spawn('python3', ['-m','http.server'], PIPE);
});


// default task
gulp.task('default', ['sass', 'js']);
