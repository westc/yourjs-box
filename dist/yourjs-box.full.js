/*! yourjs-box v1.8.0 | (c) 2023-present Chris West | MIT License | https://github.com/westc/yourjs-box */
(() => {
  /**
   * Viewer IFRAME's CSS code
   * @type {string}
   */
  const VIEWER_IFRAME_CSS = "[v-cloak]{display:none}body,html{height:100%;margin:0}body{background-color:var(--console-bg);font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif}.svg-defs{height:0;position:absolute;width:0}#vueApp{display:flex;flex-direction:column;inset:0;position:fixed}#main{display:grid;flex-grow:1;gap:0;min-height:0;position:relative}#main.is-moving-divider{-webkit-user-select:none;user-select:none}#main.col-orient.is-moving-divider{cursor:col-resize}#main.row-orient.is-moving-divider{cursor:row-resize}#main.is-moving-divider::after{background-color:var(--accent);content:'';position:absolute;z-index:99}#main.col-orient.is-moving-divider::after{bottom:0;left:calc(100% - var(--temp-editor-pct) - var(--divider-size)/ 2 - 1px);top:0;width:2px}#main.row-orient.is-moving-divider::after{height:2px;left:0;right:0;top:calc(100% - var(--temp-editor-pct) - var(--divider-size)/ 2 - 1px)}#main.col-orient{grid-template-columns:1fr var(--divider-size) calc(var(--editor-pct) - var(--divider-size)/ 2);grid-template-rows:1fr}#main.row-orient{grid-template-columns:1fr;grid-template-rows:1fr var(--divider-size) calc(var(--editor-pct) - var(--divider-size)/ 2)}.divider{background-color:var(--divider-bg);box-sizing:border-box;position:relative;transition:background-color .15s}#main.col-orient .divider{border-left:1px solid var(--toolbar-border);border-right:1px solid var(--toolbar-border);cursor:col-resize}#main.row-orient .divider{border-bottom:1px solid var(--toolbar-border);border-top:1px solid var(--toolbar-border);cursor:row-resize}.divider::after{background-color:var(--divider-grip);border-radius:2px;content:'';left:50%;position:absolute;top:50%;transform:translate(-50%,-50%);transition:background-color .15s}#main.col-orient .divider::after{height:32px;width:2px}#main.row-orient .divider::after{height:2px;width:32px}#main.is-moving-divider .divider,.divider:hover{background-color:var(--divider-hover-bg)}#main.is-moving-divider .divider::after,.divider:hover::after{background-color:var(--accent)}#displays{position:relative}#displays>div{position:absolute;inset:0;overflow:auto}#bottomNav{align-items:center;background-color:var(--toolbar-bg);border-top:1px solid var(--toolbar-border);color:var(--toolbar-text);display:flex;flex:0 0 auto;font-size:12px;gap:8px;height:32px;padding:0 6px 0 8px;-webkit-user-select:none;user-select:none}#bottomNav>.brand{align-items:center;display:flex;flex-grow:1;gap:8px}.runner-badge{border:1px solid var(--toolbar-border);border-radius:999px;color:var(--muted-text);font-size:10px;letter-spacing:.04em;line-height:15px;padding:0 6px;text-transform:uppercase}#bottomNav>.buttons{align-items:center;display:flex;gap:2px}#bottomNav .separator{background-color:var(--toolbar-border);height:16px;margin:0 4px;width:1px}#bottomNav button{align-items:center;background:0 0;border:0;border-radius:4px;color:inherit;cursor:pointer;display:inline-flex;font:inherit;gap:5px;height:24px;justify-content:center;min-width:26px;padding:0 6px}#bottomNav button>span:not(.label){display:inline-flex;font-size:14px}#bottomNav button svg:not(.spin){transform:none!important}#bottomNav button:hover:not(:disabled){background-color:var(--button-hover)}#bottomNav button:disabled{cursor:not-allowed;opacity:.45}#bottomNav button.primary{background-color:var(--accent);color:var(--accent-text);font-weight:600;margin-left:2px;padding:0 10px 0 8px}#bottomNav button.primary>span:not(.label){font-size:11px}#bottomNav button.primary:hover:not(:disabled){background-color:var(--accent-hover)}#bottomNav button:focus-visible{outline:2px solid var(--accent);outline-offset:1px}.spin{animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}.logo{align-items:center;color:var(--toolbar-text);display:inline-flex;font-weight:700;gap:5px;letter-spacing:-.01em;line-height:1}.logo-mark{flex:none;height:18px;width:18px}.logo-text{font-size:14px;white-space:nowrap}@media (max-width:440px){#bottomNav .logo-text{display:none}}.logo-your{font-weight:400;opacity:.8}.logo-large{gap:12px}.logo-large>.logo-mark{filter:drop-shadow(0 6px 12px rgb(0 0 0 / .18));height:56px;width:56px}.logo-large>.logo-text{font-size:36px}#splash{align-items:center;background-color:var(--console-bg);display:flex;inset:0;justify-content:center;position:fixed;transition:opacity .35s ease,visibility .35s;z-index:1000}#splash.hidden{opacity:0;visibility:hidden}.splash-content{align-items:center;animation:splash-in .4s ease-out both;display:flex;flex-direction:column;gap:24px}.splash-progress{background-color:var(--toolbar-border);border-radius:3px;height:3px;overflow:hidden;width:140px}.splash-progress>div{animation:splash-progress 1.1s ease-in-out infinite;background-color:var(--accent);border-radius:inherit;height:100%;width:40%}@keyframes splash-in{from{opacity:0;transform:translateY(6px)}}@keyframes splash-progress{from{transform:translateX(-100%)}to{transform:translateX(250%)}}.dialog-backdrop{align-items:center;animation:fade-in .12s ease-out;background-color:var(--backdrop);display:flex;inset:0;justify-content:center;position:fixed;z-index:900}.dialog{animation:dialog-in .15s ease-out;background-color:var(--dialog-bg);border:1px solid var(--toolbar-border);border-radius:8px;box-shadow:0 12px 40px rgb(0 0 0 / .3);color:var(--console-text);font-size:13px;padding:16px;width:min(360px,calc(100% - 32px))}.dialog-title{font-size:14px;font-weight:600;margin-bottom:6px}.dialog-message{color:var(--muted-text);line-height:1.45}.dialog-buttons{display:flex;gap:8px;justify-content:flex-end;margin-top:16px}.dialog-button{background:0 0;border:1px solid var(--toolbar-border);border-radius:4px;color:inherit;cursor:pointer;font:inherit;height:28px;padding:0 12px}.dialog-button:hover{background-color:var(--button-hover)}.dialog-button.primary{background-color:var(--accent);border-color:var(--accent);color:var(--accent-text);font-weight:600}.dialog-button.primary:hover{background-color:var(--accent-hover)}.dialog-button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}#bottomNav button.logo-button{margin-left:-4px;padding:0 4px}.about-dialog{display:flex;flex-direction:column;max-height:calc(100% - 24px);padding:0;width:min(620px,calc(100% - 24px))}.about-dialog.is-export{height:min(560px,calc(100% - 24px))}.about-header{align-items:center;border-bottom:1px solid var(--toolbar-border);display:flex;flex:0 0 auto;padding:0 8px 0 12px}.tabs{display:flex;flex-grow:1;gap:4px}.tab{background:0 0;border:0;border-bottom:2px solid transparent;color:var(--muted-text);cursor:pointer;font:inherit;font-weight:600;padding:10px 8px 8px}.tab:hover{color:var(--console-text)}.tab.active{border-bottom-color:var(--accent);color:var(--console-text)}.close-button{align-items:center;background:0 0;border:0;border-radius:4px;color:var(--muted-text);cursor:pointer;display:inline-flex;font-size:16px;height:28px;justify-content:center;width:28px}.close-button:hover{background-color:var(--button-hover);color:var(--console-text)}.close-button:focus-visible,.segmented>button:focus-visible,.tab:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}.about-body{flex:1 1 auto;min-height:0;overflow:auto;padding:16px}.about-title{align-items:center;display:flex;gap:12px}.logo-medium>.logo-mark{height:40px;width:40px}.logo-medium>.logo-text{display:none}.about-name{font-size:17px;font-weight:700}.about-version{color:var(--muted-text);font-size:12px}.about-description{line-height:1.5;margin:12px 0}.about-links{display:flex;flex-wrap:wrap;gap:6px 16px}.about-links a{color:var(--accent);font-weight:600;text-decoration:none}.about-links a:hover{text-decoration:underline}.about-body h3{color:var(--muted-text);font-size:11px;letter-spacing:.05em;margin:18px 0 6px;text-transform:uppercase}.about-details{display:grid;gap:4px 16px;grid-template-columns:max-content 1fr;margin:0}.about-details dt{color:var(--muted-text)}.about-details dd{margin:0}.about-details kbd{background-color:var(--toolbar-bg);border:1px solid var(--toolbar-border);border-bottom-width:2px;border-radius:4px;font-family:inherit;font-size:11px;padding:0 4px}.about-footer{border-top:1px solid var(--toolbar-border);color:var(--muted-text);font-size:12px;margin-top:18px;padding-top:12px}.export-body{display:flex;flex-direction:column;gap:10px}.export-options{display:flex;flex-wrap:wrap;gap:8px;justify-content:space-between}.segmented{border:1px solid var(--toolbar-border);border-radius:6px;display:inline-flex;overflow:hidden}.segmented>button{background:0 0;border:0;color:var(--muted-text);cursor:pointer;font:inherit;font-size:12px;font-weight:600;padding:5px 10px}.segmented>button+button{border-left:1px solid var(--toolbar-border)}.segmented>button:hover{background-color:var(--button-hover)}.segmented>button.active{background-color:var(--accent);color:var(--accent-text)}.export-note{color:var(--muted-text);font-size:12px}.export-preview{border:1px solid var(--toolbar-border);border-radius:6px;flex:1 1 auto;min-height:120px;overflow:hidden}.export-actions{display:flex;gap:8px;justify-content:flex-end}.file-input{display:none}.more-menu{background-color:var(--dialog-bg);border:1px solid var(--toolbar-border);border-radius:8px;bottom:38px;box-shadow:0 8px 28px rgb(0 0 0 / .25);color:var(--console-text);font-size:13px;max-height:calc(100% - 48px);min-width:236px;overflow:auto;padding:4px;position:absolute;right:6px;z-index:800}.menu-item{align-items:center;background:0 0;border:0;border-radius:5px;color:inherit;cursor:pointer;display:flex;font:inherit;gap:8px;padding:6px 8px;text-align:left;width:100%}.menu-item:focus-visible,.menu-item:hover:not(:disabled){background-color:var(--button-hover);outline:0}.menu-item:disabled{cursor:not-allowed;opacity:.4}.menu-icon{color:var(--muted-text);display:inline-flex;font-size:14px;justify-content:center;width:16px}.menu-icon svg{transform:none!important}.menu-row{align-items:center;display:flex;gap:2px;padding:2px 2px 2px 8px}.menu-row-label{flex-grow:1}.menu-step{font-weight:600;justify-content:center;width:auto}.menu-percent{color:var(--muted-text);font-variant-numeric:tabular-nums;font-weight:400;min-width:52px}.menu-separator{background-color:var(--toolbar-border);height:1px;margin:4px 0}.history-panel{max-width:min(420px,calc(100% - 12px));width:360px}.history-title{color:var(--muted-text);font-size:11px;font-weight:600;letter-spacing:.05em;padding:4px 8px 6px;text-transform:uppercase}.history-item{justify-content:space-between}.history-label{font-family:var(--console-font);font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.history-detail{color:var(--muted-text);flex-shrink:0;font-size:11px}.history-empty,.history-hint{color:var(--muted-text);font-size:12px;padding:6px 8px}.history-hint{border-top:1px solid var(--toolbar-border);margin-top:4px}.value-menu{bottom:auto;min-width:220px;position:fixed;right:auto;z-index:850}.toast{animation:fade-in .15s ease-out;background-color:var(--console-text);border-radius:6px;bottom:44px;box-shadow:0 6px 20px rgb(0 0 0 / .25);color:var(--console-bg);font-size:12px;left:50%;max-width:calc(100% - 32px);padding:6px 12px;pointer-events:none;position:fixed;transform:translateX(-50%);z-index:860}.popped-out{align-items:center;background-color:var(--console-bg);color:var(--console-text);display:flex;inset:0;justify-content:center;position:fixed;z-index:950}.popped-out-content{align-items:center;display:flex;flex-direction:column;gap:8px;padding:16px;text-align:center}.popped-out-title{font-size:15px;font-weight:600;margin-top:8px}.popped-out-text{color:var(--muted-text);font-size:13px}@keyframes fade-in{from{opacity:0}}@keyframes dialog-in{from{opacity:0;transform:scale(.96)}}.rotated-90deg{transform:rotate(90deg)}.align-top{vertical-align:top!important}.d-inline-block{display:inline-block!important}.d-block{display:block!important}.d-flex{display:flex!important}.d-inline-flex{display:inline-flex!important}.no-select{-webkit-user-select:none;user-select:none}:root{color-scheme:light;--console-font:ui-monospace,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;--console-bg:#fff;--console-text:#1f1f1f;--row-border:#f0f0f0;--arrow:#727272;--chevron:#9aa0a6;--entry-key:#881391;--preview-key:#5f6368;--string:#c41a16;--number:#1a1aa6;--null:#80868b;--header-bg:#f1f3f4;--header-text:#3c4043;--warn-bg:#fffbe5;--warn-border:#fff5c2;--warn-text:#5c3c00;--warn-icon:#e8a600;--error-bg:#fff0f0;--error-border:#ffd6d6;--error-text:#dc362e;--error-icon:#dc362e;--table-header-bg:#f3f3f3;--table-border:#d0d0d0;--toolbar-bg:#f3f3f3;--toolbar-border:#d6d6d6;--toolbar-text:#333;--muted-text:#5f6368;--button-hover:rgb(0 0 0 / 0.08);--accent:#1a73e8;--accent-hover:#1765cc;--accent-text:#fff;--divider-bg:#f3f3f3;--divider-hover-bg:#e8eaed;--divider-grip:#b0b0b0;--dialog-bg:#fff;--backdrop:rgb(0 0 0 / 0.25)}:root[data-theme=dark]{color-scheme:dark;--console-bg:#242424;--console-text:#e3e3e3;--row-border:#3a3a3a;--arrow:#9aa0a6;--chevron:#80868b;--entry-key:#5db0d7;--preview-key:#9aa0a6;--string:#f28b54;--number:#9980ff;--null:#8e8e8e;--header-bg:#2d2e30;--header-text:#c4c7c5;--warn-bg:#332b00;--warn-border:#665500;--warn-text:#ffd17a;--warn-icon:#ffd17a;--error-bg:#290000;--error-border:#5c0000;--error-text:#ff8080;--error-icon:#ff6b6b;--table-header-bg:#2e2e2e;--table-border:#4a4a4a;--toolbar-bg:#2b2b2b;--toolbar-border:#474747;--toolbar-text:#e3e3e3;--muted-text:#9aa0a6;--button-hover:rgb(255 255 255 / 0.1);--accent:#8ab4f8;--accent-hover:#aecbfa;--accent-text:#202124;--divider-bg:#2b2b2b;--divider-hover-bg:#333;--divider-grip:#6b6b6b;--dialog-bg:#2d2e30;--backdrop:rgb(0 0 0 / 0.5)}#displays{background-color:var(--console-bg);color:var(--console-text)}#displays>div{font-family:var(--console-font);font-size:calc(12px * var(--text-scale, 1));line-height:calc(16px * var(--text-scale, 1))}.console-row{border-bottom:1px solid var(--row-border);padding:2px 8px 2px 24px;position:relative;white-space:pre-wrap;word-break:break-word}.console-row>.row-icon{left:6px;line-height:0;position:absolute;top:4px}.log-error,.log-warn{margin-top:-1px}.log-warn{background-color:var(--warn-bg);border-bottom-color:var(--warn-border);border-top:1px solid var(--warn-border);color:var(--warn-text)}.log-warn>.row-icon{color:var(--warn-icon)}.log-error{background-color:var(--error-bg);border-bottom-color:var(--error-border);border-top:1px solid var(--error-border);color:var(--error-text)}.log-error>.row-icon{color:var(--error-icon)}.console-row{padding-left:calc(24px + var(--depth,0) * 16px)}.console-row>.row-icon{left:calc(6px + var(--depth,0) * 16px)}.group-header{cursor:pointer;font-weight:700}.group-header>.row-icon.arrow{top:5px}.log-assert{background-color:var(--error-bg);border-bottom-color:var(--error-border);border-top:1px solid var(--error-border);color:var(--error-text);margin-top:-1px}.log-assert>.row-icon{color:var(--error-icon)}.log-result>.row-icon{color:var(--chevron)}.trace-stack{color:var(--null);padding-left:1ch}.splash-message{color:var(--muted-text);font-size:13px;max-width:280px;text-align:center}.splash-slow{animation:show-after-delay 0s 10s both}@keyframes show-after-delay{from{visibility:hidden}to{visibility:visible}}#splash.failed .splash-progress,#splash.failed .splash-slow,.splash-error{display:none}#splash.failed .splash-error{display:block}.code-header{background-color:var(--header-bg);border-bottom:1px solid var(--row-border);color:var(--header-text);font-weight:700;padding:2px 8px;white-space:pre-wrap}.code-header.toggleable{cursor:pointer}.code-row .copy-to-editor-button{align-items:center;background-color:var(--console-bg);border:1px solid var(--toolbar-border);border-radius:4px;color:var(--toolbar-text);cursor:pointer;display:inline-flex;height:22px;justify-content:center;opacity:0;padding:0;position:absolute;right:6px;top:2px;transition:opacity .15s;width:22px}.code-row .copy-to-editor-button:focus-visible,.code-row:hover .copy-to-editor-button{opacity:1}.code-row .copy-to-editor-button:hover{background-color:var(--toolbar-bg)}@media (hover:none){.code-row .copy-to-editor-button{opacity:.8}}.notice{color:var(--null);font-style:italic}.code-row>.row-icon{color:var(--chevron)}.code-row code,.code-row pre{background:0 0!important;font-family:var(--console-font)!important;font-size:calc(12px * var(--text-scale, 1))!important;line-height:calc(16px * var(--text-scale, 1))!important;padding:0!important;text-shadow:none!important}.js-value{max-width:100%;vertical-align:top}.row-content>.js-value+.js-value{margin-left:1ch}.js-value-header.expandable{cursor:default}.js-value .expansion{padding-left:12px}.js-value .loading{color:var(--null);padding-left:12px}.arrow{display:inline-block;height:10px;position:relative;width:12px}.arrow.expandable::before{border-color:transparent transparent transparent var(--arrow);border-style:solid;border-width:4px 0 4px 6px;content:'';left:2px;position:absolute;top:1px;transform-origin:3px 4px;transition:transform .1s}.arrow.expandable.expanded::before{transform:rotate(90deg)}.entry-key{color:var(--entry-key)}.entry-key.dim{opacity:.6}.t-key{color:var(--preview-key)}.t-regexp,.t-string,.t-symbol{color:var(--string)}.t-number{color:var(--number)}.t-null{color:var(--null)}.t-function{font-style:italic}.t-node{color:var(--entry-key)}.console-table{border:1px solid var(--table-border);border-collapse:collapse;margin:2px 0 4px;white-space:nowrap}.console-table td,.console-table th{border-left:1px solid var(--table-border);max-width:300px;overflow:hidden;padding:1px 4px;text-align:left;text-overflow:ellipsis}.console-table th{background-color:var(--table-header-bg);border-bottom:1px solid var(--table-border);font-weight:400}";
  /**
   * Information about this package (eg. its version).
   * @type {{name: string, version: string, homepage: string, repoUrl: string, bugsUrl: string}}
   */
  const PACKAGE_INFO = {"name":"yourjs-box","version":"1.8.0","homepage":"https://westc.github.io/yourjs-box/","repoUrl":"https://github.com/westc/yourjs-box","bugsUrl":"https://github.com/westc/yourjs-box/issues"};
  /**
   * Viewer IFRAME's HTML code
   * @type {string}
   */
  const VIEWER_IFRAME_HTML = "<svg class=\"svg-defs\" aria-hidden=\"true\"><!-- The logo: an open box whose front is the yellow JS square. --><symbol id=\"logo-mark\" viewBox=\"0 0 32 32\"><polygon points=\"1,10 8,3 31,3 24,10\" fill=\"#4a4a4a\"/><polygon points=\"8,3 31,3 29,5 10,5\" fill=\"#2e2e2e\"/><polygon points=\"24,10 31,3 31,24 24,31\" fill=\"#c7b000\"/><rect x=\"1\" y=\"10\" width=\"23\" height=\"21\" rx=\"1.5\" fill=\"#f7df1e\"/><text x=\"22\" y=\"28.5\" text-anchor=\"end\" font-size=\"11.5\" font-weight=\"800\" letter-spacing=\"-0.3\" fill=\"#1a1a1a\">JS</text></symbol></svg><div id=\"splash\" aria-label=\"Loading\"><div class=\"splash-content\"><span class=\"logo logo-large\"><svg class=\"logo-mark\"><use href=\"#logo-mark\"/></svg><span class=\"logo-text\"><span class=\"logo-your\">Your</span>JS Box</span></span><div class=\"splash-progress\"><div></div></div><div class=\"splash-message splash-slow\">Still loading&hellip;</div><div class=\"splash-message splash-error\">YourJS Box couldn&rsquo;t load. Please check your connection and reload the page.</div></div></div><div id=\"vueApp\" v-cloak><input type=\"file\" ref=\"fileInput\" class=\"file-input\" accept=\".js,.mjs,.cjs,.ts,.mts,.cts,.txt,text/javascript,text/plain\" tabindex=\"-1\" aria-hidden=\"true\" @change=\"onFileChosen\"><div id=\"main\" ref=\"main\" :class=\"mainElemClassNames\" :style=\"mainElemStyles\" @mousedown=\"onMainElemMouseDown\"><div id=\"displays\"><div ref=\"displaysScroller\" @scroll=\"onDisplaysScroll\"><template v-for=\"display in displays\"><div v-if=\"display.type === 'prism'\"><div v-if=\"display.isHidden\" class=\"code-header toggleable no-select\" @click=\"display.isCodeShown = !display.isCodeShown\" :title=\"display.isCodeShown ? 'Hide Code' : 'Show Code'\"><span :class=\"['arrow', 'expandable', display.isCodeShown ? 'expanded' : '']\"></span>{{ display.header || 'Hidden code' }}</div><div v-else-if=\"display.header\" class=\"code-header\">{{ display.header }}</div><div v-if=\"display.isCodeShown\" class=\"console-row code-row\"><span class=\"row-icon\"><icon name=\"chevron\"></icon></span><prism :language=\"language\" :code=\"display.value\" :is-dark=\"theme === 'dark'\" match-braces></prism><button class=\"copy-to-editor-button\" title=\"Copy to editor\" @click=\"copyToEditor(display.value)\"><icon name=\"copyToEditor\"></icon></button></div></div><div v-if=\"display.type === 'log' &amp;&amp; !isInCollapsedGroup(display)\" :class=\"['console-row', 'log-' + display.key, display.groupId ? 'group-header' : '']\" :style=\"{'--depth': display.groupIds.length}\" :title=\"display.name\" @click=\"onLogRowClick(display, $event)\"><span v-if=\"display.key === 'error' || display.key === 'assert'\" class=\"row-icon\"><icon name=\"consoleError\"></icon></span><span v-else-if=\"display.key === 'warn'\" class=\"row-icon\"><icon name=\"consoleWarning\"></icon></span><span v-else-if=\"display.key === 'result'\" class=\"row-icon\"><icon name=\"result\"></icon></span><span v-else-if=\"display.groupId\" :class=\"['row-icon', 'arrow', 'expandable', display.isCollapsed ? '' : 'expanded']\"></span><div class=\"row-content\"><table v-if=\"display.table\" class=\"console-table\"><thead><tr><th v-for=\"header in display.table.headers\">{{ header }}</th></tr></thead><tbody><tr v-for=\"row in display.table.rows\"><td>{{ row.index }}</td><td v-for=\"cell in row.cells\"><template v-if=\"cell\"><span v-for=\"part in cell.parts\" :class=\"'t-' + part[0]\">{{ part[1] }}</span></template></td></tr></tbody></table><js-value v-for=\"(description, index) in display.descriptions\" :description=\"description\" :key-path=\"[]\" :path=\"[display.logId, index]\"></js-value><div v-if=\"display.stack\" class=\"trace-stack\">{{ display.stack }}</div></div></div><div v-if=\"display.type === 'notice'\" class=\"console-row notice\">{{ display.message }}</div><div v-if=\"display.type === 'error'\" class=\"console-row log-error\"><span class=\"row-icon\"><icon name=\"consoleError\"></icon></span><div class=\"row-content\">{{ display.message }}</div></div></template></div></div><div class=\"divider\" ref=\"mainDivider\"></div><div id=\"editor\"><ace-editor ref=\"editor\" v-model=\"jsCode\" :language=\"language\" :theme=\"theme\" :font-size=\"Math.round(12 * textScale)\" @key-combo=\"onEditorKeyCombo\" @history-key=\"onEditorHistoryKey\" height=\"100%\"></ace-editor></div></div><div id=\"bottomNav\"><div class=\"brand\"><button class=\"logo-button\" title=\"About YourJS Box\" @click=\"openAbout('about')\"><span class=\"logo\"><svg class=\"logo-mark\"><use href=\"#logo-mark\"/></svg><span class=\"logo-text\"><span class=\"logo-your\">Your</span>JS Box</span></span></button> <span class=\"runner-badge\" :title=\"runnerMode === 'window' ? 'Code runs directly in this page' : 'Code runs in a Web Worker (no DOM access)'\">{{ runnerMode === 'window' ? 'Window' : 'Worker' }}</span></div><div class=\"buttons\"><template v-for=\"bottomButton in bottomButtons\"><span v-if=\"bottomButton.isSeparator\" class=\"separator\"></span> <button v-else :class=\"bottomButton.className\" @click=\"bottomButton.callback.call(this, $event)\" :title=\"bottomButton.title\" :disabled=\"bottomButton.disableIf &amp;&amp; bottomButton.disableIf.call(this)\"><icon :name=\"bottomButton.iconName\"></icon><span v-if=\"bottomButton.label\" class=\"label\">{{ bottomButton.label }}</span></button></template></div></div><div v-if=\"isMenuOpen\" class=\"more-menu\" role=\"menu\" aria-label=\"More\" ref=\"moreMenu\" @keydown=\"onMenuKeyDown\"><div class=\"menu-row\" role=\"group\" aria-label=\"Text size\"><span class=\"menu-row-label\">Text size</span> <button class=\"menu-item menu-step\" role=\"menuitem\" title=\"Smaller text\" aria-label=\"Smaller text\" :disabled=\"!canShrinkText\" @click=\"changeTextScale(-1)\">A&minus;</button> <button class=\"menu-item menu-step menu-percent\" role=\"menuitem\" title=\"Reset the text size\" aria-label=\"Reset the text size\" @click=\"setTextScale(1)\">{{ Math.round(textScale * 100) }}%</button> <button class=\"menu-item menu-step\" role=\"menuitem\" title=\"Bigger text\" aria-label=\"Bigger text\" :disabled=\"!canGrowText\" @click=\"changeTextScale(1)\">A+</button></div><div class=\"menu-separator\"></div><button class=\"menu-item\" role=\"menuitem\" @click=\"openFile()\"><span class=\"menu-icon\"><icon name=\"open\"></icon></span>Open&hellip;</button> <button class=\"menu-item\" role=\"menuitem\" @click=\"saveFile()\"><span class=\"menu-icon\"><icon name=\"save\"></icon></span>Save&hellip;</button><div class=\"menu-separator\"></div><button v-if=\"isPopOut\" class=\"menu-item\" role=\"menuitem\" @click=\"closeMenu(); bringBack()\"><span class=\"menu-icon\"><icon name=\"popIn\"></icon></span>Bring back into the page</button> <button v-else class=\"menu-item\" role=\"menuitem\" @click=\"popOut()\"><span class=\"menu-icon\"><icon name=\"popOut\"></icon></span>Pop out into a window</button> <button class=\"menu-item\" role=\"menuitem\" @click=\"closeMenu(); openAbout('html')\"><span class=\"menu-icon\"><icon name=\"code\"></icon></span>Copy as HTML&hellip;</button> <button class=\"menu-item\" role=\"menuitem\" @click=\"closeMenu(); resetConsole()\"><span class=\"menu-icon\"><icon name=\"refresh\"></icon></span>Reset&hellip;</button><div class=\"menu-separator\"></div><button class=\"menu-item\" role=\"menuitem\" @click=\"closeMenu(); openAbout('about')\"><span class=\"menu-icon\"><icon name=\"info\"></icon></span>About YourJS Box</button></div><div v-if=\"isHistoryOpen\" class=\"more-menu history-panel\" role=\"menu\" aria-label=\"History\" ref=\"historyPanel\" @keydown=\"onMenuKeyDown\"><div class=\"history-title\">History</div><div v-if=\"!historyEntries.length\" class=\"history-empty\">Code that you run will show up here.</div><button v-for=\"entry in historyEntries\" class=\"menu-item history-item\" role=\"menuitem\" :title=\"commandHistory[entry.index]\" @click=\"recallHistory(entry.index)\"><span class=\"history-label\">{{ entry.label }}</span> <span class=\"history-detail\">{{ entry.detail }}</span></button><div class=\"history-hint\">Tip: press &uarr; at the start of the editor (or &darr; at the end) to go through the history.</div></div><div v-if=\"valueMenu\" class=\"more-menu value-menu\" role=\"menu\" aria-label=\"Value\" ref=\"valueMenu\" :style=\"{left: valueMenu.x + 'px', top: valueMenu.y + 'px'}\" @keydown=\"onMenuKeyDown\"><button class=\"menu-item\" role=\"menuitem\" @click=\"copyValueAsJson()\"><span class=\"menu-icon\"><icon name=\"copy\"></icon></span>Copy as JSON</button> <button class=\"menu-item\" role=\"menuitem\" @click=\"saveValueAsJson()\"><span class=\"menu-icon\"><icon name=\"save\"></icon></span>Save as JSON&hellip;</button> <button class=\"menu-item\" role=\"menuitem\" @click=\"storeValueAsGlobal()\"><span class=\"menu-icon\"><icon name=\"variable\"></icon></span>Store as global variable</button> <button v-if=\"valueMenu.propertyPath\" class=\"menu-item\" role=\"menuitem\" @click=\"copyPropertyPath()\"><span class=\"menu-icon\"><icon name=\"path\"></icon></span>Copy property path</button><template v-if=\"!valueMenu.isPrimitive\"><div class=\"menu-separator\"></div><button class=\"menu-item\" role=\"menuitem\" @click=\"refreshValue()\"><span class=\"menu-icon\"><icon name=\"refresh\"></icon></span>Refresh</button></template></div><div v-if=\"toast\" class=\"toast\" role=\"status\">{{ toast.message }}</div><div v-if=\"isPoppedOut\" class=\"popped-out\"><div class=\"popped-out-content\"><span class=\"logo logo-medium\"><svg class=\"logo-mark\"><use href=\"#logo-mark\"/></svg><span class=\"logo-text\"><span class=\"logo-your\">Your</span>JS Box</span></span><div class=\"popped-out-title\">This console is open in a separate window</div><div class=\"popped-out-text\">Its code still runs in this page.</div><div class=\"dialog-buttons\"><button class=\"dialog-button\" @click=\"focusPopOut\">Show the window</button> <button class=\"dialog-button primary\" @click=\"requestPopIn\">Bring it back</button></div></div></div><div v-if=\"isAboutOpen\" class=\"dialog-backdrop\" @mousedown.self=\"closeAbout\" @keydown.esc=\"closeAbout\"><div :class=\"['dialog', 'about-dialog', aboutTab === 'html' ? 'is-export' : '']\" role=\"dialog\" aria-modal=\"true\" aria-label=\"About YourJS Box\"><div class=\"about-header\"><div class=\"tabs\" role=\"tablist\"><button role=\"tab\" :aria-selected=\"aboutTab === 'about'\" :class=\"['tab', aboutTab === 'about' ? 'active' : '']\" @click=\"aboutTab = 'about'\">About</button> <button role=\"tab\" :aria-selected=\"aboutTab === 'html'\" :class=\"['tab', aboutTab === 'html' ? 'active' : '']\" @click=\"aboutTab = 'html'\">Copy as HTML</button></div><button class=\"close-button\" ref=\"aboutCloseButton\" title=\"Close\" @click=\"closeAbout\"><icon name=\"close\"></icon></button></div><div v-if=\"aboutTab === 'about'\" class=\"about-body\"><div class=\"about-title\"><span class=\"logo logo-medium\"><svg class=\"logo-mark\"><use href=\"#logo-mark\"/></svg><span class=\"logo-text\"><span class=\"logo-your\">Your</span>JS Box</span></span><div><div class=\"about-name\">YourJS Box</div><div class=\"about-version\">Version {{ packageInfo.version }}</div></div></div><p class=\"about-description\">An interactive JavaScript console that can be embedded in any web page with a single script tag.</p><div class=\"about-links\"><a :href=\"packageInfo.homepage\" target=\"_blank\" rel=\"noopener\">Website</a> <a :href=\"packageInfo.repoUrl\" target=\"_blank\" rel=\"noopener\">GitHub</a> <a :href=\"packageInfo.repoUrl + '#readme'\" target=\"_blank\" rel=\"noopener\">Documentation</a> <a :href=\"packageInfo.bugsUrl\" target=\"_blank\" rel=\"noopener\">Report an issue</a></div><h3>This console</h3><dl class=\"about-details\"><dt>Code runs in</dt><dd>{{ runnerDescription }}</dd><dt>Theme</dt><dd>{{ themeDescription }}</dd><dt>Language</dt><dd>{{ isTypeScript ? 'TypeScript (types are removed by Babel, not checked)' : 'JavaScript' }}</dd><dt>Code blocks run as</dt><dd>{{ blockTypeDescription }}</dd><dt>Imports</dt><dd>{{ importsUrl ? 'Packages imported by name load from ' + importsUrl.replace('{specifier}', '\u2026') : 'Only URLs and paths can be imported' }}</dd><dt>Results</dt><dd>{{ showResults ? 'The value of the last expression is shown' : 'Not shown' }}</dd><dt>Layout</dt><dd>{{ layoutDescription }}</dd></dl><h3>Keyboard shortcuts</h3><dl class=\"about-details\"><dt><kbd>{{ modKey }}</kbd> + <kbd>Enter</kbd></dt><dd>Run the next block of code</dd><dt><kbd>&uarr;</kbd> / <kbd>&darr;</kbd></dt><dd>Go through the code that was run (at the very start or end of the editor)</dd><dt><kbd>{{ modKey === 'Ctrl' ? 'Alt' : '&#8997;' }}</kbd> + <kbd>H</kbd></dt><dd>Show the history</dd><dt><kbd>Esc</kbd></dt><dd>Close this window, the menu or full screen</dd></dl><div class=\"about-footer\">MIT License &copy; 2023-present Chris West &middot; Built with {{ builtWith }}</div></div><div v-else class=\"about-body export-body\"><div class=\"export-options\"><div class=\"segmented\" role=\"radiogroup\" aria-label=\"Code\"><button v-for=\"option in exportCodeOptions\" role=\"radio\" :aria-checked=\"exportCode === option.value\" :class=\"exportCode === option.value ? 'active' : ''\" @click=\"exportCode = option.value\">{{ option.label }}</button></div><div class=\"segmented\" role=\"radiogroup\" aria-label=\"Format\"><button v-for=\"option in exportFormatOptions\" role=\"radio\" :aria-checked=\"exportFormat === option.value\" :class=\"exportFormat === option.value ? 'active' : ''\" @click=\"exportFormat = option.value\">{{ option.label }}</button></div></div><div class=\"export-note\">{{ exportNote }}</div><div class=\"export-preview\"><ace-editor :model-value=\"exportHtml\" language=\"html\" :theme=\"theme\" height=\"100%\" :read-only=\"true\"></ace-editor></div><div class=\"export-actions\"><button class=\"dialog-button\" @click=\"downloadExport\">Download page</button> <button class=\"dialog-button primary\" @click=\"copyExport\">{{ copyLabel }}</button></div></div></div></div><div v-if=\"dialog\" class=\"dialog-backdrop\" @mousedown.self=\"closeDialog(false)\" @keydown.esc=\"closeDialog(false)\"><div class=\"dialog\" role=\"alertdialog\" aria-modal=\"true\" :aria-label=\"dialog.title\"><div class=\"dialog-title\">{{ dialog.title }}</div><div class=\"dialog-message\">{{ dialog.message }}</div><div class=\"dialog-buttons\"><button class=\"dialog-button\" @click=\"closeDialog(false)\">Cancel</button> <button class=\"dialog-button primary\" ref=\"dialogConfirmButton\" @click=\"closeDialog(true)\">{{ dialog.confirmText }}</button></div></div></div></div>";
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
   * The libraries that the viewer loads along with the exact versions that it
   * was tested with.
   */
  const LIBRARY_VERSIONS = {
    // Only loaded by TypeScript consoles.
    '@babel/standalone': '7.29.9',
    'ace-builds': '1.44.0',
    'acorn': '8.18.0',
    'prism-themes': '1.9.0',
    'prismjs': '1.30.0',
    'vue': '3.5.43',
  };

  /**
   * Where the libraries are loaded from unless data-libraries-url is given.
   * `{name}` and `{version}` are replaced with each library's name and version.
   */
  const DEFAULT_LIBRARIES_URL = 'https://unpkg.com/{name}@{version}/';

  /**
   * @param {string} librariesUrl
   *   The URL template (see DEFAULT_LIBRARIES_URL).  Relative URLs are relative
   *   to the page.
   * @param {keyof LIBRARY_VERSIONS} name
   * @param {string} path
   *   The path of the file within the library's package.
   * @returns {string}
   */
  function getLibraryFileUrl(librariesUrl, name, path) {
    const baseUrl = librariesUrl
      .replace(/\{(name|version)\}/g, (_, key) => key === 'name' ? name : LIBRARY_VERSIONS[name])
      .replace(/\/?$/, '/');
    return new URL(baseUrl + path, document.baseURI).href;
  }

  /**
   * Where packages imported by name (eg. `import _ from 'lodash'`) are loaded
   * from unless data-imports-url is given.  `{specifier}` is replaced with what
   * was imported (eg. "lodash@4/fp").
   */
  const DEFAULT_IMPORTS_URL = 'https://esm.sh/{specifier}';

  /**
   * Makes the part of a URL template before its first placeholder absolute
   * (relative to the page) because the code runs somewhere (eg. a worker)
   * that doesn't know the page's URL.
   * @param {string} template
   * @returns {string}
   */
  function resolveUrlTemplate(template) {
    const index = template.indexOf('{');
    const prefix = index < 0 ? template : template.slice(0, index);
    return new URL(prefix || './', document.baseURI).href.replace(/\/$/, prefix.endsWith('/') || !prefix ? '/' : '')
      + (index < 0 ? '' : template.slice(index));
  }

  /**
   * The only functions that may be relayed to the viewer and to the runner.
   * The runner executes the user's code so anything it sends must be limited
   * to these calls.
   */
  const RELAYABLE_FUNCS = {
    viewer: ['appendLog', 'appendError', 'clearDisplays', 'onCodeRan', 'onStoredAsGlobal', 'onValueJson', 'updateDescriptionFor'],
    runner: ['clearLogs', 'getValueAsJson', 'refreshDescription', 'reset', 'runCode', 'sendDescriptionFor', 'storeAsGlobal'],
    // Things that the viewer (but never the runner) can ask this script to do.
    host: ['focusPopOut', 'popIn', 'popOut', 'requestPopIn', 'setMaximized'],
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

  /**
   * Creates the runner which runs the user's code and reports what it logs.  This
   * function must be self-contained because in worker mode it is converted to a
   * string and run inside of a Web Worker.
   * @param {(message: {target: string, func: string, args: any[]}) => void} send
   *   Sends a message to the viewer (relayed by the main script).
   * @param {Object} options
   * @param {"worker"|"window"} options.mode
   *   "worker" if running inside of a Web Worker or "window" if running directly
   *   in the page that included the main script.
   * @param {string=} options.ownUrl
   *   The URL of the script containing this function.  Stack trace lines that
   *   refer to it are removed so that only the lines for the user's code remain.
   */
  function createRunner(send, options) {
    const {mode} = options;
    const ownUrl = options.ownUrl || (mode === 'worker' ? self.location.href : '');
    const logArgsById = {};
    let logCount = 0;
    let snippetCount = 0;
    let canImportDataUrls = true;
    // The type of the block of code that is running (see runCode()).
    let runningBlockType;
    // How wrapping the last expression of each block shifted the columns on its
    // line so that stack traces can show the original columns.
    const columnShiftsBySnippet = {};
    // For TypeScript, where each position in the code that ran came from in the
    // TypeScript code (see runCode()).
    const sourceMapsBySnippet = {};
  
    const counts = {};
    const timers = {};
    // The IDs of the groups (from console.group()) that are currently open.
    let groupIds = [];
    let groupCount = 0;
  
    // Called by the code that is run (see runCode()) with the value of the last
    // expression.  The key is unique to this runner because in window mode more
    // than one console can be on the same page.
    const RESULT_KEY = `yourjs-box.result.${Math.random().toString(36).slice(2)}`;
    globalThis[Symbol.for(RESULT_KEY)] = reportResult;
  
    // The console functions that were replaced so that they can be restored.
    const consoleWrappers = [];
  
    // Overrides for console functions.  In window mode this also captures
    // anything else that the page logs, just like the browser's console.
    for (const key of [
      'assert', 'clear', 'count', 'countReset', 'debug', 'dir', 'dirxml', 'error',
      'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'table', 'time',
      'timeEnd', 'timeLog', 'trace', 'warn',
    ]) {
      const original = console[key];
      if ('function' !== typeof original) continue;
      const wrapper = function(...args) {
        handleConsoleCall(key, args);
  
        // Calls and returns the original console function.
        return original.apply(this, arguments);
      };
      console[key] = wrapper;
      consoleWrappers.push({key, original, wrapper});
    }
  
    /**
     * Shows what was passed to a console function in the same way that the
     * browser's console would.
     * @param {string} key
     * @param {any[]} args
     */
    function handleConsoleCall(key, args) {
      const label = args.length && args[0] !== undefined ? `${args[0]}` : 'default';
  
      if (key === 'clear') {
        clearLogs();
        groupIds = [];
        send({target: 'viewer', func: 'clearDisplays', args: [true]});
      }
      else if (key === 'assert') {
        if (args[0]) return;
        const rest = args.slice(1);
        addLog('assert', !rest.length
          ? ['Assertion failed: console.assert']
          : 'string' === typeof rest[0]
            ? ['Assertion failed: ' + rest[0], ...rest.slice(1)]
            : ['Assertion failed:', ...rest]);
      }
      else if (key === 'count') {
        counts[label] = (counts[label] || 0) + 1;
        addLog('count', [`${label}: ${counts[label]}`]);
      }
      else if (key === 'countReset') {
        if (Object.hasOwn(counts, label)) counts[label] = 0;
        else addLog('warn', [`Count for '${label}' does not exist`]);
      }
      else if (key === 'time') {
        if (Object.hasOwn(timers, label)) addLog('warn', [`Timer '${label}' already exists`]);
        else timers[label] = performance.now();
      }
      else if (key === 'timeLog' || key === 'timeEnd') {
        if (!Object.hasOwn(timers, label)) {
          addLog('warn', [`Timer '${label}' does not exist`]);
          return;
        }
        const ms = performance.now() - timers[label];
        if (key === 'timeEnd') delete timers[label];
        addLog(key, [`${label}: ${+ms.toFixed(3)} ms`, ...(key === 'timeLog' ? args.slice(1) : [])]);
      }
      else if (key === 'trace') {
        // Removes the first line ("Error") and this runner's own lines.
        const stack = cleanStack(new Error().stack ?? '').split('\n').slice(1).join('\n');
        addLog('trace', args.length ? args : ['console.trace'], {stack});
      }
      else if (key === 'group' || key === 'groupCollapsed') {
        const groupId = `${++groupCount}`;
        addLog(key, args.length ? args : ['console.group'], {groupId, isCollapsed: key === 'groupCollapsed'});
        groupIds.push(groupId);
      }
      else if (key === 'groupEnd') {
        groupIds.pop();
      }
      else {
        const table = key === 'table' ? parseTable(args[0], args[1]) : null;
  
        // console.table() only shows the data that was tabulated.
        addLog(key, table ? args.slice(0, 1) : args, {table});
      }
    }
  
    /**
     * Sends a message to show in the console.
     * @param {string} key
     *   The name of the console function (eg. "log").
     * @param {any[]} args
     * @param {Object=} extra
     *   Other properties to send along with the message.
     * @param {number=} depth
     *   Optional, defaults to `0`.  The depth used to summarize the args (see
     *   summarize()).
     */
    function addLog(key, args, extra, depth = 0) {
      // Keep track of the args so that they can be expanded later.
      const logId = `${++logCount}`;
      logArgsById[logId] = args.map(value => ({...summarize(value, depth), value}));
  
      send({
        target: 'viewer',
        func: 'appendLog',
        args: [{
          logId,
          key,
          descriptions: logArgsById[logId].map(without(['value'])),
          groupIds: groupIds.slice(),
          ...extra,
        }]
      });
    }
  
    /**
     * Shows the value of the last expression in the code that was run unless
     * it is `undefined`.
     * @param {*} value
     */
    function reportResult(value) {
      // Like the browser, strings are quoted (but logged strings aren't).
      if (value !== undefined) addLog('result', [value], {}, 'string' === typeof value ? 1 : 0);
    }
  
    function onError(evt) {
      reportUncaught(evt.error !== undefined ? evt.error : evt.message);
    }
    function onUnhandledRejection(evt) {
      reportUncaught(evt.reason, true);
    }
    addEventListener('error', onError);
    addEventListener('unhandledrejection', onUnhandledRejection);
  
    /**
     * Stops capturing what is logged (used when a console in window mode is
     * destroyed).  Each console function is restored unless something else has
     * replaced it since.
     */
    function destroy() {
      removeEventListener('error', onError);
      removeEventListener('unhandledrejection', onUnhandledRejection);
      delete globalThis[Symbol.for(RESULT_KEY)];
      for (const {key, original, wrapper} of consoleWrappers) {
        if (console[key] === wrapper) console[key] = original;
      }
      clearLogs();
    }
  
    /**
     * @param {*} error
     * @param {boolean=} isInPromise
     */
    function reportUncaught(error, isInPromise) {
      // Points out how to use top-level await or import statements if they were
      // used in a classic block.
      const feature = runningBlockType === 'classic' && error?.name === 'SyntaxError'
        ? /\bawait\b/.test(error.message) ? 'top-level await' : /\bimport\b/.test(error.message) ? 'import statements' : null
        : null;
      const hint = feature ? `\n(To use ${feature}, add data-block-type="module" to the script tag.)` : '';
      send({
        target: 'viewer',
        func: 'appendError',
        args: [{
          message: (isInPromise ? 'Uncaught (in promise) ' : 'Uncaught ')
            + cleanStack(error?.stack ?? `${error?.message ?? error}`)
            + hint,
        }]
      });
    }
  
    /**
     * Removes the lines of a stack trace that refer to this runner's own code so
     * that only the lines for the user's code are left.
     * @param {string} stack
     * @returns {string}
     */
    function cleanStack(stack) {
      return `${stack}`
        .split('\n')
        .filter(line => !(ownUrl && /^\s*at\b/.test(line) && line.includes(ownUrl)))
        .join('\n')
        .replace(/(snippet-\d+\.[jt]s):(\d+):(\d+)/g, (match, name, line, column) => {
          line = +line;
          column = +column;
          // Undoes the shift in columns caused by wrapping the last expression.
          const info = columnShiftsBySnippet[name];
          if (info && line === info.line && column > info.column) {
            column = Math.max(info.column, column - info.shift);
          }
          [line, column] = toSourcePosition(sourceMapsBySnippet[name], line, column);
          return `${name}:${line}:${column}`;
        });
    }
  
    /**
     * Finds where a position in compiled code came from in the original code.
     * @param {number[][][]=} sourceMap
     *   For each line of the compiled code, its mappings as [compiled column,
     *   original line, original column] (all starting at 0) sorted by column.
     * @param {number} line
     * @param {number} column
     * @returns {[number, number]}
     *   The original line and column (both starting at 1) or the given ones if
     *   the position isn't mapped.
     */
    function toSourcePosition(sourceMap, line, column) {
      const mappings = sourceMap?.[line - 1];
      let best;
      for (const mapping of mappings ?? []) {
        if (mapping[0] > column - 1) break;
        best = mapping;
      }
      return best ? [best[1] + 1, best[2] + 1 + (column - 1 - best[0])] : [line, column];
    }
  
    function without(props, obj) {
      if (!obj) return obj => without(props, obj);
      const ret = {...obj};
      for (const prop of props) delete ret[prop];
      return ret;
    }
  
    /**
     * Turns the arguments passed to `console.table()` into a table similar to the
     * one that the browser's console would show.
     * @param {*} data
     * @param {string[]=} columns
     *   Optional.  If given only these columns will be shown.
     * @return {{headers: string[], rows: {index: string, cells: (ReturnType<summarize>|null)[]}[]}|null}
     *   The table or `null` if `data` cannot be shown as a table.
     */
    function parseTable(data, columns) {
      if (data === null || 'object' !== typeof data) return null;
  
      const VALUE_HEADER = 'Value';
      const headers = [];
      let hasValueColumn = false;
      const rowsData = Object.keys(data).map(index => {
        const row = data[index];
        const rowData = {index, values: {}, hasValue: false};
        if (row !== null && ('object' === typeof row || 'function' === typeof row)) {
          for (const key of Object.keys(row)) {
            if (!headers.includes(key)) headers.push(key);
            rowData.values[key] = row[key];
          }
        }
        else {
          hasValueColumn = true;
          rowData.hasValue = true;
          rowData.value = row;
        }
        return rowData;
      });
  
      // Like the browser, only show the "Value" column if no columns were given.
      const shownHeaders = Array.isArray(columns) ? columns.map(c => `${c}`) : headers;
      const showValueColumn = hasValueColumn && !Array.isArray(columns);
      return {
        headers: ['(index)', ...shownHeaders, ...(showValueColumn ? [VALUE_HEADER] : [])],
        rows: rowsData.map(({index, values, hasValue, value}) => ({
          index,
          cells: [
            ...shownHeaders.map(h => Object.hasOwn(values, h) ? summarize(values[h], 2) : null),
            ...(showValueColumn ? [hasValue ? summarize(value, 2) : null] : []),
          ],
        })),
      };
    }
  
    /**
     * @param {*} value 
     * @returns {string}
     */
    function getTypeName(value) {
      if (value === null || value === undefined) return '' + value;
      const typeOfValue = typeof value;
      // Checking for object or undefined because document.all has a type of
      // undefined.
      return (typeOfValue === 'object' || typeOfValue === 'undefined')
        ? Object.prototype.toString.call(value).slice(8, -1)
        : typeOfValue;
    }
  
    /**
     * Gets the name of the class that `value` is an instance of (eg. "Person" for
     * `new Person()`) falling back to `typeName` if the name can't be determined.
     * @param {*} value
     * @param {string} typeName
     * @returns {string}
     */
    function getClassName(value, typeName) {
      try {
        const name = Object.getPrototypeOf(value)?.constructor?.name;
        if (name && 'string' === typeof name) return name;
      } catch (e) {}
      return typeName;
    }
  
    /**
     * The maximum number of properties or items shown in a preview.
     */
    const MAX_PREVIEW_PROPS = 5;
    const MAX_PREVIEW_ITEMS = 100;
  
    /**
     * A preview is made up of parts so that the viewer can color each part like
     * the browser's console does.  Each part is `[kind, text]` where `kind` is one
     * of "text", "key", "string", "number", "null", "symbol", "regexp" or
     * "function".
     * @typedef {[string, string][]} PreviewParts
     */
  
    /**
     * @param {*} value
     * @param {number=} depth
     *   Optional, defaults to `0`.  `0` is used for values passed directly to a
     *   console function, `1` for property values shown when expanding an object
     *   and `2` for values nested within another value's preview.
     * @param {boolean=} isPrototype
     *   Optional, defaults to `false`.  If `true` only the name of the prototype
     *   will be shown (eg. "Object").
     * @returns {{typeName: string, isPrimitive: boolean, parts: PreviewParts}}
     */
    function summarize(value, depth = 0, isPrototype = false) {
      const typeName = getTypeName(value);
      const isPrimitive = typeName === 'function'
        ? false
        : typeName === typeName.toLowerCase();
      const parts = isPrototype
        ? [['text', typeName !== 'Object' ? typeName : getClassName(value, typeName)]]
        : getPreviewParts(value, depth, typeName);
      return {typeName, isPrimitive, parts};
    }
  
    /**
     * @param {*} value
     * @param {number} depth
     * @param {string=} typeName
     * @returns {PreviewParts}
     */
    function getPreviewParts(value, depth, typeName = getTypeName(value)) {
      if (typeName === 'string') {
        if (!depth) return [['text', value]];
        if (depth > 1 && value.length > 100) value = value.slice(0, 99) + '\u2026';
        return [['string', quote(value)]];
      }
      if (typeName === 'number') return [['number', Object.is(value, -0) ? '-0' : '' + value]];
      if (typeName === 'bigint') return [['number', value + 'n']];
      if (typeName === 'boolean') return [['number', '' + value]];
      if (typeName === 'null' || typeName === 'undefined') return [['null', typeName]];
      if (typeName === 'symbol') return [['symbol', value.toString()]];
      if (typeName === 'function') return getFunctionPreviewParts(value, depth);
  
      // Previewing can throw for objects like Map.prototype which claim to be a
      // Map (via Symbol.toStringTag) but whose getters only work on a Map.
      try {
        return getObjectPreviewParts(value, depth, typeName);
      }
      catch (e) {
        return [['text', typeName]];
      }
    }
  
    /**
     * Quotes a string the way the browser's console does.
     * @param {string} string
     * @returns {string}
     */
    function quote(string) {
      const json = JSON.stringify(string);
      return string.includes("'")
        ? json
        : `'${json.slice(1, -1).replace(/\\"/g, '"')}'`;
    }
  
    /**
     * @param {Function} value
     * @param {number} depth
     * @returns {PreviewParts}
     */
    function getFunctionPreviewParts(value, depth) {
      let source = '';
      try {
        source = Function.prototype.toString.call(value);
      } catch (e) {}
      const isClass = /^class\b/.test(source);
  
      // Like the browser, show the source of functions passed directly to a
      // console function.
      if (!depth) {
        return [['text', isClass ? source : source.replace(/^(async\s+)?function\b\s*/, '$1\u0192 ')]];
      }
      if (depth > 1) return [['function', '\u0192']];
      return [['function', isClass ? `class ${value.name}` : `\u0192 ${value.name}()`]];
    }
  
    /**
     * @param {*} value
     * @param {number} depth
     * @param {string} typeName
     * @returns {PreviewParts}
     */
    function getObjectPreviewParts(value, depth, typeName) {
      const className = getClassName(value, typeName);
      const isArrayLike = /^Array(?:[^a-z]|$)|[^A-Z]Array$/.test(typeName);
  
      if (typeName === 'Date') {
        return [['text', isNaN(value) ? 'Invalid Date' : Date.prototype.toString.call(value)]];
      }
      if (typeName === 'RegExp') return [['regexp', '' + value]];
      // The state of a promise can't be determined synchronously.
      if (typeName === 'Promise') return [['text', `${className} {\u2026}`]];
      // DOM nodes (only available in window mode) are shown like the browser
      // shows them in previews (eg. "h2#title.big").
      if ('undefined' !== typeof Node && value instanceof Node) {
        if (value.nodeType === Node.ELEMENT_NODE) {
          return [['node', value.localName
            + (value.id ? '#' + value.id : '')
            + [...value.classList].map(c => '.' + c).join('')]];
        }
        if (value.nodeType === Node.TEXT_NODE) return [['string', quote(value.data)]];
        return [['node', value.nodeName]];
      }
      if (value instanceof Error) {
        return [['text', !depth ? cleanStack(value.stack ?? `${value}`) : `${value.name}: ${value.message}`]];
      }
  
      // Values nested within another preview are abbreviated.
      if (depth > 1) {
        if (isArrayLike) return [['text', `${className}(${value.length})`]];
        if (typeName === 'Map' || typeName === 'Set') return [['text', `${className}(${value.size})`]];
        return [['text', className === 'Object' ? '{\u2026}' : className]];
      }
  
      const parts = [];
      const addItems = (items, total, addItem) => {
        items.forEach((item, index) => {
          if (index) parts.push(['text', ', ']);
          addItem(item);
        });
        if (total > items.length) parts.push(['text', (items.length ? ', ' : '') + '\u2026']);
      };
  
      if (isArrayLike) {
        const length = value.length;
        parts.push(['text', typeName === 'Array' && className === 'Array' ? `(${length}) [` : `${className}(${length}) [`]);
        addItems(
          Array.from({length: Math.min(length, MAX_PREVIEW_ITEMS)}, (_, i) => i),
          length,
          i => parts.push(...(i in value ? getPreviewParts(value[i], 2) : [['null', 'empty']]))
        );
        parts.push(['text', ']']);
      }
      else if (typeName === 'Map' || typeName === 'Set') {
        const items = [...value].slice(0, MAX_PREVIEW_ITEMS);
        parts.push(['text', `${className}(${value.size}) {`]);
        addItems(items, value.size, item => {
          if (typeName === 'Map') {
            parts.push(...getPreviewParts(item[0], 2), ['text', ' => '], ...getPreviewParts(item[1], 2));
          }
          else {
            parts.push(...getPreviewParts(item, 2));
          }
        });
        parts.push(['text', '}']);
      }
      else {
        const keys = Object.keys(value);
        if (className !== 'Object') parts.push(['text', className + ' ']);
        if (typeName === 'Number' || typeName === 'String' || typeName === 'Boolean') {
          parts.push(['text', '{'], ...getPreviewParts(value.valueOf(), 2), ['text', '}']);
        }
        else {
          parts.push(['text', '{']);
          addItems(keys.slice(0, MAX_PREVIEW_PROPS), keys.length, key => {
            // Like the browser, don't call getters just to show a preview.
            const descriptor = Object.getOwnPropertyDescriptor(value, key);
            parts.push(
              ['key', key],
              ['text', ': '],
              ...('value' in descriptor ? getPreviewParts(descriptor.value, 2) : [['text', '(\u2026)']])
            );
          });
          parts.push(['text', '}']);
        }
      }
      return parts;
    }
  
    /**
     * Describes the children of a value so that it can be expanded in the viewer.
     * @param {*} value
     * @param {*=} receiver
     *   Optional, defaults to `value`.  The object used as `this` when calling
     *   getters.  When describing a prototype this is the object that was
     *   originally logged so that getters (eg. `size` on `Map.prototype`) work.
     */
    function describe(value, receiver = value) {
      const typeName = getTypeName(value);
      const entries = [];
      const $entries = [];
      const protoEntries = [];
      const $protoEntries = [];
      let wasIterated = false;
  
      if (value !== null && ('object' === typeof value || 'function' === typeof value)) {
        try {
          // Map
          if (typeName === 'Map') {
            for (const [k, v] of [...value]) {
              entries.push([getPreviewParts(k, 2).map(part => part[1]).join(''), summarize(v, 1)]);
              $entries.push({value: v});
            }
            wasIterated = true;
          }
          // other iterable (eg. Int8Array, Set)
          else if (typeName !== 'Array' && typeName !== 'function' && 'function' === typeof value[Symbol.iterator]) {
            let index = 0;
            for (const v of value) {
              entries.push(['' + index, summarize(v, 1)]);
              $entries.push({value: v});
              ++index;
            }
            wasIterated = true;
          }
        }
        catch (e) {
          // Prototypes such as Map.prototype look iterable but cannot be iterated
          // so their properties will be listed instead.
          entries.length = $entries.length = 0;
        }
  
        // Array, Object, functions, prototypes, etc.
        if (!wasIterated) {
          for (const k of Object.getOwnPropertyNames(value)) {
            try {
              const descriptor = Object.getOwnPropertyDescriptor(value, k);
              const v = 'value' in descriptor ? descriptor.value : Reflect.get(value, k, receiver);
              entries.push([k, summarize(v, 1), descriptor.enumerable]);
              $entries.push({value: v});
            } catch(e) {}
          }
        }
  
        // The prototype is its own subtree which can be expanded to see its
        // properties (and its own prototype).
        const proto = Object.getPrototypeOf(value);
        if (proto !== null) {
          protoEntries.push(['[[Prototype]]', summarize(proto, 1, true)]);
          $protoEntries.push({value: proto, receiver});
        }
      }
  
      // Map and Set entries (and other iterated values) aren't properties so
      // they have no property path.
      return {entries, protoEntries, entriesArePropertyKeys: !wasIterated, $entries, $protoEntries};
    }
  
    // ['123', 0, 'entries', 0]
    // ['123', 0, 'entries', 0]
    // LOGS = {
    //   '123': [
    //     {
    //       value: {a: 4},
    //       $entries: [{value: 4}]
    //     }
    //   ]
    // }
  
    /**
     * Runs a block of code.
     * @param {string} jsCode
     * @param {Object=} runOptions
     * @param {"classic"|"module"=} runOptions.blockType
     *   "classic" (the default) runs the code as a classic script so that
     *   top-level declarations are shared between all of the code that is run.
     *   "module" runs the code as a module which allows for top-level await and
     *   import statements, but top-level declarations stay in the module.
     * @param {[number, number]=} runOptions.resultRange
     *   The start and end index of the last expression in the code whose value
     *   should be shown.
     * @param {"javascript"|"typescript"=} runOptions.language
     *   The language that the code was written in.  TypeScript is compiled to
     *   JavaScript before it is sent here.
     * @param {number[][][]=} runOptions.sourceMap
     *   For TypeScript, where the compiled code came from (see
     *   toSourcePosition()).
     * @param {{message: string, line: number, column: number}=} runOptions.compileError
     *   For TypeScript, the syntax error that kept the code from being compiled
     *   which is reported instead of running the code.
     */
    async function runCode(jsCode, runOptions) {
      const {blockType, resultRange, language, sourceMap, compileError} = Object(runOptions);
  
      // Names the code so that stack traces refer to it by this name.
      const snippetName = `snippet-${++snippetCount}.${language === 'typescript' ? 'ts' : 'js'}`;
      if (Array.isArray(sourceMap)) sourceMapsBySnippet[snippetName] = sourceMap;
  
      // Wraps the last expression so that its value is reported.  This keeps
      // everything on the same lines so that line numbers in errors still match
      // and the shift in columns is recorded so they can be fixed too.
      if (Array.isArray(resultRange)) {
        const [start, end] = resultRange;
        const prefix = `globalThis[Symbol.for(${JSON.stringify(RESULT_KEY)})]((`;
        const linesBefore = jsCode.slice(0, start).split('\n');
        columnShiftsBySnippet[snippetName] = {
          line: linesBefore.length,
          column: linesBefore[linesBefore.length - 1].length + 1,
          shift: prefix.length,
        };
        jsCode = jsCode.slice(0, start) + prefix + jsCode.slice(start, end) + '))' + jsCode.slice(end);
      }
  
      const source = `${jsCode}\n//# sourceURL=${snippetName}`;
  
      runningBlockType = blockType === 'module' ? 'module' : 'classic';
      try {
        if (compileError) {
          // Reported here so that it shows up after anything logged by the code
          // that ran before it.
          const {message, line, column} = compileError;
          reportUncaught({
            name: 'SyntaxError',
            message: `${message}`,
            stack: `SyntaxError: ${message}\n    at ${snippetName}:${+line}:${+column}`,
          });
        }
        else if (blockType === 'module') {
          // Waits for the module to finish (including any top-level await).
          await import('data:text/javascript;charset=utf-8,' + encodeURIComponent(source));
        }
        else if (mode === 'worker') {
          importCode(source);
        }
        else {
          const script = document.createElement('script');
          script.textContent = source;
          document.head.appendChild(script);
          script.remove();
        }
      }
      catch (e) {
        reportUncaught(e);
      }
      runningBlockType = undefined;
  
      // Lets the viewer know that the code finished running and that any logs
      // made while it ran have already been sent.
      send({target: 'viewer', func: 'onCodeRan', args: []});
    }
  
    /**
     * Runs code in the worker via importScripts() so that it runs as a classic
     * script.  A data URL is used because a worker with an opaque origin (which
     * is the case when the worker itself was created from a data URL) can't
     * always import blob URLs (eg. Chrome on HTTPS sites).  If data URLs can't be
     * imported a blob URL is used instead.  Either way a failure to load means
     * the code never ran, so it is safe to try again with the other kind of URL.
     * @param {string} source
     */
    function importCode(source) {
      if (canImportDataUrls) {
        try {
          importScripts('data:text/javascript;charset=utf-8,' + encodeURIComponent(source));
          return;
        }
        catch (e) {
          if (e?.name !== 'NetworkError') throw e;
          canImportDataUrls = false;
        }
      }
      const url = URL.createObjectURL(new Blob([source], {type: 'text/javascript'}));
      try {
        importScripts(url);
      }
      finally {
        URL.revokeObjectURL(url);
      }
    }
  
    /**
     * @param {(string|number)[]} path
     *   The log ID, the argument index and then pairs of entry group keys and
     *   entry indices.
     */
    function sendDescriptionFor(path) {
      sendDescription(path, false);
    }
  
    /**
     * Describes the value again (eg. after the code changed it) including its
     * preview.
     * @param {(string|number)[]} path
     */
    function refreshDescription(path) {
      sendDescription(path, true);
    }
  
    /**
     * @param {(string|number)[]} path
     * @param {boolean} isRefresh
     *   If `true` the value's preview is included too.
     */
    function sendDescription(path, isRefresh) {
      const level = getLevel(path);
      if (!level) return;
      const description = describe(level.value, 'receiver' in level ? level.receiver : level.value);
  
      // Change the summary to an actual description at the level found.
      Object.assign(level, description);
  
      // Send the description without values back to the viewer.
      const summary = isRefresh
        ? summarize(level.value, path.length > 2 ? 1 : 0, path[path.length - 2] === 'protoEntries')
        : {};
      send({
        target: 'viewer',
        func: 'updateDescriptionFor',
        args: [path, {...without(['$entries', '$protoEntries'], description), ...summary}],
      });
    }
  
    /**
     * Finds what is stored for a logged value (or a value within it).
     * @param {(string|number)[]} path
     *   The log ID, the argument index and then pairs of entry group keys and
     *   entry indices.
     * @returns {{value: *, receiver?: *}|undefined}
     */
    function getLevel(path) {
      let level = logArgsById;
      path.forEach((pathPart, index) => {
        level = level?.[index && index % 2 === 0 ? '$' + pathPart : pathPart];
      });
      return level;
    }
  
    /**
     * Sends a value as JSON to the viewer (eg. to copy or save it).
     * @param {(string|number)[]} path
     * @param {string} requestId
     */
    function getValueAsJson(path, requestId) {
      const level = getLevel(path);
      let result;
      try {
        result = level ? toJson(level.value) : {error: 'The value is no longer available.'};
      }
      catch (e) {
        result = {error: `The value couldn't be converted to JSON (${e?.message ?? e}).`};
      }
      send({target: 'viewer', func: 'onValueJson', args: [{requestId, ...result}]});
    }
  
    /**
     * Converts a value to JSON like JSON.stringify() does except that Maps and
     * Sets become arrays, BigInts become strings and circular references (an
     * object inside of itself) are left out instead of causing an error.  An
     * object that appears more than once without being circular is kept.
     * @param {*} value
     * @returns {{json?: string, circularCount: number, error?: string}}
     */
    function toJson(value) {
      let circularCount = 0;
      // The objects currently being converted along with what they were
      // converted from (eg. a Map is converted to an array).
      const stack = [];
      const json = JSON.stringify(value, function(key, val) {
        // `this` is the object containing `key` so anything after it on the
        // stack has already been converted.
        while (stack.length && stack[stack.length - 1].converted !== this) stack.pop();
  
        if ('bigint' === typeof val) return `${val}`;
        if (val !== null && 'object' === typeof val) {
          const original = val;
          if (stack.some(item => item.original === original)) {
            circularCount++;
            return undefined;
          }
          if (val instanceof Map || val instanceof Set) val = [...val];
          stack.push({original, converted: val});
        }
        return val;
      }, 2);
      return json === undefined
        ? {error: 'This value can\'t be represented as JSON.', circularCount}
        : {json, circularCount};
    }
  
    /**
     * Stores a value as a global variable (temp1, temp2, etc.) like the
     * browser's console does so that code can use it.
     * @param {(string|number)[]} path
     */
    function storeAsGlobal(path) {
      const level = getLevel(path);
      if (!level) return;
      let index = 1;
      while (`temp${index}` in globalThis) index++;
      globalThis[`temp${index}`] = level.value;
      send({target: 'viewer', func: 'onStoredAsGlobal', args: [`temp${index}`]});
    }
  
    /**
     * Forgets all of the logged values (eg. when the console is cleared).
     */
    function clearLogs() {
      for (const logId of Object.keys(logArgsById)) delete logArgsById[logId];
      groupIds = [];
    }
  
    return {clearLogs, destroy, getValueAsJson, refreshDescription, runCode, sendDescriptionFor, storeAsGlobal};
  }
  

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
      destroy() {
        worker.terminate();
        if (blobUrl) URL.revokeObjectURL(blobUrl);
      },
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
      destroy() {
        runner.destroy();
      },
      apply(func, args) {
        // Anything the code defined stays defined so a reset can only forget
        // the logged values.
        if (func === 'reset') runner.clearLogs();
        else runner[func](...args);
      },
    };
  }

  /**
   * Creates a console.
   * @param {Object} options
   * @param {string} options.code
   *   The code that the console starts with.
   * @param {{[name: string]: string}} options.dataset
   *   The options for the console in the same form as the data attributes of
   *   a script tag (eg. `{runner: 'window', hidePrefix: 'HIDE'}`).
   * @param {string=} options.height
   *   Optional, defaults to `"100%"`.  The CSS height of the console.
   * @param {(element: HTMLIFrameElement) => void} options.insert
   *   Puts the console's element into the page.
   * @returns {{element: HTMLIFrameElement, destroy: () => void}}
   */
  function createConsole({code, dataset, height, insert}) {
    const runnerMode = dataset.runner === 'window' ? 'window' : 'worker';
    const blockType = dataset.blockType === 'module' ? 'module' : 'classic';
    const language = dataset.language === 'typescript' ? 'typescript' : 'javascript';
    const showResults = dataset.showResults !== 'false';
    // An empty data-imports-url turns off loading packages by name.
    const importsUrl = dataset.importsUrl == null
      ? DEFAULT_IMPORTS_URL
      : dataset.importsUrl && resolveUrlTemplate(dataset.importsUrl);
    const libraryUrl = getLibraryFileUrl.bind(null, dataset.librariesUrl || DEFAULT_LIBRARIES_URL);

    // The viewer in the page and, when the console is popped out, the viewer
    // in the pop-out window.  Messages from the runner go to the active one.
    /** @type {ReturnType<createCallableFrame>} */
    let inlineViewer;
    /** @type {ReturnType<createCallableFrame>?} */
    let popOutViewer = null;
    /** @type {Window?} */
    let popOutWindow = null;
    let popOutWatcher;
    let activeViewer;
    const sendToViewer = data => relayMessage(data, {viewer: activeViewer});
    // Created once the console is loaded (see load()).
    let runner = null;

    // The theme is determined up front so that the loading screen uses it.
    const theme = /^(light|dark)$/.test(dataset.theme)
      ? dataset.theme
      : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    // What the viewer can ask this script to do (see RELAYABLE_FUNCS.host).
    const hostFuncs = {
      /**
       * Makes the IFRAME fill the window (used if full screen isn't allowed).
       * @param {boolean} isMaximized
       */
      setMaximized(isMaximized) {
        const {style} = inlineViewer.iframe;
        if (isMaximized) {
          inlineViewer.normalCssText ??= style.cssText;
          Object.assign(style, {position: 'fixed', inset: '0', width: '100%', height: '100%', zIndex: '2147483647'});
        }
        else if (inlineViewer.normalCssText != null) {
          style.cssText = inlineViewer.normalCssText;
          inlineViewer.normalCssText = null;
        }
      },
      /**
       * Opens the console in a separate window.  The code still runs in this
       * page.
       * @param {*} state
       *   The state of the viewer (eg. what was logged) to show in the window.
       */
      popOut(state) {
        if (popOutWindow) {
          popOutWindow.focus();
          return;
        }
        const rect = inlineViewer.iframe.getBoundingClientRect();
        const width = Math.max(820, Math.round(rect.width));
        const height = Math.max(560, Math.round(rect.height));
        const newWindow = open('', '_blank', `popup,width=${width},height=${height}`);
        if (!newWindow) {
          inlineViewer.call('onPopOutFailed');
          return;
        }
        popOutWindow = newWindow;
        popOutViewer = createViewer(newWindow, state);
        // Lets the window send its state back even while it is closing (a
        // message sent then can't be traced back to the window).  The name
        // must match POP_IN_FUNCTION_NAME in the viewer.
        newWindow.yourjsBoxPopIn = state => newWindow === popOutWindow && hostFuncs.popIn(state);
        activeViewer = popOutViewer;
        inlineViewer.call('setPoppedOut', true);

        // If the window is closed without sending its state (which it does
        // when it is closed) bring the console back as it was.
        popOutWatcher = setInterval(() => {
          if (newWindow.closed) setTimeout(() => newWindow === popOutWindow && hostFuncs.popIn(null), 300);
        }, 500);
      },
      /**
       * Brings the console back into the page.
       * @param {*} state
       *   The state of the pop-out window's viewer or `null` to keep the state
       *   from when the console was popped out.
       */
      popIn(state) {
        const oldWindow = popOutWindow;
        if (!oldWindow) return;
        clearInterval(popOutWatcher);
        popOutWindow = null;
        popOutViewer.dispose();
        popOutViewer = null;
        activeViewer = inlineViewer;
        inlineViewer.call('setPoppedOut', false, state);
        if (!oldWindow.closed) oldWindow.close();
      },
      /** Asks the pop-out window to send its state back to the page. */
      requestPopIn() {
        if (popOutViewer) popOutViewer.call('popIn');
      },
      focusPopOut() {
        popOutWindow?.focus();
      },
    };

    // The pop-out window can't work without this page so it is closed too.
    const closePopOut = () => popOutWindow?.close();
    addEventListener('pagehide', closePopOut);

    /**
     * @param {Window=} targetWindow
     *   If given the viewer is written into this window (a pop-out window).
     * @param {*=} state
     *   The state to restore in the pop-out window.
     * @returns {ReturnType<createCallableFrame>}
     */
    function createViewer(targetWindow, state) {
      return createCallableFrame({
        deferLoad: !targetWindow,
        jsCode() {
          let mountedApp;
          
          /**
           * Indicates if any of the libraries that the viewer needs failed to load (eg.
           * because the CDN is blocked or the user is offline).
           */
          const IS_MISSING_LIBRARIES = !window.Vue || !window.ace || !window.Prism;
          if (IS_MISSING_LIBRARIES) {
            document.querySelector('#splash').classList.add('failed');
          }
          
          const Prism = window.Prism;
          delete window.Prism;
          Prism?.plugins.autoloader.loadLanguages('javascript');
          
          /**
           * The minimum amount of time (in milliseconds) that the loading screen is shown.
           */
          const MIN_LOADING_TIME = 1000;
          
          /**
           * The name of the function that the page adds to a pop-out window so that the
           * window can send its state back to the page (see bringBack()).
           */
          const POP_IN_FUNCTION_NAME = 'yourjsBoxPopIn';
          
          /**
           * The text sizes (as a multiple of the normal size) that can be chosen.
           */
          const TEXT_SCALES = [0.75, 0.9, 1, 1.15, 1.3, 1.5, 1.75, 2];
          
          /**
           * Where the chosen text size is remembered.  It applies to every console on
           * the same site.
           */
          const TEXT_SCALE_STORAGE_KEY = 'yourjs-box.textScale';
          
          /**
           * @returns {number}
           *   The remembered text size or `1` if there isn't one.
           */
          function loadTextScale() {
            try {
              const textScale = +localStorage.getItem(TEXT_SCALE_STORAGE_KEY);
              return TEXT_SCALES.includes(textScale) ? textScale : 1;
            }
            catch (e) {
              return 1;
            }
          }
          
          /**
           * If the orientation isn't specified, the editor is shown below the console
           * instead of beside it when the console is narrower than this (in pixels).
           */
          const NARROW_WIDTH = 600;
          
          /**
           * @returns {"horizontal"|"vertical"}
           *   The orientation to use when one wasn't specified.
           */
          function getAutoDividerOrient() {
            return innerWidth < NARROW_WIDTH ? 'horizontal' : 'vertical';
          }
          
          /**
           * @param {string} jsCode
           * @param {{[key: string]: string}} dataset
           *   The data attributes exactly as they were specified on the script tag.
           * @param {{runnerMode: "worker"|"window", packageInfo: {name: string, version: string, homepage: string, repoUrl: string, bugsUrl: string}}} meta
           */
          function init(jsCode, dataset, meta) {
            if (IS_MISSING_LIBRARIES) return;
            // TypeScript can't run without Babel.
            if (meta.language === 'typescript' && !window.Babel) {
              document.querySelector('#splash').classList.add('failed');
              return;
            }
            Prism.plugins.autoloader.loadLanguages(meta.language);
          
            const hidePrefix = dataset.hidePrefix ?? '';
            const darkSchemeQuery = matchMedia('(prefers-color-scheme: dark)');
            const startingCode = unindentMin(jsCode);
            const {visibleCode, hiddenGroups} = extractHiddenGroups(startingCode, hidePrefix);
            const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
            const copyHiddenGroups = () => hiddenGroups.map(group => ({...group}));
          
            mountedApp = Vue
              .createApp({
                data() {
                  return {
                    displays: [],
                    hidePrefix,
                    hiddenGroups: copyHiddenGroups(),
                    runnerMode: meta.runnerMode,
                    importsUrl: meta.importsUrl,
                    // The code the console starts with (and goes back to when reset)
                    // which changes when a file is opened.
                    originalCode: startingCode,
                    // The name of the file that was last opened or saved.
                    fileName: null,
                    blockType: meta.blockType,
                    language: meta.language,
                    showResults: meta.showResults,
                    packageInfo: meta.packageInfo,
                    libraryVersions: meta.libraryVersions,
                    // Every group of code that was run (in order) which is used when
                    // copying the console as HTML.  Unlike the displays this is only
                    // cleared by a reset.
                    runHistory: [],
                    isAboutOpen: false,
                    aboutTab: 'about',
                    exportCode: 'current',
                    exportFormat: 'snippet',
                    copyLabel: 'Copy',
                    // The number of groups of code sent to the runner that haven't
                    // finished running yet.
                    runningCount: 0,
                    /** @type {{title: string, message: string, confirmText: string, resolve: (isConfirmed: boolean) => void}?} */
                    dialog: null,
                    isDisplaysScrolledToBottom: true,
                    // Like the browser's dev tools, follow the system's color scheme
                    // unless a theme was specified.
                    forcedTheme: /^(light|dark)$/.test(dataset.theme) ? dataset.theme : null,
                    prefersDark: darkSchemeQuery.matches,
                    runCount: 0,
                    jsCode: visibleCode,
                    // If the orientation wasn't specified it follows the width of the
                    // console until the user chooses one.
                    isDividerOrientAuto: !/^(horizontal|vertical)$/.test(dataset.dividerOrient),
                    dividerOrient: /^(horizontal|vertical)$/.test(dataset.dividerOrient)
                      ? dataset.dividerOrient
                      : getAutoDividerOrient(),
                    isMovingDivider: false,
                    dividerPct: '50%',
                    dividerSize: '8px',
                    tempDividerPct: null,
                    isMenuOpen: false,
                    isHistoryOpen: false,
                    // The code that was run (newest last) which can be brought back into
                    // the editor like the browser's console (eg. with the up arrow).
                    commandHistory: [],
                    // While going through the history:  the index of the code shown and
                    // the unrun code that was in the editor (shown again at the end).
                    historyIndex: null,
                    historyDraft: null,
                    /** @type {{x: number, y: number, path: any[], propertyPath: string?, isPrimitive: boolean}?} */
                    valueMenu: null,
                    /** @type {{message: string}?} */
                    toast: null,
                    textScale: loadTextScale(),
                    isFullscreen: false,
                    // Set when full screen isn't allowed so the console fills the page.
                    isMaximized: false,
                    // Indicates if this is the viewer in a pop-out window.
                    isPopOut: meta.isPopOut,
                    // Indicates if this viewer (in the page) has been popped out.
                    isPoppedOut: false,
                    // When popped out, the state of the console that was in the page.
                    ...(meta.popOutState ?? {}),
                  };
                },
                computed: {
                  theme() {
                    return this.forcedTheme ?? (this.prefersDark ? 'dark' : 'light');
                  },
                  modKey() {
                    return isMac ? '\u2318' : 'Ctrl';
                  },
                  runnerDescription() {
                    return this.runnerMode === 'window'
                      ? 'This page (it can use the page\'s globals and DOM)'
                      : 'A Web Worker (isolated from the page, no DOM)';
                  },
                  themeDescription() {
                    const name = this.theme === 'dark' ? 'Dark' : 'Light';
                    return `${name} (${this.forcedTheme ? 'set by data-theme' : 'follows your system'})`;
                  },
                  isTypeScript() {
                    return this.language === 'typescript';
                  },
                  /** The libraries (and their versions) that this console uses. */
                  builtWith() {
                    const versions = this.libraryVersions;
                    const names = [
                      `Vue ${versions.vue}`,
                      `Ace ${versions['ace-builds']}`,
                      `Prism ${versions.prismjs}`,
                      `Acorn ${versions.acorn}`,
                      ...this.isTypeScript ? [`Babel ${versions['@babel/standalone']}`] : [],
                    ];
                    return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
                  },
                  blockTypeDescription() {
                    return this.blockType === 'module'
                      ? 'Modules (top-level await and imports work, declarations stay in each block)'
                      : 'Classic scripts (top-level declarations are shared between blocks)';
                  },
                  /**
                   * The IDs of the groups (from console.groupCollapsed() or a group that
                   * the user collapsed) whose messages should be hidden.
                   */
                  collapsedGroupIds() {
                    return new Set(
                      this.displays
                        .filter(d => d.groupId && d.isCollapsed)
                        .map(d => d.groupId)
                    );
                  },
                  layoutDescription() {
                    return (this.dividerOrient === 'vertical' ? 'Editor beside the console' : 'Editor below the console')
                      + (this.isDividerOrientAuto ? ' (automatic)' : '');
                  },
                  exportCodeOptions() {
                    return [
                      {value: 'current', label: 'Current code', note: 'The code that already ran followed by the code in the editor.'},
                      {value: 'original', label: 'Original code', note: 'The code this console started with.'},
                      {value: 'blank', label: 'Blank', note: 'An empty console with the same settings.'},
                    ];
                  },
                  exportFormatOptions() {
                    return [
                      {value: 'snippet', label: 'Embed snippet'},
                      {value: 'page', label: 'Full page'},
                    ];
                  },
                  exportNote() {
                    return this.exportCodeOptions.find(o => o.value === this.exportCode).note;
                  },
                  /**
                   * The code that the copied console will start with.
                   */
                  /**
                   * The original code split into the code for the editor and the
                   * hidden groups.
                   */
                  originalGroups() {
                    return extractHiddenGroups(this.originalCode, this.hidePrefix);
                  },
                  exportJsCode() {
                    if (this.exportCode === 'original') return this.originalCode;
                    if (this.exportCode === 'blank') return '';
                    return this.currentCode;
                  },
                  /**
                   * The groups that already ran, then the groups in the editor with any
                   * hidden groups that haven't run yet in their original places.
                   */
                  currentCode() {
                    const blocks = this.runHistory.slice();
                    const pendingHiddenGroups = this.hiddenGroups.slice();
                    let visibleCount = this.runCount;
                    const addPendingHiddenGroups = () => {
                      while (pendingHiddenGroups.length && pendingHiddenGroups[0].runCount <= visibleCount) {
                        blocks.push(pendingHiddenGroups.shift().allLines);
                      }
                    };
                    addPendingHiddenGroups();
                    for (const group of parseJSCodeGroups(this.jsCode)) {
                      if (!group.allLines.trim()) continue;
                      blocks.push(group.allLines);
                      visibleCount++;
                      addPendingHiddenGroups();
                    }
                    blocks.push(...pendingHiddenGroups.map(group => group.allLines));
                    return joinCodeBlocks(blocks);
                  },
                  /**
                   * The data attributes for the copied console.  data-libraries-url is
                   * left out because it usually points to files on this site while the
                   * copied console loads YourJS Box from a CDN.
                   */
                  exportDataset() {
                    const {librariesUrl, ...exportDataset} = dataset;
                    return exportDataset;
                  },
                  exportHtml() {
                    return buildConsoleHtml({
                      code: this.exportJsCode,
                      dataset: this.exportDataset,
                      packageInfo: this.packageInfo,
                      isFullPage: this.exportFormat === 'page',
                    });
                  },
                  bottomButtons() {
                    const isFullscreen = this.isFullscreen || this.isMaximized;
                    return [
                      {
                        iconName: 'more',
                        title: 'More',
                        className: 'more-button',
                        callback() { this.toggleMenu(); },
                      },
                      {
                        iconName: 'clear',
                        title: 'Clear console',
                        callback() { this.clearConsole(); },
                      },
                      {
                        iconName: 'history',
                        title: `History (${isMac ? '\u2325' : 'Alt+'}H)`,
                        className: 'history-button',
                        callback() { this.toggleHistory(); },
                      },
                      {
                        iconName: 'horizontalView',
                        title: 'Show the editor below the console',
                        callback() { this.setDividerOrient('horizontal'); },
                        showIf() { return this.dividerOrient !== 'horizontal'; }
                      },
                      {
                        iconName: 'verticalView',
                        title: 'Show the editor beside the console',
                        callback() { this.setDividerOrient('vertical'); },
                        showIf() { return this.dividerOrient !== 'vertical'; }
                      },
                      {
                        iconName: isFullscreen ? 'exitFullscreen' : 'fullscreen',
                        title: isFullscreen ? 'Exit full screen' : 'Full screen',
                        callback() { this.toggleFullscreen(); },
                      },
                      {
                        iconName: this.runningCount ? 'spinner' : 'play',
                        label: 'Run',
                        className: 'primary',
                        title: `Run the next block of code (${isMac ? '\u2318' : 'Ctrl+'}Enter)`,
                        callback() { this.runCode(); },
                        disableIf() { return !this.canRunCode; }
                      },
                    ].filter(btn => !btn.showIf || btn.showIf.call(this));
                  },
                  /**
                   * The history's entries (newest first) for the history list.
                   */
                  historyEntries() {
                    return this.commandHistory.map((code, index) => {
                      const [group] = parseJSCodeGroups(code);
                      const lines = (group?.lines ?? code).split('\n').filter(line => line.trim());
                      return {
                        index,
                        label: group?.headerLines || lines[0] || '',
                        detail: `${lines.length} line${lines.length === 1 ? '' : 's'}`,
                      };
                    }).reverse();
                  },
                  canShrinkText() {
                    return this.textScale > TEXT_SCALES[0];
                  },
                  canGrowText() {
                    return this.textScale < TEXT_SCALES[TEXT_SCALES.length - 1];
                  },
                  canRunCode() {
                    return this.jsCode.trim();
                  },
                  mainElemClassNames() {
                    return [
                      this.dividerOrient === 'vertical' ? 'col-orient' : 'row-orient',
                      this.isMovingDivider ? 'is-moving-divider' : ''
                    ].join(' ');
                  },
                  mainElemStyles() {
                    return {
                      '--divider-size': this.dividerSize,
                      '--editor-pct': this.dividerPct,
                      '--temp-editor-pct': this.tempDividerPct
                    };
                  }
                },
                methods: {
                  /**
                   * @param {KeyboardEvent} evt 
                   */
                  onEditorKeyCombo(evt) {
                    if ((evt.ctrlKey || evt.metaKey) && evt.key === 'Enter' && this.canRunCode) {
                      this.runCode();
                    }
                  },
                  runCode() {
                    // Always show the output of code that is run.
                    this.isDisplaysScrolledToBottom = true;
          
                    const [jsCodeGroup0, ...otherJsCodeGroups] = parseJSCodeGroups(this.jsCode);
                    this.runGroup(jsCodeGroup0);
          
                    // Remove the code that was run from the editor.
                    const remainingCode = otherJsCodeGroups.map(g => g.allLines).join('\n');
          
                    if (this.historyIndex !== null) {
                      // Code from the history was run so the unrun code comes back.  It
                      // doesn't count as moving through the code so hidden blocks still
                      // run in their places.
                      this.jsCode = [remainingCode, this.historyDraft].filter(code => code.trim()).join('\n');
                      this.historyIndex = this.historyDraft = null;
                    }
                    else {
                      this.jsCode = remainingCode;
                      this.runCount++;
                    }
                  },
                  /**
                   * Shows older (-1) or newer (1) code from the history in the editor.
                   * Going newer than the newest shows the unrun code again.
                   * @param {-1|1} direction
                   * @returns {boolean}
                   *   `true` if the history was used (so the key shouldn't do anything
                   *   else).
                   */
                  navigateHistory(direction) {
                    const history = this.commandHistory;
                    if (direction < 0) {
                      if (!history.length) return false;
                      if (this.historyIndex === null) {
                        this.historyDraft = this.jsCode;
                        this.historyIndex = history.length;
                      }
                      if (this.historyIndex > 0) this.showHistoryCode(this.historyIndex - 1, 'start');
                      return true;
                    }
                    if (this.historyIndex === null) return false;
                    if (this.historyIndex < history.length - 1) {
                      this.showHistoryCode(this.historyIndex + 1, 'end');
                    }
                    else {
                      const draft = this.historyDraft;
                      this.historyIndex = this.historyDraft = null;
                      this.setEditorCode(draft, 'end');
                    }
                    return true;
                  },
                  /**
                   * Shows code from the history in the editor (saving the unrun code if
                   * this is the first time).
                   * @param {number} index
                   * @param {"start"|"end"} cursorAt
                   */
                  showHistoryCode(index, cursorAt) {
                    if (this.historyIndex === null) this.historyDraft = this.jsCode;
                    this.historyIndex = index;
                    this.setEditorCode(this.commandHistory[index], cursorAt);
                  },
                  /**
                   * @param {string} code
                   * @param {"start"|"end"} cursorAt
                   *   Where the cursor goes so that pressing the same arrow key again
                   *   keeps going through the history.
                   */
                  setEditorCode(code, cursorAt) {
                    this.jsCode = code;
                    this.$nextTick(() => {
                      const editor = this.$refs.editor?.editor;
                      if (!editor) return;
                      if (cursorAt === 'end') editor.navigateFileEnd();
                      else editor.navigateFileStart();
                    });
                  },
                  /**
                   * Called by the editor when the up or down arrow is pressed with the
                   * cursor at the very start or end (and nothing selected).
                   * @param {{direction: -1|1, handled: boolean}} event
                   */
                  onEditorHistoryKey(event) {
                    event.handled = this.navigateHistory(event.direction);
                  },
                  toggleHistory() {
                    if (this.isHistoryOpen) {
                      this.isHistoryOpen = false;
                    }
                    else {
                      this.closeMenu();
                      this.closeValueMenu();
                      this.isHistoryOpen = true;
                      this.$nextTick(() => this.$refs.historyPanel?.querySelector('.menu-item')?.focus());
                    }
                  },
                  /**
                   * Puts code from the history list into the editor.
                   * @param {number} index
                   */
                  recallHistory(index) {
                    this.isHistoryOpen = false;
                    this.showHistoryCode(index, 'start');
                    this.$nextTick(() => this.$refs.editor?.editor.focus());
                  },
                  /**
                   * Forgets that the history was being gone through (eg. when the code in
                   * the editor is replaced).
                   */
                  stopNavigatingHistory() {
                    this.historyIndex = this.historyDraft = null;
                  },
                  /**
                   * Runs the next hidden group if all of the visible code that came
                   * before it has already been run.  This is called again once the runner
                   * finishes running each group so that the displays stay in order.
                   */
                  runHiddenGroups() {
                    const {hiddenGroups} = this;
                    if (hiddenGroups.length && hiddenGroups[0].runCount <= this.runCount) {
                      this.runGroup(hiddenGroups.shift());
                    }
                  },
                  /**
                   * Adds a group of code to the displays and then runs it.
                   * @param {ReturnType<parseJSCodeGroups>[number]} group
                   */
                  runGroup(group) {
                    const {header, isHidden} = parseGroupHeader(group.headerLines, this.hidePrefix);
                    this.displays.push({
                      type: 'prism',
                      header,
                      isHidden,
                      isCodeShown: !isHidden,
                      value: group.lines,
                    });
                    this.runningCount++;
                    this.runHistory.push(group.allLines);
                    // Hidden code wasn't typed or seen so it isn't in the history.
                    const historyCode = group.allLines.trim();
                    if (!isHidden && historyCode && this.commandHistory[this.commandHistory.length - 1] !== historyCode) {
                      this.commandHistory.push(historyCode);
                      if (this.commandHistory.length > 200) this.commandHistory.shift();
                    }
                    const {language, blockType} = this;
                    const compiled = language === 'typescript'
                      ? compileTypeScript(group.lines, {blockType})
                      : {code: group.lines};
                    const {code, resultRange} = compiled.error
                      ? {code: '', resultRange: null}
                      : prepareCode(compiled.code, {
                        blockType,
                        importsUrl: this.importsUrl,
                        // Like the browser's console, show the value of the last
                        // expression (except for hidden code).
                        findResult: this.showResults && !isHidden,
                      });
                    messageParent({
                      target: 'runner',
                      func: 'runCode',
                      args: [code, {
                        blockType,
                        resultRange,
                        language,
                        sourceMap: compiled.sourceMap,
                        compileError: compiled.error,
                      }],
                    });
                  },
                  clearConsole() {
                    this.displays = [];
                    messageParent({target: 'runner', func: 'clearLogs', args: []});
                  },
                  async resetConsole() {
                    const isConfirmed = await this.confirm({
                      title: 'Reset the console?',
                      message: 'The output will be cleared and the editor will go back to the original code.'
                        + (this.runnerMode === 'window'
                          ? '  Anything the code already defined on the page will stay defined.'
                          : ''),
                      confirmText: 'Reset',
                    });
                    if (!isConfirmed) return;
                    this.restart();
                  },
                  /**
                   * Starts over with the original code (clearing the output and, in
                   * worker mode, starting a new worker).
                   */
                  restart() {
                    const {visibleCode, hiddenGroups} = this.originalGroups;
                    this.displays = [];
                    this.jsCode = visibleCode;
                    this.hiddenGroups = hiddenGroups.map(group => ({...group}));
                    this.runCount = 0;
                    this.runningCount = 0;
                    this.runHistory = [];
                    this.stopNavigatingHistory();
                    messageParent({target: 'runner', func: 'reset', args: []});
                    this.runHiddenGroups();
                  },
                  /**
                   * Shows the file picker for opening a JavaScript file.
                   */
                  openFile() {
                    this.closeMenu();
                    const {fileInput} = this.$refs;
                    fileInput.value = '';
                    fileInput.click();
                  },
                  /**
                   * Makes the chosen file's code the code that the console starts with.
                   * @param {Event} evt
                   */
                  async onFileChosen(evt) {
                    const file = evt.target.files?.[0];
                    if (!file) return;
                    const code = unindentMin(await file.text());
                    if (this.displays.length || this.jsCode.trim()) {
                      const isConfirmed = await this.confirm({
                        title: `Open ${file.name}?`,
                        message: 'The output will be cleared and the code in the editor will be replaced with the code in the file.'
                          + (this.runnerMode === 'window'
                            ? '  Anything the code already defined on the page will stay defined.'
                            : ''),
                        confirmText: 'Open',
                      });
                      if (!isConfirmed) return;
                    }
                    this.fileName = file.name;
                    this.originalCode = code;
                    this.restart();
                  },
                  /**
                   * Saves the current code (what already ran and what is in the editor)
                   * as a JavaScript file which can be opened later.
                   */
                  async saveFile() {
                    this.closeMenu();
                    const code = this.currentCode + '\n';
                    const suggestedName = this.fileName || (this.isTypeScript ? 'yourjs-box-code.ts' : 'yourjs-box-code.js');
                    const fileType = this.isTypeScript
                      ? {description: 'TypeScript', accept: {'text/typescript': ['.ts', '.mts']}}
                      : {description: 'JavaScript', accept: {'text/javascript': ['.js', '.mjs']}};
          
                    // Shows a "Save as" dialog where it is supported.
                    if ('function' === typeof window.showSaveFilePicker) {
                      try {
                        const handle = await showSaveFilePicker({
                          suggestedName,
                          types: [fileType],
                        });
                        const writable = await handle.createWritable();
                        await writable.write(code);
                        await writable.close();
                        this.fileName = handle.name;
                        return;
                      }
                      catch (e) {
                        // The user cancelled.  For other errors the file is downloaded.
                        if (e?.name === 'AbortError') return;
                      }
                    }
          
                    const url = URL.createObjectURL(new Blob([code], {type: Object.keys(fileType.accept)[0]}));
                    Object.assign(document.createElement('a'), {href: url, download: suggestedName}).click();
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                  },
                  /**
                   * Copies code that was already run into the editor so that it can be run
                   * again (as is or modified), first asking before replacing any code that
                   * is in the editor.
                   * @param {string} code
                   */
                  async copyToEditor(code) {
                    if (this.jsCode.trim() && this.jsCode !== code) {
                      const isConfirmed = await this.confirm({
                        title: 'Replace the code in the editor?',
                        message: 'The code that is currently in the editor will be replaced with a copy of the code you selected.',
                        confirmText: 'Replace',
                      });
                      if (!isConfirmed) return;
                    }
                    this.stopNavigatingHistory();
                    this.jsCode = code;
                  },
                  /**
                   * Shows a dialog asking the user to confirm something.
                   * @param {{title: string, message: string, confirmText: string}} options
                   * @returns {Promise<boolean>}
                   */
                  confirm(options) {
                    this.dialog?.resolve(false);
                    return new Promise(resolve => {
                      this.dialog = {...options, resolve};
                      this.$nextTick(() => this.$refs.dialogConfirmButton?.focus());
                    });
                  },
                  /**
                   * @param {"about"|"html"} tab
                   */
                  openAbout(tab) {
                    this.aboutTab = tab;
                    this.isAboutOpen = true;
                    this.$nextTick(() => this.$refs.aboutCloseButton?.focus());
                  },
                  closeAbout() {
                    this.isAboutOpen = false;
                  },
                  async copyExport() {
                    const text = this.exportHtml;
                    try {
                      await navigator.clipboard.writeText(text);
                    }
                    catch (e) {
                      // Falls back to the older way of copying text.
                      const textarea = Object.assign(document.createElement('textarea'), {value: text});
                      document.body.appendChild(textarea);
                      textarea.select();
                      document.execCommand('copy');
                      textarea.remove();
                    }
                    this.copyLabel = 'Copied!';
                    clearTimeout(this.copyLabelTimeout);
                    this.copyLabelTimeout = setTimeout(() => this.copyLabel = 'Copy', 1600);
                  },
                  /**
                   * Downloads the console as a full HTML page.
                   */
                  downloadExport() {
                    const html = buildConsoleHtml({
                      code: this.exportJsCode,
                      dataset: this.exportDataset,
                      packageInfo: this.packageInfo,
                      isFullPage: true,
                    });
                    const url = URL.createObjectURL(new Blob([html], {type: 'text/html'}));
                    Object.assign(document.createElement('a'), {href: url, download: 'yourjs-box.html'}).click();
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                  },
                  /**
                   * Clicking a group's header (from console.group()) collapses or expands
                   * the group unless a value in the header was clicked.
                   * @param {*} display
                   * @param {MouseEvent} evt
                   */
                  onLogRowClick(display, evt) {
                    if (display.groupId && !evt.target.closest('.js-value-header.expandable')) {
                      display.isCollapsed = !display.isCollapsed;
                    }
                  },
                  /**
                   * Indicates if a display is inside of a collapsed group.
                   */
                  isInCollapsedGroup(display) {
                    const {collapsedGroupIds} = this;
                    return !!collapsedGroupIds.size && !!display.groupIds?.some(id => collapsedGroupIds.has(id));
                  },
                  /**
                   * @returns {*}
                   *   A copy of the parts of the console's state that are moved between
                   *   the page and a pop-out window.
                   */
                  getState() {
                    return JSON.parse(JSON.stringify({
                      displays: this.displays,
                      jsCode: this.jsCode,
                      originalCode: this.originalCode,
                      fileName: this.fileName,
                      commandHistory: this.commandHistory,
                      historyIndex: this.historyIndex,
                      historyDraft: this.historyDraft,
                      runHistory: this.runHistory,
                      hiddenGroups: this.hiddenGroups,
                      runCount: this.runCount,
                      runningCount: this.runningCount,
                      dividerOrient: this.dividerOrient,
                      isDividerOrientAuto: this.isDividerOrientAuto,
                      dividerPct: this.dividerPct,
                    }));
                  },
                  /**
                   * @param {ReturnType<this['getState']>} state
                   */
                  restoreState(state) {
                    Object.assign(this, state);
                    this.isDisplaysScrolledToBottom = true;
                  },
                  toggleMenu() {
                    if (this.isMenuOpen) {
                      this.closeMenu();
                    }
                    else {
                      this.isHistoryOpen = false;
                      this.closeValueMenu();
                      this.isMenuOpen = true;
                      this.$nextTick(() => this.$refs.moreMenu?.querySelector('.menu-item:not(:disabled)')?.focus());
                    }
                  },
                  closeMenu(shouldFocusButton) {
                    this.isMenuOpen = false;
                    if (shouldFocusButton) document.querySelector('#bottomNav .more-button')?.focus();
                  },
                  /**
                   * Lets the arrow keys move between the menu's items.
                   * @param {KeyboardEvent} evt
                   */
                  /**
                   * Lets Escape close a menu (or the history list) and the arrow keys move
                   * between its items.
                   * @param {KeyboardEvent} evt
                   */
                  onMenuKeyDown(evt) {
                    if (evt.key === 'Escape') {
                      evt.stopPropagation();
                      this.closeMenu(this.isMenuOpen);
                      this.closeValueMenu();
                      this.isHistoryOpen = false;
                    }
                    else if (evt.key === 'ArrowDown' || evt.key === 'ArrowUp') {
                      evt.preventDefault();
                      const items = [...evt.currentTarget.querySelectorAll('.menu-item:not(:disabled)')];
                      const index = items.indexOf(document.activeElement);
                      const next = items[(index + (evt.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length];
                      next?.focus();
                    }
                  },
                  /**
                   * @param {number} direction
                   *   `1` to make the text bigger or `-1` to make it smaller.
                   */
                  changeTextScale(direction) {
                    const index = TEXT_SCALES.indexOf(this.textScale) + direction;
                    if (index >= 0 && index < TEXT_SCALES.length) this.setTextScale(TEXT_SCALES[index]);
                  },
                  setTextScale(textScale) {
                    this.textScale = textScale;
                    try {
                      localStorage.setItem(TEXT_SCALE_STORAGE_KEY, `${textScale}`);
                    }
                    catch (e) {}
                  },
                  /**
                   * Uses the browser's full screen if it's allowed, otherwise the
                   * console is made to fill the page.
                   */
                  async toggleFullscreen() {
                    if (this.isMaximized) {
                      this.setMaximized(false);
                    }
                    else if (document.fullscreenElement) {
                      await document.exitFullscreen();
                    }
                    else {
                      try {
                        await document.documentElement.requestFullscreen();
                      }
                      catch (e) {
                        // A pop-out window can't be made to fill anything else.
                        if (!this.isPopOut) this.setMaximized(true);
                      }
                    }
                  },
                  setMaximized(isMaximized) {
                    this.isMaximized = isMaximized;
                    messageParent({target: 'host', func: 'setMaximized', args: [isMaximized]});
                  },
                  /**
                   * Moves the console into a separate window.  The code still runs in
                   * the page.
                   */
                  popOut() {
                    this.closeMenu();
                    if (this.isMaximized) this.setMaximized(false);
                    messageParent({target: 'host', func: 'popOut', args: [this.getState()]});
                  },
                  /**
                   * Moves the console from the pop-out window back into the page.
                   */
                  bringBack() {
                    this.hasSentState = true;
                    // The page provides a function to call directly because a message
                    // sent while this window is closing can't be traced back to it.
                    const popIn = window[POP_IN_FUNCTION_NAME];
                    if ('function' === typeof popIn) popIn(this.getState());
                    else messageParent({target: 'host', func: 'popIn', args: [this.getState()]});
                  },
                  focusPopOut() {
                    messageParent({target: 'host', func: 'focusPopOut', args: []});
                  },
                  requestPopIn() {
                    messageParent({target: 'host', func: 'requestPopIn', args: []});
                  },
                  /**
                   * Closes the menu when clicking outside of it.
                   * @param {MouseEvent} evt
                   */
                  onWindowMouseDown(evt) {
                    if (this.isMenuOpen && !evt.target.closest('.more-menu, .more-button')) {
                      this.closeMenu();
                    }
                    if (this.valueMenu && !evt.target.closest('.value-menu')) {
                      this.closeValueMenu();
                    }
                    if (this.isHistoryOpen && !evt.target.closest('.history-panel, .history-button')) {
                      this.isHistoryOpen = false;
                    }
                  },
                  /**
                   * @param {KeyboardEvent} evt
                   */
                  onWindowKeyDown(evt) {
                    if (evt.altKey && !evt.ctrlKey && !evt.metaKey && evt.code === 'KeyH') {
                      evt.preventDefault();
                      evt.stopPropagation();
                      this.toggleHistory();
                      return;
                    }
                    if (evt.key === 'Escape' && this.valueMenu) {
                      this.closeValueMenu();
                      return;
                    }
                    if (evt.key === 'Escape' && this.isMaximized && !this.isMenuOpen && !this.dialog && !this.isAboutOpen) {
                      this.setMaximized(false);
                    }
                  },
                  /**
                   * Shows the menu for a value that was right-clicked.
                   * @param {MouseEvent} evt
                   * @param {{path: any[], keyPath: string[]?, isPrimitive: boolean}} value
                   */
                  openValueMenu(evt, {path, keyPath, isPrimitive}) {
                    this.closeMenu();
                    this.valueMenu = {
                      x: evt.clientX,
                      y: evt.clientY,
                      path: path.slice(),
                      // Only properties and items (not logged values themselves) have
                      // a property path.
                      propertyPath: keyPath?.length ? formatPropertyPath(keyPath) : null,
                      fileName: keyPath?.length && /^[\w$-]+$/.test(keyPath[keyPath.length - 1]) ? keyPath[keyPath.length - 1] : 'value',
                      isPrimitive,
                    };
                    // Keeps the menu inside of the window.
                    this.$nextTick(() => {
                      const menu = this.$refs.valueMenu;
                      if (!menu || !this.valueMenu) return;
                      const {width, height} = menu.getBoundingClientRect();
                      this.valueMenu.x = Math.max(4, Math.min(this.valueMenu.x, innerWidth - width - 4));
                      this.valueMenu.y = Math.max(4, Math.min(this.valueMenu.y, innerHeight - height - 4));
                      menu.querySelector('.menu-item')?.focus();
                    });
                  },
                  closeValueMenu() {
                    this.valueMenu = null;
                  },
                  /**
                   * Asks the runner to convert the value to JSON.
                   * @param {any[]} path
                   * @returns {Promise<{json: string?, circularCount: number, error: string?}>}
                   */
                  requestValueJson(path) {
                    const requestId = `${Date.now()}-${Math.random()}`;
                    return new Promise(resolve => {
                      jsonRequests.set(requestId, resolve);
                      messageParent({target: 'runner', func: 'getValueAsJson', args: [path, requestId]});
                    });
                  },
                  /**
                   * Shows a short message (eg. "Copied") for a few seconds.
                   * @param {string} message
                   */
                  showToast(message) {
                    clearTimeout(this.toastTimeout);
                    this.toast = {message};
                    this.toastTimeout = setTimeout(() => this.toast = null, 3500);
                  },
                  /**
                   * @param {{json: string?, circularCount: number, error: string?}} result
                   * @param {string} action
                   *   What was done (eg. "Copied as JSON").
                   */
                  showJsonToast({circularCount, error}, action) {
                    this.showToast(
                      error || action + (circularCount
                        ? ` (${circularCount} circular reference${circularCount === 1 ? ' was' : 's were'} left out)`
                        : '')
                    );
                  },
                  /**
                   * Copies the value as JSON.  The copy is started right away (while
                   * the browser still allows it) with the JSON filled in when it is
                   * ready.
                   */
                  async copyValueAsJson() {
                    // A plain copy because the menu's (reactive) path can't be sent.
                    const path = [...this.valueMenu.path];
                    this.closeValueMenu();
                    const resultPromise = this.requestValueJson(path);
                    try {
                      if (window.ClipboardItem && navigator.clipboard?.write) {
                        await navigator.clipboard.write([new ClipboardItem({
                          'text/plain': resultPromise.then(({json, error}) => {
                            if (error) throw new Error(error);
                            return new Blob([json], {type: 'text/plain'});
                          }),
                        })]);
                      }
                      else {
                        const {json, error} = await resultPromise;
                        if (error) throw new Error(error);
                        await navigator.clipboard.writeText(json);
                      }
                      this.showJsonToast(await resultPromise, 'Copied as JSON');
                    }
                    catch (e) {
                      const result = await resultPromise;
                      this.showToast(result.error || 'The value couldn\'t be copied.  Your browser may not allow copying here.');
                    }
                  },
                  /**
                   * Saves the value as a JSON file.  The "Save as" dialog is shown right
                   * away (while the browser still allows it).
                   */
                  async saveValueAsJson() {
                    const {fileName} = this.valueMenu;
                    const path = [...this.valueMenu.path];
                    this.closeValueMenu();
                    const resultPromise = this.requestValueJson(path);
                    const suggestedName = `${fileName}.json`;
                    let handle;
                    if ('function' === typeof window.showSaveFilePicker) {
                      try {
                        handle = await showSaveFilePicker({
                          suggestedName,
                          types: [{description: 'JSON', accept: {'application/json': ['.json']}}],
                        });
                      }
                      catch (e) {
                        if (e?.name === 'AbortError') return;
                      }
                    }
                    const result = await resultPromise;
                    if (result.error) {
                      this.showToast(result.error);
                      return;
                    }
                    const text = result.json + '\n';
                    if (handle) {
                      const writable = await handle.createWritable();
                      await writable.write(text);
                      await writable.close();
                    }
                    else {
                      const url = URL.createObjectURL(new Blob([text], {type: 'application/json'}));
                      Object.assign(document.createElement('a'), {href: url, download: suggestedName}).click();
                      setTimeout(() => URL.revokeObjectURL(url), 1000);
                    }
                    this.showJsonToast(result, 'Saved as JSON');
                  },
                  storeValueAsGlobal() {
                    const path = [...this.valueMenu.path];
                    this.closeValueMenu();
                    messageParent({target: 'runner', func: 'storeAsGlobal', args: [path]});
                  },
                  async copyPropertyPath() {
                    const {propertyPath} = this.valueMenu;
                    this.closeValueMenu();
                    try {
                      await navigator.clipboard.writeText(propertyPath);
                      this.showToast(`Copied ${propertyPath}`);
                    }
                    catch (e) {
                      this.showToast('The property path couldn\'t be copied.  Your browser may not allow copying here.');
                    }
                  },
                  /**
                   * Shows the value as it is now (eg. after the code changed it).
                   */
                  refreshValue() {
                    const path = [...this.valueMenu.path];
                    this.closeValueMenu();
                    messageParent({target: 'runner', func: 'refreshDescription', args: [path]});
                  },
                  closeDialog(isConfirmed) {
                    const {dialog} = this;
                    this.dialog = null;
                    dialog?.resolve(isConfirmed);
                  },
                  /**
                   * Sets the orientation chosen by the user which stops it from
                   * automatically following the width of the console.
                   * @param {"horizontal"|"vertical"} orient
                   */
                  setDividerOrient(orient) {
                    this.isDividerOrientAuto = false;
                    this.dividerOrient = orient;
                  },
                  onWindowResize() {
                    if (this.isDividerOrientAuto) {
                      this.dividerOrient = getAutoDividerOrient();
                    }
                  },
                  onDisplaysScroll() {
                    this.closeValueMenu();
                    const {scrollTop, scrollHeight, clientHeight} = this.$refs.displaysScroller;
                    this.isDisplaysScrolledToBottom = scrollHeight - scrollTop - clientHeight < 8;
                  },
                  getEditorPct(evt) {    
                    const rect = this.$refs.main.getBoundingClientRect();
                    const {dividerOrient} = this;
                    const x = evt.pageX - rect.left;
                    const y = evt.pageY - rect.top;
                    const w = rect.width;
                    const h = rect.height;
                    const pct = 100 - 100 * Math.min(
                      Math.max(
                        0.2,
                        dividerOrient === 'vertical' ? x / w : (y / h)
                      ),
                      0.8
                    );
                    return pct + '%';
                  },
                  onMainElemMouseDown(evt) {
                    if (evt.target === this.$refs.mainDivider) {
                      this.isMovingDivider = true;
                      this.tempDividerPct = this.getEditorPct(evt);
                    }
                  },
                  onWindowMouseMove(evt) {
                    if (this.isMovingDivider) {
                      this.tempDividerPct = this.getEditorPct(evt);
                    }
                  },
                  onWindowMouseUp(evt) {
                    if (this.isMovingDivider) {
                      this.isMovingDivider = false;
                      this.dividerPct = this.getEditorPct(evt);
                    }
                  },
                  onWindowError(evt) {
                    this.displays.push({
                      type: 'error',
                      message: evt.error?.stack ?? evt.message ?? evt.error?.message ?? `${evt.error}`,
                      line: evt.lineno,
                      column: evt.colno,
                    })
                  }
                },
                watch: {
                  // Used by the CSS to size the text.
                  textScale: {
                    handler(textScale) {
                      document.documentElement.style.setProperty('--text-scale', textScale);
                    },
                    immediate: true,
                  },
                  theme: {
                    handler(theme) {
                      document.documentElement.dataset.theme = theme;
                    },
                    immediate: true,
                  },
                  // Like the browser's console, keep showing the newest output unless the
                  // user has scrolled up to look at older output.
                  'displays.length'() {
                    if (this.isDisplaysScrolledToBottom) {
                      this.$nextTick(() => {
                        const scroller = this.$refs.displaysScroller;
                        scroller.scrollTop = scroller.scrollHeight;
                      });
                    }
                  },
                },
                mounted() {
                  addEventListener('mousemove', this.onWindowMouseMove);
                  addEventListener('mousedown', this.onWindowMouseDown);
                  // Capturing lets shortcuts (eg. Alt+H) work before the editor sees them.
                  addEventListener('keydown', this.onWindowKeyDown, true);
                  addEventListener('resize', this.onWindowResize);
                  addEventListener('mouseup', this.onWindowMouseUp);
                  addEventListener('error', this.onWindowError);
                  darkSchemeQuery.addEventListener('change', e => this.prefersDark = e.matches);
                  document.addEventListener('fullscreenchange', () => this.isFullscreen = !!document.fullscreenElement);
          
                  // A pop-out window sends its state back to the page when it is closed.
                  if (this.isPopOut) {
                    addEventListener('pagehide', () => this.hasSentState || this.bringBack());
                  }
          
                  // Hidden code that came before all visible code gets run immediately
                  // (unless this is a pop-out window still waiting for code to finish).
                  if (!this.runningCount) this.runHiddenGroups();
          
                  // Shows the loading screen for at least a moment and then fades it out
                  // (but not in a pop-out window which should appear right away).
                  setTimeout(
                    () => document.querySelector('#splash').classList.add('hidden'),
                    Math.max(0, (this.isPopOut ? 0 : MIN_LOADING_TIME) - performance.now())
                  );
                }
              })
              .component('ace-editor', getAceComponentProps())
              .component('prism', getPrismComponentProps())
              .component('icon', getIconComponentProps())
              .component('js-value', getJSValueComponentProps())
              .mount(document.querySelector('#vueApp'));
          }
          
          function getAceComponentProps() {
            return {
              data() {
                return {
                  annotations: [],
                };
              },
              props: [
                'fontSize',
                'height',
                'keybinding',
                'language',
                'modelValue',
                'readOnly',
                'theme',
                'width',
              ],
              computed: {
                infoNotes() {
                  return this.annotations.filter(({type}) => type === 'info');
                },
                warningNotes() {
                  return this.annotations.filter(({type}) => type === 'warning');
                },
                errorNotes() {
                  return this.annotations.filter(({type}) => type === 'error');
                },
                style() {
                  return {
                    height: this.height != null
                      ? 'number' === typeof this.height
                        ? this.height + 'px'
                        : this.height
                      : '150px',
                    width: this.width != null
                      ? 'number' === typeof this.width
                        ? this.width + 'px'
                        : this.width
                      : '100%',
                  };
                },
                modeSig() {
                  return `ace/mode/${this.language ?? 'text'}`;
                },
                themeSig() {
                  let theme = `${this.theme ?? 'light'}`.replace(
                    /^light$|(^dark$)/i,
                    (_, isDark) => `cloud_editor${isDark ? '_dark' : ''}`
                  );
                  return `ace/theme/${theme}`;
                }
              },
              watch: {
                themeSig(newValue) {
                  this.editor.setTheme(newValue);
                },
                fontSize(newValue) {
                  if (newValue) this.editor.setFontSize(newValue);
                },
                modelValue(newValue) {
                  if (newValue !== this.editor.getValue()) {
                    // -1 puts the cursor at the start instead of selecting everything.
                    this.editor.setValue(newValue, -1);
                  }
                }
              },
              async mounted() {
                // Get the ace editor set up with the language and theme.
                const editor = ace.edit(this.$refs.editor, {
                  value: this.modelValue,
                  mode: this.modeSig,
                  theme: this.themeSig,
                });
                this.editor = editor;
          
                // Read-only editors don't need syntax checking (eg. hints in the gutter).
                if (this.fontSize) editor.setFontSize(this.fontSize);
          
                if (this.readOnly) {
                  editor.setReadOnly(true);
                  editor.setHighlightActiveLine(false);
                  editor.session.setUseWorker(false);
                }
          
                // Use VSCode keybinding but remove the CTRL+ENTER and CTRL+SHIFT+ENTER
                // (or on Mac CMD+ENTER and CMD+SHIFT+ENTER) commands so that they can be
                // caught by custom code.
                editor.setKeyboardHandler('ace/keyboard/vscode');
                editor.commands.removeCommand('addLineAfter');
                editor.commands.removeCommand('addLineBefore');
          
                // When the value in the ace editor is updated make sure to emit the
                // modelValue update event.
                editor.on('change', () => this.$emit('update:modelValue', editor.getValue()));
          
                // When the annotations change in the editor go ahead and trigger the
                // different note events if necessary.
                editor.session.on("changeAnnotation", () => {
                  const oldErrorsJSON = JSON.stringify(this.errorNotes);
                  const oldInfosJSON = JSON.stringify(this.infoNotes);
                  const oldWarningsJSON = JSON.stringify(this.warningNotes);
                  this.annotations = editor.getSession().getAnnotations();
                  const {errorNotes, infoNotes, warningNotes} = this;
                  if (oldErrorsJSON !== JSON.stringify(errorNotes)) {
                    this.$emit('changeErrorNotes', errorNotes);
                  }
                  if (oldInfosJSON !== JSON.stringify(infoNotes)) {
                    this.$emit('changeInfoNotes', infoNotes);
                  }
                  if (oldWarningsJSON !== JSON.stringify(warningNotes)) {
                    this.$emit('changeWarningNotes', warningNotes);
                  }
                });
          
                // Attempt to capture key combos.
                // Like the browser's console, the up arrow at the very start (or the
                // down arrow at the very end) with nothing selected goes through the
                // history.  This listens while capturing so it runs before Ace moves the
                // cursor.
                this.$refs.editor.addEventListener('keydown', evt => {
                  const isUp = evt.key === 'ArrowUp';
                  if (!isUp && evt.key !== 'ArrowDown') return;
                  if (evt.shiftKey || evt.altKey || evt.ctrlKey || evt.metaKey || !editor.selection.isEmpty()) return;
                  const {row, column} = editor.getCursorPosition();
                  const lastRow = editor.session.getLength() - 1;
                  const isAtEdge = isUp
                    ? row === 0 && column === 0
                    : row === lastRow && column === editor.session.getLine(lastRow).length;
                  if (!isAtEdge) return;
                  const event = {direction: isUp ? -1 : 1, handled: false};
                  this.$emit('historyKey', event);
                  if (event.handled) {
                    evt.preventDefault();
                    evt.stopPropagation();
                  }
                }, true);
          
                editor.textInput.getElement().addEventListener('keydown', (evt) => {
                  const isComboKeyCode = evt.keyCode === 16 // SHIFT
                    || evt.keyCode === 17 // CTRL
                    || evt.keyCode === 18 // ALT or OPT
                    || evt.keyCode === 91 // META
                    || evt.keyCode === 92 // META
                    || evt.keyCode === 93 // META;
          
                  // Dont do anything if only a combo key is being pressed.
                  if (isComboKeyCode) return;
          
                  // If this is really a key combo then go ahead and emit that event.
                  const isCombo = evt.metaKey
                    || evt.ctrlKey
                    || evt.altKey
                    || (evt.shiftKey && (evt.key ?? '').length > 1);
                  if (isCombo) this.$emit('keyCombo', evt);
                });
              },
              template: '<div ref="editor" :style="style"></div>',
            };
          }
          
          function getPrismComponentProps() {
            return {
              data() {
                return {
                  annotations: [],
                };
              },
              props: ['code', 'isDark', 'language', 'lineNumbers', 'matchBraces'],
              computed: {
                html() {},
                preStyle() {
                  return {
                    filter: (this.isDark ?? false) !== false
                      ? 'none'
                      : 'invert(1) hue-rotate(180deg) brightness(1.1)',
                    margin: 0,
                    paddingTop: '0.5em',
                    paddingBottom: '0.5em'
                  };
                }
              },
              watch: {
                code() { this.redraw(); },
                language() { this.redraw(); },
                lineNumbers() { this.redraw(); },
                matchBraces() { this.redraw(); },
              },
              methods: {
                async redraw() {
                  /** @type {HTMLPreElement} */
                  const preElem = this.$refs.pre;
                  /** @type {HTMLElement} */
                  const codeElem = this.$refs.code;
          
                  codeElem.textContent = this.code;
          
                  codeElem.className = `language-${this.language ?? 'javascript'}`;
                  preElem.className = '';
          
                  for (const propName of ['lineNumbers', 'matchBraces']) {
                    if (this[propName] != null) {
                      const dashedPropName = propName.replace(/[A-Z]+/g, '-$&').toLowerCase();
                      preElem.className += ' ' + dashedPropName;
                    }
                  }
          
                  // Wait for all scripts to load before trying to syntax highlight the
                  // code element.
                  Prism.highlightElement(codeElem);
                }
              },
              async mounted() {
                await this.redraw();
              },
              template: '<pre ref="pre" :style="preStyle"><code ref="code"></code></pre>',
            };
          }
          
          function getIconComponentProps() {
            return {
              props: ['name'],
              computed: {
                svgCode() {
                  const codes = {
                    // https://icon-sets.iconify.design/carbon/unknown/
                    missing: '<svg viewBox="0 0 32 32"><circle cx="16" cy="22.5" r="1.5" fill="currentColor"/><path fill="currentColor" d="M17 19h-2v-4h2c1.103 0 2-.897 2-2s-.897-2-2-2h-2c-1.103 0-2 .897-2 2v.5h-2V13c0-2.206 1.794-4 4-4h2c2.206 0 4 1.794 4 4s-1.794 4-4 4z"/><path fill="currentColor" d="M29.391 14.527L17.473 2.609A2.078 2.078 0 0 0 16 2c-.533 0-1.067.203-1.473.609L2.609 14.527C2.203 14.933 2 15.466 2 16s.203 1.067.609 1.473L14.526 29.39c.407.407.941.61 1.474.61s1.067-.203 1.473-.609L29.39 17.474c.407-.407.61-.94.61-1.474s-.203-1.067-.609-1.473M16 28.036L3.965 16L16 3.964L28.036 16z"/></svg>',
                    // https://icon-sets.iconify.design/radix-icons/trash/
                    trash: '<svg viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M5.5 1a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zM3 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1H11v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4h-.5a.5.5 0 0 1-.5-.5M5 4h5v8H5z" clip-rule="evenodd"/></svg>',
                    // https://icon-sets.iconify.design/radix-icons/play/
                    play: '<svg viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M3.242 2.322a.5.5 0 0 1 .491-.014l9 4.75a.5.5 0 0 1 0 .884l-9 4.75A.5.5 0 0 1 3 12.25v-9.5a.5.5 0 0 1 .242-.428M4 3.579v7.842L11.429 7.5z" clip-rule="evenodd"/></svg>',
                    // https://icon-sets.iconify.design/radix-icons/update/
                    refresh: '<svg viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M1.903 7.297c0 3.044 2.207 5.118 4.686 5.547a.521.521 0 1 1-.178 1.027C3.5 13.367.861 10.913.861 7.297c0-1.537.699-2.745 1.515-3.663c.585-.658 1.254-1.193 1.792-1.602H2.532a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V2.686l-.001.002c-.572.43-1.27.957-1.875 1.638c-.715.804-1.253 1.776-1.253 2.97m11.108.406c0-3.012-2.16-5.073-4.607-5.533a.521.521 0 1 1 .192-1.024c2.874.54 5.457 2.98 5.457 6.557c0 1.537-.699 2.744-1.515 3.663c-.585.658-1.254 1.193-1.792 1.602h1.636a.5.5 0 1 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 1 1 1 0v1.845h.002c.571-.432 1.27-.958 1.874-1.64c.715-.803 1.253-1.775 1.253-2.97" clip-rule="evenodd"/></svg>',
                    // https://icon-sets.iconify.design/radix-icons/view-horizontal/
                    horizontalView: '<svg viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M1.5 2h12a.5.5 0 0 1 .5.5V7H1V2.5a.5.5 0 0 1 .5-.5M1 8v4.5a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5V8zM0 2.5A1.5 1.5 0 0 1 1.5 1h12A1.5 1.5 0 0 1 15 2.5v10a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 0 12.5z" clip-rule="evenodd"/></svg>',
                    // https://icon-sets.iconify.design/radix-icons/view-vertical/
                    verticalView: '<svg viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M8 2h5.5a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5H8zM7 2H1.5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5H7zm-7 .5A1.5 1.5 0 0 1 1.5 1h12A1.5 1.5 0 0 1 15 2.5v10a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 0 12.5z" clip-rule="evenodd"/></svg>',
                    // https://icon-sets.iconify.design/vaadin/play/
                    play: '<svg viewBox="0 0 16 16"><path fill="currentColor" d="M2 1v14l12-7z"/></svg>',
                    // https://icon-sets.iconify.design/mdi/error-outline/
                    error: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M11 15h2v2h-2zm0-8h2v6h-2zm1-5C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8a8 8 0 0 1 8-8a8 8 0 0 1 8 8a8 8 0 0 1-8 8"/></svg>',
                    // Icons similar to those in the browser's console.
                    history: '<svg viewBox="0 0 16 16"><path d="M2.5 8a5.5 5.5 0 1 0 1.6-3.9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M2.25 2.5v2.75H5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 5v3.25l2.25 1.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                    copy: '<svg viewBox="0 0 16 16"><rect x="5.5" y="5.5" width="8" height="8" rx="1.25" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M10.5 3.5v-.75A1.25 1.25 0 0 0 9.25 1.5h-5A1.25 1.25 0 0 0 3 2.75v5A1.25 1.25 0 0 0 4.25 9h.75" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
                    variable: '<svg viewBox="0 0 16 16"><path d="M5 2.5c-1.5 1.5-2 3.5-2 5.5s.5 4 2 5.5M11 2.5c1.5 1.5 2 3.5 2 5.5s-.5 4-2 5.5M6.5 6l3 4M9.5 6l-3 4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
                    path: '<svg viewBox="0 0 16 16"><circle cx="3.5" cy="12.5" r="1.5" fill="currentColor"/><circle cx="12.5" cy="3.5" r="1.5" fill="currentColor"/><path d="M3.5 11V8a2 2 0 0 1 2-2h5a2 2 0 0 0 2-2" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
                    open: '<svg viewBox="0 0 16 16"><path d="M2 4.5a1 1 0 0 1 1-1h3.2l1.3 1.5H13a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
                    save: '<svg viewBox="0 0 16 16"><path d="M8 2.5v7M5 7l3 3 3-3M3 11.5v1.5h10v-1.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                    fullscreen: '<svg viewBox="0 0 16 16"><path d="M2.5 6V2.5H6M10 2.5h3.5V6M13.5 10v3.5H10M6 13.5H2.5V10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                    exitFullscreen: '<svg viewBox="0 0 16 16"><path d="M6 2.5V6H2.5M13.5 6H10V2.5M10 13.5V10h3.5M2.5 10H6v3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                    more: '<svg viewBox="0 0 16 16"><circle cx="3.5" cy="8" r="1.4" fill="currentColor"/><circle cx="8" cy="8" r="1.4" fill="currentColor"/><circle cx="12.5" cy="8" r="1.4" fill="currentColor"/></svg>',
                    popOut: '<svg viewBox="0 0 16 16"><path d="M9.5 2.5h4v4M13.5 2.5L8 8M12 9.5v3a1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                    popIn: '<svg viewBox="0 0 16 16"><path d="M12 8.5H8V4.5M8 8.5l5.5-5.5M12 10.5v2a1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                    code: '<svg viewBox="0 0 16 16"><path d="M5.5 4.5L2 8l3.5 3.5M10.5 4.5L14 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                    info: '<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 7.25v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="8" cy="5" r="1" fill="currentColor"/></svg>',
                    result: '<svg viewBox="0 0 16 16"><path d="M9 4.5L5.5 8 9 11.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="8" r="1.1" fill="currentColor"/></svg>',
                    close: '<svg viewBox="0 0 16 16"><path d="M4 4l8 8m0-8l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
                    clear: '<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3.75 12.25l8.5-8.5" stroke="currentColor" stroke-width="1.5"/></svg>',
                    copyToEditor: '<svg viewBox="0 0 16 16"><path d="M6 3.5L2.5 7 6 10.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 7h6.5a4 4 0 0 1 4 4v1.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
                    spinner: '<svg viewBox="0 0 16 16" class="spin"><path d="M8 1.75a6.25 6.25 0 1 1-6.25 6.25" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>',
                    chevron: '<svg viewBox="0 0 16 16"><path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                    consoleError: '<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="currentColor"/><path d="M5.5 5.5l5 5m0-5l-5 5" stroke="#fff" stroke-width="1.75" stroke-linecap="round"/></svg>',
                    consoleWarning: '<svg viewBox="0 0 16 16"><path d="M8 1.75L14.75 14H1.25z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6v3.5" stroke="#202124" stroke-width="1.75" stroke-linecap="round"/><circle cx="8" cy="11.75" r="1" fill="#202124"/></svg>',
                  };
                  return (codes[this.name] ?? codes.missing).replace('<svg', '$& xmlns="http://www.w3.org/2000/svg" style="height: 1em; width: 1em; display: inline-block; transform: translateY(0.1em);"');
                }
              },
              template: '<span v-html="svgCode"></span>'
            }
          }
          
          function getJSValueComponentProps() {
            return {
              // keyPath is the property keys leading to this value from the logged
              // value (eg. ["people", "0", "name"]) or null if it can't be reached by
              // property keys (eg. inside of a Map).
              props: ['description', 'path', 'name', 'isDimName', 'keyPath'],
              data() {
                return {
                  isExpanded: false,
                  hasBeenExpanded: false,
                };
              },
              watch: {
                isExpanded(newValue) {
                  if (newValue && !this.hasBeenExpanded) {
                    this.hasBeenExpanded = newValue;
                  }
                },
                // When a refresh replaces this value's description, its new contents are
                // requested if it is still expanded.
                isPartialDescription(isPartial) {
                  if (isPartial && this.isExpanded) this.requestDescription();
                },
              },
              computed: {
                isPartialDescription() {
                  return this.description.entries === undefined;
                },
                isExpandable() {
                  return !this.description.isPrimitive;
                },
                isEntry() {
                  return this.name != null;
                },
                classNames() {
                  return [
                    'js-value',
                    // Entries are always on their own line just like expanded values.
                    (this.isEntry || (this.isExpandable && this.isExpanded)) ? 'd-block' : 'd-inline-block',
                    this.isExpanded ? 'expanded' : '',
                  ];
                },
                entryGroups() {
                  // protoEntries only ever contains the [[Prototype]] entry whose
                  // members can be reached directly so it adds nothing to the key path.
                  const {keyPath, description} = this;
                  return [
                    {
                      key: 'entries',
                      isDim: entry => entry[2] === false,
                      getKeyPath: entry => keyPath && description.entriesArePropertyKeys ? keyPath.concat([entry[0]]) : null,
                    },
                    {
                      key: 'protoEntries',
                      isDim: () => true,
                      getKeyPath: () => keyPath,
                    },
                  ];
                }
              },
              methods: {
                toggleExpanded() {
                  if (!this.isExpandable) return;
                  this.isExpanded = !this.isExpanded;
                  if (this.isExpanded && this.isPartialDescription) this.requestDescription();
                },
                requestDescription() {
                  messageParent({target: 'runner', func: 'sendDescriptionFor', args: [this.path]});
                },
                /**
                 * Shows the menu for this value (eg. Copy as JSON).
                 * @param {MouseEvent} evt
                 */
                openMenu(evt) {
                  this.$root.openValueMenu(evt, {
                    path: this.path,
                    keyPath: this.keyPath,
                    isPrimitive: this.description.isPrimitive,
                  });
                },
              },
              template: `
                <div :class="classNames">
                  <div :class="['js-value-header', isExpandable ? 'expandable' : '']" @click="toggleExpanded" @contextmenu.prevent.stop="openMenu"><span
                    v-if="isExpandable || isEntry" :class="['arrow', isExpandable ? 'expandable' : '', isExpanded ? 'expanded' : '']"></span><template
                    v-if="isEntry"><span :class="['entry-key', isDimName ? 'dim' : '']">{{ name }}</span>: </template><span
                    v-for="part in description.parts" :class="'t-' + part[0]">{{ part[1] }}</span></div>
                  <div v-if="hasBeenExpanded" v-show="isExpanded" class="expansion">
                    <div v-if="isPartialDescription" class="loading">Loading&hellip;</div>
                    <template v-else>
                      <template v-for="group in entryGroups">
                        <js-value
                          v-for="(entry, entryIndex) in description[group.key]"
                          :name="entry[0]"
                          :is-dim-name="group.isDim(entry)"
                          :description="entry[1]"
                          :key-path="group.getKeyPath(entry)"
                          :path="path.concat([group.key, entryIndex])">
                        </js-value>
                      </template>
                    </template>
                  </div>
                </div>
              `
            };
          }
          
          /**
           * @param {string} jsCode 
           * @returns {{headerLines: string, lines: string, allLines: string}[]}
           */
          function parseJSCodeGroups(jsCode) {
            return jsCode.split(/\r\n|\r|\n/).reduce(
              (groups, line) => {
                const lastGroup = groups[groups.length - 1];
                const isHeaderLine = /^\/\/[^]*\\\\$/.test(line);
                const headerLine = isHeaderLine ? line.replace(/^\/+\s*|\s*\\+$/g, '') : line;
                if (!groups.length || (isHeaderLine && !lastGroup.canAppendHeader)) {
                  groups.push({
                    headerLines: isHeaderLine ? [headerLine] : [],
                    lines: isHeaderLine ? [] : [line],
                    allLines: [line],
                    canAppendHeader: isHeaderLine,
                  });
                }
                else if (isHeaderLine) {
                  lastGroup.headerLines.push(headerLine);
                  lastGroup.allLines.push(line);
                }
                else {
                  lastGroup.canAppendHeader = false;
                  lastGroup.lines.push(line);
                  lastGroup.allLines.push(line);
                }
                return groups;
              },
              []
            ).reduce(
              (groups, group) => {
                if (!group.canAppendHeader) {
                  delete group.canAppendHeader;
                  group.headerLines = group.headerLines.join('\n').trimEnd();
                  group.lines = group.lines.join('\n');
                  group.allLines = group.allLines.join('\n');
                  groups.push(group);
                }
                return groups;
              },
              []
            );
          }
          
          /**
           * Determines the header that should be displayed for a group of code and
           * whether or not the group's code should be hidden.  A group is hidden if its
           * header starts with `hidePrefix`, in which case anything after the prefix (and
           * an optional colon) is used as the header.
           * @param {string} headerLines
           * @param {string} hidePrefix
           * @returns {{header: string, isHidden: boolean}}
           */
          function parseGroupHeader(headerLines, hidePrefix) {
            const isHidden = !!hidePrefix && headerLines.startsWith(hidePrefix);
            return {
              header: isHidden
                ? headerLines.slice(hidePrefix.length).replace(/^\s*:?\s*/, '')
                : headerLines,
              isHidden,
            };
          }
          
          /**
           * Separates the hidden groups of code from the visible code.
           * @param {string} jsCode
           * @param {string} hidePrefix
           * @returns {{
           *   visibleCode: string,
           *   hiddenGroups: (ReturnType<parseJSCodeGroups>[number] & {runCount: number})[]
           * }}
           *   `visibleCode` is the code to show in the editor.  Each hidden group has a
           *   `runCount` indicating how many visible groups must be run before it runs.
           */
          function extractHiddenGroups(jsCode, hidePrefix) {
            const visibleGroups = [];
            const hiddenGroups = [];
            for (const group of parseJSCodeGroups(jsCode)) {
              if (parseGroupHeader(group.headerLines, hidePrefix).isHidden) {
                hiddenGroups.push({...group, runCount: visibleGroups.length});
              }
              else {
                visibleGroups.push(group);
              }
            }
            return {
              visibleCode: visibleGroups.map(g => g.allLines).join('\n'),
              hiddenGroups,
            };
          }
          
          /**
           * Compiles TypeScript to JavaScript by removing the types (without checking
           * them) using Babel.  Every line stays on the same line so that line numbers
           * in errors still match.
           * @param {string} code
           * @param {Object} options
           * @param {"classic"|"module"} options.blockType
           * @returns {{code: string, sourceMap?: number[][][], error?: {message: string, line: number, column: number}}}
           *   The JavaScript code and, for each of its lines, where it came from (see
           *   decodeSourceMap()) or the syntax error that kept it from being compiled.
           */
          function compileTypeScript(code, {blockType}) {
            try {
              const result = Babel.transform(code, {
                filename: 'snippet.ts',
                presets: [['typescript', {
                  allExtensions: true,
                  // Only `import type` is removed so that an import is never dropped
                  // just because it isn't used yet.
                  onlyRemoveTypeImports: true,
                }]],
                sourceType: blockType === 'module' ? 'module' : 'script',
                // Allows `export` in a namespace in classic blocks.  Imports in classic
                // blocks are left in so that running them shows the usual error.
                parserOpts: {allowImportExportEverywhere: blockType !== 'module'},
                retainLines: true,
                sourceMaps: true,
              });
              return {code: result.code, sourceMap: decodeSourceMap(result.map.mappings)};
            }
            catch (e) {
              if (e?.name !== 'SyntaxError' || !e.loc) throw e;
              return {
                code,
                error: {
                  // Babel's message starts with the file name and ends with the
                  // position and the code where the error is.
                  message: `${e.message}`.split('\n')[0].replace(/^\/?snippet\.ts:\s*/, '').replace(/\s*\(\d+:\d+\)$/, ''),
                  line: e.loc.line,
                  column: e.loc.column + 1,
                },
              };
            }
          }
          
          /**
           * Decodes the mappings of a source map (for a single source).
           * @param {string} mappings
           * @returns {number[][][]}
           *   For each line of the compiled code, its mappings as [compiled column,
           *   original line, original column] (all starting at 0) sorted by column.
           */
          function decodeSourceMap(mappings) {
            const BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            const totals = [0, 0, 0, 0, 0];
            return mappings.split(';').map(line => {
              totals[0] = 0;
              const lineMappings = [];
              for (const segment of line.split(',')) {
                if (!segment) continue;
                const fields = [];
                let value = 0, shift = 0;
                for (const char of segment) {
                  const digit = BASE64.indexOf(char);
                  value += (digit & 31) << shift;
                  if (digit & 32) {
                    shift += 5;
                  }
                  else {
                    fields.push(value & 1 ? -(value >>> 1) : value >>> 1);
                    value = shift = 0;
                  }
                }
                // The fields are the compiled column, the source index, the original
                // line and the original column, each relative to the previous one.
                fields.forEach((field, index) => totals[index] += field);
                if (fields.length >= 4) lineMappings.push([totals[0], totals[2], totals[3]]);
              }
              return lineMappings.sort((a, b) => a[0] - b[0]);
            });
          }
          
          /**
           * Gets a block of code ready to run:  packages imported by name (eg.
           * `import _ from 'lodash'` or `import('lodash')`) are loaded from importsUrl
           * and the last statement is found if it is an expression so that its value
           * can be shown.
           * @param {string} code
           * @param {Object} options
           * @param {"classic"|"module"} options.blockType
           * @param {string?} options.importsUrl
           *   The URL template where `{specifier}` is replaced with what was imported
           *   or an empty value to leave imports alone.
           * @param {boolean} options.findResult
           * @returns {{code: string, resultRange: [number, number]|null}}
           *   The code to run and the start and end index of its last expression (or
           *   `null`).  If the code can't be parsed it is returned as is so that running
           *   it shows the syntax error.
           */
          function prepareCode(code, {blockType, importsUrl, findResult}) {
            if (!window.acorn) return {code, resultRange: null};
            let ast;
            try {
              ast = acorn.parse(code, {
                ecmaVersion: 'latest',
                sourceType: blockType === 'module' ? 'module' : 'script',
                allowHashBang: true,
              });
            }
            catch (e) {
              return {code, resultRange: null};
            }
          
            let resultRange = null;
            if (findResult) {
              const last = ast.body[ast.body.length - 1];
              if (last?.type === 'ExpressionStatement' && !last.directive) {
                resultRange = [last.expression.start, last.expression.end];
              }
            }
          
            // Finds every import (and re-export) of a package by name.
            const replacements = [];
            if (importsUrl) {
              walkAst(ast, node => {
                const {source} = /^(Import(Declaration|Expression)|Export(All|Named)Declaration)$/.test(node.type) ? node : {};
                if (source?.type === 'Literal' && 'string' === typeof source.value && isBareSpecifier(source.value)) {
                  replacements.push({
                    start: source.start,
                    end: source.end,
                    text: JSON.stringify(importsUrl.replace(/\{specifier\}/g, source.value)),
                  });
                }
              });
            }
          
            // Replaces them from last to first, moving the result's range as needed.
            replacements.sort((a, b) => b.start - a.start);
            for (const {start, end, text} of replacements) {
              code = code.slice(0, start) + text + code.slice(end);
              const shift = text.length - (end - start);
              if (resultRange) resultRange = resultRange.map(index => index >= end ? index + shift : index);
            }
          
            return {code, resultRange};
          }
          
          /**
           * Turns property keys into a path like the browser's console's "Copy property
           * path" (eg. ["people", "0", "first name"] becomes `people[0]["first name"]`).
           * @param {string[]} keys
           * @returns {string}
           */
          function formatPropertyPath(keys) {
            return keys.map((key, index) =>
              /^(0|[1-9]\d*)$/.test(key)
                ? `[${key}]`
                : /^[A-Za-z_$][\w$]*$/.test(key)
                  ? (index ? '.' : '') + key
                  : `[${JSON.stringify(key)}]`
            ).join('');
          }
          
          /**
           * Indicates if an import specifier is a package name (eg. "lodash",
           * "lodash@4/fp" or "@scope/pkg") rather than a relative path or a URL (eg.
           * "./utils.js", "https://example.com/x.js" or "node:fs").
           * @param {string} specifier
           * @returns {boolean}
           */
          function isBareSpecifier(specifier) {
            return !/^(\.{0,2}\/|#|[a-z][a-z\d+.-]*:)/i.test(specifier);
          }
          
          /**
           * Calls the callback for every node in an Acorn syntax tree.
           * @param {*} node
           * @param {(node: *) => void} callback
           */
          function walkAst(node, callback) {
            if (Array.isArray(node)) {
              for (const child of node) walkAst(child, callback);
            }
            else if (node && 'string' === typeof node.type) {
              callback(node);
              for (const key of Object.keys(node)) {
                const value = node[key];
                if (value && 'object' === typeof value) walkAst(value, callback);
              }
            }
          }
          
          /**
           * Joins groups of code back together making sure that each one (other than
           * the first) starts with a header so that they stay separate groups.
           * @param {string[]} blocks
           * @returns {string}
           */
          function joinCodeBlocks(blocks) {
            return blocks
              .map(block => block.replace(/^(\s*[\r\n])+|\s+$/g, ''))
              .filter(Boolean)
              .map((block, index) => {
                const firstLine = block.split(/\r\n|\r|\n/)[0];
                return index && !/^\/\/[^]*\\\\$/.test(firstLine) ? `// \\\\\n${block}` : block;
              })
              .join('\n\n');
          }
          
          /**
           * Builds the HTML for a console that uses the given code and data attributes.
           * @param {Object} options
           * @param {string} options.code
           * @param {{[key: string]: string}} options.dataset
           * @param {{name: string, version: string}} options.packageInfo
           * @param {boolean} options.isFullPage
           *   If `true` a full page is returned, otherwise just a snippet to embed.
           * @returns {string}
           */
          function buildConsoleHtml({code, dataset, packageInfo, isFullPage}) {
            const {name, version} = packageInfo;
            const src = `https://cdn.jsdelivr.net/npm/${name}@${version.split('.')[0]}/dist/${name}.min.js`;
            const attrs = Object.entries(dataset)
              .map(([key, value]) => ` data-${key.replace(/[A-Z]/g, c => '-' + c.toLowerCase())}="${escapeHtmlAttribute(value)}"`)
              .join('');
            const indent = isFullPage ? '    ' : '  ';
          
            // Keeps the code from ending the script tag early.
            const safeCode = code.replace(/<\/(script)/gi, '<\\/$1').replace(/<!--/g, '<\\!--');
            const scriptLines = safeCode.trim()
              ? [
                  `<script src="${src}"${attrs}>`,
                  ...safeCode.split('\n').map(line => line.trim() ? '  ' + line : ''),
                  '</script>',
                ]
              : [`<script src="${src}"${attrs}></script>`];
            const indentedScript = scriptLines.map(line => line ? indent + line : line).join('\n');
          
            return isFullPage
              ? [
                  '<!DOCTYPE html>',
                  '<html lang="en">',
                  '  <head>',
                  '    <meta charset="utf-8">',
                  '    <meta name="viewport" content="width=device-width, initial-scale=1">',
                  '    <title>YourJS Box</title>',
                  '    <style>',
                  '      html, body { height: 100%; margin: 0; }',
                  '    </style>',
                  '  </head>',
                  '  <body>',
                  indentedScript,
                  '  </body>',
                  '</html>',
                  '',
                ].join('\n')
              : `<div style="height: 400px;">\n${indentedScript}\n</div>\n`;
          }
          
          /**
           * @param {string} value
           * @returns {string}
           */
          function escapeHtmlAttribute(value) {
            return `${value}`.replace(/[&"<>]/g, c => `&#${c.charCodeAt(0)};`);
          }
          
          /**
           * Finds the minimum indentation of all of the lines that have non-space
           * characters and removes the indentation accordingly for all indented lines.
           * @param {string} text
           *   The string containing the lines of text that should be unindented.
           * @param {{trim: boolean, tabSize: number}=} opt_options
           *   Optional, defaults to `{trim: true, tabSize: 4}`.  The `trim` property
           *   indicates if leading lines should be removed along with trailing
           *   whitespaces.  The `tabSize` property indicates how many spaces will be
           *   used to replace all tab characters.
           * @returns {string}
           *   A new version of `text` with all of the minimally indented lines having
           *   no leading spacing and all other indented lines following suit.  If
           *   `opt_options.trim` is `true` all leading lines and trailing spaces will
           *   not exist.  All tab characters will be replaced with
           *   `opt_options.tabSize` amount of space characters.
           */
          function unindentMin(text, opt_options) {
            opt_options = Object(opt_options);
            const tabSize = opt_options.tabSize ?? 4;
            const trim = opt_options.trim ?? true;
            text = text.replace(/\t/g, ' '.repeat(tabSize));
            if (!/(^|[\r\n])\S/.test(text)) {
              const rgx = /(^|[\r\n])((?:(?!\r|\n)\s)+)(?=(\S)?)/g;
              let min = Infinity;
              for (let match; match = rgx.exec(text);) {
                if (match[3]) {
                  min = Math.min(min, match[2].length);
                }
              }
              text = text.replace(
                rgx,
                (_, start, spaces) => start + spaces.slice(min)
              );
            }
            return trim ? text.replace(/^(\s*[\r\n]+)+|\s+$/g, '') : text;
          }
          
          /**
           * Picks the properties of a description sent by the runner so that nothing
           * unexpected makes its way into the displays.
           * @param {*} description
           */
          function sanitizeDescription(description) {
            description = Object(description);
            return {
              typeName: `${description.typeName}`,
              isPrimitive: !!description.isPrimitive,
              // Each part is [kind, text] where kind is used in a class name.
              parts: Array.from(description.parts ?? [], part => [
                /^[a-z]+$/.test(Object(part)[0]) ? part[0] : 'text',
                `${Object(part)[1]}`,
              ]),
              ...sanitizeEntries(description),
              ...(description.entriesArePropertyKeys != null ? {entriesArePropertyKeys: !!description.entriesArePropertyKeys} : {}),
            };
          }
          
          /**
           * Picks the entries of a description sent by the runner.
           * @param {*} description
           */
          function sanitizeEntries(description) {
            description = Object(description);
            const result = {};
            for (const key of ['entries', 'protoEntries']) {
              if (Array.isArray(description[key])) {
                // Each entry is [key, description, isEnumerable].
                result[key] = description[key].map(entry => [
                  `${Object(entry)[0]}`,
                  sanitizeDescription(Object(entry)[1]),
                  Object(entry)[2] !== false,
                ]);
              }
            }
            return result;
          }
          
          /**
           * NOTE:  Called via main by the runner.
           * @param {object} options
           * @param {string} options.logId
           * @param {string} options.key
           * @param {any[]} options.descriptions
           * @param {{headers: string[], rows: {index: string, cells: any[]}[]}|null} options.table
           */
          function appendLog({logId, key, descriptions, table, groupIds, groupId, isCollapsed, stack}) {
            key = `${key}`;
            mountedApp.displays.push({
              type: 'log',
              key,
              name: key === 'result' ? 'Result' : `console.${key}`,
              descriptions: Array.from(descriptions, sanitizeDescription),
              table: table ? {
                headers: Array.from(table.headers, h => `${h}`),
                rows: Array.from(table.rows, row => ({
                  index: `${row.index}`,
                  cells: Array.from(row.cells, cell => cell && sanitizeDescription(cell)),
                })),
              } : null,
              // The groups (from console.group()) that this message is in.
              groupIds: Array.from(groupIds ?? [], id => `${id}`),
              // Set if this message starts a group.
              groupId: groupId != null ? `${groupId}` : null,
              isCollapsed: !!isCollapsed,
              stack: stack != null ? `${stack}` : null,
              logId: `${logId}`,
            });
          }
          
          /**
           * NOTE:  Called via main by the runner.
           * @param {object} options
           * @param {string} options.message
           * @param {number=} options.line
           * @param {number=} options.column
           */
          function appendError({message, line, column}) {
            mountedApp.displays.push({
              type: 'error',
              message: `${message}`,
              line: +line,
              column: +column,
            });
          }
          
          /**
           * NOTE:  Called via main by the runner.
           * @param {(string|number)[]} path
           *   The log ID, the argument index and then pairs of entry group keys and entry
           *   indices.
           * @param {*} description
           */
          function updateDescriptionFor(path, description) {
            path = Array.from(path);
            const logId = path.shift();
            const display = mountedApp.displays.find(d => d.type === 'log' && d.logId === logId);
            let level = display?.descriptions[toIndex(path.shift())];
          
            for (let i = 0; level && i < path.length; i += 2) {
              const groupKey = path[i];
              if (groupKey !== 'entries' && groupKey !== 'protoEntries') return;
              level = level[groupKey]?.[toIndex(path[i + 1])]?.[1];
            }
          
            if (!level) return;
            Object.assign(level, sanitizeEntries(description));
            level.entriesArePropertyKeys = !!Object(description).entriesArePropertyKeys;
            // A refresh also sends the value's preview.
            if (Array.isArray(Object(description).parts)) {
              const {typeName, isPrimitive, parts} = sanitizeDescription(description);
              Object.assign(level, {typeName, isPrimitive, parts});
            }
          }
          
          /**
           * NOTE:  Called via main by the runner with a value converted to JSON (see
           * requestValueJson()).
           * @param {{requestId: string, json?: string, circularCount?: number, error?: string}} result
           */
          function onValueJson(result) {
            const {requestId, json, circularCount, error} = Object(result);
            const resolve = jsonRequests.get(`${requestId}`);
            if (!resolve) return;
            jsonRequests.delete(`${requestId}`);
            resolve({
              json: json != null ? `${json}` : null,
              circularCount: +circularCount || 0,
              error: error != null ? `${error}` : null,
            });
          }
          
          /**
           * The functions waiting for values to be converted to JSON by their request
           * IDs.
           * @type {Map<string, (result: {json: string?, circularCount: number, error: string?}) => void>}
           */
          const jsonRequests = new Map();
          
          /**
           * NOTE:  Called via main by the runner after a value was stored as a global
           * variable.
           * @param {string} name
           */
          function onStoredAsGlobal(name) {
            mountedApp.displays.push({type: 'notice', message: `Stored as the global variable ${`${name}`}`});
          }
          
          /**
           * NOTE:  Called via main by the runner once it has run a group of code.
           */
          function onCodeRan() {
            mountedApp.runningCount = Math.max(0, mountedApp.runningCount - 1);
            mountedApp.runHiddenGroups();
          }
          
          /**
           * NOTE:  Called by main when the console is popped out into a separate window
           * or brought back into the page.
           * @param {boolean} isPoppedOut
           * @param {*=} state
           *   When brought back, the state of the pop-out window's viewer (if it sent
           *   it).
           */
          function setPoppedOut(isPoppedOut, state) {
            mountedApp.isPoppedOut = isPoppedOut;
            if (state) mountedApp.restoreState(state);
          }
          
          /**
           * NOTE:  Called by main to ask the pop-out window to send its state back.
           */
          function popIn() {
            mountedApp.bringBack();
          }
          
          /**
           * NOTE:  Called by main if the browser blocked the pop-out window.
           */
          function onPopOutFailed() {
            mountedApp.displays.push({
              type: 'notice',
              message: 'The pop-out window was blocked by the browser.  Allow pop-ups for this site and try again.',
            });
          }
          
          /**
           * NOTE:  Called via main by the runner when console.clear() is called.
           */
          function clearDisplays() {
            mountedApp.displays = [{type: 'notice', message: 'Console was cleared'}];
          }
          
          /**
           * Only allows non-negative integers to be used as an index.
           * @param {*} value
           * @returns {number|undefined}
           */
          function toIndex(value) {
            return Number.isInteger(value) && value >= 0 ? value : undefined;
          }
          
        },
        // Exact versions are used so that a new release of a library can never
        // change how an existing version of this console works.  Ace and Prism
        // load other files (eg. language modes) from next to these files.
        jsUrls: [
          libraryUrl('vue', 'dist/vue.global.prod.js'),
          libraryUrl('ace-builds', 'src-noconflict/ace.js'),
          libraryUrl('prismjs', 'components/prism-core.min.js'),
          libraryUrl('prismjs', 'plugins/autoloader/prism-autoloader.min.js'),
          libraryUrl('prismjs', 'plugins/match-braces/prism-match-braces.min.js'),
          // Used to find the last expression in each block of code (so that its
          // value can be shown) and the packages that it imports.
          libraryUrl('acorn', 'dist/acorn.js'),
          // Removes the types from TypeScript code before it is run.
          ...language === 'typescript' ? [libraryUrl('@babel/standalone', 'babel.min.js')] : [],
        ],
        cssUrls: [
          'data:text/css,' + encodeURIComponent(VIEWER_IFRAME_CSS),
          libraryUrl('prism-themes', 'themes/prism-vsc-dark-plus.min.css'),
          libraryUrl('prismjs', 'plugins/match-braces/prism-match-braces.min.css'),
        ],
        head: targetWindow ? '<meta charset="utf-8"><title>YourJS Box</title>' : '',
        htmlAttributes: 'data-theme="' + theme + '"',
        targetWindow,
        onMessage(message) {
          relayMessage(message.data, {runner, host: {apply: (func, args) => hostFuncs[func](...args)}});
        },
        async onReady() {
          // The dataset is passed as is so that the viewer knows which options
          // were actually specified (eg. when copying the console as HTML).
          this.call('init', code, dataset, {
            runnerMode,
            blockType,
            language,
            showResults,
            importsUrl,
            packageInfo: PACKAGE_INFO,
            libraryVersions: LIBRARY_VERSIONS,
            isPopOut: !!targetWindow,
            popOutState: state ?? null,
          });
        },
        body: VIEWER_IFRAME_HTML,
        style: {
          width: '100%',
          // Fills its container unless a height is given but is never
          // squashed smaller than the default height of an IFRAME.
          height: height || '100%',
          minHeight: '150px',
          border: 0,
          display: 'block',
        },
      });
    }

    inlineViewer = activeViewer = createViewer();
    insert(inlineViewer.iframe);

    let isDestroyed = false;

    /**
     * Loads the viewer and starts the runner (which, in window mode, is when
     * the page's console functions start being captured).
     */
    function load() {
      if (runner || isDestroyed) return;
      runner = runnerMode === 'window'
        ? createWindowRunner(sendToViewer)
        : createWorkerRunner(sendToViewer);
      inlineViewer.load();
    }

    // Unless data-loading="eager" is given, nothing is loaded until the console
    // is about to be scrolled into view (or a hidden console is shown).
    /** @type {IntersectionObserver?} */
    let loadObserver = null;
    if (dataset.loading !== 'eager' && 'function' === typeof window.IntersectionObserver) {
      loadObserver = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          loadObserver.disconnect();
          loadObserver = null;
          load();
        }
      }, {rootMargin: '200px'});
      loadObserver.observe(inlineViewer.iframe);
    }
    else {
      load();
    }

    return {
      element: inlineViewer.iframe,
      /**
       * Removes the console, stops its code and closes its pop-out window.
       */
      destroy() {
        if (isDestroyed) return;
        isDestroyed = true;
        if (popOutWindow) {
          clearInterval(popOutWatcher);
          popOutViewer.dispose();
          popOutWindow.close();
          popOutWindow = null;
        }
        removeEventListener('pagehide', closePopOut);
        loadObserver?.disconnect();
        runner?.destroy();
        inlineViewer.dispose();
        inlineViewer.iframe.remove();
      },
    };
  }

  /**
   * Creates a console in place of a script tag using its code and data
   * attributes.
   * @param {HTMLScriptElement} script
   */
  function createConsoleFromScript(script) {
    return createConsole({
      code: script.textContent,
      dataset: JSON.parse(JSON.stringify(script.dataset)),
      insert: element => script.parentNode.insertBefore(element, script),
    });
  }

  /**
   * Where YourJSBox.create() can put a console relative to its target.
   */
  const PLACEMENTS = {
    fill: (target, element) => target.replaceChildren(element),
    append: (target, element) => target.append(element),
    prepend: (target, element) => target.prepend(element),
    replace: (target, element) => target.replaceWith(element),
    before: (target, element) => target.before(element),
    after: (target, element) => target.after(element),
  };

  /**
   * The options of YourJSBox.create() which are the same as the data
   * attributes of a script tag.
   */
  const CONSOLE_OPTION_NAMES = ['blockType', 'dividerOrient', 'hidePrefix', 'importsUrl', 'language', 'librariesUrl', 'loading', 'runner', 'showResults', 'theme'];

  /**
   * The JavaScript API for creating consoles (available as window.YourJSBox).
   */
  const YourJSBox = Object.freeze({
    version: PACKAGE_INFO.version,

    /**
     * Creates a console.
     * @param {Object} options
     * @param {string|Element} options.target
     *   The element (or a CSS selector for it) that the console is placed
     *   relative to.
     * @param {"fill"|"append"|"prepend"|"replace"|"before"|"after"=} options.placement
     *   Optional, defaults to `"fill"`.  Where the console goes:  "fill"
     *   replaces the target's contents, "append" and "prepend" add it inside
     *   of the target, "replace" replaces the target itself and "before" and
     *   "after" add it next to the target.
     * @param {(string|number)=} options.height
     *   Optional, defaults to `"100%"`.  The CSS height of the console (a
     *   number is treated as pixels).  It is never less than 150px.
     * @param {string=} options.code
     *   Optional.  The code that the console starts with.
     * @param {string=} options.runner
     * @param {string=} options.blockType
     * @param {string=} options.language
     * @param {(boolean|string)=} options.showResults
     * @param {string=} options.hidePrefix
     * @param {string=} options.dividerOrient
     * @param {string=} options.theme
     * @param {string=} options.librariesUrl
     * @param {string=} options.importsUrl
     * @param {string=} options.loading
     *   The same as the data attributes of a script tag.
     * @returns {{element: HTMLIFrameElement, destroy: () => void}}
     */
    create(options) {
      options = Object(options);
      const {target, placement = 'fill', height, code = ''} = options;
      const targetElement = 'string' === typeof target ? document.querySelector(target) : target;
      if (targetElement?.nodeType !== 1) {
        throw new TypeError(
          'string' === typeof target
            ? `YourJSBox.create(): no element matches the target ${JSON.stringify(target)}.`
            : 'YourJSBox.create(): target must be an element or a CSS selector.'
        );
      }
      if (!Object.hasOwn(PLACEMENTS, placement)) {
        throw new TypeError(`YourJSBox.create(): placement must be one of ${Object.keys(PLACEMENTS).join(', ')}.`);
      }

      const dataset = {};
      for (const name of CONSOLE_OPTION_NAMES) {
        if (options[name] != null) dataset[name] = `${options[name]}`;
      }

      return createConsole({
        code: `${code}`,
        dataset,
        height: 'number' === typeof height ? `${height}px` : height != null ? `${height}` : undefined,
        insert: element => PLACEMENTS[placement](targetElement, element),
      });
    },
  });

  // NOTE:  This solution was intentionally written without using newer JS
  // features to make the minified version even smaller.
  var createCallableFrame = (function () {
    var IFRAME_SCRIPT_MESSAGE_CODE = parseFunction(function() {
      // The window that created this one:  the opener if this is a pop-out
      // window or else the parent of the IFRAME.
      var HOST_WINDOW = window.opener || window.parent;

      // NOTE:  Referencing with window to ensure that local namespace will not
      // interfere.
      window.addEventListener('message', function(e) {
        var data = e.data;
        if (
          e.source === HOST_WINDOW
          && data && /^[A-Za-z_$][\w$]*$/.test(data.funcName)
          && Array.isArray(data.args)
        ) {
          var func = eval(data.funcName);
          if ('function' === typeof func) func.apply(e, data.args);
        }
      });

      function messageParent(message) {
        HOST_WINDOW.postMessage(message, '*');
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
     * @param {Window=} options.targetWindow
     *   If given the page is written into this (same origin) window (eg. a
     *   pop-out window) instead of into a new IFRAME.
     * @param {boolean=} options.deferLoad
     *   If true the IFRAME's page isn't loaded until `load()` is called.
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
            HOST_WINDOW.postMessage({funcName: funcName, args: args, id: READY_ID}, '*');
          };

          callParent = function(funcName) {
            HOST_WINDOW.postMessage(
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

      var TARGET_WINDOW = options.targetWindow;
      var IFRAME = TARGET_WINDOW ? null : document.createElement('iframe');
      function getFrameWindow() {
        return TARGET_WINDOW || IFRAME.contentWindow;
      }

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
      // Writes the page into the target window or sets the IFRAME's source.
      if (TARGET_WINDOW) {
        TARGET_WINDOW.document.open();
        TARGET_WINDOW.document.write(HTML_CODE);
        TARGET_WINDOW.document.close();
      }
      else {
        // Allows the console to go full screen.
        IFRAME.setAttribute('allow', 'fullscreen');
        if (!options.deferLoad) IFRAME.srcdoc = HTML_CODE;
      }

      // Set the style of the iframe.
      if (style && IFRAME) {
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
      function onWindowMessage(e) {
        if (e.source === getFrameWindow()) {
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
      }
      addEventListener('message', onWindowMessage);

      // Returns an object which makes it possible to call functions and get
      // access to the IFRAME.
      var queuedMessages = [];
      function postToFrame(message) {
        if (isReady) getFrameWindow().postMessage(message, '*');
        else queuedMessages.push(message);
      }
      var callableFrame = {
        apply: function(funcName, args) {
          postToFrame({funcName: funcName, args: args});
        },
        call: function(funcName) {
          postToFrame({funcName: funcName, args: Array.prototype.slice.call(arguments, 1)});
        },
        iframe: IFRAME,
        window: TARGET_WINDOW,
        // Loads the IFRAME's page if it was deferred.
        load: function() {
          if (IFRAME && !IFRAME.srcdoc) IFRAME.srcdoc = HTML_CODE;
        },
        // Stops listening for messages from the frame.
        dispose: function() {
          removeEventListener('message', onWindowMessage);
        }
      };
      return callableFrame;
    };
    /**
     * @typedef {Object} createCallableFrame_Return
     * @property {(funcName: string, args: any[]) => void} apply
     * @property {(funcName: string, ...args: any[]) => void} call
     * @property {HTMLIFrameElement?} iframe
     * @property {Window=} window
     * @property {() => void} load
     * @property {() => void} dispose
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

  // The first copy of this script that is loaded provides the API.
  if (!window.YourJSBox) window.YourJSBox = YourJSBox;

  // A script in the body is replaced by a console while a script in the head
  // only provides the API.
  const currentScript = document.currentScript;
  if (currentScript && !document.head?.contains(currentScript)) {
    createConsoleFromScript(currentScript);
  }
})();