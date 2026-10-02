/**
 * Author: Chris West
 * Last Modified: 2024/02/13 00:26:31
 * Description:
 *   Responsible for updating the files in the dist directory.
 */

const gulp = require('gulp');
const babel = require('gulp-babel');
const babelCore = require('@babel/core');
const terser = require('terser');
const uglify = require('gulp-uglify');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const htmlMinifier = require('html-minifier');
const CleanCSS = require('clean-css');
const fs = require('fs');
const browserSync = require('browser-sync').create();

const cssIframeSrc = 'src/viewer-iframe.css';
const htmlIframeSrc = 'src/viewer-iframe.html';
const jsViewerIframeSrc = 'src/viewer-iframe.js';
const jsRunnerSrc = 'src/runner.js';
const jsSrc = 'src/main.js';
const dirDest = 'dist';
const jsDest = `${dirDest}/main.js`;

const babelOptions = {
  // presets: ['@babel/preset-env']
};

/** @type {{[key in ("CSS_VIEWER_IFRAME"|"HTML_VIEWER_IFRAME"|"JS_VIEWER_IFRAME"|"JS_VIEWER_IFRAME_MIN"|"JS_RUNNER"|"JS_RUNNER_MIN")]?: string}} */
const PLACEHOLDER_VALUES = {};


function getReplacer(useJsIframeMin=false) {
  return replace(
    /((?<=^|\r|\n)(?:(?!\r|\n)\s)*|)\[\[\s*(\w+)_FILE_PLACEHOLDER\s*\]\]/g,
    (_, prefix, type) => {
      const key = type + ((/^JS_(?:RUNNER|VIEWER_IFRAME)$/.test(type) && useJsIframeMin) ? '_MIN' : '');
      const result = PLACEHOLDER_VALUES[key];
      return prefix ? result.replace(/^/gm, prefix) : result;
    }
  );
}


// Define the placeholder values.
async function definePlaceholderValues() {
  // Read the content of the IFRAME JS files.
  const jsViewerIframeContent = fs.readFileSync(jsViewerIframeSrc, 'utf8');
  const jsRunnerContent = fs.readFileSync(jsRunnerSrc, 'utf8');

  Object.assign(PLACEHOLDER_VALUES, {
    CSS_VIEWER_IFRAME: JSON.stringify(new CleanCSS().minify(fs.readFileSync(cssIframeSrc, 'utf8')).styles),
    HTML_VIEWER_IFRAME: JSON.stringify(htmlMinifier.minify(fs.readFileSync(htmlIframeSrc, 'utf8'), {
      collapseWhitespace: true,
      removeComments: false,
    })),
    JS_VIEWER_IFRAME: jsViewerIframeContent,
    JS_RUNNER: jsRunnerContent,
    JS_VIEWER_IFRAME_MIN: (await terser.minify(
      babelCore.transformSync(jsViewerIframeContent, babelOptions).code
    )).code,
    JS_RUNNER_MIN: (await terser.minify(
      babelCore.transformSync(jsRunnerContent, babelOptions).code,
      // Keeps createRunner() from being dropped since it is only referenced
      // from main.js.
      { compress: { unused: false }, mangle: { reserved: ['createRunner'] } }
    )).code
  });
}

// Builds main.js with the minified IFRAME code.
function buildMiniJS() {
  return gulp.src(jsSrc)
    .pipe(getReplacer(true))
    .pipe(gulp.dest(dirDest));
}

// Builds main.full.js with the unminified IFRAME code.
function buildJS() {
  return gulp.src(jsSrc)
    .pipe(getReplacer())
    .pipe(rename({ suffix: '.full' }))
    .pipe(gulp.dest(dirDest));
}

// Builds main.min.js from main.js.
function minifyJS() {
  return gulp.src(jsDest)
    .pipe(babel(babelOptions))
    .pipe(uglify({
      compress: { unused: false },
      mangle: false
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(dirDest));
}

const build = gulp.series(definePlaceholderValues, buildMiniJS, buildJS, minifyJS);

gulp.task('build', build);

// Watch for changes and rebuild.
gulp.task('watch', function () {
  return gulp.watch(
    [cssIframeSrc, htmlIframeSrc, jsSrc, jsViewerIframeSrc, jsRunnerSrc],
    build
  );
});

// Serves the repo and reloads the browser whenever the dist files or the
// examples change.
gulp.task('serve', function (done) {
  browserSync.init({
    server: { baseDir: './' },
    startPath: '/examples/',
    files: [`${dirDest}/*.js`, 'examples/**/*.html'],
    listen: 'localhost',
    notify: false,
    open: false,
    ui: false,
  }, done);
});

// Default task: Build once and then watch for changes.
gulp.task('default', gulp.series('build', 'watch'));

// Build once, then watch for changes while serving the examples.
gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));
