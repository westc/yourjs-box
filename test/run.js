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
   * The text of each message in the console (not including code that ran),
   * prefixed with its type (eg. "error: ...").
   */
  messages() {
    return this.inViewer(() => [...document.querySelectorAll('.console-row:not(.code-row)')].map(row => {
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
  await t.click('#bottomNav button[title^="Reset"]');
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
