let mountedApp;

const Prism = window.Prism;
delete window.Prism;
Prism.plugins.autoloader.loadLanguages('javascript');

/**
 * The minimum amount of time (in milliseconds) that the loading screen is shown.
 */
const MIN_LOADING_TIME = 1000;

function init(jsCode, dataset) {
  const hidePrefix = dataset.hidePrefix ?? '';
  const darkSchemeQuery = matchMedia('(prefers-color-scheme: dark)');
  const {visibleCode, hiddenGroups} = extractHiddenGroups(unindentMin(jsCode), hidePrefix);
  const copyHiddenGroups = () => hiddenGroups.map(group => ({...group}));

  mountedApp = Vue
    .createApp({
      data() {
        return {
          displays: [],
          hidePrefix,
          hiddenGroups: copyHiddenGroups(),
          runnerMode: dataset.runner,
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
          dividerOrient: dataset.dividerOrient === 'vertical' ? 'vertical' : 'horizontal',
          isMovingDivider: false,
          dividerPct: '50%',
          dividerSize: '8px',
          tempDividerPct: null,
        };
      },
      computed: {
        theme() {
          return this.forcedTheme ?? (this.prefersDark ? 'dark' : 'light');
        },
        bottomButtons() {
          const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
          return [
            {
              iconName: 'clear',
              title: 'Clear console',
              callback() { this.clearConsole(); },
            },
            {
              iconName: 'refresh',
              title: this.runnerMode === 'worker'
                ? 'Reset (also stops any code that is still running)'
                : 'Reset',
              callback() { this.resetConsole(); },
            },
            { isSeparator: true },
            {
              iconName: 'horizontalView',
              title: 'Show the editor below the console',
              callback() { this.dividerOrient = 'horizontal'; },
              showIf() { return this.dividerOrient !== 'horizontal'; }
            },
            {
              iconName: 'verticalView',
              title: 'Show the editor beside the console',
              callback() { this.dividerOrient = 'vertical'; },
              showIf() { return this.dividerOrient !== 'vertical'; }
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
          this.jsCode = otherJsCodeGroups.map(g => g.allLines).join('\n');

          this.runCount++;
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
          messageParent({target: 'runner', func: 'runCode', args: [group.lines]});
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

          this.displays = [];
          this.jsCode = visibleCode;
          this.hiddenGroups = copyHiddenGroups();
          this.runCount = 0;
          this.runningCount = 0;
          messageParent({target: 'runner', func: 'reset', args: []});
          this.runHiddenGroups();
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
        closeDialog(isConfirmed) {
          const {dialog} = this;
          this.dialog = null;
          dialog?.resolve(isConfirmed);
        },
        onDisplaysScroll() {
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
        addEventListener('mouseup', this.onWindowMouseUp);
        addEventListener('error', this.onWindowError);
        darkSchemeQuery.addEventListener('change', e => this.prefersDark = e.matches);

        // Hidden code that came before all visible code gets run immediately.
        this.runHiddenGroups();

        // Shows the loading screen for at least a moment and then fades it out.
        setTimeout(
          () => document.querySelector('#splash').classList.add('hidden'),
          Math.max(0, MIN_LOADING_TIME - performance.now())
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
      themeSig(newValue) {
        this.editor.setTheme(newValue);
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
          // Icons similar to those in the browser's console.
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
    props: ['description', 'path', 'name', 'isDimName'],
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
        // protoEntries only ever contains the [[Prototype]] entry.
        return [
          { key: 'entries', isDim: entry => entry[2] === false },
          { key: 'protoEntries', isDim: () => true },
        ];
      }
    },
    methods: {
      toggleExpanded() {
        if (!this.isExpandable) return;
        this.isExpanded = !this.isExpanded;
        if (this.isExpanded && this.isPartialDescription) {
          messageParent({target: 'runner', func: 'sendDescriptionFor', args: [this.path]});
        }
      }
    },
    template: `
      <div :class="classNames">
        <div :class="['js-value-header', isExpandable ? 'expandable' : '']" @click="toggleExpanded"><span
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
function appendLog({logId, key, descriptions, table}) {
  key = `${key}`;
  mountedApp.displays.push({
    type: 'log',
    key,
    name: `console.${key}`,
    descriptions: Array.from(descriptions, sanitizeDescription),
    table: table ? {
      headers: Array.from(table.headers, h => `${h}`),
      rows: Array.from(table.rows, row => ({
        index: `${row.index}`,
        cells: Array.from(row.cells, cell => cell && sanitizeDescription(cell)),
      })),
    } : null,
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

  if (level) Object.assign(level, sanitizeEntries(description));
}

/**
 * NOTE:  Called via main by the runner once it has run a group of code.
 */
function onCodeRan() {
  mountedApp.runningCount = Math.max(0, mountedApp.runningCount - 1);
  mountedApp.runHiddenGroups();
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
