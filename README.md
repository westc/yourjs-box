# yourjs-box

Embed an interactive JavaScript console on any web page with one script tag.
Step-by-step code blocks, DevTools-style output, and code that runs in a Web
Worker or the page itself.

**[Live demo](https://westc.github.io/yourjs-box/)** &middot;
[Examples](https://westc.github.io/yourjs-box/examples/)

## Usage

Add the script wherever you want the console to appear and put the code that
should be loaded into the console inside of the script tag:

```html
<div style="height: 400px;">
  <script src="https://cdn.jsdelivr.net/npm/yourjs-box@1/dist/yourjs-box.min.js">
    // Say hello \\
    console.log('Hello world!');

    // Show a table \\
    console.table([{name: 'John', age: 42}, {name: 'Jane', age: 37}]);
  </script>
</div>
```

The console fills its container.  The script is also available from unpkg at
`https://unpkg.com/yourjs-box@1/dist/yourjs-box.min.js`.

### Code Blocks

A comment line that ends with `\\` is a header.  Headers split the code into
blocks which are run one at a time each time the run button is clicked (or
<kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>Enter</kbd> is pressed in the editor).

Hovering over code that already ran shows a "Copy to editor" button which
copies that code into the editor so that it can be run again, as is or modified.
If the editor already has code in it you are asked before it is replaced.

### Toolbar

- **Clear** removes everything from the console.  Code can also call
  `console.clear()`.
- **Reset** clears the console and puts the original code back into the editor.
  In worker mode this also stops any code that is still running (eg. an
  infinite loop) by starting a new worker.
- The layout button switches between showing the editor below or beside the
  console.
- **Run** runs the next block of code.

### Attributes

| Attribute | Description |
| --- | --- |
| `data-runner` | `"worker"` (default) runs the code in a Web Worker.  `"window"` runs it directly in the page.  See below. |
| `data-divider-orient` | `"vertical"` (default) puts the editor beside the output.  `"horizontal"` puts it below. |
| `data-hide-prefix` | Any block whose header starts with this prefix is hidden. See below. |
| `data-theme` | `"light"` or `"dark"`.  Defaults to following the system's color scheme like the browser's dev tools. |

### Hidden Code

If `data-hide-prefix="HIDE"` is specified then a block with a header like
`// HIDE: Setup \\` will not be shown in the editor.  Instead it runs
automatically as soon as all of the code that came before it has run.  It shows
up in the output as a collapsed block labelled with whatever came after the
prefix (and optional colon), or "Hidden code" if nothing did.  Clicking the
label shows or hides the code.

### Where Code Runs

The console's interface is always in an IFRAME so that its styles and the
page's styles can't affect each other.  The code itself runs in one of two
places:

- **Web Worker** (`data-runner="worker"`, the default):  The code can't access
  the page.  There is no `document` or DOM, but everything else (timers,
  `fetch()`, promises, etc.) works.  Reset stops code that never finishes.
- **Window** (`data-runner="window"`):  The code runs directly in the page, so
  it can use the page's globals, functions and DOM.  Only use this with code you
  trust.  Since it replaces the page's `console` functions, the console also
  shows anything else the page logs, just like the browser's console.  Reset
  can't undo what the code already did to the page (eg. variables it defined).

In both modes, top-level declarations (`let`, `const`, `class`, etc.) are shared
between blocks.

## Development

Install the development dependencies by running `npm install`.

- `npm run dev` builds, rebuilds whenever one of the files in `src/` changes
  and serves the examples at http://localhost:3000/examples/ with the browser
  reloading automatically after each rebuild.
- `npm run build` builds the files in `dist/` once.
- `npm start` builds and then rebuilds whenever one of the files in `src/`
  changes (without serving anything).

The kitchen sink example (`examples/kitchen-sink.html`) has several consoles
which cover every feature.  Add `?build=standard` or `?build=min` to its URL to
test `dist/yourjs-box.js` or `dist/yourjs-box.min.js` instead of
`dist/yourjs-box.full.js`.

## Roadmap

- Open button - Load a JS file from the filesystem.
- Save button - Save the current inputs as a JS file that can be opened later.
- Add `@timeout` annotation to the special comments that will allow you to input the amount of seconds to wait since the last call to a console logging function before automatically running the next comment segmented block.
- Allow for TypeScript
- Allow for CoffeeScript
- Allow code to run in main window.

## License

Released under the [MIT License](LICENSE).  You're free to use, modify and
distribute it, including in commercial projects, as long as the copyright and
license notice is kept.

Copyright (c) 2023-present Christopher West
