const gulp = require('gulp');
const sass = require('gulp-sass');
const watch = require('gulp-watch');
const uglifyjs = require('gulp-uglifyjs');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const webserver = require('gulp-webserver');
const cleanCss = require('gulp-clean-css');
const fs = require('fs');
const replace = require('gulp-replace');

const packageJson = JSON.parse(fs.readFileSync('./package.json'));
const componentName = packageJson.name;
const componentFormattedName = formatComponentName();
const dist = './dist';
const demo = `${dist}/demo`;
const src = './src';

gulp.task('clean', () => {
  return gulp.src([dist, './index.html']).pipe(clean({ force: true }));
});

gulp.task('dev:sass', () => {
  gulp.src(`${src}/styles.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(dist));
  
  return gulp.src(`${src}/${packageJson.name}.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(dist));
});

gulp.task('dev:html', () => {
  return gulp.src(`${src}/index.html`)
    .pipe(replace(/\${component-name}/g, componentName))
    .pipe(replace(/\${component-formatted-name}/g, componentFormattedName))
    .pipe(gulp.dest('.'));
});

gulp.task('dev:js', () => {
  return gulp.src(`${src}/*.js`)
    .pipe(gulp.dest(dist));
});

gulp.task('build:sass', () => {
  gulp.src(`${src}/styles.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(demo));
  
  return gulp.src(`${src}/${packageJson.name}.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCss())
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest(dist));
});

gulp.task('build:html', () => {
  return gulp.src(`${src}/index.html`)
    .pipe(replace(/\${component-name}/g, componentName))
    .pipe(replace(/\${component-formatted-name}/g, componentFormattedName))
    .pipe(gulp.dest('.'));
});

gulp.task('build:js', () => {
  gulp.src(`${src}/*.js`)
    .pipe(gulp.dest(demo));
  
  return gulp.src(`${src}/${packageJson.name}.js`)
    .pipe(uglifyjs())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest(dist));
});

gulp.task('watch', () => {
  runSequence('demo', () => {
    gulp.watch(`${src}/index.html`, ['dev:html']);
    gulp.watch(`${src}/*.scss`, ['dev:sass']);
    gulp.watch(`${src}/*.js`, ['dev:js']);
    gulp.src('.')
      .pipe(webserver({
        livereload: true,
        port: 3000
      }))
  });
});

gulp.task('demo', () => {
  runSequence('clean', 'dev:html', 'dev:sass', 'dev:js');
});

gulp.task('build', () => {
  runSequence('clean', 'build:html', 'build:sass', 'build:js');
});

function formatComponentName() {
  return componentName.split(/-/).map(substring =>
    `${substring.charAt(0).toUpperCase()}${substring.substr(1)}`
  ).join(' ');
}

