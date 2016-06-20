import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import del from 'del';
import gulp from 'gulp';
import gutil from 'gulp-util';
import source from 'vinyl-source-stream';
import stylus from 'gulp-stylus';
import uglify from 'gulp-uglify';

gulp.task('default', ['build']);

gulp.task('clean', () => del(['dist/**/*']));

gulp.task('default', ['build']);

gulp.task('stylus', () => {
  gulp.src('src/styles/youtify.styl')
    .pipe(stylus({ compress: gutil.env.dist }))
    .pipe(gulp.dest('dist'));
});

gulp.task('browserify', () =>
  browserify({
    entries: 'src/index.js',
    debug: !gutil.env.dist,
  })
  .transform(babelify.configure({
    presets: ['es2015'],
    plugins: ['transform-es2015-modules-commonjs'],
  }))
  .bundle()
  .pipe(source('youtify.js'))
  .pipe(buffer())
  .pipe(gutil.env.dist ? uglify() : gutil.noop())
  .pipe(gulp.dest('./dist')));

gulp.task('copy-files', () =>
  gulp.src([
    'src/manifest.json',
    'src/inject.js',
    'src/assets/**/*',
  ], { base: 'src' })
  .pipe(gulp.dest('dist')));

gulp.task('license', () =>
  gulp.src('LICENSE')
    .pipe(gulp.dest('dist')));

gulp.task('watch', ['build'], () => {
  gulp.watch([
    '*',
    'src/*.json',
    'src/inject.js',
    'src/assets/*',
  ], ['copy-files']);
  gulp.watch('src/**/*.js', ['browserify']);
  gulp.watch('src/**/*.styl', ['stylus']);
});

gulp.task('build', ['clean', 'copy-files', 'browserify', 'stylus', 'license']);
