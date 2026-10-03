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
      // Undoes the shift in columns caused by wrapping the last expression.
      .replace(/(snippet-\d+\.js):(\d+):(\d+)/g, (match, name, line, column) => {
        const info = columnShiftsBySnippet[name];
        return info && +line === info.line && +column > info.column
          ? `${name}:${line}:${Math.max(info.column, column - info.shift)}`
          : match;
      });
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
      if (depth > 1 && value.length > 100) value = value.slice(0, 99) + '…';
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
      return [['text', isClass ? source : source.replace(/^(async\s+)?function\b\s*/, '$1ƒ ')]];
    }
    if (depth > 1) return [['function', 'ƒ']];
    return [['function', isClass ? `class ${value.name}` : `ƒ ${value.name}()`]];
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
      return [['text', className === 'Object' ? '{…}' : className]];
    }

    const parts = [];
    const addItems = (items, total, addItem) => {
      items.forEach((item, index) => {
        if (index) parts.push(['text', ', ']);
        addItem(item);
      });
      if (total > items.length) parts.push(['text', (items.length ? ', ' : '') + '…']);
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
            ...('value' in descriptor ? getPreviewParts(descriptor.value, 2) : [['text', '(…)']])
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

    if (value !== null && ('object' === typeof value || 'function' === typeof value)) {
      let wasIterated = false;
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

    return {entries, protoEntries, $entries, $protoEntries};
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
   */
  async function runCode(jsCode, runOptions) {
    const {blockType, resultRange} = Object(runOptions);

    // Names the code so that stack traces refer to it by this name.
    const snippetName = `snippet-${++snippetCount}.js`;

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
      if (blockType === 'module') {
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
    // Get the description of the desired value.
    let level = logArgsById;
    let pathPartIndex = 0;
    for (let pathPart of path) {
      if (pathPartIndex && pathPartIndex % 2 === 0) {
        pathPart = '$' + pathPart;
      }
      level = level?.[pathPart];
      pathPartIndex++;
    }
    if (!level) return;
    const description = describe(level.value, 'receiver' in level ? level.receiver : level.value);

    // Change the summary to an actual description at the level found.
    Object.assign(level, description);

    // Send the description without values back to the viewer.
    send({
      target: 'viewer',
      func: 'updateDescriptionFor',
      args: [path, without(['$entries', '$protoEntries'], description)],
    });
  }

  /**
   * Forgets all of the logged values (eg. when the console is cleared).
   */
  function clearLogs() {
    for (const logId of Object.keys(logArgsById)) delete logArgsById[logId];
    groupIds = [];
  }

  return {clearLogs, destroy, runCode, sendDescriptionFor};
}
