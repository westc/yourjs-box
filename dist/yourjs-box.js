/*! yourjs-box v1.0.0 | (c) 2023-present Christopher West | MIT License | https://github.com/westc/yourjs-box */
(() => {
  /**
   * Viewer IFRAME's CSS code
   * @type {string}
   */
  const VIEWER_IFRAME_CSS = "[v-cloak]{display:none}body,html{height:100%;margin:0}body{background-color:var(--console-bg);font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif}#vueApp{display:flex;flex-direction:column;inset:0;position:fixed}#main{display:grid;flex-grow:1;gap:0;min-height:0;position:relative}#main.is-moving-divider{-webkit-user-select:none;user-select:none}#main.col-orient.is-moving-divider{cursor:col-resize}#main.row-orient.is-moving-divider{cursor:row-resize}#main.is-moving-divider::after{background-color:var(--accent);content:'';position:absolute;z-index:99}#main.col-orient.is-moving-divider::after{bottom:0;left:calc(100% - var(--temp-editor-pct) - var(--divider-size)/ 2 - 1px);top:0;width:2px}#main.row-orient.is-moving-divider::after{height:2px;left:0;right:0;top:calc(100% - var(--temp-editor-pct) - var(--divider-size)/ 2 - 1px)}#main.col-orient{grid-template-columns:1fr var(--divider-size) calc(var(--editor-pct) - var(--divider-size)/ 2);grid-template-rows:1fr}#main.row-orient{grid-template-columns:1fr;grid-template-rows:1fr var(--divider-size) calc(var(--editor-pct) - var(--divider-size)/ 2)}.divider{background-color:var(--divider-bg);box-sizing:border-box;position:relative;transition:background-color .15s}#main.col-orient .divider{border-left:1px solid var(--toolbar-border);border-right:1px solid var(--toolbar-border);cursor:col-resize}#main.row-orient .divider{border-bottom:1px solid var(--toolbar-border);border-top:1px solid var(--toolbar-border);cursor:row-resize}.divider::after{background-color:var(--divider-grip);border-radius:2px;content:'';left:50%;position:absolute;top:50%;transform:translate(-50%,-50%);transition:background-color .15s}#main.col-orient .divider::after{height:32px;width:2px}#main.row-orient .divider::after{height:2px;width:32px}#main.is-moving-divider .divider,.divider:hover{background-color:var(--divider-hover-bg)}#main.is-moving-divider .divider::after,.divider:hover::after{background-color:var(--accent)}#displays{position:relative}#displays>div{position:absolute;inset:0;overflow:auto}#bottomNav{align-items:center;background-color:var(--toolbar-bg);border-top:1px solid var(--toolbar-border);color:var(--toolbar-text);display:flex;flex:0 0 auto;font-size:12px;gap:8px;height:32px;padding:0 6px 0 8px;-webkit-user-select:none;user-select:none}#bottomNav>.brand{align-items:center;display:flex;flex-grow:1;gap:8px}.runner-badge{border:1px solid var(--toolbar-border);border-radius:999px;color:var(--muted-text);font-size:10px;letter-spacing:.04em;line-height:15px;padding:0 6px;text-transform:uppercase}#bottomNav>.buttons{align-items:center;display:flex;gap:2px}#bottomNav .separator{background-color:var(--toolbar-border);height:16px;margin:0 4px;width:1px}#bottomNav button{align-items:center;background:0 0;border:0;border-radius:4px;color:inherit;cursor:pointer;display:inline-flex;font:inherit;gap:5px;height:24px;justify-content:center;min-width:26px;padding:0 6px}#bottomNav button>span:not(.label){display:inline-flex;font-size:14px}#bottomNav button svg:not(.spin){transform:none!important}#bottomNav button:hover:not(:disabled){background-color:var(--button-hover)}#bottomNav button:disabled{cursor:not-allowed;opacity:.45}#bottomNav button.primary{background-color:var(--accent);color:var(--accent-text);font-weight:600;margin-left:2px;padding:0 10px 0 8px}#bottomNav button.primary>span:not(.label){font-size:11px}#bottomNav button.primary:hover:not(:disabled){background-color:var(--accent-hover)}#bottomNav button:focus-visible{outline:2px solid var(--accent);outline-offset:1px}.spin{animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}.logo{align-items:center;color:var(--toolbar-text);display:inline-flex;font-weight:700;gap:5px;letter-spacing:-.01em;line-height:1}.logo-mark{align-items:flex-end;background-color:#f7df1e;border-radius:3px;box-sizing:border-box;color:#1a1a1a;display:inline-flex;font-size:9.5px;font-weight:800;height:18px;justify-content:flex-end;letter-spacing:-.02em;padding:0 2px 2px 0;width:18px}.logo-text{font-size:14px}.logo-large{gap:12px}.logo-large>.logo-mark{border-radius:10px;box-shadow:0 8px 24px rgb(0 0 0 / .18);font-size:24px;height:56px;padding:0 6px 5px 0;width:56px}.logo-large>.logo-text{font-size:36px}#splash{align-items:center;background-color:var(--console-bg);display:flex;inset:0;justify-content:center;position:fixed;transition:opacity .35s ease,visibility .35s;z-index:1000}#splash.hidden{opacity:0;visibility:hidden}.splash-content{align-items:center;animation:splash-in .4s ease-out both;display:flex;flex-direction:column;gap:24px}.splash-progress{background-color:var(--toolbar-border);border-radius:3px;height:3px;overflow:hidden;width:140px}.splash-progress>div{animation:splash-progress 1.1s ease-in-out infinite;background-color:var(--accent);border-radius:inherit;height:100%;width:40%}@keyframes splash-in{from{opacity:0;transform:translateY(6px)}}@keyframes splash-progress{from{transform:translateX(-100%)}to{transform:translateX(250%)}}.dialog-backdrop{align-items:center;animation:fade-in .12s ease-out;background-color:var(--backdrop);display:flex;inset:0;justify-content:center;position:fixed;z-index:900}.dialog{animation:dialog-in .15s ease-out;background-color:var(--dialog-bg);border:1px solid var(--toolbar-border);border-radius:8px;box-shadow:0 12px 40px rgb(0 0 0 / .3);color:var(--console-text);font-size:13px;padding:16px;width:min(360px,calc(100% - 32px))}.dialog-title{font-size:14px;font-weight:600;margin-bottom:6px}.dialog-message{color:var(--muted-text);line-height:1.45}.dialog-buttons{display:flex;gap:8px;justify-content:flex-end;margin-top:16px}.dialog-button{background:0 0;border:1px solid var(--toolbar-border);border-radius:4px;color:inherit;cursor:pointer;font:inherit;height:28px;padding:0 12px}.dialog-button:hover{background-color:var(--button-hover)}.dialog-button.primary{background-color:var(--accent);border-color:var(--accent);color:var(--accent-text);font-weight:600}.dialog-button.primary:hover{background-color:var(--accent-hover)}.dialog-button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}#bottomNav button.logo-button{margin-left:-4px;padding:0 4px}#bottomNav button.info-button{color:var(--muted-text);min-width:24px;padding:0 4px}#bottomNav button.info-button:hover{color:var(--toolbar-text)}.about-dialog{display:flex;flex-direction:column;max-height:calc(100% - 24px);padding:0;width:min(620px,calc(100% - 24px))}.about-dialog.is-export{height:min(560px,calc(100% - 24px))}.about-header{align-items:center;border-bottom:1px solid var(--toolbar-border);display:flex;flex:0 0 auto;padding:0 8px 0 12px}.tabs{display:flex;flex-grow:1;gap:4px}.tab{background:0 0;border:0;border-bottom:2px solid transparent;color:var(--muted-text);cursor:pointer;font:inherit;font-weight:600;padding:10px 8px 8px}.tab:hover{color:var(--console-text)}.tab.active{border-bottom-color:var(--accent);color:var(--console-text)}.close-button{align-items:center;background:0 0;border:0;border-radius:4px;color:var(--muted-text);cursor:pointer;display:inline-flex;font-size:16px;height:28px;justify-content:center;width:28px}.close-button:hover{background-color:var(--button-hover);color:var(--console-text)}.close-button:focus-visible,.segmented>button:focus-visible,.tab:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}.about-body{flex:1 1 auto;min-height:0;overflow:auto;padding:16px}.about-title{align-items:center;display:flex;gap:12px}.logo-medium>.logo-mark{border-radius:7px;font-size:16px;height:40px;padding:0 4px 4px 0;width:40px}.logo-medium>.logo-text{display:none}.about-name{font-size:17px;font-weight:700}.about-aka{color:var(--muted-text);font-size:13px;font-weight:400;margin-left:4px}.about-version{color:var(--muted-text);font-size:12px}.about-description{line-height:1.5;margin:12px 0}.about-links{display:flex;flex-wrap:wrap;gap:6px 16px}.about-links a{color:var(--accent);font-weight:600;text-decoration:none}.about-links a:hover{text-decoration:underline}.about-body h3{color:var(--muted-text);font-size:11px;letter-spacing:.05em;margin:18px 0 6px;text-transform:uppercase}.about-details{display:grid;gap:4px 16px;grid-template-columns:max-content 1fr;margin:0}.about-details dt{color:var(--muted-text)}.about-details dd{margin:0}.about-details kbd{background-color:var(--toolbar-bg);border:1px solid var(--toolbar-border);border-bottom-width:2px;border-radius:4px;font-family:inherit;font-size:11px;padding:0 4px}.about-footer{border-top:1px solid var(--toolbar-border);color:var(--muted-text);font-size:12px;margin-top:18px;padding-top:12px}.export-body{display:flex;flex-direction:column;gap:10px}.export-options{display:flex;flex-wrap:wrap;gap:8px;justify-content:space-between}.segmented{border:1px solid var(--toolbar-border);border-radius:6px;display:inline-flex;overflow:hidden}.segmented>button{background:0 0;border:0;color:var(--muted-text);cursor:pointer;font:inherit;font-size:12px;font-weight:600;padding:5px 10px}.segmented>button+button{border-left:1px solid var(--toolbar-border)}.segmented>button:hover{background-color:var(--button-hover)}.segmented>button.active{background-color:var(--accent);color:var(--accent-text)}.export-note{color:var(--muted-text);font-size:12px}.export-preview{border:1px solid var(--toolbar-border);border-radius:6px;flex:1 1 auto;min-height:120px;overflow:hidden}.export-actions{display:flex;gap:8px;justify-content:flex-end}@keyframes fade-in{from{opacity:0}}@keyframes dialog-in{from{opacity:0;transform:scale(.96)}}.rotated-90deg{transform:rotate(90deg)}.align-top{vertical-align:top!important}.d-inline-block{display:inline-block!important}.d-block{display:block!important}.d-flex{display:flex!important}.d-inline-flex{display:inline-flex!important}.no-select{-webkit-user-select:none;user-select:none}:root{color-scheme:light;--console-font:ui-monospace,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;--console-bg:#fff;--console-text:#1f1f1f;--row-border:#f0f0f0;--arrow:#727272;--chevron:#9aa0a6;--entry-key:#881391;--preview-key:#5f6368;--string:#c41a16;--number:#1a1aa6;--null:#80868b;--header-bg:#f1f3f4;--header-text:#3c4043;--warn-bg:#fffbe5;--warn-border:#fff5c2;--warn-text:#5c3c00;--warn-icon:#e8a600;--error-bg:#fff0f0;--error-border:#ffd6d6;--error-text:#dc362e;--error-icon:#dc362e;--table-header-bg:#f3f3f3;--table-border:#d0d0d0;--toolbar-bg:#f3f3f3;--toolbar-border:#d6d6d6;--toolbar-text:#333;--muted-text:#5f6368;--button-hover:rgb(0 0 0 / 0.08);--accent:#1a73e8;--accent-hover:#1765cc;--accent-text:#fff;--divider-bg:#f3f3f3;--divider-hover-bg:#e8eaed;--divider-grip:#b0b0b0;--dialog-bg:#fff;--backdrop:rgb(0 0 0 / 0.25)}:root[data-theme=dark]{color-scheme:dark;--console-bg:#242424;--console-text:#e3e3e3;--row-border:#3a3a3a;--arrow:#9aa0a6;--chevron:#80868b;--entry-key:#5db0d7;--preview-key:#9aa0a6;--string:#f28b54;--number:#9980ff;--null:#8e8e8e;--header-bg:#2d2e30;--header-text:#c4c7c5;--warn-bg:#332b00;--warn-border:#665500;--warn-text:#ffd17a;--warn-icon:#ffd17a;--error-bg:#290000;--error-border:#5c0000;--error-text:#ff8080;--error-icon:#ff6b6b;--table-header-bg:#2e2e2e;--table-border:#4a4a4a;--toolbar-bg:#2b2b2b;--toolbar-border:#474747;--toolbar-text:#e3e3e3;--muted-text:#9aa0a6;--button-hover:rgb(255 255 255 / 0.1);--accent:#8ab4f8;--accent-hover:#aecbfa;--accent-text:#202124;--divider-bg:#2b2b2b;--divider-hover-bg:#333;--divider-grip:#6b6b6b;--dialog-bg:#2d2e30;--backdrop:rgb(0 0 0 / 0.5)}#displays{background-color:var(--console-bg);color:var(--console-text)}#displays>div{font-family:var(--console-font);font-size:12px;line-height:16px}.console-row{border-bottom:1px solid var(--row-border);padding:2px 8px 2px 24px;position:relative;white-space:pre-wrap;word-break:break-word}.console-row>.row-icon{left:6px;line-height:0;position:absolute;top:4px}.log-error,.log-warn{margin-top:-1px}.log-warn{background-color:var(--warn-bg);border-bottom-color:var(--warn-border);border-top:1px solid var(--warn-border);color:var(--warn-text)}.log-warn>.row-icon{color:var(--warn-icon)}.log-error{background-color:var(--error-bg);border-bottom-color:var(--error-border);border-top:1px solid var(--error-border);color:var(--error-text)}.log-error>.row-icon{color:var(--error-icon)}.code-header{background-color:var(--header-bg);border-bottom:1px solid var(--row-border);color:var(--header-text);font-weight:700;padding:2px 8px;white-space:pre-wrap}.code-header.toggleable{cursor:pointer}.code-row .copy-to-editor-button{align-items:center;background-color:var(--console-bg);border:1px solid var(--toolbar-border);border-radius:4px;color:var(--toolbar-text);cursor:pointer;display:inline-flex;height:22px;justify-content:center;opacity:0;padding:0;position:absolute;right:6px;top:2px;transition:opacity .15s;width:22px}.code-row .copy-to-editor-button:focus-visible,.code-row:hover .copy-to-editor-button{opacity:1}.code-row .copy-to-editor-button:hover{background-color:var(--toolbar-bg)}@media (hover:none){.code-row .copy-to-editor-button{opacity:.8}}.notice{color:var(--null);font-style:italic}.code-row>.row-icon{color:var(--chevron)}.code-row code,.code-row pre{background:0 0!important;font-family:var(--console-font)!important;font-size:12px!important;line-height:16px!important;padding:0!important;text-shadow:none!important}.js-value{max-width:100%;vertical-align:top}.row-content>.js-value+.js-value{margin-left:1ch}.js-value-header.expandable{cursor:default}.js-value .expansion{padding-left:12px}.js-value .loading{color:var(--null);padding-left:12px}.arrow{display:inline-block;height:10px;position:relative;width:12px}.arrow.expandable::before{border-color:transparent transparent transparent var(--arrow);border-style:solid;border-width:4px 0 4px 6px;content:'';left:2px;position:absolute;top:1px;transform-origin:3px 4px;transition:transform .1s}.arrow.expandable.expanded::before{transform:rotate(90deg)}.entry-key{color:var(--entry-key)}.entry-key.dim{opacity:.6}.t-key{color:var(--preview-key)}.t-regexp,.t-string,.t-symbol{color:var(--string)}.t-number{color:var(--number)}.t-null{color:var(--null)}.t-function{font-style:italic}.t-node{color:var(--entry-key)}.console-table{border:1px solid var(--table-border);border-collapse:collapse;margin:2px 0 4px;white-space:nowrap}.console-table td,.console-table th{border-left:1px solid var(--table-border);max-width:300px;overflow:hidden;padding:1px 4px;text-align:left;text-overflow:ellipsis}.console-table th{background-color:var(--table-header-bg);border-bottom:1px solid var(--table-border);font-weight:400}";
  /**
   * Information about this package (eg. its version).
   * @type {{name: string, version: string, homepage: string, repoUrl: string, bugsUrl: string}}
   */
  const PACKAGE_INFO = {"name":"yourjs-box","version":"1.0.0","homepage":"https://westc.github.io/yourjs-box/","repoUrl":"https://github.com/westc/yourjs-box","bugsUrl":"https://github.com/westc/yourjs-box/issues"};
  /**
   * Viewer IFRAME's HTML code
   * @type {string}
   */
  const VIEWER_IFRAME_HTML = "<div id=\"splash\" aria-label=\"Loading\"><div class=\"splash-content\"><span class=\"logo logo-large\"><span class=\"logo-mark\">JS</span><span class=\"logo-text\">Box</span></span><div class=\"splash-progress\"><div></div></div></div></div><div id=\"vueApp\" v-cloak><div id=\"main\" ref=\"main\" :class=\"mainElemClassNames\" :style=\"mainElemStyles\" @mousedown=\"onMainElemMouseDown\"><div id=\"displays\"><div ref=\"displaysScroller\" @scroll=\"onDisplaysScroll\"><template v-for=\"display in displays\"><div v-if=\"display.type === 'prism'\"><div v-if=\"display.isHidden\" class=\"code-header toggleable no-select\" @click=\"display.isCodeShown = !display.isCodeShown\" :title=\"display.isCodeShown ? 'Hide Code' : 'Show Code'\"><span :class=\"['arrow', 'expandable', display.isCodeShown ? 'expanded' : '']\"></span>{{ display.header || 'Hidden code' }}</div><div v-else-if=\"display.header\" class=\"code-header\">{{ display.header }}</div><div v-if=\"display.isCodeShown\" class=\"console-row code-row\"><span class=\"row-icon\"><icon name=\"chevron\"></icon></span><prism language=\"javascript\" :code=\"display.value\" :is-dark=\"theme === 'dark'\" match-braces></prism><button class=\"copy-to-editor-button\" title=\"Copy to editor\" @click=\"copyToEditor(display.value)\"><icon name=\"copyToEditor\"></icon></button></div></div><div v-if=\"display.type === 'log'\" :class=\"['console-row', 'log-' + display.key]\" :title=\"display.name\"><span v-if=\"display.key === 'error'\" class=\"row-icon\"><icon name=\"consoleError\"></icon></span><span v-else-if=\"display.key === 'warn'\" class=\"row-icon\"><icon name=\"consoleWarning\"></icon></span><div class=\"row-content\"><table v-if=\"display.table\" class=\"console-table\"><thead><tr><th v-for=\"header in display.table.headers\">{{ header }}</th></tr></thead><tbody><tr v-for=\"row in display.table.rows\"><td>{{ row.index }}</td><td v-for=\"cell in row.cells\"><template v-if=\"cell\"><span v-for=\"part in cell.parts\" :class=\"'t-' + part[0]\">{{ part[1] }}</span></template></td></tr></tbody></table><js-value v-for=\"(description, index) in display.descriptions\" :description=\"description\" :path=\"[display.logId, index]\"></js-value></div></div><div v-if=\"display.type === 'notice'\" class=\"console-row notice\">{{ display.message }}</div><div v-if=\"display.type === 'error'\" class=\"console-row log-error\"><span class=\"row-icon\"><icon name=\"consoleError\"></icon></span><div class=\"row-content\">{{ display.message }}</div></div></template></div></div><div class=\"divider\" ref=\"mainDivider\"></div><div id=\"editor\"><ace-editor v-model=\"jsCode\" language=\"javascript\" :theme=\"theme\" @key-combo=\"onEditorKeyCombo\" height=\"100%\"></ace-editor></div></div><div id=\"bottomNav\"><div class=\"brand\"><button class=\"logo-button\" title=\"About JS Box\" @click=\"openAbout('about')\"><span class=\"logo\"><span class=\"logo-mark\">JS</span><span class=\"logo-text\">Box</span></span></button> <button class=\"info-button\" title=\"About JS Box\" @click=\"openAbout('about')\"><icon name=\"info\"></icon></button> <span class=\"runner-badge\" :title=\"runnerMode === 'window' ? 'Code runs directly in this page' : 'Code runs in a Web Worker (no DOM access)'\">{{ runnerMode === 'window' ? 'Window' : 'Worker' }}</span></div><div class=\"buttons\"><template v-for=\"bottomButton in bottomButtons\"><span v-if=\"bottomButton.isSeparator\" class=\"separator\"></span> <button v-else :class=\"bottomButton.className\" @click=\"bottomButton.callback.call(this, $event)\" :title=\"bottomButton.title\" :disabled=\"bottomButton.disableIf &amp;&amp; bottomButton.disableIf.call(this)\"><icon :name=\"bottomButton.iconName\"></icon><span v-if=\"bottomButton.label\" class=\"label\">{{ bottomButton.label }}</span></button></template></div></div><div v-if=\"isAboutOpen\" class=\"dialog-backdrop\" @mousedown.self=\"closeAbout\" @keydown.esc=\"closeAbout\"><div :class=\"['dialog', 'about-dialog', aboutTab === 'html' ? 'is-export' : '']\" role=\"dialog\" aria-modal=\"true\" aria-label=\"About JS Box\"><div class=\"about-header\"><div class=\"tabs\" role=\"tablist\"><button role=\"tab\" :aria-selected=\"aboutTab === 'about'\" :class=\"['tab', aboutTab === 'about' ? 'active' : '']\" @click=\"aboutTab = 'about'\">About</button> <button role=\"tab\" :aria-selected=\"aboutTab === 'html'\" :class=\"['tab', aboutTab === 'html' ? 'active' : '']\" @click=\"aboutTab = 'html'\">Copy as HTML</button></div><button class=\"close-button\" ref=\"aboutCloseButton\" title=\"Close\" @click=\"closeAbout\"><icon name=\"close\"></icon></button></div><div v-if=\"aboutTab === 'about'\" class=\"about-body\"><div class=\"about-title\"><span class=\"logo logo-medium\"><span class=\"logo-mark\">JS</span><span class=\"logo-text\">Box</span></span><div><div class=\"about-name\">YourJS Box <span class=\"about-aka\">aka JS Box</span></div><div class=\"about-version\">Version {{ packageInfo.version }}</div></div></div><p class=\"about-description\">An interactive JavaScript console that can be embedded in any web page with a single script tag.</p><div class=\"about-links\"><a :href=\"packageInfo.homepage\" target=\"_blank\" rel=\"noopener\">Website</a> <a :href=\"packageInfo.repoUrl\" target=\"_blank\" rel=\"noopener\">GitHub</a> <a :href=\"packageInfo.repoUrl + '#readme'\" target=\"_blank\" rel=\"noopener\">Documentation</a> <a :href=\"packageInfo.bugsUrl\" target=\"_blank\" rel=\"noopener\">Report an issue</a></div><h3>This console</h3><dl class=\"about-details\"><dt>Code runs in</dt><dd>{{ runnerDescription }}</dd><dt>Theme</dt><dd>{{ themeDescription }}</dd><dt>Layout</dt><dd>{{ layoutDescription }}</dd></dl><h3>Keyboard shortcuts</h3><dl class=\"about-details\"><dt><kbd>{{ modKey }}</kbd> + <kbd>Enter</kbd></dt><dd>Run the next block of code</dd><dt><kbd>Esc</kbd></dt><dd>Close this window</dd></dl><div class=\"about-footer\">MIT License &copy; 2023-present Christopher West &middot; Built with Vue, Ace and Prism</div></div><div v-else class=\"about-body export-body\"><div class=\"export-options\"><div class=\"segmented\" role=\"radiogroup\" aria-label=\"Code\"><button v-for=\"option in exportCodeOptions\" role=\"radio\" :aria-checked=\"exportCode === option.value\" :class=\"exportCode === option.value ? 'active' : ''\" @click=\"exportCode = option.value\">{{ option.label }}</button></div><div class=\"segmented\" role=\"radiogroup\" aria-label=\"Format\"><button v-for=\"option in exportFormatOptions\" role=\"radio\" :aria-checked=\"exportFormat === option.value\" :class=\"exportFormat === option.value ? 'active' : ''\" @click=\"exportFormat = option.value\">{{ option.label }}</button></div></div><div class=\"export-note\">{{ exportNote }}</div><div class=\"export-preview\"><ace-editor :model-value=\"exportHtml\" language=\"html\" :theme=\"theme\" height=\"100%\" :read-only=\"true\"></ace-editor></div><div class=\"export-actions\"><button class=\"dialog-button\" @click=\"downloadExport\">Download page</button> <button class=\"dialog-button primary\" @click=\"copyExport\">{{ copyLabel }}</button></div></div></div></div><div v-if=\"dialog\" class=\"dialog-backdrop\" @mousedown.self=\"closeDialog(false)\" @keydown.esc=\"closeDialog(false)\"><div class=\"dialog\" role=\"alertdialog\" aria-modal=\"true\" :aria-label=\"dialog.title\"><div class=\"dialog-title\">{{ dialog.title }}</div><div class=\"dialog-message\">{{ dialog.message }}</div><div class=\"dialog-buttons\"><button class=\"dialog-button\" @click=\"closeDialog(false)\">Cancel</button> <button class=\"dialog-button primary\" ref=\"dialogConfirmButton\" @click=\"closeDialog(true)\">{{ dialog.confirmText }}</button></div></div></div></div>";
  /**
   * The URL of this script which is used to remove this script's lines from the
   * stack traces of errors in window mode.
   */
  const OWN_URL = document.currentScript?.src ?? '';

  /**
   * The page's console methods before any console in window mode replaced them
   * so that this script's own messages don't show up in those consoles.  These
   * are shared by every copy of this script that is loaded in the page.
   */
  const ORIGINAL_CONSOLE = window[Symbol.for('yourjs-box.originalConsole')] ??= {...console};

  /**
   * The only functions that may be relayed to the viewer and to the runner.
   * The runner executes the user's code so anything it sends must be limited
   * to these calls.
   */
  const RELAYABLE_FUNCS = {
    viewer: ['appendLog', 'appendError', 'clearDisplays', 'onCodeRan', 'updateDescriptionFor'],
    runner: ['clearLogs', 'reset', 'runCode', 'sendDescriptionFor'],
  };

  /**
   * Relays a message to its target as long as the function being called is
   * allowed.
   * @param {*} data
   * @param {{[target: string]: {apply: (func: string, args: any[]) => void}}} targets
   */
  function relayMessage(data, targets) {
    const {target, func, args} = Object(data);
    const targetObj = targets[target];
    if (targetObj && RELAYABLE_FUNCS[target].includes(func) && Array.isArray(args)) {
      targetObj.apply(func, args);
    }
    else {
      ORIGINAL_CONSOLE.error('Unhandled message sent to main handler:', data);
    }
  }

  function createRunner(e,t){const{mode:n}=t,r=t.ownUrl||("worker"===n?self.location.href:""),o={};let s=0,c=0,i=!0;for(const t of["clear","debug","error","info","log","table","warn"]){const n=console[t];"function"==typeof n&&(console[t]=function(...r){if("clear"===t)E(),e({target:"viewer",func:"clearDisplays",args:[!0]});else{const n="table"===t?f(r[0],r[1]):null;n&&(r=r.slice(0,1));const c=""+ ++s;o[c]=r.map((e=>({...g(e),value:e}))),e({target:"viewer",func:"appendLog",args:[{logId:c,key:t,descriptions:o[c].map(l(["value"])),table:n}]})}return n.apply(this,arguments)})}function u(t,n){e({target:"viewer",func:"appendError",args:[{message:(n?"Uncaught (in promise) ":"Uncaught ")+a(t?.stack??`${t?.message??t}`)}]})}function a(e){return`${e}`.split("\n").filter((e=>!(r&&/^\s*at\b/.test(e)&&e.includes(r)))).join("\n")}function l(e,t){if(!t)return t=>l(e,t);const n={...t};for(const t of e)delete n[t];return n}function f(e,t){if(null===e||"object"!=typeof e)return null;const n="Value",r=[];let o=!1;const s=Object.keys(e).map((t=>{const n=e[t],s={index:t,values:{},hasValue:!1};if(null===n||"object"!=typeof n&&"function"!=typeof n)o=!0,s.hasValue=!0,s.value=n;else for(const e of Object.keys(n))r.includes(e)||r.push(e),s.values[e]=n[e];return s})),c=Array.isArray(t)?t.map((e=>`${e}`)):r,i=o&&!Array.isArray(t);return{headers:["(index)",...c,...i?[n]:[]],rows:s.map((({index:e,values:t,hasValue:n,value:r})=>({index:e,cells:[...c.map((e=>Object.hasOwn(t,e)?g(t[e],2):null)),...i?[n?g(r,2):null]:[]]})))}}function p(e){if(null==e)return""+e;const t=typeof e;return"object"===t||"undefined"===t?Object.prototype.toString.call(e).slice(8,-1):t}function d(e,t){try{const t=Object.getPrototypeOf(e)?.constructor?.name;if(t&&"string"==typeof t)return t}catch(e){}return t}addEventListener("error",(e=>{u(void 0!==e.error?e.error:e.message)})),addEventListener("unhandledrejection",(e=>{u(e.reason,!0)}));const y=5,h=100;function g(e,t=0,n=!1){const r=p(e),o="function"!==r&&r===r.toLowerCase(),s=undefined;return{typeName:r,isPrimitive:o,parts:n?[["text","Object"!==r?r:d(e,r)]]:m(e,t,r)}}function m(e,t,n=p(e)){if("string"===n)return t?(t>1&&e.length>100&&(e=e.slice(0,99)+"…"),[["string",b(e)]]):[["text",e]];if("number"===n)return[["number",Object.is(e,-0)?"-0":""+e]];if("bigint"===n)return[["number",e+"n"]];if("boolean"===n)return[["number",""+e]];if("null"===n||"undefined"===n)return[["null",n]];if("symbol"===n)return[["symbol",e.toString()]];if("function"===n)return v(e,t);try{return x(e,t,n)}catch(e){return[["text",n]]}}function b(e){const t=JSON.stringify(e);return e.includes("'")?t:`'${t.slice(1,-1).replace(/\\"/g,'"')}'`}function v(e,t){let n="";try{n=Function.prototype.toString.call(e)}catch(e){}const r=/^class\b/.test(n);return t?t>1?[["function","ƒ"]]:[["function",r?`class ${e.name}`:`ƒ ${e.name}()`]]:[["text",r?n:n.replace(/^(async\s+)?function\b\s*/,"$1ƒ ")]]}function x(e,t,n){const r=d(e,n),o=/^Array(?:[^a-z]|$)|[^A-Z]Array$/.test(n);if("Date"===n)return[["text",isNaN(e)?"Invalid Date":Date.prototype.toString.call(e)]];if("RegExp"===n)return[["regexp",""+e]];if("undefined"!=typeof Node&&e instanceof Node)return e.nodeType===Node.ELEMENT_NODE?[["node",e.localName+(e.id?"#"+e.id:"")+[...e.classList].map((e=>"."+e)).join("")]]:e.nodeType===Node.TEXT_NODE?[["string",b(e.data)]]:[["node",e.nodeName]];if(e instanceof Error)return[["text",t?`${e.name}: ${e.message}`:a(e.stack??`${e}`)]];if(t>1)return o?[["text",`${r}(${e.length})`]]:"Map"===n||"Set"===n?[["text",`${r}(${e.size})`]]:[["text","Object"===r?"{…}":r]];const s=[],c=(e,t,n)=>{e.forEach(((e,t)=>{t&&s.push(["text",", "]),n(e)})),t>e.length&&s.push(["text",(e.length?", ":"")+"…"])};if(o){const t=e.length;s.push(["text","Array"===n&&"Array"===r?`(${t}) [`:`${r}(${t}) [`]),c(Array.from({length:Math.min(t,h)},((e,t)=>t)),t,(t=>s.push(...t in e?m(e[t],2):[["null","empty"]]))),s.push(["text","]"])}else if("Map"===n||"Set"===n){const t=[...e].slice(0,h);s.push(["text",`${r}(${e.size}) {`]),c(t,e.size,(e=>{"Map"===n?s.push(...m(e[0],2),["text"," => "],...m(e[1],2)):s.push(...m(e,2))})),s.push(["text","}"])}else{const t=Object.keys(e);"Object"!==r&&s.push(["text",r+" "]),"Number"===n||"String"===n||"Boolean"===n?s.push(["text","{"],...m(e.valueOf(),2),["text","}"]):(s.push(["text","{"]),c(t.slice(0,y),t.length,(t=>{const n=Object.getOwnPropertyDescriptor(e,t);s.push(["key",t],["text",": "],..."value"in n?m(n.value,2):[["text","(…)"]])})),s.push(["text","}"]))}return s}function j(e,t=e){const n=p(e),r=[],o=[],s=[],c=[];if(null!==e&&("object"==typeof e||"function"==typeof e)){let i=!1;try{if("Map"===n){for(const[t,n]of[...e])r.push([m(t,2).map((e=>e[1])).join(""),g(n,1)]),o.push({value:n});i=!0}else if("Array"!==n&&"function"!==n&&"function"==typeof e[Symbol.iterator]){let t=0;for(const n of e)r.push([""+t,g(n,1)]),o.push({value:n}),++t;i=!0}}catch(e){r.length=o.length=0}if(!i)for(const n of Object.getOwnPropertyNames(e))try{const s=Object.getOwnPropertyDescriptor(e,n),c="value"in s?s.value:Reflect.get(e,n,t);r.push([n,g(c,1),s.enumerable]),o.push({value:c})}catch(e){}const u=Object.getPrototypeOf(e);null!==u&&(s.push(["[[Prototype]]",g(u,1,!0)]),c.push({value:u,receiver:t}))}return{entries:r,protoEntries:s,$entries:o,$protoEntries:c}}function O(t){const r=`${t}\n//# sourceURL=snippet-${++c}.js`;if("worker"===n)try{$(r)}catch(e){u(e)}else{const e=document.createElement("script");e.textContent=r,document.head.appendChild(e),e.remove()}e({target:"viewer",func:"onCodeRan",args:[]})}function $(e){if(i)try{return void importScripts("data:text/javascript;charset=utf-8,"+encodeURIComponent(e))}catch(e){if("NetworkError"!==e?.name)throw e;i=!1}const t=URL.createObjectURL(new Blob([e],{type:"text/javascript"}));try{importScripts(t)}finally{URL.revokeObjectURL(t)}}function w(t){let n=o,r=0;for(let e of t)r&&r%2==0&&(e="$"+e),n=n?.[e],r++;if(!n)return;const s=j(n.value,"receiver"in n?n.receiver:n.value);Object.assign(n,s),e({target:"viewer",func:"updateDescriptionFor",args:[t,l(["$entries","$protoEntries"],s)]})}function E(){for(const e of Object.keys(o))delete o[e]}return{clearLogs:E,runCode:O,sendDescriptionFor:w}}

  /**
   * Runs the user's code in a Web Worker.  The worker can be terminated which
   * makes it possible to reset the console even if the code never finishes.
   * @param {(message: any) => void} onMessage
   */
  function createWorkerRunner(onMessage) {
    const WORKER_SOURCE = '(function(){'
      + 'var runner = (' + createRunner + ')(function(m) { postMessage(m); }, {mode: "worker"});'
      + 'onmessage = function(e) {'
      +   'var d = e.data;'
      +   'if (d && Object.prototype.hasOwnProperty.call(runner, d.func) && Array.isArray(d.args)) {'
      +     'runner[d.func].apply(null, d.args);'
      +   '}'
      + '};'
      + 'postMessage({target: "main", func: "ready"});'
      + '})();';

    // A data URL gives the worker an opaque origin so that it cannot make
    // requests with the page's cookies.  Not all browsers support data URL
    // workers so a blob URL is used as a fallback.
    let canUseDataUrl = true;
    let blobUrl;
    let worker, isReady, pendingMessages;

    function start() {
      isReady = false;
      pendingMessages = [];
      const url = canUseDataUrl
        ? 'data:text/javascript;charset=utf-8,' + encodeURIComponent(WORKER_SOURCE)
        : (blobUrl ??= URL.createObjectURL(new Blob([WORKER_SOURCE], {type: 'text/javascript'})));
      try {
        worker = new Worker(url);
      }
      catch (e) {
        if (!canUseDataUrl) throw e;
        canUseDataUrl = false;
        return start();
      }

      const thisWorker = worker;
      worker.onmessage = e => {
        if (thisWorker !== worker) return;
        if (e.data?.target === 'main' && e.data.func === 'ready') {
          isReady = true;
          for (const message of pendingMessages.splice(0)) worker.postMessage(message);
        }
        else {
          onMessage(e.data);
        }
      };
      worker.onerror = e => {
        // If the worker failed to start from a data URL try a blob URL.
        if (thisWorker === worker && !isReady && canUseDataUrl) {
          e.preventDefault();
          canUseDataUrl = false;
          const messages = pendingMessages;
          worker.terminate();
          start();
          pendingMessages.push(...messages);
        }
      };
    }

    start();

    return {
      apply(func, args) {
        if (func === 'reset') {
          worker.terminate();
          start();
        }
        else if (isReady) {
          worker.postMessage({func, args});
        }
        else {
          pendingMessages.push({func, args});
        }
      },
    };
  }

  /**
   * Runs the user's code directly in this window so that it has access to
   * everything defined by the page.
   * @param {(message: any) => void} onMessage
   */
  function createWindowRunner(onMessage) {
    const runner = createRunner(onMessage, {mode: 'window', ownUrl: OWN_URL});
    return {
      apply(func, args) {
        // Anything the code defined stays defined so a reset can only forget
        // the logged values.
        if (func === 'reset') runner.clearLogs();
        else runner[func](...args);
      },
    };
  }

  /**
   * Function executed when the script is included in a document.
   * @param {HTMLScriptElement} script
   *   This is the current script but also the placeholder for where the
   *   console will be inserted into the DOM.
   */
  function main(script) {
    const dataset = JSON.parse(JSON.stringify(script.dataset));
    const runnerMode = dataset.runner === 'window' ? 'window' : 'worker';

    /** @type {ReturnType<createCallableFrame>} */
    let callableViewerFrame;
    const sendToViewer = data => relayMessage(data, {viewer: callableViewerFrame});
    const runner = runnerMode === 'window'
      ? createWindowRunner(sendToViewer)
      : createWorkerRunner(sendToViewer);

    // The theme is determined up front so that the loading screen uses it.
    const theme = /^(light|dark)$/.test(dataset.theme)
      ? dataset.theme
      : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    callableViewerFrame = createCallableFrame({
      jsCode() {
        let mountedApp;const Prism=window.Prism;delete window.Prism,Prism.plugins.autoloader.loadLanguages("javascript");const MIN_LOADING_TIME=1e3,NARROW_WIDTH=600;function getAutoDividerOrient(){return innerWidth<NARROW_WIDTH?"horizontal":"vertical"}function init(e,t,i){const n=t.hidePrefix??"",r=matchMedia("(prefers-color-scheme: dark)"),s=unindentMin(e),{visibleCode:o,hiddenGroups:a}=extractHiddenGroups(s,n),l=/Mac|iPhone|iPad/.test(navigator.platform),d=()=>a.map((e=>({...e})));mountedApp=Vue.createApp({data:()=>({displays:[],hidePrefix:n,hiddenGroups:d(),runnerMode:i.runnerMode,packageInfo:i.packageInfo,runHistory:[],isAboutOpen:!1,aboutTab:"about",exportCode:"current",exportFormat:"snippet",copyLabel:"Copy",runningCount:0,dialog:null,isDisplaysScrolledToBottom:!0,forcedTheme:/^(light|dark)$/.test(t.theme)?t.theme:null,prefersDark:r.matches,runCount:0,jsCode:o,isDividerOrientAuto:!/^(horizontal|vertical)$/.test(t.dividerOrient),dividerOrient:/^(horizontal|vertical)$/.test(t.dividerOrient)?t.dividerOrient:getAutoDividerOrient(),isMovingDivider:!1,dividerPct:"50%",dividerSize:"8px",tempDividerPct:null}),computed:{theme(){return this.forcedTheme??(this.prefersDark?"dark":"light")},modKey:()=>l?"⌘":"Ctrl",runnerDescription(){return"window"===this.runnerMode?"This page (it can use the page's globals and DOM)":"A Web Worker (isolated from the page, no DOM)"},themeDescription(){return`${"dark"===this.theme?"Dark":"Light"} (${this.forcedTheme?"set by data-theme":"follows your system"})`},layoutDescription(){return("vertical"===this.dividerOrient?"Editor beside the console":"Editor below the console")+(this.isDividerOrientAuto?" (automatic)":"")},exportCodeOptions:()=>[{value:"current",label:"Current code",note:"The code that already ran followed by the code in the editor."},{value:"original",label:"Original code",note:"The code this console started with."},{value:"blank",label:"Blank",note:"An empty console with the same settings."}],exportFormatOptions:()=>[{value:"snippet",label:"Embed snippet"},{value:"page",label:"Full page"}],exportNote(){return this.exportCodeOptions.find((e=>e.value===this.exportCode)).note},exportJsCode(){if("original"===this.exportCode)return s;if("blank"===this.exportCode)return"";const e=this.runHistory.slice(),t=this.hiddenGroups.slice();let i=this.runCount;const n=()=>{for(;t.length&&t[0].runCount<=i;)e.push(t.shift().allLines)};n();for(const t of parseJSCodeGroups(this.jsCode))t.allLines.trim()&&(e.push(t.allLines),i++,n());return e.push(...t.map((e=>e.allLines))),joinCodeBlocks(e)},exportHtml(){return buildConsoleHtml({code:this.exportJsCode,dataset:t,packageInfo:this.packageInfo,isFullPage:"page"===this.exportFormat})},bottomButtons(){return[{iconName:"clear",title:"Clear console",callback(){this.clearConsole()}},{iconName:"refresh",title:"worker"===this.runnerMode?"Reset (also stops any code that is still running)":"Reset",callback(){this.resetConsole()}},{isSeparator:!0},{iconName:"horizontalView",title:"Show the editor below the console",callback(){this.setDividerOrient("horizontal")},showIf(){return"horizontal"!==this.dividerOrient}},{iconName:"verticalView",title:"Show the editor beside the console",callback(){this.setDividerOrient("vertical")},showIf(){return"vertical"!==this.dividerOrient}},{iconName:this.runningCount?"spinner":"play",label:"Run",className:"primary",title:`Run the next block of code (${l?"⌘":"Ctrl+"}Enter)`,callback(){this.runCode()},disableIf(){return!this.canRunCode}}].filter((e=>!e.showIf||e.showIf.call(this)))},canRunCode(){return this.jsCode.trim()},mainElemClassNames(){return["vertical"===this.dividerOrient?"col-orient":"row-orient",this.isMovingDivider?"is-moving-divider":""].join(" ")},mainElemStyles(){return{"--divider-size":this.dividerSize,"--editor-pct":this.dividerPct,"--temp-editor-pct":this.tempDividerPct}}},methods:{onEditorKeyCombo(e){(e.ctrlKey||e.metaKey)&&"Enter"===e.key&&this.canRunCode&&this.runCode()},runCode(){this.isDisplaysScrolledToBottom=!0;const[e,...t]=parseJSCodeGroups(this.jsCode);this.runGroup(e),this.jsCode=t.map((e=>e.allLines)).join("\n"),this.runCount++},runHiddenGroups(){const{hiddenGroups:e}=this;e.length&&e[0].runCount<=this.runCount&&this.runGroup(e.shift())},runGroup(e){const{header:t,isHidden:i}=parseGroupHeader(e.headerLines,this.hidePrefix);this.displays.push({type:"prism",header:t,isHidden:i,isCodeShown:!i,value:e.lines}),this.runningCount++,this.runHistory.push(e.allLines),messageParent({target:"runner",func:"runCode",args:[e.lines]})},clearConsole(){this.displays=[],messageParent({target:"runner",func:"clearLogs",args:[]})},async resetConsole(){await this.confirm({title:"Reset the console?",message:"The output will be cleared and the editor will go back to the original code."+("window"===this.runnerMode?"  Anything the code already defined on the page will stay defined.":""),confirmText:"Reset"})&&(this.displays=[],this.jsCode=o,this.hiddenGroups=d(),this.runCount=0,this.runningCount=0,this.runHistory=[],messageParent({target:"runner",func:"reset",args:[]}),this.runHiddenGroups())},async copyToEditor(e){if(this.jsCode.trim()&&this.jsCode!==e){if(!await this.confirm({title:"Replace the code in the editor?",message:"The code that is currently in the editor will be replaced with a copy of the code you selected.",confirmText:"Replace"}))return}this.jsCode=e},confirm(e){return this.dialog?.resolve(!1),new Promise((t=>{this.dialog={...e,resolve:t},this.$nextTick((()=>this.$refs.dialogConfirmButton?.focus()))}))},openAbout(e){this.aboutTab=e,this.isAboutOpen=!0,this.$nextTick((()=>this.$refs.aboutCloseButton?.focus()))},closeAbout(){this.isAboutOpen=!1},async copyExport(){const e=this.exportHtml;try{await navigator.clipboard.writeText(e)}catch(t){const i=Object.assign(document.createElement("textarea"),{value:e});document.body.appendChild(i),i.select(),document.execCommand("copy"),i.remove()}this.copyLabel="Copied!",clearTimeout(this.copyLabelTimeout),this.copyLabelTimeout=setTimeout((()=>this.copyLabel="Copy"),1600)},downloadExport(){const e=buildConsoleHtml({code:this.exportJsCode,dataset:t,packageInfo:this.packageInfo,isFullPage:!0}),i=URL.createObjectURL(new Blob([e],{type:"text/html"}));Object.assign(document.createElement("a"),{href:i,download:"js-box.html"}).click(),setTimeout((()=>URL.revokeObjectURL(i)),1e3)},closeDialog(e){const{dialog:t}=this;this.dialog=null,t?.resolve(e)},setDividerOrient(e){this.isDividerOrientAuto=!1,this.dividerOrient=e},onWindowResize(){this.isDividerOrientAuto&&(this.dividerOrient=getAutoDividerOrient())},onDisplaysScroll(){const{scrollTop:e,scrollHeight:t,clientHeight:i}=this.$refs.displaysScroller;this.isDisplaysScrolledToBottom=t-e-i<8},getEditorPct(e){const t=this.$refs.main.getBoundingClientRect(),{dividerOrient:i}=this,n=e.pageX-t.left,r=e.pageY-t.top,s=t.width,o=t.height;return 100-100*Math.min(Math.max(.2,"vertical"===i?n/s:r/o),.8)+"%"},onMainElemMouseDown(e){e.target===this.$refs.mainDivider&&(this.isMovingDivider=!0,this.tempDividerPct=this.getEditorPct(e))},onWindowMouseMove(e){this.isMovingDivider&&(this.tempDividerPct=this.getEditorPct(e))},onWindowMouseUp(e){this.isMovingDivider&&(this.isMovingDivider=!1,this.dividerPct=this.getEditorPct(e))},onWindowError(e){this.displays.push({type:"error",message:e.error?.stack??e.message??e.error?.message??`${e.error}`,line:e.lineno,column:e.colno})}},watch:{theme:{handler(e){document.documentElement.dataset.theme=e},immediate:!0},"displays.length"(){this.isDisplaysScrolledToBottom&&this.$nextTick((()=>{const e=this.$refs.displaysScroller;e.scrollTop=e.scrollHeight}))}},mounted(){addEventListener("mousemove",this.onWindowMouseMove),addEventListener("resize",this.onWindowResize),addEventListener("mouseup",this.onWindowMouseUp),addEventListener("error",this.onWindowError),r.addEventListener("change",(e=>this.prefersDark=e.matches)),this.runHiddenGroups(),setTimeout((()=>document.querySelector("#splash").classList.add("hidden")),Math.max(0,1e3-performance.now()))}}).component("ace-editor",getAceComponentProps()).component("prism",getPrismComponentProps()).component("icon",getIconComponentProps()).component("js-value",getJSValueComponentProps()).mount(document.querySelector("#vueApp"))}function getAceComponentProps(){return{data:()=>({annotations:[]}),props:["height","keybinding","language","modelValue","readOnly","theme","width"],computed:{infoNotes(){return this.annotations.filter((({type:e})=>"info"===e))},warningNotes(){return this.annotations.filter((({type:e})=>"warning"===e))},errorNotes(){return this.annotations.filter((({type:e})=>"error"===e))},style(){return{height:null!=this.height?"number"==typeof this.height?this.height+"px":this.height:"150px",width:null!=this.width?"number"==typeof this.width?this.width+"px":this.width:"100%"}},modeSig(){return`ace/mode/${this.language??"text"}`},themeSig(){return`ace/theme/${`${this.theme??"light"}`.replace(/^light$|(^dark$)/i,((e,t)=>"cloud_editor"+(t?"_dark":"")))}`}},watch:{themeSig(e){this.editor.setTheme(e)},modelValue(e){e!==this.editor.getValue()&&this.editor.setValue(e,-1)}},async mounted(){const e=ace.edit(this.$refs.editor,{value:this.modelValue,mode:this.modeSig,theme:this.themeSig});this.editor=e,this.readOnly&&(e.setReadOnly(!0),e.setHighlightActiveLine(!1),e.session.setUseWorker(!1)),e.setKeyboardHandler("ace/keyboard/vscode"),e.commands.removeCommand("addLineAfter"),e.commands.removeCommand("addLineBefore"),e.on("change",(()=>this.$emit("update:modelValue",e.getValue()))),e.session.on("changeAnnotation",(()=>{const t=JSON.stringify(this.errorNotes),i=JSON.stringify(this.infoNotes),n=JSON.stringify(this.warningNotes);this.annotations=e.getSession().getAnnotations();const{errorNotes:r,infoNotes:s,warningNotes:o}=this;t!==JSON.stringify(r)&&this.$emit("changeErrorNotes",r),i!==JSON.stringify(s)&&this.$emit("changeInfoNotes",s),n!==JSON.stringify(o)&&this.$emit("changeWarningNotes",o)})),e.textInput.getElement().addEventListener("keydown",(e=>{if(16===e.keyCode||17===e.keyCode||18===e.keyCode||91===e.keyCode||92===e.keyCode||93===e.keyCode)return;(e.metaKey||e.ctrlKey||e.altKey||e.shiftKey&&(e.key??"").length>1)&&this.$emit("keyCombo",e)}))},template:'<div ref="editor" :style="style"></div>'}}function getPrismComponentProps(){return{data:()=>({annotations:[]}),props:["code","isDark","language","lineNumbers","matchBraces"],computed:{html(){},preStyle(){return{filter:!1!==(this.isDark??!1)?"none":"invert(1) hue-rotate(180deg) brightness(1.1)",margin:0,paddingTop:"0.5em",paddingBottom:"0.5em"}}},watch:{code(){this.redraw()},language(){this.redraw()},lineNumbers(){this.redraw()},matchBraces(){this.redraw()}},methods:{async redraw(){const e=this.$refs.pre,t=this.$refs.code;t.textContent=this.code,t.className="language-javascript",e.className="";for(const t of["lineNumbers","matchBraces"])if(null!=this[t]){const i=t.replace(/[A-Z]+/g,"-$&").toLowerCase();e.className+=" "+i}Prism.highlightElement(t)}},async mounted(){await this.redraw()},template:'<pre ref="pre" :style="preStyle"><code ref="code"></code></pre>'}}function getIconComponentProps(){return{props:["name"],computed:{svgCode(){const e={missing:'<svg viewBox="0 0 32 32"><circle cx="16" cy="22.5" r="1.5" fill="currentColor"/><path fill="currentColor" d="M17 19h-2v-4h2c1.103 0 2-.897 2-2s-.897-2-2-2h-2c-1.103 0-2 .897-2 2v.5h-2V13c0-2.206 1.794-4 4-4h2c2.206 0 4 1.794 4 4s-1.794 4-4 4z"/><path fill="currentColor" d="M29.391 14.527L17.473 2.609A2.078 2.078 0 0 0 16 2c-.533 0-1.067.203-1.473.609L2.609 14.527C2.203 14.933 2 15.466 2 16s.203 1.067.609 1.473L14.526 29.39c.407.407.941.61 1.474.61s1.067-.203 1.473-.609L29.39 17.474c.407-.407.61-.94.61-1.474s-.203-1.067-.609-1.473M16 28.036L3.965 16L16 3.964L28.036 16z"/></svg>',trash:'<svg viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M5.5 1a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zM3 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1H11v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4h-.5a.5.5 0 0 1-.5-.5M5 4h5v8H5z" clip-rule="evenodd"/></svg>',play:'<svg viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M3.242 2.322a.5.5 0 0 1 .491-.014l9 4.75a.5.5 0 0 1 0 .884l-9 4.75A.5.5 0 0 1 3 12.25v-9.5a.5.5 0 0 1 .242-.428M4 3.579v7.842L11.429 7.5z" clip-rule="evenodd"/></svg>',refresh:'<svg viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M1.903 7.297c0 3.044 2.207 5.118 4.686 5.547a.521.521 0 1 1-.178 1.027C3.5 13.367.861 10.913.861 7.297c0-1.537.699-2.745 1.515-3.663c.585-.658 1.254-1.193 1.792-1.602H2.532a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V2.686l-.001.002c-.572.43-1.27.957-1.875 1.638c-.715.804-1.253 1.776-1.253 2.97m11.108.406c0-3.012-2.16-5.073-4.607-5.533a.521.521 0 1 1 .192-1.024c2.874.54 5.457 2.98 5.457 6.557c0 1.537-.699 2.744-1.515 3.663c-.585.658-1.254 1.193-1.792 1.602h1.636a.5.5 0 1 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 1 1 1 0v1.845h.002c.571-.432 1.27-.958 1.874-1.64c.715-.803 1.253-1.775 1.253-2.97" clip-rule="evenodd"/></svg>',horizontalView:'<svg viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M1.5 2h12a.5.5 0 0 1 .5.5V7H1V2.5a.5.5 0 0 1 .5-.5M1 8v4.5a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5V8zM0 2.5A1.5 1.5 0 0 1 1.5 1h12A1.5 1.5 0 0 1 15 2.5v10a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 0 12.5z" clip-rule="evenodd"/></svg>',verticalView:'<svg viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M8 2h5.5a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5H8zM7 2H1.5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5H7zm-7 .5A1.5 1.5 0 0 1 1.5 1h12A1.5 1.5 0 0 1 15 2.5v10a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 0 12.5z" clip-rule="evenodd"/></svg>',play:'<svg viewBox="0 0 16 16"><path fill="currentColor" d="M2 1v14l12-7z"/></svg>',error:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M11 15h2v2h-2zm0-8h2v6h-2zm1-5C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8a8 8 0 0 1 8-8a8 8 0 0 1 8 8a8 8 0 0 1-8 8"/></svg>',info:'<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 7.25v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="8" cy="5" r="1" fill="currentColor"/></svg>',close:'<svg viewBox="0 0 16 16"><path d="M4 4l8 8m0-8l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',clear:'<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3.75 12.25l8.5-8.5" stroke="currentColor" stroke-width="1.5"/></svg>',copyToEditor:'<svg viewBox="0 0 16 16"><path d="M6 3.5L2.5 7 6 10.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 7h6.5a4 4 0 0 1 4 4v1.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',spinner:'<svg viewBox="0 0 16 16" class="spin"><path d="M8 1.75a6.25 6.25 0 1 1-6.25 6.25" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>',chevron:'<svg viewBox="0 0 16 16"><path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',consoleError:'<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="currentColor"/><path d="M5.5 5.5l5 5m0-5l-5 5" stroke="#fff" stroke-width="1.75" stroke-linecap="round"/></svg>',consoleWarning:'<svg viewBox="0 0 16 16"><path d="M8 1.75L14.75 14H1.25z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6v3.5" stroke="#202124" stroke-width="1.75" stroke-linecap="round"/><circle cx="8" cy="11.75" r="1" fill="#202124"/></svg>'};return(e[this.name]??e.missing).replace("<svg",'$& xmlns="http://www.w3.org/2000/svg" style="height: 1em; width: 1em; display: inline-block; transform: translateY(0.1em);"')}},template:'<span v-html="svgCode"></span>'}}function getJSValueComponentProps(){return{props:["description","path","name","isDimName"],data:()=>({isExpanded:!1,hasBeenExpanded:!1}),watch:{isExpanded(e){e&&!this.hasBeenExpanded&&(this.hasBeenExpanded=e)}},computed:{isPartialDescription(){return void 0===this.description.entries},isExpandable(){return!this.description.isPrimitive},isEntry(){return null!=this.name},classNames(){return["js-value",this.isEntry||this.isExpandable&&this.isExpanded?"d-block":"d-inline-block",this.isExpanded?"expanded":""]},entryGroups:()=>[{key:"entries",isDim:e=>!1===e[2]},{key:"protoEntries",isDim:()=>!0}]},methods:{toggleExpanded(){this.isExpandable&&(this.isExpanded=!this.isExpanded,this.isExpanded&&this.isPartialDescription&&messageParent({target:"runner",func:"sendDescriptionFor",args:[this.path]}))}},template:'\n      <div :class="classNames">\n        <div :class="[\'js-value-header\', isExpandable ? \'expandable\' : \'\']" @click="toggleExpanded"><span\n          v-if="isExpandable || isEntry" :class="[\'arrow\', isExpandable ? \'expandable\' : \'\', isExpanded ? \'expanded\' : \'\']"></span><template\n          v-if="isEntry"><span :class="[\'entry-key\', isDimName ? \'dim\' : \'\']">{{ name }}</span>: </template><span\n          v-for="part in description.parts" :class="\'t-\' + part[0]">{{ part[1] }}</span></div>\n        <div v-if="hasBeenExpanded" v-show="isExpanded" class="expansion">\n          <div v-if="isPartialDescription" class="loading">Loading&hellip;</div>\n          <template v-else>\n            <template v-for="group in entryGroups">\n              <js-value\n                v-for="(entry, entryIndex) in description[group.key]"\n                :name="entry[0]"\n                :is-dim-name="group.isDim(entry)"\n                :description="entry[1]"\n                :path="path.concat([group.key, entryIndex])">\n              </js-value>\n            </template>\n          </template>\n        </div>\n      </div>\n    '}}function parseJSCodeGroups(e){return e.split(/\r\n|\r|\n/).reduce(((e,t)=>{const i=e[e.length-1],n=/^\/\/[^]*\\\\$/.test(t),r=n?t.replace(/^\/+\s*|\s*\\+$/g,""):t;return!e.length||n&&!i.canAppendHeader?e.push({headerLines:n?[r]:[],lines:n?[]:[t],allLines:[t],canAppendHeader:n}):n?(i.headerLines.push(r),i.allLines.push(t)):(i.canAppendHeader=!1,i.lines.push(t),i.allLines.push(t)),e}),[]).reduce(((e,t)=>(t.canAppendHeader||(delete t.canAppendHeader,t.headerLines=t.headerLines.join("\n").trimEnd(),t.lines=t.lines.join("\n"),t.allLines=t.allLines.join("\n"),e.push(t)),e)),[])}function parseGroupHeader(e,t){const i=!!t&&e.startsWith(t);return{header:i?e.slice(t.length).replace(/^\s*:?\s*/,""):e,isHidden:i}}function extractHiddenGroups(e,t){const i=[],n=[];for(const r of parseJSCodeGroups(e))parseGroupHeader(r.headerLines,t).isHidden?n.push({...r,runCount:i.length}):i.push(r);return{visibleCode:i.map((e=>e.allLines)).join("\n"),hiddenGroups:n}}function joinCodeBlocks(e){return e.map((e=>e.replace(/^(\s*[\r\n])+|\s+$/g,""))).filter(Boolean).map(((e,t)=>{const i=e.split(/\r\n|\r|\n/)[0];return t&&!/^\/\/[^]*\\\\$/.test(i)?`// \\\\\n${e}`:e})).join("\n\n")}function buildConsoleHtml({code:e,dataset:t,packageInfo:i,isFullPage:n}){const{name:r,version:s}=i,o=`https://cdn.jsdelivr.net/npm/${r}@${s.split(".")[0]}/dist/${r}.min.js`,a=Object.entries(t).map((([e,t])=>` data-${e.replace(/[A-Z]/g,(e=>"-"+e.toLowerCase()))}="${escapeHtmlAttribute(t)}"`)).join(""),l=n?"    ":"  ",d=e.replace(/<\/(script)/gi,"<\\/$1").replace(/<!--/g,"<\\!--"),c=(d.trim()?[`<script src="${o}"${a}>`,...d.split("\n").map((e=>e.trim()?"  "+e:"")),"<\/script>"]:[`<script src="${o}"${a}><\/script>`]).map((e=>e?l+e:e)).join("\n");return n?["<!DOCTYPE html>",'<html lang="en">',"  <head>",'    <meta charset="utf-8">','    <meta name="viewport" content="width=device-width, initial-scale=1">',"    <title>JS Box</title>","    <style>","      html, body { height: 100%; margin: 0; }","    </style>","  </head>","  <body>",c,"  </body>","</html>",""].join("\n"):`<div style="height: 400px;">\n${c}\n</div>\n`}function escapeHtmlAttribute(e){return`${e}`.replace(/[&"<>]/g,(e=>`&#${e.charCodeAt(0)};`))}function unindentMin(e,t){const i=(t=Object(t)).tabSize??4,n=t.trim??!0;if(e=e.replace(/\t/g," ".repeat(i)),!/(^|[\r\n])\S/.test(e)){const t=/(^|[\r\n])((?:(?!\r|\n)\s)+)(?=(\S)?)/g;let i=1/0;for(let n;n=t.exec(e);)n[3]&&(i=Math.min(i,n[2].length));e=e.replace(t,((e,t,n)=>t+n.slice(i)))}return n?e.replace(/^(\s*[\r\n]+)+|\s+$/g,""):e}function sanitizeDescription(e){return{typeName:`${(e=Object(e)).typeName}`,isPrimitive:!!e.isPrimitive,parts:Array.from(e.parts??[],(e=>[/^[a-z]+$/.test(Object(e)[0])?e[0]:"text",`${Object(e)[1]}`])),...sanitizeEntries(e)}}function sanitizeEntries(e){e=Object(e);const t={};for(const i of["entries","protoEntries"])Array.isArray(e[i])&&(t[i]=e[i].map((e=>[`${Object(e)[0]}`,sanitizeDescription(Object(e)[1]),!1!==Object(e)[2]])));return t}function appendLog({logId:e,key:t,descriptions:i,table:n}){t=`${t}`,mountedApp.displays.push({type:"log",key:t,name:`console.${t}`,descriptions:Array.from(i,sanitizeDescription),table:n?{headers:Array.from(n.headers,(e=>`${e}`)),rows:Array.from(n.rows,(e=>({index:`${e.index}`,cells:Array.from(e.cells,(e=>e&&sanitizeDescription(e)))})))}:null,logId:`${e}`})}function appendError({message:e,line:t,column:i}){mountedApp.displays.push({type:"error",message:`${e}`,line:+t,column:+i})}function updateDescriptionFor(e,t){const i=(e=Array.from(e)).shift(),n=mountedApp.displays.find((e=>"log"===e.type&&e.logId===i));let r=n?.descriptions[toIndex(e.shift())];for(let t=0;r&&t<e.length;t+=2){const i=e[t];if("entries"!==i&&"protoEntries"!==i)return;r=r[i]?.[toIndex(e[t+1])]?.[1]}r&&Object.assign(r,sanitizeEntries(t))}function onCodeRan(){mountedApp.runningCount=Math.max(0,mountedApp.runningCount-1),mountedApp.runHiddenGroups()}function clearDisplays(){mountedApp.displays=[{type:"notice",message:"Console was cleared"}]}function toIndex(e){return Number.isInteger(e)&&e>=0?e:void 0}
      },
      jsUrls: [
        'https://unpkg.com/vue@3/dist/vue.global.prod.js',
        'https://unpkg.com/ace-builds@1/src-noconflict/ace.js',
        'https://unpkg.com/prismjs@1/components/prism-core.min.js',
        'https://unpkg.com/prismjs@1/plugins/autoloader/prism-autoloader.min.js',
        'https://unpkg.com/prismjs@1/plugins/match-braces/prism-match-braces.min.js',
      ],
      cssUrls: [
        'data:text/css,' + encodeURIComponent(VIEWER_IFRAME_CSS),
        'https://unpkg.com/prism-themes@1/themes/prism-vsc-dark-plus.min.css',
        'https://unpkg.com/prismjs@1/plugins/match-braces/prism-match-braces.min.css',
      ],
      htmlAttributes: 'data-theme="' + theme + '"',
      onMessage(message) {
        relayMessage(message.data, {runner});
      },
      async onReady() {
        // The dataset is passed as is so that the viewer knows which options
        // were actually specified (eg. when copying the console as HTML).
        this.call('init', script.textContent, dataset, {runnerMode, packageInfo: PACKAGE_INFO});
      },
      body: VIEWER_IFRAME_HTML,
      style: {
        width: '100%',
        height: '100%',
        border: 0,
        display: 'block',
      },
    });

    script.parentNode.insertBefore(callableViewerFrame.iframe, script);
  }

  // NOTE:  This solution was intentionally written without using newer JS
  // features to make the minified version even smaller.
  var createCallableFrame = (function () {
    var IFRAME_SCRIPT_MESSAGE_CODE = parseFunction(function() {
      // NOTE:  Referencing with window to ensure that local namespace will not
      // interfere.
      window.addEventListener('message', function(e) {
        var data = e.data;
        if (
          e.source === window.parent
          && data && /^[A-Za-z_$][\w$]*$/.test(data.funcName)
          && Array.isArray(data.args)
        ) {
          var func = eval(data.funcName);
          if ('function' === typeof func) func.apply(e, data.args);
        }
      });

      function messageParent(message) {
        window.parent.postMessage(message, '*');
      }
    }).body;

    /**
     * Creates an IFRAME which allows for easier 2-way communication.
     * @template {createCallableFrame_Return} R
     * @param {Object} options
     * @param {(string|Function)=} options.jsCode
     *   The JavaScript code that will be encapsulated and run within the IFRAME.
     *   The code can call `messageParent(message)` to send a message to
     *   `options.onMessage()`.  The code can call `callParent(funcName, ...args)`
     *   to execute `options.functions[funcName](...args)`.  The code can call
     *   `applyParent(funcName, args)` to execute
     *   `options.functions[funcName](...args)`.
     * @param {{[funcName: string]: (this: R, ...args) => void}=} options.functions
     *   Functions that can be called by the IFRAME code to execute code on the
     *   parent level.
     * @param {string[]=} options.jsUrls
     * @param {string[]=} options.cssUrls
     * @param {string=} options.head
     * @param {string=} options.body
     * @param {(CSSStyleDeclaration|string)=} options.style
     *   The HTML code that will be used to instantiate the page.
     * @param {string=} options.htmlAttributes
     *   Attributes to add to the `<html>` element of the IFRAME.
     * @param {((this: R, event: MessageEvent) => void)=} options.onMessage
     * @param {((this: R, event: MessageEvent) => void)=} options.onReady
     * @returns {R}
     */
    function createCallableFrame(options) {
      // Break some of the options out into their own variables.
      var jsCode = options.jsCode;
      var onMessage = options.onMessage;
      var onReady = options.onReady;
      var style = options.style;

      // isReady indicates if the IFRAME is ready to have messages sent to it
      // while READY_ID is used internally to confirm if the IFRAME is actually
      // ready to receive function calls.
      var isReady, READY_ID = Math.random() + '' + Math.random();

      // The script code for the IFRAME.
      var IFRAME_SCRIPT_CODE = [
        '(function(){',
        IFRAME_SCRIPT_MESSAGE_CODE,
        'var applyParent, callParent;',
        '(function(READY_ID){',
        parseFunction(function() {
          applyParent = function(funcName, args) {
            window.parent.postMessage({funcName: funcName, args: args, id: READY_ID}, '*');
          };

          callParent = function(funcName) {
            window.parent.postMessage(
              {funcName: funcName, args: Array.prototype.slice.call(arguments, 1), id: READY_ID},
              '*'
            );
          };

          var interval = setInterval(function() {
            if (/^(complete|interactive)$/.test(document.readyState)) {
              clearInterval(interval);
              messageParent(READY_ID);
            }
          }, 100);
        }).body,
        '})(' + JSON.stringify(READY_ID) + ');',
        'function' !== typeof jsCode ? jsCode || '' : parseFunction(jsCode).body,
        '})();',
      ].join('\n')
      // Prevents the HTML parser from ending the inline script early.
      .replace(/<(?=\/script|!--)/gi, '\\x3C');

      // Creates the IFRAME and sets its source via srcdoc.
      var IFRAME = document.createElement('iframe');
      var HTML_CODE = [
        '<!DOCTYPE html>',
        '<html ' + (options.htmlAttributes || '') + '>',
        '<head>',
        options.head || '',
        (options.cssUrls || []).map(function(cssUrl) {
          return '<link href="' + cssUrl + '" rel="stylesheet">';
        }).join('\n'),
        '</head>',
        '<body>',
        options.body || '',
        // The scripts are loaded after the body so that the body can be shown
        // while they load.
        (options.jsUrls || []).map(function(jsUrl) {
          return '<script src="' + jsUrl + '"><\x2fscript>';
        }).join('\n'),
        '<script>' + IFRAME_SCRIPT_CODE + '<\x2fscript>',
        '</body>',
        '</html>'
      ].join('\n');
      IFRAME.srcdoc = HTML_CODE;

      // Set the style of the iframe.
      if (style) {
        if ('string' === typeof style) {
          IFRAME.style.cssText = style;
        }
        else {
          for (var styleKey in style) {
            if (hasOwn(style, styleKey)) {
              IFRAME.style[styleKey] = style[styleKey];
            }
          }
        }
      }

      // Adds an event listener so that messages from the IFRAME will be captured.
      addEventListener('message', function(e) {
        if (e.source === IFRAME.contentWindow) {
          var data = e.data;
          var dataIsReadyId = READY_ID === data;
          if (isReady && !dataIsReadyId) {
            if (options.functions && data.id === READY_ID && hasOwn(options.functions, data.funcName)) {
              options.functions[data.funcName].apply(callableFrame, data.args);
            }
            else if ('function' === typeof onMessage) {
              onMessage.call(callableFrame, e);
            }
            else {
              console.warn('Message sent from callable frame but no listener was set up.', e);
            }
          }
          else if (dataIsReadyId) {
            isReady = true;
            if ('function' === typeof onReady) onReady.call(callableFrame, e);
            // Sends anything that was queued before the IFRAME was ready.
            while (queuedMessages.length) postToFrame(queuedMessages.shift());
          }
          else { // !isReady
            console.warn('Message sent from callable frame prematurely:', e);
          }
        }
      });

      // Returns an object which makes it possible to call functions and get
      // access to the IFRAME.
      var queuedMessages = [];
      function postToFrame(message) {
        if (isReady) IFRAME.contentWindow.postMessage(message, '*');
        else queuedMessages.push(message);
      }
      var callableFrame = {
        apply: function(funcName, args) {
          postToFrame({funcName: funcName, args: args});
        },
        call: function(funcName) {
          postToFrame({funcName: funcName, args: Array.prototype.slice.call(arguments, 1)});
        },
        iframe: IFRAME
      };
      return callableFrame;
    };
    /**
     * @typedef {Object} createCallableFrame_Return
     * @property {(funcName: string, args: any[]) => void} apply
     * @property {(funcName: string, ...args: any[]) => void} call
     * @property {HTMLIFrameElement} iframe
     */

    /**
     * Determines if `obj` has its own property named `prop`.
     * @type {(obj: any, prop: string|symbol) => boolean}
     */
    var hasOwn = atob.call.bind({}.hasOwnProperty);

    /**
     * Parses a user-defined function to determine if it is an arrow function, an
     * async function a generator function and also gets the parameters as a string
     * and the function body as a string.
     * @param {Function} input
     * @returns {{
     *   isArrow: boolean;
     *   isAsync: boolean;
     *   isGenerator: boolean;
     *   parameters: string;
     *   body: string;
     * }}
     */
    function parseFunction(input) {
      // Get rid of all comments encountered before the function body.
      var strFunc = input + '';
      /** @type {RegExpExecArray?} */
      var m;
      while (m = /\/\*[^]*?\*\/|\/\/.*/g.exec(strFunc)) {
        var STR_BEFORE = strFunc.slice(0, m.index);
        if (/[\{"'`]/.test(STR_BEFORE)) break;
        strFunc = STR_BEFORE + ' ' + strFunc.slice(m.index + m[0].length);
      }

      // Determines if the function is an async function.
      var IS_ASYNC = /^\s*async\b/.test(strFunc);
      if (IS_ASYNC) strFunc = strFunc.replace('async', '');
      
      // Determines if the function is a generator function.
      var IS_GENERATOR = /^\s*(?:function\s*)?\*/.test(strFunc);
      if (IS_GENERATOR) strFunc = strFunc.replace(/(?:\bfunction\s*)?\*/, '');

      // Determines if the function is an arrow function.
      var ARROW_MATCH = /\s*=>\s*/.exec(strFunc);
      var INDEX_OF_FUNC_START = strFunc.search(/\)\s*\{/);
      var IS_ARROW = ARROW_MATCH && (ARROW_MATCH.index < INDEX_OF_FUNC_START || INDEX_OF_FUNC_START < 0);

      // Parses out the parameters and body as strings.
      var parameters, body;
      if (IS_ARROW) {
        var STR_BEFORE = strFunc.slice(0, ARROW_MATCH.index);
        var STR_AFTER = strFunc.slice(ARROW_MATCH.index + ARROW_MATCH[0].length);
        parameters = (/\S+(?:\s*,\s*\S+)*/.exec(STR_BEFORE.replace(/[()]/g, ' ')) ?? [])[0];
        body = !/^\{/.test(STR_AFTER)
          ? 'return ' + STR_AFTER
          : STR_AFTER.replace(/^\{|\}\s*$/g, '');
      }
      else {
        parameters = (/\(([^\)]*)\)/.exec(strFunc) ?? [])[1];
        body = (/\{([^]*)\}/.exec(strFunc) ?? [])[1];
      }

      // Returns the parsed function.
      return {
        isAsync: IS_ASYNC,
        isGenerator: IS_GENERATOR,
        isArrow: IS_ARROW,
        parameters,
        body,
      };
    }

    // Make parseFunction() available.
    createCallableFrame.parseFunction = parseFunction;

    return createCallableFrame;
  })();

  main(document.currentScript);
})();