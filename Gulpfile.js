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

const cssIframeSrc = 'src/viewer-iframe.css';
const htmlIframeSrc = 'src/viewer-iframe.html';
const jsViewerIframeSrc = 'src/viewer-iframe.js';
const jsRunnerIframeSrc = 'src/runner-iframe.js';
const jsSrc = 'src/main.js';
const dirDest = 'dist';
const jsDest = `${dirDest}/main.js`;

const babelOptions = {
  // presets: ['@babel/preset-env']
};

/** @type {{[key in ("CSS_VIEWER_IFRAME"|"HTML_VIEWER_IFRAME"|"JS_VIEWER_IFRAME"|"JS_VIEWER_IFRAME_MIN"|"JS_RUNNER_IFRAME"|"JS_RUNNER_IFRAME_MIN")]?: string}} */
const PLACEHOLDER_VALUES = {};


function getReplacer(useJsIframeMin=false) {
  return replace(
    /((?<=^|\r|\n)(?:(?!\r|\n)\s)*|)\[\[\s*(\w+)_FILE_PLACEHOLDER\s*\]\]/g,
    (_, prefix, type) => {
      const key = type + ((/^JS_(?:RUNN|VIEW)?ER_IFRAME$/.test(type) && useJsIframeMin) ? '_MIN' : '');
      const result = PLACEHOLDER_VALUES[key];
      return prefix ? result.replace(/^/gm, prefix) : result;
    }
  );
}


// Watch for changes and run the build-js task
gulp.task('watch', function () {
  gulp.watch(
    [cssIframeSrc, htmlIframeSrc, jsSrc, jsViewerIframeSrc, jsRunnerIframeSrc],
    gulp.series(

      // Define the placeholder values.
      async function definePlaceholderValues() {
        // Read the content of the IFRAME JS file.
        const jsViewerIframeContent = fs.readFileSync(jsViewerIframeSrc, 'utf8');
        const jsRunnerIframeContent = fs.readFileSync(jsRunnerIframeSrc, 'utf8');

        Object.assign(PLACEHOLDER_VALUES, {
          CSS_VIEWER_IFRAME: JSON.stringify(new CleanCSS().minify(fs.readFileSync(cssIframeSrc, 'utf8')).styles),
          HTML_VIEWER_IFRAME: JSON.stringify(htmlMinifier.minify(fs.readFileSync(htmlIframeSrc, 'utf8'), {
            collapseWhitespace: true,
            removeComments: false,
          })),
          JS_VIEWER_IFRAME: jsViewerIframeContent,
          JS_RUNNER_IFRAME: jsRunnerIframeContent,
          JS_VIEWER_IFRAME_MIN: (await terser.minify(
            babelCore.transformSync(jsViewerIframeContent, babelOptions).code
          )).code,
          JS_RUNNER_IFRAME_MIN: (await terser.minify(
            babelCore.transformSync(jsRunnerIframeContent, babelOptions).code
          )).code
        });
      },

      // Define a task to transpile and minify JavaScript
      async function buildMiniJS(done) {
        // Read the content of the HTML file
        const cssContent = new CleanCSS().minify(fs.readFileSync(cssIframeSrc, 'utf8')).styles;
        const htmlContent = htmlMinifier.minify(fs.readFileSync(htmlIframeSrc, 'utf8'), {
          collapseWhitespace: true,
          removeComments: false,
        });
      
        return gulp.src(jsSrc)
          .pipe(getReplacer(true))
          .pipe(gulp.dest(dirDest));
      },

      // Define a task to transpile and minify JavaScript
      function buildJS() {
        return gulp.src(jsSrc)
          .pipe(getReplacer())
          .pipe(rename({ suffix: '.full' }))
          .pipe(gulp.dest(dirDest));
      },

      async function minifyJS() {
        return gulp.src(jsDest)
          .pipe(babel(babelOptions))
          .pipe(uglify({
            compress: { unused: false },
            mangle: false
          }))
          .pipe(rename({ suffix: '.min' }))
          .pipe(gulp.dest(dirDest));
      }

    )
  );
});

// Default task: Run 'watch' as a default task
gulp.task('default', gulp.series('watch'));
