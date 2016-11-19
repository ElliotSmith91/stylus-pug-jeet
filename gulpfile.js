var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var stylus = require('gulp-stylus');
var prefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var pug = require('gulp-pug');
var koutoSwiss = require( "kouto-swiss" );

//defining some commonly used paths
var paths = {
  'bower': './bower_components',
  'dev': './_dev'
};

//defining source file paths
var src = {
  stylus: paths.dev + '/assets/styles/**',
  js: paths.dev + '/assets/scripts/*.js',
  pug: paths.dev + '/*.pug'
};

/**
* Compile Sass files from dev to site staging
*/
gulp.task('stylus', function(){
  return gulp.src(
    paths.dev + ('/assets/styles/app.styl')
  )
  .pipe(stylus({
    includePaths: ['styles'],
    onError: browserSync.notify,
    "use": koutoSwiss()
  }))
  .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
  .pipe(concat('app.css'))
  .pipe(gulp.dest('./_site/assets/css'))
  .pipe(browserSync.stream());
});

/**
* Compile pug files from dev to site staging
*/
gulp.task('pug', function(){
  return gulp.src(src.pug)
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('./_site/'));
});

gulp.task('scripts', function(){
  gulp.src([
    paths.bower + '/bootstrap-sass/assets/javascripts/bootstrap.js',
    paths.bower + '/jquery/dist/jquery.js'
  ])
  .pipe(concat('app.js'))
  .pipe(gulp.dest('./_site/assets/js'));
});

gulp.task('watch', function() {
  gulp.watch(src.stylus, ["stylus"]);
  gulp.watch(src.pug, ['pug']);
});

gulp.task('serve', ['stylus'], function(){
  browserSync.init({
    server:"./_site"
  });

  gulp.watch(src.stylus, ['stylus']);
  gulp.watch("./_site/*.html").on('change', browserSync.reload);
});

gulp.task('default', ['serve', 'watch']);
