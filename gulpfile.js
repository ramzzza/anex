let gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  del = require('del'),
  autoprefixer = require('gulp-autoprefixer'),
  fileinclude = require('gulp-file-include'),
  notify = require('gulp-notify'),
  babel = require('gulp-babel');


gulp.task('clean', async function () {
  del.sync('dist')
});

gulp.task('scss', function () {
  return gulp.src('app/sass/**/*.sass')
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .on("error", notify.onError({
      message: "Error: <%= error.message %>",
      title: "У вас SASS"
    }))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 8 versions']
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});



gulp.task('html', function () {
  return gulp.src('app/*.html')
    .pipe(browserSync.reload({
      stream: true
    }))
});

///////////////////////////////////////////////////////////////////////
gulp.task('fileinclude', function () {
  return gulp.src('app/html/[^_]*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: './'
    }))
    .pipe(gulp.dest('app'))
    .pipe(browserSync.reload({
      stream: true
    }))
});



gulp.task('script', function () {
  return gulp.src('app/js/*.js')
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('js', function () {
  return gulp.src([
      'node_modules/slick-carousel/slick/slick.js'
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: "app/"
    }
  });
});

gulp.task('export', async function () {
  let buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));

  let BuildCss = gulp.src('app/css/**/*.css')
    .pipe(gulp.dest('dist/css'));

  let BuildJs = gulp.src('app/js/**/*.js')
  .pipe(babel({
    presets: ['@babel/env']
}))
    .pipe(gulp.dest('dist/js'));

  let BuildFonts = gulp.src('app/fonts/**/*.*')
    .pipe(gulp.dest('dist/fonts'));

  let BuildImg = gulp.src('app/img/**/*.*')
    .pipe(gulp.dest('dist/img'));
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('watch', function () {
  gulp.watch('app/sass/**/*.sass', gulp.parallel('scss'))
  gulp.watch('app/*.html', gulp.parallel('html'))
  gulp.watch('app/html/*.html', gulp.parallel('fileinclude'))
  gulp.watch('app/js/*.js', gulp.parallel('script'))
});












gulp.task('build', gulp.series('clean', 'export'))

gulp.task('default', gulp.parallel('scss', 'js', 'browser-sync', 'watch'));