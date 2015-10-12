var browserify = require('browserify')
var buffer     = require('vinyl-buffer')
var del        = require('del')
var gulp       = require('gulp')
var gutil      = require('gulp-util')
var rename     = require('gulp-rename')
var source     = require('vinyl-source-stream')
var stylus     = require('gulp-stylus')
var uglify     = require('gulp-uglify')

gulp.task('default', ['build'])

gulp.task('clean', function () {
  return del([
    'dist/**/*',
  ])
})

gulp.task('default', ['clean:mobile']);

gulp.task('stylus', function () {
  gulp.src('src/youtify.styl')
    .pipe(stylus({
        compress: gutil.env.dist
      }))
    .pipe(gulp.dest('dist'))
})

gulp.task('browserify', function() {
  var b = browserify({
    entries: 'src/index.js',
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
      'src/manifest.json',
      'src/inject.js',
      'src/assets/**/*'
    ], { base: 'src' })
    .pipe(gulp.dest('dist'))
})

gulp.task('license', function() {
  return gulp.src('LICENSE')
    .pipe(gulp.dest('dist'))
})

gulp.task('watch', ['build'], function() {
  gulp.watch([
    '*',
    'src/*.json',
    'src/inject.js',
    'src/assets/*'
  ], ['copy-files'])
  gulp.watch('src/**/*.js', ['browserify'])
  gulp.watch('src/**/*.styl', ['stylus'])
})

gulp.task('build', ['clean', 'copy-files', 'browserify', 'stylus', 'license'])
