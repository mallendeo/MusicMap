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
        compress: gutil.env.dist
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
    .pipe(gutil.env.dist ? uglify() : gutil.noop())
    .pipe(gulp.dest('./dist'))
})

gulp.task('copy-files', function() {
  return gulp.src([
      'LICENSE',
      'src/manifest.json',
      'src/inject.js'
    ])
    .pipe(gulp.dest('./dist'))
})

gulp.task('watch', ['build'], function() {
  gulp.watch(['*', 'src/*'], ['copy-files'])
  gulp.watch('src/**/*.js', ['browserify'])
  gulp.watch('src/**/*.styl', ['stylus'])
})

gulp.task('build', ['copy-files', 'browserify', 'stylus'])
