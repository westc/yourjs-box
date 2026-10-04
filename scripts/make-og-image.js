/**
 * Makes og-image.png (the picture shown when the landing page is shared) by
 * taking a screenshot of a page with a real console in Chrome.  Run it with
 * `npm run og-image` after `npm run build`.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { chromium } = require('playwright-core');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(ROOT, 'og-image.png');

const CODE = String.raw`
  // Objects can be expanded \\
  const team = [
    {name: 'Ada', role: 'Engineer'},
    {name: 'Grace', role: 'Admiral'},
  ];
  console.log(team);

  // Tables too \\
  console.table(team);

  // And the last value is shown \\
  team.map(person => person.name);

  // Your turn! \\
  console.log('Hello from YourJS Box!');
`;

// The same logo as in the console and on the landing page.
const LOGO_SVG = `<svg viewBox="0 0 32 32">
  <polygon points="1,10 8,3 31,3 24,10" fill="#4a4a4a"/>
  <polygon points="8,3 31,3 29,5 10,5" fill="#2e2e2e"/>
  <polygon points="24,10 31,3 31,24 24,31" fill="#c7b000"/>
  <rect x="1" y="10" width="23" height="21" rx="1.5" fill="#f7df1e"/>
  <text x="22" y="28.5" text-anchor="end" font-size="11.5" font-weight="800" letter-spacing="-0.3" fill="#1a1a1a">JS</text>
</svg>`;

(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'yourjs-box-og-'));
  const pagePath = path.join(dir, 'og.html');
  fs.writeFileSync(pagePath, `<!DOCTYPE html>
    <html><head><style>
      html, body { margin: 0; height: 100%; overflow: hidden; }
      body {
        background: radial-gradient(circle at 20% 10%, #2a2b2f, #17181a 70%);
        color: #e6e6e6;
        display: flex;
        font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        gap: 40px;
        padding: 56px;
        box-sizing: border-box;
      }
      .text { display: flex; flex: 0 0 410px; flex-direction: column; justify-content: center; }
      .logo { align-items: center; display: flex; font-size: 40px; font-weight: 700; gap: 16px; letter-spacing: -0.01em; }
      .logo svg { filter: drop-shadow(0 6px 12px rgb(0 0 0 / 0.35)); height: 68px; width: 68px; }
      .logo .your { font-weight: 400; opacity: 0.8; }
      h1 { font-size: 40px; letter-spacing: -0.03em; line-height: 1.12; margin: 30px 0 18px; }
      .highlight { background: linear-gradient(transparent 70%, rgb(247 223 30 / 0.35) 70%); }
      p { color: #9aa0a6; font-size: 19px; line-height: 1.5; margin: 0; }
      .console { border-radius: 10px; box-shadow: 0 12px 40px rgb(0 0 0 / 0.5); flex: 1; overflow: hidden; }
      .console iframe { display: block; }
    </style></head>
    <body>
      <div class="text">
        <div class="logo">${LOGO_SVG}<span><span class="your">Your</span>JS Box</span></div>
        <h1>A JavaScript console you can <span class="highlight">drop into any page</span></h1>
        <p>One script tag. Step-by-step code blocks. Output that looks just like the browser&rsquo;s dev tools.</p>
      </div>
      <div class="console">
        <script src="${path.join(ROOT, 'dist/yourjs-box.min.js')}" data-theme="dark" data-divider-orient="horizontal" data-loading="eager">${CODE}</script>
      </div>
    </body></html>`);

  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto('file://' + pagePath);
  await page.evaluate(() => Object.assign(document.querySelector('iframe').style, { height: '518px', width: '100%' }));
  const viewer = await (await page.waitForSelector('iframe')).contentFrame();
  await viewer.waitForFunction(() => document.querySelector('#splash')?.classList.contains('hidden'), null, { timeout: 30000 });

  // Makes the editor small so that the output has most of the room.
  await viewer.evaluate(() => document.querySelector('#vueApp')._vnode.component.proxy.dividerPct = '28%');

  // Runs every block except the last one, which is left in the editor.
  for (let i = 0; i < 3; i++) {
    await viewer.click('#bottomNav button.primary');
    await page.waitForTimeout(400);
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: OUTPUT });
  await browser.close();
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`Saved ${path.relative(ROOT, OUTPUT)}`);
})();
