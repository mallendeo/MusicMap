var browserify = require('browserify')
var buffer     = require('vinyl-buffer')
var gulp       = require('gulp')
var gutil      = require('gulp-util')
var rename     = require('gulp-rename')
var source     = require('vinyl-source-stream')
var stylus     = require('gulp-stylus')
var uglify     = require('gulp-uglify')

gulp.task('default', ['browserify', 'stylus'])

gulp.task('stylus', function () {
  gulp.src('./src/youtify.styl')
    .pipe(stylus({
        compress: gutil.env.production
      }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('browserify', function() {
  var b = browserify({
    entries: './src/index.js',
    debug: true
  })

  return b.bundle()
    .pipe(source('youtify.js'))
    .pipe(buffer())
    .pipe(gutil.env.production ? uglify() : gutil.noop())
    .pipe(gulp.dest('./dist'))
})

gulp.task('copy-files', function() {
  return gulp.src([
      'LICENSE',
      'manifest.json',
      'contributors.txt',
      'inject.js'
    ])
    .pipe(gulp.dest('./dist'))
})

gulp.task('watch', ['dist'], function() {
  gulp.watch('*', ['copy-files'])
  gulp.watch('src/**/*.js', ['browserify'])
  gulp.watch('src/**/*.styl', ['stylus'])
})

gulp.task('dist', ['copy-files', 'browserify', 'stylus'])
