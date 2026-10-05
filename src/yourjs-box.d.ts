/**
 * Types for the `YourJSBox` global that loading YourJS Box provides.  See
 * https://github.com/westc/yourjs-box#javascript-api for more details.
 *
 * Use them in TypeScript (or in JavaScript checked by VS Code) with:
 *   /// <reference types="yourjs-box" />
 */

declare namespace YourJSBox {
  /**
   * The options that can also be set with the `data-*` attributes of a script
   * tag (eg. `wordWrap` is the same as `data-word-wrap`).
   */
  interface ConsoleOptions {
    /**
     * `"worker"` (default) runs the code in a Web Worker.  `"window"` runs it
     * directly in the page.
     */
    runner?: 'worker' | 'window';
    /**
     * `"classic"` (default) runs each block like a regular `<script>` so
     * top-level declarations are shared between blocks.  `"module"` runs each
     * block like a `<script type="module">`.
     */
    blockType?: 'classic' | 'module';
    /** `"javascript"` (default) or `"typescript"`. */
    language?: 'javascript' | 'typescript';
    /**
     * Whether the value of the last expression in each block is shown.
     * Defaults to `true`.
     */
    showResults?: boolean | 'true' | 'false';
    /** Any block whose header starts with this prefix is hidden but still runs. */
    hidePrefix?: string;
    /**
     * Whether only the editor is shown until there is something in the
     * output.  Defaults to `true`.
     */
    hideEmptyOutput?: boolean | 'true' | 'false';
    /**
     * `"vertical"` puts the editor beside the output and `"horizontal"` puts
     * it below.  If not given, the editor is beside the output unless the
     * console is narrower than 600px.
     */
    dividerOrient?: 'vertical' | 'horizontal';
    /** If not given, the theme follows the system's color scheme. */
    theme?: 'light' | 'dark';
    /** Whether long lines wrap in the editor.  Defaults to `false`. */
    wordWrap?: boolean | 'true' | 'false';
    /**
     * The columns where lines are shown in the editor (eg. `[80, 120]` or
     * `"80, 120"`).  Defaults to `80` and `""` (or `[]`) shows none.
     */
    rulers?: number | number[] | string;
    /**
     * `"lazy"` (default) waits to load the console until it is about to be
     * scrolled into view.  `"eager"` loads it right away.
     */
    loading?: 'lazy' | 'eager';
    /**
     * Where packages imported by name are loaded from, where `{specifier}` is
     * replaced by the package (eg. `"https://esm.sh/{specifier}"`, which is
     * the default).  `""` turns this off.
     */
    importsUrl?: string;
    /**
     * Where to load Vue, Ace, Prism, Acorn and Babel from, where `{name}` and
     * `{version}` are replaced by each library's name and version (eg.
     * `"/node_modules/{name}/"`).  Defaults to unpkg.
     */
    librariesUrl?: string;
  }

  /** Where a console goes relative to its target. */
  type Placement = 'fill' | 'append' | 'prepend' | 'replace' | 'before' | 'after';

  interface CreateOptions extends ConsoleOptions {
    /** The element (or a CSS selector for it) that the console is placed relative to. */
    target: string | Element;
    /**
     * `"fill"` (default) replaces the target's contents, `"append"` and
     * `"prepend"` add the console inside of the target, `"replace"` replaces
     * the target itself and `"before"` and `"after"` add it next to the target.
     */
    placement?: Placement;
    /**
     * The CSS height of the console (a number is treated as pixels).
     * Defaults to `"100%"`.  It is never less than 150px.
     */
    height?: string | number;
    /** The code that the console starts with. */
    code?: string;
  }

  interface FromOptions extends ConsoleOptions {
    /** Defaults to `"replace"`. */
    placement?: Placement;
    /**
     * The CSS height of each console (a number is treated as pixels).
     * Defaults to a height that fits the code (from 250px to 600px).
     */
    height?: string | number;
  }

  /** A console that was created. */
  interface Box {
    /** The console's IFRAME. */
    readonly element: HTMLIFrameElement;
    /**
     * Removes the console, stops its code and closes its pop-out window (in
     * window mode it also restores the page's `console` functions).  For a
     * console made by `from()` that replaced its element, the element is put
     * back.
     */
    destroy(): void;
  }
}

declare const YourJSBox: {
  /** The version of YourJS Box that was loaded (eg. `"1.10.0"`). */
  readonly version: string;
  /**
   * Creates a console.
   * @throws {TypeError} If the target or the placement isn't valid.
   */
  create(options: YourJSBox.CreateOptions): YourJSBox.Box;
  /**
   * Turns existing elements (eg. the code blocks in a page made from Markdown)
   * into consoles that start with their code.  The `data-*` attributes of each
   * element override `options` and a `language-ts` class turns on TypeScript.
   * @param elements
   *   A CSS selector, an element or a list of elements (eg. a `NodeList`).
   * @returns The consoles in the same order as the elements.
   */
  from(
    elements: string | Element | ArrayLike<Element> | Iterable<Element>,
    options?: YourJSBox.FromOptions
  ): YourJSBox.Box[];
};

interface Window {
  YourJSBox: typeof YourJSBox;
}
