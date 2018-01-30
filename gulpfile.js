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
const bower = './bower_components/';
const dist = './dist';
const demo = `${dist}/demo`;
const src = './src';
const vendors = './vendors/';

gulp.task('clean', () => gulp.src([dist, './index.html']).pipe(clean({force: true})));

gulp.task('sass', () => {
  gulp.src(`${src}/*.scss`)
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

gulp.task('html', () => {
  return gulp.src(`${src}/index.html`)
    .pipe(replace(/\${component-name}/g, componentName))
    .pipe(replace(/\${component-formatted-name}/g, componentFormattedName))
    .pipe(gulp.dest('.'));
});

gulp.task('js', () => {
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
  runSequence('build', () => {
    gulp.watch(`${src}/index.html`, ['html']);
    gulp.watch(`${src}/*.scss`, ['sass']);
    gulp.watch(`${src}/*.js`, ['js']);
    gulp.src('.')
      .pipe(webserver({
        livereload: true,
        port: 3000
      }))
  });
});

gulp.task('clean:vendors', () => gulp.src(vendors));

gulp.task('install:vendors', () => {
  return gulp.src(`${bower}*`)
    .pipe(gulp.dest(vendors));
});

gulp.task('vendors', () => {
  return gulp.src(`${vendors}*`)
    .pipe(gulp.dest(`${dist}/vendors`));
});

gulp.task('build', () => {
  runSequence('clean', 'clean:vendors', 'install:vendors', 'vendors', 'html', 'sass', 'js');
});

function formatComponentName() {
  return componentName.split(/-/).map(substring =>
    `${substring.charAt(0).toUpperCase()}${substring.substr(1)}`
  ).join(' ');
}




