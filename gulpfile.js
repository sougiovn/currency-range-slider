const gulp = require('gulp');
const sass = require('gulp-sass');
const watch = require('gulp-watch');
const uglifyjs = require('gulp-uglifyjs');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const webserver = require('gulp-webserver');

const dist = './dist';
const demo = `${dist}/demo`;
const src = './src';

gulp.task('clean', () => gulp.src(dist).pipe(clean()));

gulp.task('dev:sass', () => {
  return gulp.src(`${src}/styles.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(dist));
});

gulp.task('dev:html', () => {
  return gulp.src(`${src}/index.html`)
    .pipe(gulp.dest(dist));
});

gulp.task('dev:js', () => {
  return gulp.src(`${src}/*.js`)
    .pipe(gulp.dest(dist));
});

gulp.task('build:sass', () => {
  return gulp.src(`${src}/styles.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(demo));
});

gulp.task('build:html', () => {
  return gulp.src(`${src}/index.html`)
    .pipe(gulp.dest(demo));
});

gulp.task('build:js', () => {
  gulp.src(`${src}/*.js`)
    .pipe(gulp.dest(demo));

  return gulp.src(`${src}/range-slider`)
    .pipe(uglifyjs())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest(dist));
});

gulp.task('watch', () => {
  runSequence('clean', 'dev:html', 'dev:sass', 'dev:js', () => {
    gulp.watch(`${src}/index.html`, ['dev:html']);
    gulp.watch(`${src}/styles.scss`, ['dev:sass']);
    gulp.watch(`${src}/*.js`, ['dev:js']);
    gulp.src(dist)
      .pipe(webserver({
        livereload: true,
        port: 3000
      }))
  });
});

gulp.task('build', () => {
  runSequence('build:html', 'build:sass', 'build:js');
});

