/**
 * Browser tests for the built files in dist/.  Run them with `npm test` which
 * builds first.  They use the installed copy of Google Chrome (set CHROME_PATH
 * to use a different Chromium based browser) and need an internet connection
 * because the console loads its libraries from CDNs.
 *
 * Run only some of the tests by passing part of their names:
 *   node test/run.js results module
 */

const assert = require('assert/strict');
const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright-core');

const ROOT = path.resolve(__dirname, '..');
const MIME_TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' };

/** @type {{name: string, fn: (t: TestContext) => Promise<void>}[]} */
const TESTS = [];
const test = (name, fn) => TESTS.push({ name, fn });

/**
 * Serves the repo so that the dist files and examples can be loaded.
 * @returns {Promise<http.Server>}
 */
function startServer() {
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    // Folders are served as empty pages which the tests use as a starting point.
    if (pathname.endsWith('/')) {
      res.writeHead(200, { 'Content-Type': 'text/html' }).end('<!DOCTYPE html>');
      return;
    }
    const filePath = path.join(ROOT, pathname);
    if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME_TYPES[path.extname(filePath)] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}

/**
 * Helpers for working with one console on a page.
 */
class TestContext {
  constructor(browser, baseUrl) {
    this.browser = browser;
    this.baseUrl = baseUrl;
  }

  /**
   * Opens a page containing one console.
   * @param {string} code
   * @param {{[name: string]: string}=} attributes
   *   The data attributes to put on the script tag (eg. `{runner: 'window'}`).
   * @param {{width?: number, routes?: [string, Function][]}=} options
   */
  async open(code, attributes = {}, options = {}) {
    await this.newPage(options);
    return this.load(code, attributes);
  }

  /**
   * Creates a new browser context with a blank page on the test server.
   * @param {{width?: number, routes?: [string, Function][]}=} options
   */
  async newPage(options = {}) {
    this.context = await this.browser.newContext({
      viewport: { width: options.width ?? 1200, height: 800 },
      permissions: ['clipboard-read', 'clipboard-write'],
      acceptDownloads: true,
    });
    for (const [url, handler] of options.routes ?? []) await this.context.route(url, handler);
    this.page = await this.context.newPage();
    // Every URL requested by the page (including the console's IFRAME).
    this.requestedUrls = [];
    this.page.on('request', request => this.requestedUrls.push(request.url()));
    // Gives the page a real URL so that relative URLs work.
    await this.page.goto(`${this.baseUrl}/test/`);
    this.dialogs = [];
    this.page.on('dialog', dialog => {
      this.dialogs.push(dialog.message());
      dialog.dismiss();
    });
  }

  /**
   * Replaces the page's content with the HTML (the dist file can be included
   * with `<script src="SRC">`) and waits for it to load.
   */
  async setPage(html) {
    await this.page.setContent(html.replace(/SRC/g, `${this.baseUrl}/dist/yourjs-box.min.js`), { waitUntil: 'load' });
  }

  /**
   * Uses the console in the given IFRAME (eg. one made by YourJSBox.create()).
   */
  async useConsole(iframeSelector) {
    this.viewer = await (await this.page.waitForSelector(iframeSelector)).contentFrame();
    await this.waitForConsole(this.viewer);
  }

  /**
   * Replaces the page's content with a new console (in the same browser
   * context so things like localStorage are kept).
   */
  async load(code, attributes = {}) {
    const attrs = Object.entries(attributes)
      .map(([name, value]) => ` data-${name.replace(/[A-Z]/g, c => '-' + c.toLowerCase())}="${value}"`)
      .join('');
    await this.page.setContent(
      `<!DOCTYPE html><html><body style="margin:0;height:100vh">`
      + `<h1 id="title">Host page</h1>`
      + `<div style="height:600px"><script src="${this.baseUrl}/dist/yourjs-box.min.js"${attrs}>\n${code}\n</script></div>`
      + `</body></html>`,
      { waitUntil: 'load' }
    );
    this.viewer = this.page.frames().find(frame => frame !== this.page.mainFrame());
    await this.viewer.waitForFunction(() => document.querySelector('#splash')?.classList.contains('hidden') || document.querySelector('#splash')?.classList.contains('failed'), null, { timeout: 20000 });
    return this;
  }

  async close() {
    await this.context?.close();
  }

  /** Evaluates a function in the console's IFRAME. */
  inViewer(fn, arg) {
    return this.viewer.evaluate(fn, arg);
  }

  editorCode() {
    return this.inViewer(() => ace.edit(document.querySelector('#editor .ace_editor')).getValue());
  }

  setEditorCode(code) {
    return this.inViewer(c => ace.edit(document.querySelector('#editor .ace_editor')).setValue(c, -1), code);
  }

  click(selector) {
    return this.inViewer(s => document.querySelector(s).click(), selector);
  }

  /** Clicks Run and waits for the block to finish running. */
  async run(times = 1) {
    for (let i = 0; i < times; i++) {
      await this.click('#bottomNav button.primary');
      await this.page.waitForTimeout(150);
      await this.viewer.waitForFunction(() => !document.querySelector('#bottomNav .spin'), null, { timeout: 10000 });
    }
    await this.page.waitForTimeout(150);
  }

  /** Sets the code in the editor and runs it. */
  async runCode(code) {
    await this.setEditorCode(code);
    await this.run();
  }

  /**
   * Right-clicks the value whose line starts with the text (the last one if
   * there are several) and returns the labels in its menu.
   */
  async rightClickValue(text) {
    await this.inViewer(t => {
      const header = [...document.querySelectorAll('.js-value-header')].filter(h => h.textContent.trim().startsWith(t)).pop();
      const {left, top} = header.getBoundingClientRect();
      header.dispatchEvent(new MouseEvent('contextmenu', {bubbles: true, cancelable: true, clientX: left + 5, clientY: top + 5}));
    }, text);
    await this.viewer.waitForSelector('.value-menu');
    return this.inViewer(() => [...document.querySelectorAll('.value-menu .menu-item')].map(item => item.textContent.trim()));
  }

  /** Clicks the item in the value menu that starts with the text. */
  async clickValueMenu(text) {
    await this.inViewer(t => [...document.querySelectorAll('.value-menu .menu-item')].find(item => item.textContent.trim().startsWith(t)).click(), text);
  }

  /** Expands the value whose line starts with the text and waits for it. */
  async expand(text) {
    await this.inViewer(t => [...document.querySelectorAll('.js-value-header.expandable')].filter(h => h.textContent.trim().startsWith(t)).pop().click(), text);
    await this.viewer.waitForFunction(() => !document.querySelector('.js-value .loading'));
  }

  /** Waits for a toast message and returns it. */
  async toast() {
    await this.viewer.waitForSelector('.toast');
    return this.inViewer(() => document.querySelector('.toast').textContent.trim());
  }

  /**
   * Opens the "More" menu and clicks the item that starts with the text.
   */
  async menu(text) {
    await this.click('#bottomNav .more-button');
    await this.inViewer(t => [...document.querySelectorAll('.more-menu .menu-item')].find(item => item.textContent.trim().startsWith(t)).click(), text);
  }

  /**
   * Waits for the console in a page or frame (eg. a pop-out window) to load.
   */
  async waitForConsole(frame) {
    await frame.waitForFunction(() => document.querySelector('#splash')?.classList.contains('hidden'), null, { timeout: 20000 });
  }

  /**
   * The text of each message in the console (not including code that ran),
   * prefixed with its type (eg. "error: ...").
   * @param {import('playwright-core').Frame=} frame
   *   Optional, defaults to the console's IFRAME.
   */
  messages(frame = this.viewer) {
    return frame.evaluate(() => [...document.querySelectorAll('.console-row:not(.code-row)')].map(row => {
      const type = (row.className.match(/\blog-(\w+)/) || [, row.classList.contains('notice') ? 'notice' : 'log'])[1];
      return `${type}: ${row.innerText.trim().replace(/\s*\n\s*/g, ' | ')}`;
    }));
  }

  /** The headers of the code that ran. */
  headers() {
    return this.inViewer(() => [...document.querySelectorAll('.code-header')].map(h => h.innerText.trim()));
  }
}

// ---------------------------------------------------------------------------

test('built files only contain ASCII characters', async () => {
  // Keeps them working when served without a charset on a page that isn't UTF-8.
  for (const file of fs.readdirSync(path.join(ROOT, 'dist'))) {
    const text = fs.readFileSync(path.join(ROOT, 'dist', file), 'utf8');
    const index = text.search(/[^\x00-\x7F]/);
    assert.equal(index, -1, `${file} has a non-ASCII character: ${JSON.stringify(text.slice(index - 20, index + 20))}`);
  }
});

test('logs values with browser-style previews', async t => {
  await t.open(String.raw`
    console.log('text', 42, null, {a: 1, nested: {b: 2}}, [1, 'two'], new Map([['k', 'v']]));
    class Person { constructor(name) { this.name = name; } }
    console.warn(new Person('Ada'));
    console.error('bad');
  `);
  await t.run();
  assert.deepEqual(await t.messages(), [
    "log: text | 42 | null | {a: 1, nested: {…}} | (2) [1, 'two'] | Map(1) {'k' => 'v'}",
    "warn: Person {name: 'Ada'}",
    'error: bad',
  ]);
});

test('expands objects including [[Prototype]]', async t => {
  await t.open(`console.log({a: 1})`);
  await t.run();
  await t.click('.row-content .js-value-header.expandable');
  await t.viewer.waitForFunction(() => document.querySelectorAll('.expansion .entry-key').length >= 2);
  const keys = await t.inViewer(() => [...document.querySelectorAll('.expansion .entry-key')].map(k => k.textContent));
  assert.deepEqual(keys, ['a', '[[Prototype]]']);
});

test('runs one block at a time and shares classic declarations', async t => {
  await t.open(String.raw`
    // First \\
    let x = 40;
    // Second \\
    console.log(x + 2);
  `);
  await t.run();
  assert.equal((await t.editorCode()).trim(), String.raw`// Second \\` + '\nconsole.log(x + 2);');
  await t.run();
  assert.deepEqual(await t.headers(), ['First', 'Second']);
  assert.deepEqual(await t.messages(), ['log: 42']);
});

test('runs hidden blocks in order', async t => {
  await t.open(String.raw`
    // HIDE: Setup \\
    console.log('setup');
    // Visible \\
    console.log('visible');
    // HIDE \\
    console.log('after visible');
  `, { hidePrefix: 'HIDE' });
  assert.deepEqual(await t.messages(), ['log: setup']);
  assert.ok(!(await t.editorCode()).includes('setup'));
  await t.run();
  await t.page.waitForTimeout(300);
  assert.deepEqual(await t.headers(), ['Setup', 'Visible', 'Hidden code']);
  assert.deepEqual(await t.messages(), ['log: setup', 'log: visible', 'log: after visible']);
});

test('shows console.table()', async t => {
  await t.open(`console.table([{name: 'Ada', age: 36}, {name: 'Grace'}])`);
  await t.run();
  const rows = await t.inViewer(() => [...document.querySelectorAll('.console-table tr')].map(tr => tr.innerText.trim().split(/\s+/)));
  assert.deepEqual(rows, [['(index)', 'name', 'age'], ['0', "'Ada'", '36'], ['1', "'Grace'"]]);
});

test('shows the other console functions', async t => {
  await t.open(String.raw`
    console.count(); console.count(); console.countReset(); console.count('x');
    console.assert(true, 'not shown');
    console.assert(false, 'shown', 1);
    console.time('t'); console.timeEnd('t');
    console.dir({a: 1});
    console.group('Outer');
    console.log('inside');
    console.groupCollapsed('Inner');
    console.log('hidden');
    console.groupEnd();
    console.groupEnd();
    console.log('outside');
  `);
  await t.run();
  const messages = await t.messages();
  assert.deepEqual(messages.slice(0, 5), ['count: default: 1', 'count: default: 2', 'count: x: 1', 'assert: Assertion failed: shown | 1', messages[4]]);
  assert.match(messages[4], /^timeEnd: t: [\d.]+ ms$/);
  assert.deepEqual(messages.slice(5), ['dir: {a: 1}', 'group: Outer', 'log: inside', 'groupCollapsed: Inner', 'log: outside']);
  await t.inViewer(() => [...document.querySelectorAll('.group-header')].find(g => g.innerText.includes('Inner')).click());
  assert.ok((await t.messages()).includes('log: hidden'));
});

test('reports errors with the block name in the stack trace', async t => {
  await t.open(String.raw`
    // Throw \\
    null.x;
    // Reject \\
    Promise.reject(new Error('nope'));
  `);
  await t.run(2);
  await t.page.waitForTimeout(300);
  // The rejected promise is also the result of the second block.
  const [thrown, result, rejected] = await t.messages();
  assert.match(thrown, /^error: Uncaught TypeError: .*\| at snippet-1\.js:1:/);
  assert.equal(result, 'result: Promise {…}');
  assert.match(rejected, /^error: Uncaught \(in promise\) Error: nope \| at snippet-2\.js:1:/);
});

test('keeps the original columns when the last expression throws', async t => {
  await t.open(`const team = [{}];\n  team[0].greet();`);
  await t.run();
  assert.match((await t.messages())[0], /at snippet-1\.js:2:11$/);
});

test('shows the value of the last expression', async t => {
  await t.open(String.raw`
    // Expression \\
    [1, 2, 3].map(n => n * 2)
    // undefined is not shown \\
    console.log('logged')
  `);
  await t.run(2);
  assert.deepEqual(await t.messages(), ['result: (3) [2, 4, 6]', 'log: logged']);
});

test('data-show-results="false" hides results', async t => {
  await t.open(`2 + 2`, { showResults: 'false' });
  await t.run();
  assert.deepEqual(await t.messages(), []);
});

test('module blocks allow top-level await and imports', async t => {
  await t.open(String.raw`
    // Await \\
    const value = await Promise.resolve(21);
    value * 2
    // Import \\
    import seven from 'data:text/javascript,export default 7';
    seven
    // Declarations stay in their block \\
    typeof value
  `, { blockType: 'module' });
  await t.run(3);
  assert.deepEqual(await t.messages(), ['result: 42', 'result: 7', "result: 'undefined'"]);
});

test('classic blocks explain how to use top-level await', async t => {
  await t.open(`await 1`);
  await t.run();
  assert.match((await t.messages())[0], /^error: Uncaught SyntaxError: .*data-block-type="module"/);
});

test('worker code cannot reach the page or the viewer', async t => {
  await t.open(String.raw`
    console.log(typeof document, typeof window);
    postMessage({target: 'viewer', func: 'eval', args: ['alert(1)']});
  `);
  await t.run();
  await t.page.waitForTimeout(300);
  assert.deepEqual(await t.messages(), ['log: undefined | undefined']);
  assert.deepEqual(t.dialogs, []);
});

test('window mode can use the page', async t => {
  await t.open(`document.querySelector('#title').textContent = 'Changed'`, { runner: 'window' });
  await t.run();
  assert.equal(await t.page.textContent('#title'), 'Changed');
  assert.deepEqual(await t.messages(), ["result: 'Changed'"]);
});

test('Reset stops an infinite loop and restores the code', async t => {
  const code = String.raw`
    // Loop \\
    while (true) {}
  `;
  await t.open(code);
  await t.click('#bottomNav button.primary');
  await t.page.waitForTimeout(500);
  assert.ok(await t.inViewer(() => !!document.querySelector('#bottomNav .spin')));
  await t.menu('Reset');
  await t.click('.dialog-button.primary');
  await t.viewer.waitForFunction(() => !document.querySelector('#bottomNav .spin'));
  assert.ok((await t.editorCode()).includes('while (true)'));
  await t.runCode(`console.log('still works')`);
  assert.deepEqual(await t.messages(), ['log: still works']);
});

test('Clear and console.clear() empty the console', async t => {
  await t.open(`console.log(1)`);
  await t.run();
  await t.click('#bottomNav button[title="Clear console"]');
  assert.deepEqual(await t.messages(), []);
  await t.runCode(`console.log(1); console.clear(); console.log(2)`);
  assert.deepEqual(await t.messages(), ['notice: Console was cleared', 'log: 2']);
});

test('Copy to editor asks before replacing code', async t => {
  await t.open(`console.log('first')`);
  await t.run();
  await t.click('.copy-to-editor-button');
  assert.equal(await t.editorCode(), "console.log('first')");
  await t.setEditorCode('keep me');
  await t.click('.copy-to-editor-button');
  assert.ok(await t.inViewer(() => !!document.querySelector('.dialog')));
  await t.click('.dialog-button.primary');
  assert.equal(await t.editorCode(), "console.log('first')");
});

test('Copy as HTML includes code that ran and the data attributes', async t => {
  await t.open(String.raw`
    // One \\
    console.log(1);
    // Two \\
    console.log(2);
  `, { theme: 'dark' });
  await t.run();
  await t.click('#bottomNav button[title="Clear console"]');
  await t.click('#bottomNav .logo-button');
  await t.inViewer(() => [...document.querySelectorAll('.tab')].find(tab => tab.textContent === 'Copy as HTML').click());
  await t.viewer.waitForFunction(() => document.querySelector('.export-preview .ace_editor'));
  const html = await t.inViewer(() => ace.edit(document.querySelector('.export-preview .ace_editor')).getValue());
  assert.match(html, /<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/yourjs-box@\d+\/dist\/yourjs-box\.min\.js" data-theme="dark">/);
  assert.match(html, /\/\/ One \\\\\n\s*console\.log\(1\);\n\n\s*\/\/ Two \\\\\n\s*console\.log\(2\);/);
});

test('stacks the editor below the console when narrow', async t => {
  await t.open(`1`, {}, { width: 500 });
  assert.ok(await t.inViewer(() => document.querySelector('#main').classList.contains('row-orient')));
  await t.page.setViewportSize({ width: 1200, height: 800 });
  await t.page.waitForTimeout(200);
  assert.ok(await t.inViewer(() => document.querySelector('#main').classList.contains('col-orient')));
});

test('data-libraries-url can point to another CDN', async t => {
  await t.open(`2 + 2`, { librariesUrl: 'https://cdn.jsdelivr.net/npm/{name}@{version}/' });
  await t.run();
  assert.deepEqual(await t.messages(), ['result: 4']);
  assert.equal(t.requestedUrls.filter(url => url.startsWith('https://unpkg.com/')).length, 0);
  assert.ok(t.requestedUrls.some(url => url.startsWith('https://cdn.jsdelivr.net/npm/acorn@')));
});

test('data-libraries-url can point to files on the same site', async t => {
  // Serves /vendor/{name}/... (like a copy of node_modules) from the real
  // packages using the versions in src/main.js.
  const versions = Object.fromEntries(
    [...fs.readFileSync(path.join(ROOT, 'src/main.js'), 'utf8').matchAll(/'([\w-]+)': '(\d+\.\d+\.\d+)'/g)]
      .map(([, name, version]) => [name, version])
  );
  const vendorRoute = async route => {
    const [, name, filePath] = new URL(route.request().url()).pathname.match(/^\/vendor\/([^/]+)\/(.+)$/);
    route.fulfill({ response: await route.fetch({ url: `https://unpkg.com/${name}@${versions[name]}/${filePath}` }) });
  };
  await t.open(`console.log('hi'); 1 + 1`, { librariesUrl: '/vendor/{name}/' }, { routes: [['**/vendor/**', vendorRoute]] });
  await t.run();
  assert.deepEqual(await t.messages(), ['log: hi', 'result: 2']);
  // Ace's mode and Prism's language are loaded from next to the main files.
  await t.viewer.waitForFunction(() => ace.edit(document.querySelector('#editor .ace_editor')).session.getMode().$id === 'ace/mode/javascript');
  const vendorFiles = t.requestedUrls.filter(url => url.includes('/vendor/')).map(url => url.replace(/^.*\/vendor\//, ''));
  for (const file of ['vue/dist/vue.global.prod.js', 'ace-builds/src-noconflict/mode-javascript.js', 'prismjs/components/prism-javascript.min.js', 'acorn/dist/acorn.js']) {
    assert.ok(vendorFiles.includes(file), `${file} was not loaded from /vendor/`);
  }
  assert.equal(t.requestedUrls.filter(url => /unpkg|jsdelivr/.test(url)).length, 0);
});

test('About lists the library versions and Copy as HTML leaves out data-libraries-url', async t => {
  await t.open(`1`, { librariesUrl: 'https://cdn.jsdelivr.net/npm/{name}@{version}/', theme: 'dark' });
  await t.click('#bottomNav .logo-button');
  assert.match(await t.inViewer(() => document.querySelector('.about-footer').innerText), /Vue \d+\.\d+\.\d+, Ace \d+\.\d+\.\d+,\s+Prism \d+\.\d+\.\d+ and Acorn \d+\.\d+\.\d+/);
  await t.inViewer(() => [...document.querySelectorAll('.tab')].find(tab => tab.textContent === 'Copy as HTML').click());
  await t.viewer.waitForFunction(() => document.querySelector('.export-preview .ace_editor'));
  const html = await t.inViewer(() => ace.edit(document.querySelector('.export-preview .ace_editor')).getValue());
  assert.ok(html.includes('data-theme="dark"'));
  assert.ok(!html.includes('data-libraries-url'));
});

test('the More menu changes the text size and remembers it', async t => {
  await t.open(`console.log('hi')`);
  await t.run();
  await t.click('#bottomNav .more-button');
  for (let i = 0; i < 2; i++) await t.inViewer(() => document.querySelector('.menu-item[title="Bigger text"]').click());
  assert.equal(await t.inViewer(() => document.querySelector('.menu-percent').textContent.trim()), '130%');
  assert.equal(await t.inViewer(() => getComputedStyle(document.querySelector('#displays > div')).fontSize), '15.6px');
  assert.equal(await t.inViewer(() => ace.edit(document.querySelector('#editor .ace_editor')).getFontSize()), 16);
  // Escape closes the menu.
  await t.inViewer(() => document.querySelector('.more-menu').dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true})));
  assert.ok(await t.inViewer(() => !document.querySelector('.more-menu')));
  // Another console on the same site uses the same text size.
  await t.load(`1`);
  assert.equal(await t.inViewer(() => getComputedStyle(document.querySelector('#displays > div')).fontSize), '15.6px');
});

test('the layout button switches where the editor is', async t => {
  await t.open(`1`, {}, { width: 1200 });
  assert.ok(await t.inViewer(() => document.querySelector('#main').classList.contains('col-orient')));
  await t.click('#bottomNav button[title="Show the editor below the console"]');
  assert.ok(await t.inViewer(() => document.querySelector('#main').classList.contains('row-orient')));
  await t.viewer.waitForSelector('#bottomNav button[title="Show the editor beside the console"]');
  await t.click('#bottomNav button[title="Show the editor beside the console"]');
  assert.ok(await t.inViewer(() => document.querySelector('#main').classList.contains('col-orient')));
});

test('full screen uses the browser\'s full screen', async t => {
  await t.open(`1`);
  await t.click('#bottomNav button[title="Full screen"]');
  await t.viewer.waitForFunction(() => !!document.fullscreenElement);
  await t.viewer.waitForSelector('#bottomNav button[title="Exit full screen"]');
  await t.click('#bottomNav button[title="Exit full screen"]');
  await t.viewer.waitForFunction(() => !document.fullscreenElement);
});

test('full screen fills the page if the browser\'s full screen is not allowed', async t => {
  await t.open(`1`);
  await t.inViewer(() => document.documentElement.requestFullscreen = () => Promise.reject(new Error('Not allowed')));
  await t.click('#bottomNav button[title="Full screen"]');
  await t.page.waitForTimeout(200);
  const iframeBox = () => t.page.evaluate(() => {
    const {position} = document.querySelector('iframe').style;
    const {width, height} = document.querySelector('iframe').getBoundingClientRect();
    return {position, width, height};
  });
  assert.deepEqual(await iframeBox(), {position: 'fixed', width: 1200, height: 800});
  await t.inViewer(() => dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'})));
  await t.page.waitForTimeout(200);
  assert.equal((await iframeBox()).position, '');
});

test('pop out keeps running code in the page (window mode)', async t => {
  await t.open(String.raw`
    // Before \\
    console.log('before');
    // In the pop-out window \\
    document.querySelector('#title').textContent = 'Changed from the pop-out';
  `, { runner: 'window' });
  await t.run();
  const [popOut] = await Promise.all([t.context.waitForEvent('page'), t.menu('Pop out')]);
  await t.waitForConsole(popOut.mainFrame());
  assert.ok(await t.inViewer(() => !!document.querySelector('.popped-out')));
  assert.deepEqual(await t.messages(popOut.mainFrame()), ['log: before']);
  await popOut.evaluate(() => document.querySelector('#bottomNav button.primary').click());
  await popOut.waitForTimeout(500);
  assert.equal(await t.page.textContent('#title'), 'Changed from the pop-out');
  // Closing the window brings the console (including the new output) back.
  await popOut.close({ runBeforeUnload: true });
  await t.viewer.waitForFunction(() => !document.querySelector('.popped-out'));
  assert.deepEqual(await t.messages(), ['log: before', "result: 'Changed from the pop-out'"]);
});

test('pop out keeps the worker\'s variables and can be brought back', async t => {
  await t.open(`let x = 5`);
  await t.run();
  const [popOut] = await Promise.all([t.context.waitForEvent('page'), t.menu('Pop out')]);
  await t.waitForConsole(popOut.mainFrame());
  await popOut.evaluate(() => ace.edit(document.querySelector('#editor .ace_editor')).setValue('x * 2', -1));
  await popOut.evaluate(() => document.querySelector('#bottomNav button.primary').click());
  await popOut.waitForTimeout(500);
  assert.deepEqual(await t.messages(popOut.mainFrame()), ['result: 10']);
  await t.inViewer(() => [...document.querySelectorAll('.popped-out button')].find(b => b.textContent.includes('Bring it back')).click());
  await t.viewer.waitForFunction(() => !document.querySelector('.popped-out'));
  await popOut.waitForEvent('close', { timeout: 5000 }).catch(() => {});
  assert.ok(popOut.isClosed());
  assert.deepEqual(await t.messages(), ['result: 10']);
});

test('a script in the head only provides YourJSBox', async t => {
  await t.newPage();
  await t.setPage('<!DOCTYPE html><html><head><script src="SRC"></script></head><body><div id="lesson"></div></body></html>');
  assert.equal(await t.page.evaluate(() => document.querySelectorAll('iframe').length), 0);
  const version = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version;
  assert.deepEqual(await t.page.evaluate(() => [YourJSBox.version, Object.isFrozen(YourJSBox), typeof YourJSBox.create]), [version, true, 'function']);
});

test('a script in the body creates a console and provides YourJSBox', async t => {
  await t.open(`1`);
  assert.equal(await t.page.evaluate(() => typeof YourJSBox.create), 'function');
});

test('YourJSBox.create() fills a target found by a selector', async t => {
  await t.newPage();
  await t.setPage('<!DOCTYPE html><html><head><script src="SRC"></script></head><body><div id="lesson" style="height: 320px"><p>Loading...</p></div></body></html>');
  await t.page.evaluate(() => YourJSBox.create({target: '#lesson', code: '2 + 2', theme: 'dark'}));
  await t.useConsole('#lesson > iframe');
  assert.deepEqual(await t.page.evaluate(() => [...document.querySelector('#lesson').children].map(e => e.tagName)), ['IFRAME']);
  assert.equal(await t.page.evaluate(() => document.querySelector('#lesson > iframe').getBoundingClientRect().height), 320);
  await t.run();
  assert.deepEqual(await t.messages(), ['result: 4']);
  assert.equal(await t.inViewer(() => document.documentElement.dataset.theme), 'dark');
});

test('YourJSBox.create() supports every placement', async t => {
  await t.newPage();
  await t.setPage('<!DOCTYPE html><html><head><script src="SRC"></script></head><body><div id="wrap"></div></body></html>');
  const structures = await t.page.evaluate(() => {
    const describe = el => el.id ? `${el.tagName}#${el.id}` : el.tagName;
    const result = {};
    for (const placement of ['fill', 'append', 'prepend', 'replace', 'before', 'after']) {
      const wrap = document.querySelector('#wrap');
      wrap.innerHTML = '<p></p><div id="target"><span></span></div><p></p>';
      const box = YourJSBox.create({target: document.querySelector('#target'), placement});
      result[placement] = [...wrap.children].map(el => describe(el) + (el.id === 'target' ? `(${[...el.children].map(describe).join(',')})` : '')).join(' ');
      box.destroy();
    }
    return result;
  });
  assert.deepEqual(structures, {
    fill: 'P DIV#target(IFRAME) P',
    append: 'P DIV#target(SPAN,IFRAME) P',
    prepend: 'P DIV#target(IFRAME,SPAN) P',
    replace: 'P IFRAME P',
    before: 'P IFRAME DIV#target(SPAN) P',
    after: 'P DIV#target(SPAN) IFRAME P',
  });
});

test('YourJSBox.create() heights default to 100% with a 150px minimum', async t => {
  await t.newPage();
  await t.setPage('<!DOCTYPE html><html><head><script src="SRC"></script></head><body><div id="tall" style="height: 300px"></div><div id="auto"></div><div id="short" style="height: 50px"></div><div id="sized"></div></body></html>');
  const heights = await t.page.evaluate(() => {
    const heightOf = box => box.element.getBoundingClientRect().height;
    return {
      tall: heightOf(YourJSBox.create({target: '#tall'})),
      auto: heightOf(YourJSBox.create({target: '#auto'})),
      short: heightOf(YourJSBox.create({target: '#short'})),
      sized: heightOf(YourJSBox.create({target: '#sized', height: 250})),
    };
  });
  assert.deepEqual(heights, {tall: 300, auto: 150, short: 150, sized: 250});
});

test('YourJSBox.create() explains bad targets and placements', async t => {
  await t.newPage();
  await t.setPage('<!DOCTYPE html><html><head><script src="SRC"></script></head><body><div id="lesson"></div></body></html>');
  const errors = await t.page.evaluate(() => [
    {target: '#missing'},
    {target: 42},
    {target: '#lesson', placement: 'inside'},
  ].map(options => {
    try {
      YourJSBox.create(options);
      return 'no error';
    }
    catch (e) {
      return `${e.name}: ${e.message}`;
    }
  }));
  assert.deepEqual(errors, [
    'TypeError: YourJSBox.create(): no element matches the target "#missing".',
    'TypeError: YourJSBox.create(): target must be an element or a CSS selector.',
    'TypeError: YourJSBox.create(): placement must be one of fill, append, prepend, replace, before, after.',
  ]);
});

test('destroy() removes the console and restores the page\'s console in window mode', async t => {
  await t.newPage();
  await t.setPage('<!DOCTYPE html><html><head><script src="SRC"></script></head><body><div id="lesson" style="height: 300px"></div></body></html>');
  await t.page.evaluate(() => window.box = YourJSBox.create({target: '#lesson', runner: 'window', code: 'console.log(1)'}));
  await t.useConsole('#lesson > iframe');
  const isNative = () => t.page.evaluate(() => ['log', 'warn', 'error', 'table'].every(key => /\[native code\]/.test(console[key])));
  assert.equal(await isNative(), false);
  await t.page.evaluate(() => box.destroy());
  assert.equal(await t.page.evaluate(() => document.querySelectorAll('iframe').length), 0);
  assert.equal(await isNative(), true);
});

test('Copy as HTML includes the options given to YourJSBox.create()', async t => {
  await t.newPage();
  await t.setPage('<!DOCTYPE html><html><head><script src="SRC"></script></head><body><div id="lesson" style="height: 400px"></div></body></html>');
  await t.page.evaluate(() => YourJSBox.create({target: '#lesson', code: 'console.log(1)', theme: 'dark', hidePrefix: 'SETUP', showResults: false, language: 'typescript'}));
  await t.useConsole('#lesson > iframe');
  await t.click('#bottomNav .logo-button');
  await t.inViewer(() => [...document.querySelectorAll('.tab')].find(tab => tab.textContent === 'Copy as HTML').click());
  await t.viewer.waitForFunction(() => document.querySelector('.export-preview .ace_editor'));
  const html = await t.inViewer(() => ace.edit(document.querySelector('.export-preview .ace_editor')).getValue());
  assert.match(html, /<script src="[^"]+" data-hide-prefix="SETUP" data-language="typescript" data-show-results="false" data-theme="dark">/);
});

/**
 * Answers requests for packages with small modules (so the tests don't
 * depend on esm.sh) that export the specifier that was requested.
 * @param {string} prefix
 *   The part of the URL before the specifier.
 */
function fakePackages(prefix) {
  return route => {
    const specifier = decodeURIComponent(route.request().url().slice(prefix.length));
    route.fulfill({
      contentType: 'text/javascript',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: `export default ${JSON.stringify('loaded ' + specifier)}; export const name = ${JSON.stringify(specifier)};`,
    });
  };
}

test('packages can be imported by name in module blocks', async t => {
  const prefix = 'https://packages.example.com/';
  await t.open(String.raw`
    // Static import \\
    import pkg, {name} from 'some-pkg@1/sub';
    pkg
    // Dynamic import \\
    (await import('@scope/other')).name
    // Paths and URLs are left alone \\
    import seven from 'data:text/javascript,export default 7';
    seven
  `, { blockType: 'module', importsUrl: prefix + '{specifier}' }, { routes: [[prefix + '**', fakePackages(prefix)]] });
  await t.run(3);
  assert.deepEqual(await t.messages(), ["result: 'loaded some-pkg@1/sub'", "result: '@scope/other'", 'result: 7']);
});

test('packages are loaded from esm.sh by default and can be imported in classic blocks', async t => {
  const prefix = 'https://esm.sh/';
  await t.open(String.raw`
    // Dynamic import \\
    import('lodash').then(m => console.log(m.default));
    // Import statements need module blocks \\
    import x from 'lodash';
  `, {}, { routes: [[prefix + '**', fakePackages(prefix)]] });
  await t.run(2);
  await t.page.waitForTimeout(300);
  const messages = await t.messages();
  assert.ok(messages.includes('log: loaded lodash'), messages.join('\n'));
  assert.ok(messages.some(m => /^error: Uncaught SyntaxError: .*To use import statements, add data-block-type="module"/.test(m)), messages.join('\n'));
});

test('an empty data-imports-url leaves imports alone', async t => {
  await t.open(`import('some-pkg').catch(e => console.log(e.name))`, { importsUrl: '' });
  await t.run();
  await t.page.waitForTimeout(300);
  assert.deepEqual(await t.messages(), ['result: Promise {…}', 'log: TypeError']);
});

test('Save saves the current code', async t => {
  await t.open(String.raw`
    // One \\
    console.log(1);
    // Two \\
    console.log(2);
  `);
  await t.run();
  // Pretends to be the browser's "Save as" dialog.
  await t.inViewer(() => window.showSaveFilePicker = async options => {
    window.saved = {suggestedName: options.suggestedName, text: ''};
    return {name: 'lesson.js', createWritable: async () => ({write: async text => saved.text += text, close: async () => {}})};
  });
  await t.menu('Save');
  await t.viewer.waitForFunction(() => window.saved?.text);
  const saved = await t.inViewer(() => saved);
  assert.equal(saved.suggestedName, 'js-box.js');
  assert.equal(saved.text, String.raw`// One \\` + '\nconsole.log(1);\n\n' + String.raw`// Two \\` + '\nconsole.log(2);\n');

  // Without the dialog the file is downloaded (named after the last save).
  await t.inViewer(() => window.showSaveFilePicker = undefined);
  const [download] = await Promise.all([t.page.waitForEvent('download'), t.menu('Save')]);
  assert.equal(download.suggestedFilename(), 'lesson.js');
  assert.equal(fs.readFileSync(await download.path(), 'utf8'), saved.text);
});

test('Open makes a file the code the console starts with', async t => {
  await t.open(`console.log('page code')`, { hidePrefix: 'HIDE' });
  await t.run();
  await t.viewer.setInputFiles('input.file-input', {
    name: 'lesson.js',
    mimeType: 'text/javascript',
    buffer: Buffer.from(String.raw`// HIDE: Setup \\` + '\nconsole.log("setup");\n' + String.raw`// Step 1 \\` + '\nconsole.log("step 1");\n'),
  });
  // There was output so it asks first.
  await t.viewer.waitForSelector('.dialog');
  assert.match(await t.inViewer(() => document.querySelector('.dialog-title').textContent), /Open lesson\.js\?/);
  await t.click('.dialog-button.primary');
  await t.viewer.waitForFunction(() => document.querySelectorAll('.console-row:not(.code-row)').length === 1);
  assert.deepEqual(await t.messages(), ['log: setup']);
  const opened = await t.editorCode();
  assert.equal(opened, String.raw`// Step 1 \\` + '\nconsole.log("step 1");');
  // Reset goes back to the opened file.
  await t.run();
  await t.menu('Reset');
  await t.click('.dialog-button.primary');
  await t.page.waitForTimeout(300);
  assert.equal(await t.editorCode(), opened);
  assert.deepEqual(await t.messages(), ['log: setup']);
});

test('right-clicking a value shows what can be done with it', async t => {
  await t.open(`console.log({count: 1})`);
  await t.run();
  assert.deepEqual(await t.rightClickValue('{count: 1}'), ['Copy as JSON', 'Save as JSON…', 'Store as global variable', 'Refresh']);
  await t.inViewer(() => dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'})));
  assert.ok(await t.inViewer(() => !document.querySelector('.value-menu')));
  await t.expand('{count: 1}');
  assert.deepEqual(await t.rightClickValue('count: 1'), ['Copy as JSON', 'Save as JSON…', 'Store as global variable', 'Copy property path']);
});

const CIRCULAR_CODE = `
  const a = {name: 'a', list: [1, 2], shared: null};
  const shared = {x: 1};
  a.shared = [shared, shared];
  a.self = a;
  a.list.push(a);
  a.m = new Map([['k', 1]]);
  a.s = new Set([1]);
  a.big = 10n;
  console.log(a);
`;
const CIRCULAR_JSON = JSON.stringify({name: 'a', list: [1, 2, null], shared: [{x: 1}, {x: 1}], m: [['k', 1]], s: [1], big: '10'}, null, 2);

test('Copy as JSON leaves out circular references', async t => {
  await t.open(CIRCULAR_CODE);
  await t.run();
  await t.rightClickValue("{name: 'a'");
  await t.clickValueMenu('Copy as JSON');
  assert.equal(await t.toast(), 'Copied as JSON (2 circular references were left out)');
  assert.equal(await t.page.evaluate(() => navigator.clipboard.readText()), CIRCULAR_JSON);
});

test('Save as JSON saves the value as a file', async t => {
  await t.open(`console.log({people: [{name: 'Ada'}]})`);
  await t.run();
  await t.inViewer(() => window.showSaveFilePicker = async options => {
    window.saved = {suggestedName: options.suggestedName, text: ''};
    return {createWritable: async () => ({write: async text => saved.text += text, close: async () => {}})};
  });
  await t.expand('{people:');
  await t.rightClickValue('people:');
  await t.clickValueMenu('Save as JSON');
  assert.equal(await t.toast(), 'Saved as JSON');
  const saved = await t.inViewer(() => saved);
  assert.deepEqual(saved, {suggestedName: 'people.json', text: JSON.stringify([{name: 'Ada'}], null, 2) + '\n'});
});

test('Store as global variable lets code use the value', async t => {
  await t.open(CIRCULAR_CODE);
  await t.run();
  await t.rightClickValue("{name: 'a'");
  await t.clickValueMenu('Store as global variable');
  await t.viewer.waitForFunction(() => document.querySelector('.notice'));
  await t.runCode('temp1.self === temp1 && temp1.name');
  await t.rightClickValue("{name: 'a'");
  await t.clickValueMenu('Store as global variable');
  await t.page.waitForTimeout(300);
  assert.deepEqual((await t.messages()).filter(m => !m.startsWith('log:')), [
    'notice: Stored as the global variable temp1',
    "result: 'a'",
    'notice: Stored as the global variable temp2',
  ]);
});

test('Store as global variable puts the variable on the page in window mode', async t => {
  await t.open(`console.log({fromThePage: true})`, { runner: 'window' });
  await t.run();
  await t.rightClickValue('{fromThePage: true}');
  await t.clickValueMenu('Store as global variable');
  await t.viewer.waitForFunction(() => document.querySelector('.notice'));
  assert.deepEqual(await t.page.evaluate(() => window.temp1), {fromThePage: true});
});

test('Copy property path copies the path to properties and items', async t => {
  await t.open(String.raw`
    // Objects \\
    console.log({people: [{name: 'Ada', 'first name': 'Ada'}], map: new Map([['k', {v: 1}]])});
    // Prototype members \\
    class Person { greet() {} }
    console.log(new Person());
  `);
  await t.run(2);
  const copiedPath = async text => {
    await t.rightClickValue(text);
    await t.clickValueMenu('Copy property path');
    await t.toast();
    return t.page.evaluate(() => navigator.clipboard.readText());
  };
  await t.expand('{people:');
  await t.expand('people:');
  await t.expand('0:');
  assert.equal(await copiedPath("name: 'Ada'"), 'people[0].name');
  assert.equal(await copiedPath("first name: 'Ada'"), 'people[0]["first name"]');
  await t.expand('map:');
  assert.ok(!(await t.rightClickValue("'k':")).includes('Copy property path'));
  await t.inViewer(() => dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'})));
  await t.expand('Person {}');
  await t.expand('[[Prototype]]');
  assert.equal(await copiedPath('greet:'), 'greet');
});

test('Refresh shows the value as it is now', async t => {
  await t.open(String.raw`
    // Log it \\
    globalThis.o = {a: 1};
    console.log(o);
    // Change it \\
    o.a = 10;
    o.b = 2;
  `);
  await t.run();
  await t.expand('{a: 1}');
  await t.run();
  await t.rightClickValue('{a: 1}');
  await t.clickValueMenu('Refresh');
  await t.viewer.waitForFunction(() => [...document.querySelectorAll('.js-value-header')].some(h => h.textContent.trim() === '{a: 10, b: 2}'));
  // It stays expanded and shows the new properties.
  await t.viewer.waitForFunction(() => [...document.querySelectorAll('.expansion .js-value-header')].some(h => h.textContent.trim() === 'b: 2'));
});

const THREE_BLOCKS = String.raw`
  // One \\
  console.log(1);
  // Two \\
  console.log(2);
  // Three \\
  console.log(3);
`;
const block = (header, code) => String.raw`// ${header} \\` + '\n' + code;

test('the up and down arrows go through the history', async t => {
  await t.open(THREE_BLOCKS);
  await t.run(2);
  await t.inViewer(() => ace.edit(document.querySelector('#editor .ace_editor')).focus());
  const press = async key => {
    await t.page.keyboard.press(key);
    return t.editorCode();
  };
  // The cursor is at the start after running so up goes back.
  assert.equal(await press('ArrowUp'), block('Two', 'console.log(2);'));
  assert.equal(await press('ArrowUp'), block('One', 'console.log(1);'));
  assert.equal(await press('ArrowUp'), block('One', 'console.log(1);'));
  // Down only goes forward when the cursor is at the very end.
  assert.equal(await press('ArrowDown'), block('One', 'console.log(1);'));
  await t.inViewer(() => ace.edit(document.querySelector('#editor .ace_editor')).navigateFileEnd());
  assert.equal(await press('ArrowDown'), block('Two', 'console.log(2);'));
  // Past the newest, the unrun code comes back.
  assert.equal(await press('ArrowDown'), block('Three', 'console.log(3);'));
  // Up in the middle of the code just moves the cursor.
  await t.inViewer(() => ace.edit(document.querySelector('#editor .ace_editor')).moveCursorTo(1, 3));
  assert.equal(await press('ArrowUp'), block('Three', 'console.log(3);'));
});

test('running code from the history brings back the unrun code', async t => {
  await t.open(String.raw`
    // One \\
    console.log(1);
    // Two \\
    console.log(2);
    // HIDE \\
    console.log('hidden after two');
    // Three \\
    console.log(3);
  `, { hidePrefix: 'HIDE' });
  await t.run();
  const unrunCode = await t.editorCode();
  await t.inViewer(() => ace.edit(document.querySelector('#editor .ace_editor')).focus());
  await t.page.keyboard.press('ArrowUp');
  await t.run();
  assert.equal(await t.editorCode(), unrunCode);
  // Running it again didn't count as running "Two" so the hidden block waits.
  assert.deepEqual(await t.messages(), ['log: 1', 'log: 1']);
  await t.run();
  assert.deepEqual(await t.messages(), ['log: 1', 'log: 1', 'log: 2', 'log: hidden after two']);
});

test('the history list shows earlier code and Alt+H opens it', async t => {
  await t.open(THREE_BLOCKS);
  await t.run(2);
  await t.inViewer(() => ace.edit(document.querySelector('#editor .ace_editor')).focus());
  await t.page.keyboard.press('Alt+KeyH');
  await t.viewer.waitForSelector('.history-panel');
  assert.deepEqual(await t.inViewer(() => [...document.querySelectorAll('.history-label')].map(e => e.textContent)), ['Two', 'One']);
  // The editor didn't get a character typed into it.
  assert.equal(await t.editorCode(), block('Three', 'console.log(3);'));
  await t.inViewer(() => [...document.querySelectorAll('.history-item')].find(item => item.textContent.includes('One')).click());
  assert.ok(await t.inViewer(() => !document.querySelector('.history-panel')));
  assert.equal(await t.editorCode(), block('One', 'console.log(1);'));
  // The toolbar button opens it too.
  await t.click('#bottomNav .history-button');
  assert.ok(await t.inViewer(() => !!document.querySelector('.history-panel')));
});

test('the toolbar buttons are in order', async t => {
  await t.open(`1`);
  const titles = await t.inViewer(() => [...document.querySelectorAll('#bottomNav .buttons button')].map(b => b.title.replace(/ \(.*\)$/, '')));
  assert.deepEqual(titles, ['More', 'Clear console', 'History', 'Show the editor below the console', 'Full screen', 'Run the next block of code']);
});

test('TypeScript has its types removed before it runs', async t => {
  await t.open(String.raw`
    // Types \\
    interface Person { name: string; age?: number }
    enum Color { Red, Green }
    const people: Person[] = [{name: 'Ann'}];
    function first<T>(items: T[]): T { return items[0]; }
    first<Person>(people).name as string
    // Declarations are shared between classic blocks \\
    namespace Shapes { export const sides = 4; }
    [Color.Green, Color[0], Shapes.sides]
  `, { language: 'typescript' });
  await t.run(2);
  assert.deepEqual(await t.messages(), ["result: 'Ann'", "result: (3) [1, 'Red', 4]"]);
  assert.deepEqual(await t.inViewer(() => [
    ace.edit(document.querySelector('#editor .ace_editor')).session.getMode().$id,
    document.querySelector('.code-row code').className,
  ]), ['ace/mode/typescript', 'language-typescript']);
  assert.ok(t.requestedUrls.some(url => url.includes('/@babel/standalone@')));
});

test('JavaScript consoles do not load Babel', async t => {
  await t.open(`1`);
  assert.ok(!t.requestedUrls.some(url => url.includes('babel')));
});

test('TypeScript errors point to the TypeScript code', async t => {
  await t.open(String.raw`
    // Runtime error \\
    function getX(a: number, point: {x: number} | null): number { return point!.x; }
    getX(1, null)
    // Syntax error \\
    let count: = 1;
  `, { language: 'typescript' });
  await t.run(2);
  const [runtime, syntax] = await t.messages();
  // The columns are the ones in the TypeScript code (not the compiled code).
  assert.match(runtime, /^error: Uncaught TypeError: .* \| at getX \(snippet-1\.ts:1:77\) \| at snippet-1\.ts:2:1$/);
  assert.equal(syntax, 'error: Uncaught SyntaxError: Unexpected token | at snippet-2.ts:1:12');
});

test('TypeScript classic blocks explain how to use top-level await', async t => {
  await t.open(`const n: number = await 1;`, { language: 'typescript' });
  await t.run();
  assert.match((await t.messages())[0], /^error: Uncaught SyntaxError: 'await' .*data-block-type="module"/);
});

test('TypeScript module blocks keep imports unless they only import types', async t => {
  await t.open(String.raw`
    import type { Thing } from 'not-a-real-package';
    import seven from 'data:text/javascript,export default 7';
    const value: number = await Promise.resolve(seven * 6);
    value
  `, { language: 'typescript', blockType: 'module' });
  await t.run();
  assert.deepEqual(await t.messages(), ['result: 42']);
  assert.ok(!t.requestedUrls.some(url => url.includes('not-a-real-package')));

  await t.inViewer(() => window.showSaveFilePicker = async options => {
    window.saved = options;
    return {name: 'lesson.ts', createWritable: async () => ({write: async () => {}, close: async () => {}})};
  });
  await t.menu('Save');
  await t.viewer.waitForFunction(() => window.saved);
  assert.deepEqual(await t.inViewer(() => [saved.suggestedName, saved.types[0].accept]), ['js-box.ts', {'text/typescript': ['.ts', '.mts']}]);

  await t.click('#bottomNav .logo-button');
  assert.match(await t.inViewer(() => document.querySelector('.about-body').innerText), /Language\s+TypeScript[\s\S]*Babel 7\./);
});

test('the kitchen sink switches examples and options', async t => {
  await t.newPage();
  await t.page.goto(`${t.baseUrl}/examples/kitchen-sink.html`);
  await t.useConsole('#console > iframe');
  assert.match(await t.page.textContent('#version'), /^v\d+\.\d+\.\d+ · yourjs-box\.full\.js$/);

  // An example sets the options that it needs.
  await t.page.selectOption('#example', 'typescript');
  await t.useConsole('#console > iframe');
  assert.equal(await t.page.inputValue('select[name="language"]'), 'typescript');
  assert.equal(await t.inViewer(() => ace.edit(document.querySelector('#editor .ace_editor')).session.getMode().$id), 'ace/mode/typescript');
  await t.page.selectOption('select[name="theme"]', 'dark');
  await t.useConsole('#console > iframe');
  assert.equal(await t.inViewer(() => document.documentElement.dataset.theme), 'dark');
  assert.match(await t.page.textContent('#embed-code'), /data-language="typescript"\n\s+data-theme="dark">/);
  assert.equal(new URL(t.page.url()).search, '?example=typescript&language=typescript&theme=dark');

  // The options are kept when the page is reloaded (eg. to switch builds).
  await t.page.selectOption('select[name="build"]', 'min');
  await t.page.waitForURL(/build=min/);
  await t.useConsole('#console > iframe');
  assert.match(await t.page.textContent('#version'), /yourjs-box\.min\.js$/);
  assert.equal(await t.page.inputValue('#example'), 'typescript');
  assert.equal(await t.inViewer(() => document.documentElement.dataset.theme), 'dark');

  // Window mode can change the page.
  await t.page.selectOption('#example', 'window');
  await t.useConsole('#console > iframe');
  await t.run(2);
  assert.equal(await t.page.textContent('#page-box'), 'Changed by the console!');
});

test('consoles load when they are about to be scrolled into view', async t => {
  await t.newPage();
  await t.setPage(`<!DOCTYPE html><html><body style="margin:0">
    <div style="height:3000px">Spacer</div>
    <div style="height:400px"><script src="SRC" data-runner="window">console.log('loaded')</script></div>
  </body></html>`);
  await t.page.waitForTimeout(500);
  // Nothing is loaded and the page's console isn't captured yet.
  assert.equal(await t.page.evaluate(() => document.querySelector('iframe').srcdoc), '');
  assert.ok(!t.requestedUrls.some(url => url.includes('/vue@')));
  assert.ok(await t.page.evaluate(() => `${console.log}`.includes('[native code]')));

  await t.page.evaluate(() => document.querySelector('iframe').scrollIntoView());
  await t.useConsole('iframe');
  await t.run();
  assert.deepEqual(await t.messages(), ['log: loaded']);
});

test('data-loading="eager" loads consoles that are out of view', async t => {
  await t.newPage();
  await t.setPage(`<!DOCTYPE html><html><body style="margin:0">
    <div style="height:3000px">Spacer</div>
    <div style="height:400px"><script src="SRC" data-loading="eager">1 + 1</script></div>
  </body></html>`);
  await t.useConsole('iframe');
  await t.run();
  assert.deepEqual(await t.messages(), ['result: 2']);
});

test('a console in a hidden element loads once it is shown', async t => {
  await t.newPage();
  await t.setPage('<!DOCTYPE html><html><head><script src="SRC"></script></head><body><div id="tab" style="display:none;height:400px"></div></body></html>');
  await t.page.evaluate(() => YourJSBox.create({target: '#tab', code: '"sho" + "wn"'}));
  await t.page.waitForTimeout(500);
  assert.equal(await t.page.evaluate(() => document.querySelector('#tab iframe').srcdoc), '');
  await t.page.evaluate(() => document.querySelector('#tab').style.display = 'block');
  await t.useConsole('#tab iframe');
  await t.run();
  assert.deepEqual(await t.messages(), ["result: 'shown'"]);
});

test('explains when the libraries fail to load', async t => {
  await t.open(`1`, {}, { routes: [['https://unpkg.com/**', route => route.abort()]] });
  assert.ok(await t.inViewer(() => document.querySelector('#splash').classList.contains('failed')));
});

// ---------------------------------------------------------------------------

(async () => {
  const filters = process.argv.slice(2).map(f => f.toLowerCase());
  const tests = TESTS.filter(({ name }) => !filters.length || filters.some(f => name.toLowerCase().includes(f)));
  const server = await startServer();
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' });
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  let failures = 0;
  for (const { name, fn } of tests) {
    const t = new TestContext(browser, baseUrl);
    const start = Date.now();
    try {
      await fn(t);
      console.log(`✓ ${name} (${Date.now() - start} ms)`);
    }
    catch (e) {
      failures++;
      console.log(`✗ ${name}\n    ${`${e.message}`.replace(/\n/g, '\n    ')}`);
    }
    finally {
      await t.close();
    }
  }
  await browser.close();
  server.close();
  console.log(`\n${tests.length - failures} passed, ${failures} failed`);
  process.exit(failures ? 1 : 0);
})();
