const logArgsById = {};
const OLD_CONSOLE = Object.assign({}, console);

function init() {
  // Overrides for console functions: log, warn, debug, info
  for (const [key, value] of Object.entries(console)) {
    if ('function' === typeof value && /^(debug|error|info|log|warn)$/.test(key)) {
      console[key] = function() {
        // Gets a unique logId.
        let logId = '' + Date.now();
        for (; logArgsById.hasOwnProperty(logId); logId += '.' + Math.random());

        // Keep track of the args.
        logArgsById[logId] = Array.prototype.map.call(
          arguments,
          value => ({...summarize(value), value})
        );
  
        // Sends the initial log data back to the parent to then relay it back to
        // the viewer.
        messageParent({
          target: 'viewer',
          func: 'appendLog',
          args: [{
            type: 'log',
            logId,
            key,
            descriptions: logArgsById[logId].map(without(['value']))
          }]
        });
  
        // Calls and returns the original console function.
        return value.apply(this, arguments);
      };
    }
  }

  addEventListener('error', evt => {
    messageParent({
      target: 'viewer',
      func: 'appendError',
      args: [{
        type: 'error',
        message: evt.error?.stack ?? evt.message ?? evt.error?.message ?? `${evt.error}`,
        line: evt.lineno,
        column: evt.colno,
      }]
    });
  });
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
    string = 'Date('
      + new Intl.DateTimeFormat(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          weekday: 'short',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          fractionalSecondDigits: 3,
        }).format(value)
      + ')';
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

function describe(value) {
  const {typeName, string, isPrimitive} = summarize(value);
  const entries = [];
  const $entries = [];
  const protoEntries = [];
  const $protoEntries = [];

  if (!isPrimitive) {
    // Map
    if (typeName === 'Map') {
      for (const [k, v] of [...value]) {
        entries.push([summarize(k).string, summarize(v)]);
        $entries.push({value: v});
      }
    }
    // other iterable (eg. Int8Array, Set)
    else if (typeName !== 'Array' && 'function' === typeof value[Symbol.iterator]) {
      let index = 0;
      for (const v of value) {
        entries.push(['' + index, summarize(v)]);
        $entries.push({value: v});
        ++index;
      }
    }
    // Array, Object, etc.
    else {
      for (const k of Object.keys(value)) {
        try {
          const v = value[k];
          entries.push([k, summarize(v)]);
          $entries.push({value: v});
      } catch(e) {}
      }
    }

    // Add all proto entries but do in a try-catch just `value` is `__proto__`
    // of an object.
    try {
      for (const k of Object.getOwnPropertyNames(Object.getPrototypeOf(value))) {
        const v = value[k];
        protoEntries.push([k, summarize(v)]);
        $protoEntries.push({value: v});
      }
    } catch(e){}
  }

  return {
    entries,
    isPrimitive,
    protoEntries,
    string,
    typeName,
    $entries,
    $protoEntries
  };
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

function sendDescriptionFor(path) {
  // OLD_CONSOLE.log('sendDescriptionFor', {logArgsById, path});
  // Get the description of the desired value.
  let level = logArgsById;
  let pathPartIndex = 0;
  for (let pathPart of path) {
    if (pathPartIndex && pathPartIndex % 2 === 0) {
      pathPart = '$' + pathPart;
    }
    level = level[pathPart];
    pathPartIndex++;
  }
  const description = describe(level.value);

  // Change the summary to an actual description at the level found.
  Object.assign(level, description);

  // Send the description without values back to the viewer.
  messageParent({
    target: 'viewer',
    func: 'updateDescriptionFor',
    args: [path, without(['$entries', '$protoEntries'], description)],
  });
}

function without(props, obj) {
  if (!obj) return obj => without(props, obj);
  const ret = {...obj};
  for (const prop of props) delete ret[prop];
  return ret;
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
