# Changelog

All notable changes to YourJS Box are listed here, newest first.  The format
is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the
project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.10.0] - 2026-10-04

### Added

- `YourJSBox.from()` turns existing elements (eg. the code blocks in a page
  made from Markdown) into consoles that start with their code.  It takes a
  CSS selector, an element or a list of elements, reads options from each
  element's `data-*` attributes and turns on TypeScript for `language-ts`
  code blocks.

### Changed

- Consoles load Ace's minified build, which sends about 50 KB less.
- The loading screen no longer waits for the Prism stylesheets to load.

### Fixed

- The README called it "JS Box" in one place.

## [1.9.0] - 2026-10-04

### Added

- `console.log()` and the other logging functions support the format
  specifiers `%s`, `%d`, `%i`, `%f`, `%o`, `%O`, `%c` and `%%` like the
  browser's console.  `%c` only allows safe CSS (colors, fonts, borders,
  padding, etc.) and never anything that loads a URL.
- A message that is the same as the one logged right before it is shown once
  with a count.
- **Run all blocks** (<kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>Enter</kbd>
  or the **&#8943;** menu) runs the remaining blocks one at a time, in order
  with any hidden blocks.
- <kbd>Ctrl</kbd>+<kbd>L</kbd> clears the console.

### Changed

- New open box logo in the console, on the landing page and in the favicon.
- The console is called "YourJS Box" everywhere (no more "JS Box").
- Saved code is named `yourjs-box-code.js` (or `.ts`) by default and Copy as
  HTML downloads `yourjs-box.html`.

## [1.8.0] - 2026-10-04

### Added

- `data-loading="eager"` (or the `loading` option of `YourJSBox.create()`)
  loads a console right away.

### Changed

- Consoles wait until they are about to be scrolled into view (or, if hidden,
  shown) before loading, so a page with many consoles only loads the ones that
  are read.  Their space is kept while they wait.

## [1.7.0] - 2026-10-04

### Added

- TypeScript support with `data-language="typescript"` (or the `language`
  option of `YourJSBox.create()`).  Types are removed by Babel, which is only
  loaded by TypeScript consoles.  Errors point to the lines and columns in the
  TypeScript code, and Open, Save, the editor and the About window all know
  about the language.

## [1.6.0] - 2026-10-03

### Added

- A right-click menu for values in the output with Copy as JSON, Save as
  JSON, Store as global variable, Copy property path and Refresh.
- Command history:  like the browser's console, <kbd>&uarr;</kbd> at the very
  start of the editor shows the previous code that was run and
  <kbd>&darr;</kbd> at the very end goes forward again.
- A **History** button (<kbd>Alt</kbd>/<kbd>&#8997;</kbd>+<kbd>H</kbd>) that
  lists the code that was run so it can be put back into the editor.

### Changed

- The toolbar is now More, Clear, History, Layout, Full screen and Run.
- <kbd>Esc</kbd> closes whichever menu has focus and the arrow keys work in
  every menu.

## [1.5.0] - 2026-10-03

### Added

- **Open** loads a JavaScript file as the code that the console starts with.
- **Save** saves the code that already ran and the code in the editor as a
  file.
- Packages imported by name (eg. `import confetti from 'canvas-confetti'`)
  are loaded from esm.sh, or from the URL template in `data-imports-url`.
- Classic blocks that use import statements explain how to use
  `data-block-type="module"`.

## [1.4.0] - 2026-10-03

### Added

- The `YourJSBox` JavaScript API:  `YourJSBox.create()` creates a console
  relative to an element (with the placements fill, append, prepend, replace,
  before and after) and returns `{element, destroy}`.  `YourJSBox.version`
  reports the loaded version.
- A script tag in the head only provides the API, while one in the body is
  still replaced by a console.

### Changed

- Consoles are 100% of their container's height by default and never less
  than 150px.

## [1.3.1] - 2026-10-02

### Changed

- The layout button (editor beside or below the console) is back on the
  toolbar instead of in the **&#8943;** menu.

## [1.3.0] - 2026-10-02

### Added

- **Full screen**, which fills the page instead if the browser doesn't allow
  full screen.
- The **&#8943;** menu with the text size (remembered for each site), Copy as
  HTML, Reset and About.
- **Pop out into a window**, which moves the console into a separate window
  while its code keeps running in the page.

## [1.2.0] - 2026-10-02

### Added

- `data-block-type="module"` runs each block as a module so that top-level
  `await` and `import` work.  Classic blocks that use top-level `await`
  explain how to turn this on.
- The value of the last expression in each block is shown, like the
  browser's console.  `data-show-results="false"` turns this off.
- `console.dir()`, `dirxml()`, `assert()`, `count()`, `countReset()`,
  `time()`, `timeLog()`, `timeEnd()`, `trace()`, `group()`,
  `groupCollapsed()` and `groupEnd()`.
- `data-libraries-url` sets where Vue, Ace, Prism and Acorn are loaded from
  (eg. to host them yourself).
- The loading screen explains when the libraries fail to load.
- The About window lists the versions of the libraries.

### Changed

- The versions of Vue, Ace, Prism and Acorn are pinned.

### Fixed

- The built files only contain ASCII characters so that they work on pages
  that aren't UTF-8.

## [1.1.2] - 2026-10-02

### Changed

- Clicking the logo opens the About window (the separate info button is
  gone).

## [1.1.1] - 2026-10-02

### Fixed

- The built files said they were version 1.0.0.

## [1.1.0] - 2026-10-02

### Added

- An About window (opened from the toolbar) with the version, links, the
  console's settings and keyboard shortcuts.
- A **Copy as HTML** tab that gives the HTML for the console (with its
  current code, its original code or no code) as an embed snippet or a full
  page.

## [1.0.0] - 2026-10-02

The first release as `yourjs-box`.

### Added

- A browser console that is added to a page with one script tag, with code
  split into blocks by `// Header \\` comments and run one at a time.
- Code runs in a Web Worker by default or in the page itself with
  `data-runner="window"`.
- Output that looks like Chrome's dev tools, including expandable objects,
  `console.table()` and `console.clear()`.
- Light and dark themes that follow the system (or `data-theme`).
- Clear and Reset (which also stops infinite loops in worker mode).
- **Copy to editor** on code that already ran.
- Hidden blocks with `data-hide-prefix`.
- The editor beside the console, or below it when the console is narrower
  than 600px or with `data-divider-orient="horizontal"`.

[Unreleased]: https://github.com/westc/yourjs-box/compare/v1.10.0...HEAD
[1.10.0]: https://github.com/westc/yourjs-box/compare/v1.9.0...v1.10.0
[1.9.0]: https://github.com/westc/yourjs-box/compare/v1.8.0...v1.9.0
[1.8.0]: https://github.com/westc/yourjs-box/compare/v1.7.0...v1.8.0
[1.7.0]: https://github.com/westc/yourjs-box/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/westc/yourjs-box/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/westc/yourjs-box/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/westc/yourjs-box/compare/v1.3.1...v1.4.0
[1.3.1]: https://github.com/westc/yourjs-box/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/westc/yourjs-box/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/westc/yourjs-box/compare/v1.1.2...v1.2.0
[1.1.2]: https://github.com/westc/yourjs-box/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/westc/yourjs-box/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/westc/yourjs-box/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/westc/yourjs-box/releases/tag/v1.0.0
