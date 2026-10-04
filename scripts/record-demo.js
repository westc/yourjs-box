/**
 * Records demo.gif (shown at the top of the README) by scripting a console in
 * Chrome and turning screenshots of it into a GIF with ffmpeg.  Run it with
 * `npm run record-demo` after `npm run build` (ffmpeg must be installed).
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { chromium } = require('playwright-core');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(ROOT, 'demo.gif');
const WIDTH = 900;
const HEIGHT = 460;

const CODE = String.raw`
  // Say hello \\
  console.log('Hello, world!');

  // Expand objects \\
  const people = [{name: 'Ada', born: 1815}, {name: 'Grace', born: 1906}];
  people

  // Show tables \\
  console.table(people);
`;

// A fake mouse pointer so that the clicks can be seen.
const CURSOR_SVG = '<svg width="22" height="22" viewBox="0 0 16 16"><path d="M2 1l11 7-5 1 3 5-2 1-3-5-4 3z" fill="#fff" stroke="#000" stroke-width="1"/></svg>';

(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'yourjs-box-demo-'));
  const pagePath = path.join(dir, 'demo.html');
  fs.writeFileSync(pagePath, `<!DOCTYPE html>
    <html><head><style>
      html, body { margin: 0; height: 100%; overflow: hidden; }
      #cursor { position: fixed; left: ${WIDTH * 0.6}px; top: ${HEIGHT * 0.6}px; z-index: 10; pointer-events: none;
        transition: left 0.6s ease-in-out, top 0.6s ease-in-out, transform 0.1s; }
      #cursor.pressed { transform: scale(0.8); }
    </style></head>
    <body>
      <script src="${path.join(ROOT, 'dist/yourjs-box.min.js')}" data-theme="dark" data-divider-orient="vertical">${CODE}</script>
      <div id="cursor">${CURSOR_SVG}</div>
    </body></html>`);

  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 2 });
  await page.goto('file://' + pagePath);
  const viewer = await (await page.waitForSelector('iframe')).contentFrame();
  await viewer.waitForFunction(() => document.querySelector('#splash')?.classList.contains('hidden'), null, { timeout: 30000 });
  await page.waitForTimeout(500);

  // Takes screenshots until stopped, remembering when each one was taken.
  const frames = [];
  let isRecording = true;
  const recording = (async () => {
    while (isRecording) {
      frames.push({ buffer: await page.screenshot(), time: Date.now() });
    }
  })();

  const wait = ms => page.waitForTimeout(ms);
  /** Moves the pointer to the (last) element in the console and clicks it. */
  async function click(selector, { offsetX = 0.5 } = {}) {
    const box = await viewer.evaluate(([s, x]) => {
      const rect = [...document.querySelectorAll(s)].pop().getBoundingClientRect();
      return { x: rect.left + rect.width * x, y: rect.top + rect.height / 2 };
    }, [selector, offsetX]);
    await page.evaluate(({ x, y }) => Object.assign(document.querySelector('#cursor').style, { left: x - 3 + 'px', top: y - 2 + 'px' }), box);
    await wait(750);
    await page.evaluate(() => document.querySelector('#cursor').classList.add('pressed'));
    await viewer.evaluate(s => [...document.querySelectorAll(s)].pop().click(), selector);
    await wait(120);
    await page.evaluate(() => document.querySelector('#cursor').classList.remove('pressed'));
  }
  const run = () => click('#bottomNav button.primary');

  await wait(600);
  await run();
  await wait(900);
  await run();
  await wait(700);
  await click('.js-value-header.expandable', { offsetX: 0.08 });
  await wait(1200);
  await run();
  await wait(1300);

  // Types code into the editor and runs it.
  await click('#editor .ace_content', { offsetX: 0.3 });
  await viewer.evaluate(() => ace.edit(document.querySelector('#editor .ace_editor')).focus());
  await page.keyboard.type('people.map(p => p.name)', { delay: 70 });
  await wait(500);
  await run();
  await wait(1300);
  await page.keyboard.type('people[2].name', { delay: 70 });
  await wait(500);
  await run();
  await wait(2500);

  isRecording = false;
  await recording;
  await browser.close();

  // Each frame is shown until the next one was taken.
  const list = frames.map(({ buffer, time }, index) => {
    const file = path.join(dir, `frame-${String(index).padStart(5, '0')}.png`);
    fs.writeFileSync(file, buffer);
    const duration = ((frames[index + 1]?.time ?? time + 100) - time) / 1000;
    return `file '${file}'\nduration ${duration}`;
  });
  // The concat demuxer ignores the last duration unless the file is repeated.
  list.push(list[list.length - 1].split('\n')[0]);
  fs.writeFileSync(path.join(dir, 'frames.txt'), list.join('\n'));

  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-f', 'concat', '-safe', '0', '-i', path.join(dir, 'frames.txt'),
    '-vf', `fps=12,scale=${WIDTH}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle`,
    '-loop', '0',
    OUTPUT,
  ], { stdio: 'inherit' });
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`Saved ${path.relative(ROOT, OUTPUT)} (${frames.length} frames, ${(fs.statSync(OUTPUT).size / 1024).toFixed(0)} KB)`);
})();
