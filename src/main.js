(() => {
  /**
   * Viewer IFRAME's CSS code
   * @type {string}
   */
  const VIEWER_IFRAME_CSS = [[CSS_VIEWER_IFRAME_FILE_PLACEHOLDER]];
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
    dataset.runner = runnerMode;

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
        [[JS_VIEWER_IFRAME_FILE_PLACEHOLDER]]
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
        this.call('init', script.textContent, dataset);
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