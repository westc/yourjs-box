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

  const hidePrefix = dataset.hidePrefix ?? '';
  const darkSchemeQuery = matchMedia('(prefers-color-scheme: dark)');
  const originalCode = unindentMin(jsCode);
  const {visibleCode, hiddenGroups} = extractHiddenGroups(originalCode, hidePrefix);
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
          blockType: meta.blockType,
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
        exportJsCode() {
          if (this.exportCode === 'original') return originalCode;
          if (this.exportCode === 'blank') return '';

          // The groups that already ran, then the groups in the editor with
          // any hidden groups that haven't run yet in their original places.
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
         * copied console loads JS Box from a CDN.
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
              iconName: 'clear',
              title: 'Clear console',
              callback() { this.clearConsole(); },
            },
            {
              iconName: isFullscreen ? 'exitFullscreen' : 'fullscreen',
              title: isFullscreen ? 'Exit full screen' : 'Full screen',
              callback() { this.toggleFullscreen(); },
            },
            {
              iconName: 'more',
              title: 'More',
              className: 'more-button',
              callback() { this.toggleMenu(); },
            },
            {
              iconName: this.runningCount ? 'spinner' : 'play',
              label: 'Run',
              className: 'primary',
              title: `Run the next block of code (${isMac ? '\u2318' : 'Ctrl+'}Enter)`,
              callback() { this.runCode(); },
              disableIf() { return !this.canRunCode; }
            },
          ];
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
          this.runHistory.push(group.allLines);
          messageParent({
            target: 'runner',
            func: 'runCode',
            args: [group.lines, {
              blockType: this.blockType,
              // Like the browser's console, show the value of the last
              // expression (except for hidden code).
              resultRange: this.showResults && !isHidden
                ? findLastExpression(group.lines, this.blockType)
                : null,
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

          this.displays = [];
          this.jsCode = visibleCode;
          this.hiddenGroups = copyHiddenGroups();
          this.runCount = 0;
          this.runningCount = 0;
          this.runHistory = [];
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
          Object.assign(document.createElement('a'), {href: url, download: 'js-box.html'}).click();
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
        onMenuKeyDown(evt) {
          if (evt.key === 'Escape') {
            evt.stopPropagation();
            this.closeMenu(true);
          }
          else if (evt.key === 'ArrowDown' || evt.key === 'ArrowUp') {
            evt.preventDefault();
            const items = [...this.$refs.moreMenu.querySelectorAll('.menu-item:not(:disabled)')];
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
        },
        /**
         * @param {KeyboardEvent} evt
         */
        onWindowKeyDown(evt) {
          if (evt.key === 'Escape' && this.isMaximized && !this.isMenuOpen && !this.dialog && !this.isAboutOpen) {
            this.setMaximized(false);
          }
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
        addEventListener('keydown', this.onWindowKeyDown);
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
          fullscreen: '<svg viewBox="0 0 16 16"><path d="M2.5 6V2.5H6M10 2.5h3.5V6M13.5 10v3.5H10M6 13.5H2.5V10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          exitFullscreen: '<svg viewBox="0 0 16 16"><path d="M6 2.5V6H2.5M13.5 6H10V2.5M10 13.5V10h3.5M2.5 10H6v3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          more: '<svg viewBox="0 0 16 16"><circle cx="3.5" cy="8" r="1.4" fill="currentColor"/><circle cx="8" cy="8" r="1.4" fill="currentColor"/><circle cx="12.5" cy="8" r="1.4" fill="currentColor"/></svg>',
          check: '<svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
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
 * Finds the last statement in the code if it is an expression so that its
 * value can be shown.
 * @param {string} code
 * @param {"classic"|"module"} blockType
 * @returns {[number, number]|null}
 *   The start and end index of the expression or `null` if the last statement
 *   isn't an expression (or the code can't be parsed, in which case running
 *   it will show the syntax error).
 */
function findLastExpression(code, blockType) {
  if (!window.acorn) return null;
  try {
    const {body} = acorn.parse(code, {
      ecmaVersion: 'latest',
      sourceType: blockType === 'module' ? 'module' : 'script',
      allowHashBang: true,
    });
    const last = body[body.length - 1];
    if (last?.type === 'ExpressionStatement' && !last.directive) {
      return [last.expression.start, last.expression.end];
    }
  }
  catch (e) {}
  return null;
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
        '    <title>JS Box</title>',
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
