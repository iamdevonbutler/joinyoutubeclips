const gulp = require('gulp');
const gutil = require('gulp-util');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');

const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const $ = gulpLoadPlugins();
const runSequence = require('run-sequence');
const reload = browserSync.reload;

const iconFont = require('gulp-iconfont');
const iconFontCss = require('gulp-iconfont-css');
const fileinclude = require('gulp-file-include');
const favicons = require('gulp-favicons');

const fullBoot = gutil.env.full;
var skinny = gutil.env.skinny; // compress stuff...

gulp.task('favicon', function () {
  return gulp.src('app/favicon.png').pipe(favicons({
    appName: 'joinYouTubeClips',
    appDescription: 'www.joinyoutubeclips.com',
    developerName: 'Jay Pescione <jpescione@gmail.com>',
    developerURL: 'https://github.com/iamdevonbutler',
    background: 'transparent',
    path: '/favicons/',
    html: '../../app/html/favicons.html',
    url: 'http://wwww.joinyoutubeclips.com/favicon.png',
    display: 'standalone',
    orientation: 'portrait',
    version: 2,
    versioning: true,
    logging: false,
    online: false,
    pipeHTML: true,
    replace: true
  }))
  .on('error', gutil.log)
  .pipe(gulp.dest('dist/favicons'));
});

// weird thing...iconFontCss wants the _icons.scss file to already exist.
gulp.task('iconfont', function(){
  var fontName = 'Icons';
  gulp.src(['app/icons/*.svg'], {base: 'app'})
    .pipe(iconFontCss({
      base: 'app',
      fontName: fontName,
      targetPath: '../../app/styles/vendor/_icons.scss',
      fontPath: '../icons/',
    }))
    .pipe(iconFont({
      fontName: fontName,
      normalize: true,
     }))
    .pipe(gulp.dest('dist/icons'));
});

gulp.task('styles', () => {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.if(skinny, $.cssnano()))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('scripts', () => {
  return browserify({debug: true})
    .transform(babelify)
    .require('./app/scripts/main.js', {entry: true})
    .bundle()
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe(source('main.js'))
    .pipe($.if(skinny, buffer()))
    .pipe($.if(skinny, $.uglify()))
    .pipe(gulp.dest('dist/scripts'));
});

function lint(files, options) {
  return gulp.src(files)
    .pipe($.eslint(options))
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/scripts/**/*.js');
});

gulp.task('html', () => {
  return gulp.src('app/*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe($.if(skinny, $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.if(skinny, $.cache($.imagemin())))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    'app/CNAME',
    'app/LICENSE',
    'app/robots.txt',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['dist']));

gulp.task('serve', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist'],
    }
  });

  gulp.watch([
    'dist/**/*',
  ]).on('change', reload);

  gulp.watch('app/**/*.html', ['html']);
  gulp.watch('app/images/**/*', ['images']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('app/icons/**/*', ['iconfont']);
  gulp.watch('app/styles/vendor/_icons.scss', ['styles']);
  gulp.watch('app/favicon.png', ['favicon']);
  gulp.watch('app/html/favicons.html', ['html']);
});

gulp.task('build', ['clean', 'lint'], () => {
  const preBuildTasks = ['images', 'styles', 'scripts', 'fonts', 'extras', 'favicon', 'iconfont'];
  runSequence(preBuildTasks, 'html', () => {
    return gulp.src('dist/**/*')
      .pipe($.size({title: 'build', gzip: true}));
  });
});

gulp.task('deploy', ['build'], () => {
  return gulp.src('dist')
    .pipe($.subtree())
    .pipe($.clean());
});

gulp.task('default', fullBoot ? ['clean', 'lint'] : ['lint'], () => {
  const preServeTasks = ['images', 'styles', 'scripts', 'fonts', 'extras'].concat(fullBoot ? ['favicon', 'iconfont'] : []);
  runSequence(preServeTasks, 'html', () => {
    gulp.start('serve');
  });
});
