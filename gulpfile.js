const gulp = require('gulp');
const gutil = require('gulp-util');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const wiredep = require('wiredep').stream;

const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');

const $ = gulpLoadPlugins();
const runSequence = require('run-sequence');
const reload = browserSync.reload;

const iconFont = require('gulp-iconfont');
const iconFontCss = require('gulp-iconfont-css');
const fileinclude = require('gulp-file-include');
const favicons = require('gulp-favicons');
const bootstrapTasks = ['lint', 'iconfont', 'images', 'fonts', 'extras', 'favicon', 'html'];

gulp.task('favicon', function () {
  return gulp.src('app/favicon.png').pipe(favicons({
    appName: 'joinYouTubeClips',
    appDescription: 'www.joinyoutubeclips.com',
    developerName: 'Jason Pescione <jpescione@gmail.com>',
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
  .pipe(gulp.dest('.tmp/favicons'))
  .pipe(gulp.dest('dist/favicons'));
});

gulp.task('iconfont', function(){
  var fontName = 'Icons';
  gulp.src(['app/icons/*.svg'])
    .pipe(iconFontCss({
      base: 'app',
      fontName: fontName,
      targetPath: '../../../app/styles/vendor/_icons.scss',
      fontPath: '../fonts/icons/'
    }))
    .pipe(iconFont({
      fontName: fontName,
      normalize: true,
     }))
    .pipe(gulp.dest('.tmp/fonts/icons'))
    .pipe(gulp.dest('dist/fonts/icons'));
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
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
  return browserify({debug: true})
    // .transform(babelify)
    .require('./app/scripts/main.js', {entry: true})
    .bundle()
    .on('error', function handleError(err) {
      console.error(err.toString());
      this.emit('end');
    })
    .pipe(source('main.js'))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}));
});

function lint(files, options) {
  return gulp.src(files)
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint(options))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/scripts/**/*.js', {
    fix: true
  })
  .pipe(gulp.dest('app/scripts'));
});
gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js', {
    fix: true,
    env: {
      mocha: true
    }
  })
  .pipe(gulp.dest('test/spec/**/*.js'));
});

gulp.task('html', (callback) => {
  runSequence(// 'favicon',
              ['scripts', 'styles'],
              '_html',
              callback);
});

gulp.task('_html', () => {
  return gulp.src('app/*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    // .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('.tmp'))
    .pipe(gulp.dest('dist'))
    .pipe(reload({stream: true}));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin()))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    'app/CNAME',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', bootstrapTasks, () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/**/*.html', ['_html']);
  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('app/icons/**/*', ['iconfont']);
  gulp.watch('app/favicon.png', ['favicon']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

gulp.task('serve:test', ['scripts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/scripts',
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', bootstrapTasks, () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('deploy', ['build'], () => {
  return gulp.src('dist')
    .pipe($.subtree())
    .pipe($.clean());
});

gulp.task('default', ['clean'], () => {
  gulp.start('serve');
});
