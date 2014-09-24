var path = require('path');
var gulp = require("gulp");
var clean = require('gulp-clean');

var sass = require('gulp-ruby-sass');

var webserver = require('gulp-webserver');


var plumber = require('gulp-plumber');
var reactify = require('reactify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');


var paths = {
  scss: ['./node_modules/Ovid/dist/stylesheets/application.rails.scss'],
  js: ['./app.jsx'],
  ovidjs:['./node_modules/Ovid/dist/javascripts/jsx/**/*.js','./app.jsx'],
  fonts:'./node_modules/Ovid/dist/fonts/**',
  images:'./node_modules/Ovid/dist/images/**'
};


gulp.task('clean', function () {
  gulp.src('build', {read: false})
    .pipe(clean());
});


gulp.task('js', function() {
  // Browserify/bundle the JS.
  browserify(paths.js, {debug:true})
    .transform(reactify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./build/'));
});

gulp.task('sass', function () {
  gulp.src(paths.scss)
    .pipe(sass())
    .pipe(gulp.dest('./build'));
});

gulp.task('copy', function() {
  gulp.src(paths.fonts)
    .pipe(plumber())
    .pipe(gulp.dest('./build/assets/Ovid/dist/fonts'));

  gulp.src(paths.images)
    .pipe(plumber())
    .pipe(gulp.dest('./build/assets/Ovid/dist/images'));

  gulp.src('./index.html')
    .pipe(plumber())
    .pipe(gulp.dest('./build'));


});

/*
gulp.task('watch', function() {
 // gulp.watch(paths.scss, ['scss']);
  gulp.watch(paths.ovidjs, ['js']);
});
*/

gulp.task('server', function() {
  gulp.src('build')
    .pipe(webserver({

    }));
});


gulp.task('build', ['js', 'sass', 'copy']);