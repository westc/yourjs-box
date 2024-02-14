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
        [[JS_RUNNER_IFRAME_FILE_PLACEHOLDER]]
      },
      functions: {
      },
      onMessage(message) {
        const {target, func, args} = message.data;
        if (target === 'viewer') callableViewerFrame.apply(func, args);
        else console.error('Unhandled message sent to main handler:', message);
      },
      async onReady() {
        callableViewerFrame = createViewerFrame(script, this);
        this.call('init');
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
      functions: {
      },
      onMessage(message) {
        const {target, func, args} = message.data;
        if (target === 'runner') callableRunnerFrame.apply(func, args);
        else console.error('Unhandled message sent to main handler:', message);
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