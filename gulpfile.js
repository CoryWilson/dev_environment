//Declare the dependencies for each gulp module
var gulp        = require('gulp'),
    browserSync = require('browser-sync').create(),
    bower       = require('gulp-bower'),
    minifyCss   = require('gulp-minify-css'),
    rename      = require('gulp-rename'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify');

//Adding paths to directories for convenience
var config = {
  bowerDir : './bower_components',
  jsPath   : './dev/js',
  sassPath : './dev/sass'
};

//Let's give gulp some tasks to complete

//Task that moves bower components to the site directory
gulp.task('bower', function(){
  //Grabs bower components
  return bower(config.bowerDir)
    //Move bower components to site directory
    .pipe(gulp.dest('./site/assets/js/vendor'));
});

//Task that monitors our styles
gulp.task('styles', function(){
  //Grabbing Main SASS File
  gulp.src(config.sassPath+'/main.scss')
    //Starting sourcemaps
    .pipe(sourcemaps.init())
      //Compile SASS into CSS
      .pipe(sass())
      //Minify CSS file
      .pipe(minifyCss())
      //Rename the CSS to reflect minified status
      .pipe(rename('main.min.css'))
    //Write the sourcemaps to a directory named maps
    .pipe(sourcemaps.write('../../../maps/css'))
    //Move newly minified CSS file to site directory
    .pipe(gulp.dest('./site/assets/css'))
    //Have browser-sync register any changes to CSS file
    .pipe(browserSync.stream());
});

//Task that monitors our JavaScripts
gulp.task('scripts', function(){
  //Grabbing JS Files
  gulp.src(config.jsPath+'/*.js')
    //Starting sourcemaps
    .pipe(sourcemaps.init())
      //Minifying JS files
      .pipe(uglify())
      //Rename the JS files to reflect minified status
      .pipe(rename(function(path){
        path.extname = '.min.js';
      }))
    //Write the sourcemaps to a directory named maps
    .pipe(sourcemaps.write('../../../maps/js'))
    //Move newly minified JS files to site directory
    .pipe(gulp.dest('./site/assets/js'));
});

//Task that triggers a reload when html files are changed
gulp.task('script-watch',['scripts'],browserSync.reload);

//Task that moves html to site directory
gulp.task('html', function(){
  gulp.src('./*.html')
    .pipe(gulp.dest('./site'));
});

//Task that triggers a reload when html files are changed
gulp.task('html-watch',['html'],browserSync.reload);

//Task that serves up the files from the site directory
gulp.task('serve',['styles','scripts','html'],function(){
  //browser-sync serves files from the site directory
  browserSync.init({
    server: './site'
  });
  //gulp watch tasks for the SASS and JS from the dev directory, as well as the html from the root
  gulp.watch(config.sassPath+'/*.scss',['styles']);
  gulp.watch(config.jsPath+'/*.js',['script-watch']);
  gulp.watch('./*.html',['html-watch']);
});

//the default task will run the bower, html, scripts, and serve tasks
gulp.task('default', ['bower','html','scripts','serve']);
