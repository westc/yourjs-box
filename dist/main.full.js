(() => {
  /**
   * Viewer IFRAME's CSS code
   * @type {string}
   */
  const VIEWER_IFRAME_CSS = "@import url(https://fonts.googleapis.com/css2?family=Raleway:wght@100;400;700;900&display=swap);[v-cloak]{display:none}#vueApp{display:flex;flex-direction:column;font-family:Raleway,sans-serif;inset:0;position:fixed}#main{flex-grow:1;display:grid;gap:0;position:relative}#main.col-orient.is-moving-divider{cursor:col-resize}#main.row-orient.is-moving-divider{cursor:row-resize}#main.is-moving-divider::after{display:block;content:'';position:absolute;background-image:repeating-linear-gradient(45deg,hsl(0deg,100%,50%,75%),hsl(60deg,100%,50%,75%),hsl(120deg,100%,50%,75%),hsl(180deg,100%,50%,75%),hsl(240deg,100%,50%,75%),hsl(300deg,100%,50%,75%),hsl(360deg,100%,50%,75%) 100px);box-shadow:inset 0 0 0 1px #fff;z-index:99}#main.col-orient.is-moving-divider::after{width:var(--divider-size);left:calc(100% - var(--temp-editor-pct) - var(--divider-size) + var(--divider-size)/ 2);top:0;bottom:0}#main.row-orient.is-moving-divider::after{height:var(--divider-size);top:calc(100% - var(--temp-editor-pct) - var(--divider-size) + var(--divider-size)/ 2);left:0;right:0}#main.col-orient{grid-template-columns:1fr var(--divider-size) calc(var(--editor-pct) - var(--divider-size)/ 2);grid-template-rows:1fr}#main.row-orient{grid-template-columns:1fr;grid-template-rows:1fr var(--divider-size) calc(var(--editor-pct) - var(--divider-size)/ 2)}#main.col-orient .divider{background-image:repeating-linear-gradient(45deg,rgba(255,255,255,.2),rgba(0,0,0,0),rgba(255,255,255,.2) 10px),linear-gradient(90deg,#ccc,#000,#000,#ccc);cursor:col-resize}#main.row-orient .divider{background-image:repeating-linear-gradient(45deg,rgba(255,255,255,.2),rgba(0,0,0,0),rgba(255,255,255,.2) 10px),linear-gradient(0deg,#ccc,#000,#000,#ccc);cursor:row-resize}#displays{position:relative}#displays>div{position:absolute;inset:0;overflow:auto}#bottomNav{flex-grow:0;display:flex;flex-direction:row;background-image:linear-gradient(to bottom,hsl(55deg,100%,60%),hsl(55deg,100%,50%) 50%,hsl(50deg,100%,50%) 50%,hsl(55deg,100%,45%));align-items:center;-webkit-user-select:none;user-select:none}#bottomNav>:first-child{flex-grow:1;padding:0 .5em}#bottomNav>.buttons{flex-grow:0}#bottomNav>.buttons>button{border:0!important;background-color:rgba(255,255,255,.2);box-shadow:-.1em 0 .1em -.1em #000,.1em 0 .1em -.1em #000;padding:0 .5em}button{cursor:pointer}button:disabled{cursor:not-allowed}#bottomNav>.buttons>button.active,#bottomNav>.buttons>button:hover{background-color:rgba(0,0,0,.2)}#logo{font-size:1.2em;font-weight:900;filter:drop-shadow(0 0 1px #FFF) drop-shadow(0 0 1px #FFF) drop-shadow(0 0 1px #FFF) drop-shadow(0 0 1px #FFF) drop-shadow(0 0 1px #000)}.rotated-90deg{transform:rotate(90deg)}.align-top{vertical-align:top!important}.d-inline-block{display:inline-block!important}.error-display{background-color:#f99;box-shadow:inset 0 1px 1px 1px #fff;color:#600;padding:.5em;text-wrap:wrap;white-space-collapse:preserve;display:flex;flex-direction:row;font-family:'Courier New',Courier,monospace;font-size:.9em}.error-display>:last-child{flex-grow:1;margin-left:.25em}.js-value{display:inline;margin-right:.75em;text-wrap:wrap;white-space-collapse:preserve}.js-value.promise{color:hsl(30deg,100%,25%)}.js-value.string{color:hsl(60deg,100%,25%)}.js-value.number{color:hsl(120deg,100%,25%)}.js-value.bigint{color:hsl(180deg,100%,25%)}.js-value.symbol{color:hsl(210deg,100%,25%)}.js-value.boolean{color:hsl(240deg,100%,25%)}.js-value.date{color:hsl(270deg,100%,25%)}.js-value.function{color:hsl(300deg,100%,25%)}.js-value.array-like,.js-value.object{display:block}.log{background-color:#eee;font-family:'Courier New',Courier,monospace;font-size:.9em;padding:.125em .25em}.log.warn{background-color:#ff9;color:#660}.log.error{background-color:#fdd;color:#600}.log.info{background-color:#def;color:#006}.log.debug{background-color:#dff;color:#006}.log>.type{box-shadow:0 .5em .5em -.5em;color:#0009;font-size:.8em;margin:0 0 .5em;background-image:linear-gradient(90deg,#0000,#0002 80%,#0001);text-align:left}.no-select{-webkit-user-select:none;user-select:none}.prism-header{background-image:linear-gradient(0deg,#0008,#2228 80%,#1118),linear-gradient(90deg,#000,#222 80%,#111);color:#eee;font-size:.8em;padding:.2em .5em;text-align:left;text-wrap:wrap;white-space-collapse:preserve}";
  /**
   * Viewer IFRAME's HTML code
   * @type {string}
   */
  const VIEWER_IFRAME_HTML = "<div id=\"vueApp\"><div id=\"main\" ref=\"main\" :class=\"mainElemClassNames\" :style=\"mainElemStyles\" @mousedown=\"onMainElemMouseDown\"><div id=\"displays\"><div><template v-for=\"display in displays\"><div v-if=\"display.type === 'prism'\" @click=\"this.jsCode = display.value\"><div v-if=\"display.header\" class=\"prism-header\">{{ display.header }}</div><prism language=\"javascript\" :code=\"display.value\" is-dark match-braces></prism></div><template v-if=\"display.type === 'log'\"><div :class=\"display.classNames\"><div class=\"type no-select\">{{ display.name }}</div><div><js-value v-for=\"value in display.values\" :value=\"value\"></js-value></div></div></template><template v-if=\"display.type === 'error'\"><div class=\"error-display\"><div><icon name=\"error\"></icon></div><div>{{ display.message }}</div></div></template></template></div></div><div class=\"divider\" ref=\"mainDivider\"></div><div id=\"editor\"><ace-editor v-model=\"jsCode\" language=\"javascript\" theme=\"dark\" @key-combo=\"onEditorKeyCombo\" height=\"100%\"></ace-editor></div></div><div id=\"bottomNav\"><div><span id=\"logo\">JSBox</span></div><div class=\"buttons\"><template v-for=\"bottomButton in bottomButtons\"><button @click=\"bottomButton.callback.call(this, $event)\" :title=\"bottomButton.title\" :disabled=\"bottomButton.disableIf &amp;&amp; bottomButton.disableIf.call(this)\"><icon :name=\"bottomButton.iconName\"></icon></button></template></div></div></div>";
  /**
   * Indicates if you can use a blob.  This will be false if testing in local
   * file system.
   */
  const CAN_USE_BLOB_SRC = !(u=>(URL.revokeObjectURL(u),u.startsWith('blob:null/')))(URL.createObjectURL(new Blob()));

  /**
   * Function executed when the script is included in a document.
   * @param {HTMLScriptElement} script
   *   This is the current script but also the placeholder for where lupa will
   *   be inserted into the DOM.
   */
  function main(script) {
    createFrames(script);
  }

  /**
   * @param {HTMLScriptElement} script 
   */
  function createFrames(script) {
    /** @type {ReturnType<createCallableFrame>} */
    let callableViewerFrame;

    const callableRunnerFrame = createCallableFrame({
      jsCode() {
        function init(jsCode, dataset) {
        }
        
        /**
         * Determines if a value is an array that can be visualized like a table.  Such
         * an array would only contain objects where at least one of them has at least
         * one key.
         * @param {*} value
         * @return {any[][]|null}
         */
        function parseTableArray(value) {
          if (!Array.isArray(value) || value.length < 1) return null;
        
          // Start the headers by looking at the first row if it is an array.
          const colValToIndices = {};
          let headers = [];
          if (Array.isArray(value[0])) {
            /** @type {any[]} */
            const firstRow = value.shift();
            headers = firstRow;
            for (let i = 0, l = firstRow.length; i < l; i++) {
              const item = firstRow[i];
              if (Object.hasOwn(colValToIndices, item)) colValToIndices[item].push(i);
              else colValToIndices[item] = [i];
            }
          }
        
          // Populate the rows and add any headers that were missing.
          const newRows = [];
          for (const oldRow of value) {
            if (oldRow === null || 'object' !== typeof oldRow) return null;
            const newRow = [];
            if (Array.isArray(oldRow)) {
              newRow.push(...oldRow);
              if (oldRow.length > headers.length) {
                headers.length = oldRow.length;
              }
            }
            else {
              const entries = Object.entries(oldRow);
              if (!entries.length) return null;
              for (const [oldKey, oldValue] of entries) {
                /** @type {number[]} */
                let indices = !Object.hasOwn(colValToIndices, oldKey)
                  ? colValToIndices[oldKey] = [headers.push(oldKey) - 1]
                  : colValToIndices[oldKey];
                for (const index of indices) {
                  newRow[index] = oldValue;
                }
              }
            }
            newRows.push(newRow);
          }
        
          // Return the array of arrays representing the table.
          return [headers, ...newRows];
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
         * Describes any value so that in part it can be sent to another frame.
         */
        function describe(value, summarize=false) {
          const typeName = getTypeName(value);
          const isPrimitive = typeName === typeName.toLowerCase();
          /** @type {[*,*][]=} */
          let protoEntries;
          /** @type {[string,*][]=} */
          let entries;
          /** @type {[*,*][]=} */
          let jsonProtoEntries;
          /** @type {[string,*][]=} */
          let jsonEntries;
          /** @type {string} */
          let string;
        
          // symbol
          if (typeName === 'symbol') {
            string = value.toString();
          }
          // bigint, boolean or number
          else if (typeName === 'bigint' || typeName === 'boolean' || typeName === 'number' || typeName === 'Date' || typeName === 'RegExp') {
            string = `${typeName}(${value})`;
          }
          // string
          else if (typeName === 'string') {
            string = (summarize ? '' : `string(${value.length}) `)
              + JSON.stringify(value).replace(/"([^]{14})[^]+([^]{14})"/, '"$1\u2026$2"');
          }
          // function
          else if (typeName === 'function') {
            string = `ƒ ${value.name}(\u2026)`;
          }
        
          // Iterable or object
          if (!isPrimitive && !summarize) {
            protoEntries = [];
            entries = [];
            jsonProtoEntries = [];
            jsonEntries = [];
            // map or weakmap
            if (typeName === 'Map' || typeName === 'WeakMap') {
              for (const entry of Object.entries(value)) {
                protoEntries.push(entry);
                jsonProtoEntries.push([
                  describe(entry[0], true).string,
                  describe(entry[1], true).string
                ]);
              }
            }
            // set or weakset
            else if (/^(?:Weak)?(?:Set)$/.test(typeName)) {
              let index = 0;
              for (const v of value) {
                entries.push([index, v]);
                jsonEntries.push([index, describe(v, true).string]);
                index++;
              }
            }
            // Other object
            else {
              string ??= typeName;
            }
            string ??= `${typeName}(${value.size ?? value.length})`;
        
            // Add all proto entries.
            for (const k of Object.getOwnPropertyNames(Object.getPrototypeOf(value))) {
              const v = value[k];
              protoEntries.push([k, v]);
              jsonProtoEntries.push([k, describe(v, true).string]);
            }
        
            // Add any remaining normal entries.
            for (const k of Object.keys(value)) {
              const v = value[k];
              entries.push([k, v]);
              jsonEntries.push([k, describe(v, true).string]);
            }
          }
          // null or undefined
          else if (!string) {
            string = '' + value;
          }
        
          return {
            typeName,
            string,
            value,
            entries,
            protoEntries,
            jsonEntries,
            jsonProtoEntries,
            isPrimitive
          };
        }
        
        /**
         * 
         * @param {*} value 
         * @returns {{typeName: string, string: string, isPrimitive: boolean}}
         */
        function summarize(value) {
          const typeName = getTypeName(value);
          const isPrimitive = typeName === typeName.toLowerCase();
        
          if (typeName === 'symbol') string = value.toString();
          else if (typeName === 'bigint') string = value + 'n';
          else if (typeName === 'null' || typeName === 'undefined' || typeName === 'boolean' || typeName === 'number' || typeName === 'RegExp') {
            string = '' + value;
          }
          else if (typeName === 'Date') {
            string = new Intl.DateTimeFormat(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              weekday: 'short',
              hour: 'numeric',
              minute: '2-digit',
              second: '2-digit',
              fractionalSecondDigits: 3,
            }).format(value);
          }
          else if (typeName === 'string') string = value;
          else if (typeName === 'function') string = `ƒ ${value.name}(\u2026)`;
          else if (typeName === 'WeakMap' || typeName === 'WeakSet') string = typeName;
          else if (typeName === 'Map' || typeName === 'Set') string = `${typeName}(${value.size})`;
          else if (/^Array(?:[^a-z]|$)|[^A-Z]Array$|^String$/.test(typeName)) {
            string = `${typeName}(${value.length})`;
          }
          else if (typeName === 'Number' || typeName === 'Boolean') string = `${typeName}(${value})`;
          else string = `${typeName}(${Object.keys(value).length})`;
        
          return {typeName, string, isPrimitive};
        }
        
        function describeForMessaging(value) {
          const {typeName, string, jsonEntries, jsonProtoEntries, isPrimitive} = describe(value);
          return {typeName, string, jsonEntries, jsonProtoEntries, isPrimitive};
        }
        
        /**
         * @param {string} jsCode 
         */
        function runCode(jsCode) {
          const url = URL.createObjectURL(new Blob([jsCode], {type: 'application/javascript'}));
        
          // Run the code by adding it to a new script tag.
          document.head.appendChild(
            Object.assign(document.createElement('script'), {
              src: url,
              onload() {
                URL.revokeObjectURL(url);
                document.head.removeChild(this);
              },
            })
          );
        }
        
        // Overrides for console functions: log, warn, debug, info
        const logArgsById = {};
        for (const [key, value] of Object.entries(console)) {
          if ('function' === typeof value && /^(debug|error|info|log|warn)$/.test(key)) {
            console[key] = function() {
              // Gets a unique logId.
              let logId = '' + Date.now();
              for (; logArgsById.hasOwnProperty(logId); logId += Math.random());
        
              // Sends the initial log data back to the parent to then relay it back to
              // the viewer.
              messageParent({
                action: 'log',
                logId,
                type: key,
                args: Array.prototype.map.call(arguments, summarize)
              });
        
              // Calls and returns the original console function.
              return value.apply(this, arguments);
            };
          }
        }
        
      },
      functions: {
      },
      onMessage(message) {
        console.log('callableViewerFrame.onMessage', message);
      },
      async onReady() {
        callableViewerFrame = createViewerFrame(script, this);
      },
      body: '',
      style: {width: 0, height: 0, border: 0},
      useBlobSrc: CAN_USE_BLOB_SRC,
    });

    script.parentNode.insertBefore(callableRunnerFrame.iframe, script);
  }

  /**
   * @param {HTMLScriptElement} script 
   * @param {ReturnType<createCallableFrame>} callableRunnerFrame 
   * @returns {ReturnType<createCallableFrame>}
   */
  function createViewerFrame(script, callableRunnerFrame) {
    const callableViewerFrame = createCallableFrame({
      jsCode() {
        let mountedApp;
        
        const Prism = window.Prism;
        delete window.Prism;
        Prism.plugins.autoloader.loadLanguages('javascript');
        
        function init(jsCode, dataset) {
          mountedApp = Vue
            .createApp({
              data() {
                return {
                  displays: [],
                  jsCode: unindentMin(jsCode),
                  dividerOrient: dataset.dividerOrient === 'vertical' ? 'vertical' : 'horizontal',
                  isMovingDivider: false,
                  dividerPct: '50%',
                  dividerSize: '8px',
                  tempDividerPct: null,
                };
              },
              computed: {
                bottomButtons() {
                  return [
                    {
                      iconName: 'horizontalView',
                      title: 'Horizontal View',
                      callback() { this.dividerOrient = 'horizontal'; },
                      showIf() { return this.dividerOrient !== 'horizontal'; }
                    },
                    {
                      iconName: 'verticalView',
                      title: 'Vertical View',
                      callback() { this.dividerOrient = 'vertical'; },
                      showIf() { return this.dividerOrient !== 'vertical'; }
                    },
                    {
                      iconName: 'play',
                      title: 'Run Code',
                      callback() { this.runCode(); },
                      disableIf() { return !this.canRunCode; }
                    },
                  ].filter(btn => !btn.showIf || btn.showIf.call(this));
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
                  const {jsCode} = this;
                  const jsCodeGroups = parseJSCodeGroups(jsCode);
                  const jsCodeGroup0 = jsCodeGroups[0];
        
                  const url = URL.createObjectURL(new Blob([jsCodeGroup0.allLines], {type: 'application/javascript'}));
        
                  // Add the code to the displays.
                  this.displays.push({
                    type: 'prism',
                    header: jsCodeGroup0.headerLines,
                    value: jsCodeGroup0.lines,
                    url,
                  });
        
                  // Clear the editor's code.
                  this.jsCode = jsCodeGroups.slice(1).map(g => g.allLines).join('\n');
        
                  // Run the code by adding it to a new script tag.
                  document.head.appendChild(
                    Object.assign(document.createElement('script'), {
                      src: url,
                      onload() {
                        URL.revokeObjectURL(url);
                        document.head.removeChild(this);
                      },
                    })
                  );
        
                  messageParent({action: 'runCode', args: [jsCodeGroup0.lines]});
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
              mounted() {
                addEventListener('mousemove', this.onWindowMouseMove);
                addEventListener('mouseup', this.onWindowMouseUp);
                addEventListener('error', this.onWindowError);
        
                const vueApp = this;
                for (const [key, value] of Object.entries(console)) {
                  if ('function' === typeof value) {
                    console[key] = function() {
                      vueApp.displays.push({
                        type: 'log',
                        classNames: ['log', key],
                        name: `console.${key}`,
                        values: [...arguments],
                      });
                      return value.apply(this, arguments);
                    };
                  }
                }
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
              'height',
              'keybinding',
              'language',
              'modelValue',
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
              modelValue(newValue) {
                if (newValue !== this.editor.getValue()) {
                  this.editor.setValue(newValue);
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
        
                codeElem.className = `language-javascript`;
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
                };
                return (codes[this.name] ?? codes.missing).replace('<svg', '$& xmlns="http://www.w3.org/2000/svg" style="height: 1em; width: 1em; display: inline-block; transform: translateY(0.1em);"');
              }
            },
            template: '<span v-html="svgCode"></span>'
          }
        }
        
        function getJSValueComponentProps() {
          return {
            props: ['value'],
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
              }
            },
            computed: {
              type() {
                const {value} = this;
                if (value === null) return 'null';
                const typeName = typeof value;
                if (typeName === 'object') {
                  const typeName2 = Object.prototype.toString.call(value).slice(8, -1);
                  return typeName2 !== 'Date'
                    ? (value[Symbol.iterator] && 'number' === typeof value.length)
                      ? 'array-like'
                      : typeName2 === 'Promise'
                        ? 'promise'
                        : typeName
                    : 'date';
                }
                return typeName;
              },
              isMultiline() {
                const {type} = this;
                return type === 'function'
                  || type === 'array-like'
                  || type === 'object'
                  || (type === 'string' && /[\r\n]/.test(this.value));
              },
              string() {
                const {value, type} = this;
                if (type === 'date') {
                  return new Intl.DateTimeFormat(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    weekday: 'short',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    fractionalSecondDigits: 3,
                    timeZoneName: 'long'
                  }).format(value);
                }
                return value?.toString() ?? `${value}`;
              }
            },
            template: `
              <div v-if="isMultiline">
                <div v-if="type === 'function'" class="js-value function">{{ string }}</div>
                <div v-if="type === 'array-like'" class="js-value array-like">
                  <span @click="isExpanded = !isExpanded" :class="'d-inline-block ' + (isExpanded ? 'rotated-90deg' : '')">
                    <icon name="play"></icon>
                  </span>
                  <template v-if="Array.isArray(value)">Array({{ value.length }})</template>
                  <template v-if="!Array.isArray(value)">Iterable({{ value.length }})</template>
                  <table v-if="hasBeenExpanded" v-show="isExpanded">
                    <tr v-for="(item, index) in value">
                      <td class="align-top">{{ index }}</td>
                      <td><js-value :value="item"></js-value></td>
                    </tr>
                  </table>
                </div>
                <div v-if="type === 'object'" class="js-value object">
                  <span @click="isExpanded = !isExpanded" :class="'d-inline-block ' + (isExpanded ? 'rotated-90deg' : '')">
                    <icon name="play"></icon>
                  </span>
                  <template v-if="true">Object({{ Object.keys(value).length }})</template>
                  <table v-if="hasBeenExpanded" v-show="isExpanded">
                    <tr v-for="keyValue in Object.entries(value)">
                      <td class="align-top">{{ keyValue[0] }}</td>
                      <td><js-value :value="keyValue[1]"></js-value></td>
                    </tr>
                  </table>
                </div>
                <div v-if="type === 'string'" class="js-value string">{{ string }}</div>
              </div>
              <template v-else>
                <div v-if="type === 'bigint'" class="js-value bigint">{{ string }}</div>
                <div v-if="type === 'boolean'" class="js-value boolean">{{ string }}</div>
                <div v-if="type === 'date'" class="js-value date">{{ string }}</div>
                <div v-if="type === 'null'" class="js-value null">{{ string }}</div>
                <div v-if="type === 'number'" class="js-value number">{{ string }}</div>
                <div v-if="type === 'promise'" class="js-value promise">{{ string }}</div>
                <div v-if="type === 'string'" class="js-value string">{{ string }}</div>
                <div v-if="type === 'symbol'" class="js-value symbol">{{ string }}</div>
                <div v-if="type === 'undefined'" class="js-value undefined">{{ string }}</div>
              </template>
            `
          }
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
      functions: {
      },
      onMessage(message) {
        const {action, args} = message.data;
        callableRunnerFrame.apply(action, args);
      },
      async onReady() {
        this.call('init', script.textContent, JSON.parse(JSON.stringify(script.dataset)));
      },
      body: VIEWER_IFRAME_HTML,
      style: {
        width: '100%',
        height: '100%',
        border: 0
      },
      useBlobSrc: CAN_USE_BLOB_SRC,
    });

    script.parentNode.insertBefore(callableViewerFrame.iframe, script);

    return callableViewerFrame;
  }

  // NOTE:  This solution was intentionally written without using newer JS
  // features to make the minified version even smaller.
  var createCallableFrame = (function () {
    var IFRAME_SCRIPT_MESSAGE_CODE = parseFunction(function() {
      // NOTE:  Referencing with window to ensure that local namespace will not
      // interfere.
      window.addEventListener('message', function(e) {
        if (e.data.funcName && e.data.args) {
          var func = eval(e.data.funcName);
          if ('function' === typeof func) func.apply(e, e.data.args || []);
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
     * @param {boolean=} options.useBlobSrc
     *   If specified a `Blob` will be used to construct the URL of the IFRAME
     *   instead of using a data URL.
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

      function getUrl(content, type) {
        return (options.useBlobSrc && window.URL && 'function' === typeof URL.createObjectURL && 'function' === typeof Blob)
          ? URL.createObjectURL(new Blob([content], {type: type}))
          : toDataURL(content, {type: type, charset: 'utf8'});
      }

      // isReady indicates if the IFRAME is ready to have messages sent to it
      // while READY_ID is used internally to confirm if the IFRAME is actually
      // ready to receive function calls.
      var isReady, READY_ID = Math.random() + '' + Math.random();

      // Turns the script code for the IFRAME into a data URL.
      var IFRAME_SCRIPT_SRC = getUrl(
        [
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
        ].join('\n'),
        'text/javascript'
      );

      // Creates the IFRAME and sets its source by leveraging data URLs.
      var IFRAME = document.createElement('iframe');
      var HTML_CODE = [
        '<!DOCTYPE html>',
        '<html>',
        '<head>',
        options.head || '',
        (options.cssUrls || []).map(function(cssUrl) {
          return '<link href="' + cssUrl + '" rel="stylesheet">';
        }).join('\n'),
        (options.jsUrls || []).map(function(jsUrl) {
          return '<script src="' + jsUrl + '"><\x2fscript>';
        }).join('\n'),
        '</head>',
        '<body>',
        options.body || '',
        '<script src="' + IFRAME_SCRIPT_SRC + '"><\x2fscript>',
        '</body>',
        '</html>'
      ].join('\n');
      IFRAME.src = getUrl(HTML_CODE, 'text/html');

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
          }
          else { // !isReady
            console.warn('Message sent from callable frame prematurely:', e);
          }
        }
      });

      // Returns an object which makes it possible to call functions and get
      // access to the IFRAME.
      var callableFrame = {
        apply: function(funcName, args) {
          IFRAME.contentWindow.postMessage({funcName: funcName, args: args}, '*');
        },
        call: function(funcName) {
          IFRAME.contentWindow.postMessage({funcName: funcName, args: Array.prototype.slice.call(arguments, 1)}, '*');
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
     * Turns a string that can represent a text document and returns the
     * corresponding data URL (AKA data URI).
     * @param {string} text
     *   The text to turn into a data URL.
     * @param {Object} options
     *   Optional.  An object containing the different options to set.
     * @param {boolean=} options.base64
     *   Optional, defaults to the `false`.  Indicates if the returned data URL
     *   should be base64 encoded.
     * @param {string=} options.charset
     *   Optional.  Indicates the character set of the content.  Examples are
     *   "US-ASCII", "UTF-8", etc.
     * @param {string=} options.type
     *   Optional, defaults to the empty string.  The content type of `text` (eg.
     *   `"text/html"`).
     * @returns {string}
     *   A data URL which represents `text` as the given `type`.
     */
    function toDataURL(text, options) {
      options = Object(options);
      var base64 = options.base64;
      var charset = options.charset;
      return ('data:'
          + (options.type ?? '')
          + ';'
          + (charset ? 'charset=' + charset + ';' : '')
          + (base64 ? 'base64;' : '')
        ).replace(/;$/, '')
        + ','
        + (base64
          // unescape() and encodeURIComponent() used based on this solution:
          // https://stackoverflow.com/a/26603875/657132
          ? window.btoa(unescape(encodeURIComponent(text)))
          : encodeURIComponent(text)
        );
    }

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

    // Make toDataURL() and parseFunction() available.
    createCallableFrame.toDataURL = toDataURL;
    createCallableFrame.parseFunction = parseFunction;

    return createCallableFrame;
  })();

  main(document.currentScript);
})();