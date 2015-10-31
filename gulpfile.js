'use strict';
let browserify = require('browserify');
let buffer     = require('vinyl-buffer');
let del        = require('del');
let gulp       = require('gulp');
let gutil      = require('gulp-util');
let rename     = require('gulp-rename');
let source     = require('vinyl-source-stream');
let stylus     = require('gulp-stylus');
let uglify     = require('gulp-uglify');

gulp.task('default', ['build']);

gulp.task('clean', function () {
  return del([
    'dist/**/*',
  ]);
});

gulp.task('default', ['build']);

gulp.task('stylus', function () {
  gulp.src('src/styles/youtify.styl')
    .pipe(stylus({
        compress: gutil.env.dist
      }))
    .pipe(gulp.dest('dist'));
});

gulp.task('browserify', function () {
  return browserify({
      entries: 'src/index.js',
      debug: !gutil.env.dist
    })
    .bundle()
    .pipe(source('youtify.js'))
    .pipe(buffer())
    .pipe(gutil.env.dist ? uglify() : gutil.noop())
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy-files', function () {
  return gulp.src([
      'src/manifest.json',
      'src/inject.js',
      'src/assets/**/*'
    ], { base: 'src' })
    .pipe(gulp.dest('dist'));
});

gulp.task('license', function () {
  return gulp.src('LICENSE')
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['build'], function () {
  gulp.watch([
    '*',
    'src/*.json',
    'src/inject.js',
    'src/assets/*'
  ], ['copy-files']);
  gulp.watch('src/**/*.js', ['browserify']);
  gulp.watch('src/**/*.styl', ['stylus']);
});

gulp.task('build', ['clean', 'copy-files', 'browserify', 'stylus', 'license']);
