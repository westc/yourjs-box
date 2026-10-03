(() => {
  /**
   * Viewer IFRAME's CSS code
   * @type {string}
   */
  const VIEWER_IFRAME_CSS = [[CSS_VIEWER_IFRAME_FILE_PLACEHOLDER]];
  /**
   * Information about this package (eg. its version).
   * @type {{name: string, version: string, homepage: string, repoUrl: string, bugsUrl: string}}
   */
  const PACKAGE_INFO = [[PACKAGE_INFO_FILE_PLACEHOLDER]];
  /**
   * Viewer IFRAME's HTML code
   * @type {string}
   */
  const VIEWER_IFRAME_HTML = [[HTML_VIEWER_IFRAME_FILE_PLACEHOLDER]];
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

  [[JS_RUNNER_FILE_PLACEHOLDER]]

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
    const runner = runnerMode === 'window'
      ? createWindowRunner(sendToViewer)
      : createWorkerRunner(sendToViewer);

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
        jsCode() {
          [[JS_VIEWER_IFRAME_FILE_PLACEHOLDER]]
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
        ],
        cssUrls: [
          'data:text/css,' + encodeURIComponent(VIEWER_IFRAME_CSS),
          libraryUrl('prism-themes', 'themes/prism-vsc-dark-plus.min.css'),
          libraryUrl('prismjs', 'plugins/match-braces/prism-match-braces.min.css'),
        ],
        head: targetWindow ? '<meta charset="utf-8"><title>JS Box</title>' : '',
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
        runner.destroy();
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
  const CONSOLE_OPTION_NAMES = ['blockType', 'dividerOrient', 'hidePrefix', 'importsUrl', 'librariesUrl', 'runner', 'showResults', 'theme'];

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
     * @param {(boolean|string)=} options.showResults
     * @param {string=} options.hidePrefix
     * @param {string=} options.dividerOrient
     * @param {string=} options.theme
     * @param {string=} options.librariesUrl
     * @param {string=} options.importsUrl
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
        IFRAME.srcdoc = HTML_CODE;
        // Allows the console to go full screen.
        IFRAME.setAttribute('allow', 'fullscreen');
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