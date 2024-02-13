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
        function init(e,t){}function parseTableArray(e){if(!Array.isArray(e)||e.length<1)return null;const t={};let n=[];if(Array.isArray(e[0])){const r=e.shift();n=r;for(let e=0,n=r.length;e<n;e++){const n=r[e];Object.hasOwn(t,n)?t[n].push(e):t[n]=[e]}}const r=[];for(const s of e){if(null===s||"object"!=typeof s)return null;const e=[];if(Array.isArray(s))e.push(...s),s.length>n.length&&(n.length=s.length);else{const r=Object.entries(s);if(!r.length)return null;for(const[s,o]of r){let r=Object.hasOwn(t,s)?t[s]:t[s]=[n.push(s)-1];for(const t of r)e[t]=o}}r.push(e)}return[n,...r]}function getTypeName(e){if(null==e)return""+e;const t=typeof e;return"object"===t||"undefined"===t?Object.prototype.toString.call(e).slice(8,-1):t}function describe(e,t=!1){const n=getTypeName(e),r=n===n.toLowerCase();let s,o,i,c,a;if("symbol"===n?a=e.toString():"bigint"===n||"boolean"===n||"number"===n||"Date"===n||"RegExp"===n?a=`${n}(${e})`:"string"===n?a=(t?"":`string(${e.length}) `)+JSON.stringify(e).replace(/"([^]{14})[^]+([^]{14})"/,'"$1…$2"'):"function"===n&&(a=`ƒ ${e.name}(…)`),r||t)a||(a=""+e);else{if(s=[],o=[],i=[],c=[],"Map"===n||"WeakMap"===n)for(const t of Object.entries(e))s.push(t),i.push([describe(t[0],!0).string,describe(t[1],!0).string]);else if(/^(?:Weak)?(?:Set)$/.test(n)){let t=0;for(const n of e)o.push([t,n]),c.push([t,describe(n,!0).string]),t++}else a??=n;a??=`${n}(${e.size??e.length})`;for(const t of Object.getOwnPropertyNames(Object.getPrototypeOf(e))){const n=e[t];s.push([t,n]),i.push([t,describe(n,!0).string])}for(const t of Object.keys(e)){const n=e[t];o.push([t,n]),c.push([t,describe(n,!0).string])}}return{typeName:n,string:a,value:e,entries:o,protoEntries:s,jsonEntries:c,jsonProtoEntries:i,isPrimitive:r}}function summarize(e){const t=getTypeName(e),n=t===t.toLowerCase();return"symbol"===t?string=e.toString():"bigint"===t?string=e+"n":"null"===t||"undefined"===t||"boolean"===t||"number"===t||"RegExp"===t?string=""+e:"Date"===t?string=new Intl.DateTimeFormat(void 0,{year:"numeric",month:"short",day:"numeric",weekday:"short",hour:"numeric",minute:"2-digit",second:"2-digit",fractionalSecondDigits:3}).format(e):"string"===t?string=e:"function"===t?string=`ƒ ${e.name}(…)`:"WeakMap"===t||"WeakSet"===t?string=t:"Map"===t||"Set"===t?string=`${t}(${e.size})`:/^Array(?:[^a-z]|$)|[^A-Z]Array$|^String$/.test(t)?string=`${t}(${e.length})`:string="Number"===t||"Boolean"===t?`${t}(${e})`:`${t}(${Object.keys(e).length})`,{typeName:t,string:string,isPrimitive:n}}function describeForMessaging(e){const{typeName:t,string:n,jsonEntries:r,jsonProtoEntries:s,isPrimitive:o}=describe(e);return{typeName:t,string:n,jsonEntries:r,jsonProtoEntries:s,isPrimitive:o}}function runCode(e){const t=URL.createObjectURL(new Blob([e],{type:"application/javascript"}));document.head.appendChild(Object.assign(document.createElement("script"),{src:t,onload(){URL.revokeObjectURL(t),document.head.removeChild(this)}}))}const logArgsById={};for(const[e,t]of Object.entries(console))"function"==typeof t&&/^(debug|error|info|log|warn)$/.test(e)&&(console[e]=function(){let n=""+Date.now();for(;logArgsById.hasOwnProperty(n);n+=Math.random());return messageParent({action:"log",logId:n,type:e,args:Array.prototype.map.call(arguments,summarize)}),t.apply(this,arguments)});
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
        let mountedApp;const Prism=window.Prism;function init(e,t){mountedApp=Vue.createApp({data:()=>({displays:[],jsCode:unindentMin(e),dividerOrient:"vertical"===t.dividerOrient?"vertical":"horizontal",isMovingDivider:!1,dividerPct:"50%",dividerSize:"8px",tempDividerPct:null}),computed:{bottomButtons(){return[{iconName:"horizontalView",title:"Horizontal View",callback(){this.dividerOrient="horizontal"},showIf(){return"horizontal"!==this.dividerOrient}},{iconName:"verticalView",title:"Vertical View",callback(){this.dividerOrient="vertical"},showIf(){return"vertical"!==this.dividerOrient}},{iconName:"play",title:"Run Code",callback(){this.runCode()},disableIf(){return!this.canRunCode}}].filter((e=>!e.showIf||e.showIf.call(this)))},canRunCode(){return this.jsCode.trim()},mainElemClassNames(){return["vertical"===this.dividerOrient?"col-orient":"row-orient",this.isMovingDivider?"is-moving-divider":""].join(" ")},mainElemStyles(){return{"--divider-size":this.dividerSize,"--editor-pct":this.dividerPct,"--temp-editor-pct":this.tempDividerPct}}},methods:{onEditorKeyCombo(e){(e.ctrlKey||e.metaKey)&&"Enter"===e.key&&this.canRunCode&&this.runCode()},runCode(){const{jsCode:e}=this,t=parseJSCodeGroups(e),i=t[0],n=URL.createObjectURL(new Blob([i.allLines],{type:"application/javascript"}));this.displays.push({type:"prism",header:i.headerLines,value:i.lines,url:n}),this.jsCode=t.slice(1).map((e=>e.allLines)).join("\n"),document.head.appendChild(Object.assign(document.createElement("script"),{src:n,onload(){URL.revokeObjectURL(n),document.head.removeChild(this)}})),messageParent({action:"runCode",args:[i.lines]})},getEditorPct(e){const t=this.$refs.main.getBoundingClientRect(),{dividerOrient:i}=this,n=e.pageX-t.left,s=e.pageY-t.top,r=t.width,a=t.height;return 100-100*Math.min(Math.max(.2,"vertical"===i?n/r:s/a),.8)+"%"},onMainElemMouseDown(e){e.target===this.$refs.mainDivider&&(this.isMovingDivider=!0,this.tempDividerPct=this.getEditorPct(e))},onWindowMouseMove(e){this.isMovingDivider&&(this.tempDividerPct=this.getEditorPct(e))},onWindowMouseUp(e){this.isMovingDivider&&(this.isMovingDivider=!1,this.dividerPct=this.getEditorPct(e))},onWindowError(e){this.displays.push({type:"error",message:e.error?.stack??e.message??e.error?.message??`${e.error}`,line:e.lineno,column:e.colno})}},mounted(){addEventListener("mousemove",this.onWindowMouseMove),addEventListener("mouseup",this.onWindowMouseUp),addEventListener("error",this.onWindowError);const e=this;for(const[t,i]of Object.entries(console))"function"==typeof i&&(console[t]=function(){return e.displays.push({type:"log",classNames:["log",t],name:`console.${t}`,values:[...arguments]}),i.apply(this,arguments)})}}).component("ace-editor",getAceComponentProps()).component("prism",getPrismComponentProps()).component("icon",getIconComponentProps()).component("js-value",getJSValueComponentProps()).mount(document.querySelector("#vueApp"))}function getAceComponentProps(){return{data:()=>({annotations:[]}),props:["height","keybinding","language","modelValue","theme","width"],computed:{infoNotes(){return this.annotations.filter((({type:e})=>"info"===e))},warningNotes(){return this.annotations.filter((({type:e})=>"warning"===e))},errorNotes(){return this.annotations.filter((({type:e})=>"error"===e))},style(){return{height:null!=this.height?"number"==typeof this.height?this.height+"px":this.height:"150px",width:null!=this.width?"number"==typeof this.width?this.width+"px":this.width:"100%"}},modeSig(){return`ace/mode/${this.language??"text"}`},themeSig(){return`ace/theme/${`${this.theme??"light"}`.replace(/^light$|(^dark$)/i,((e,t)=>"cloud_editor"+(t?"_dark":"")))}`}},watch:{modelValue(e){e!==this.editor.getValue()&&this.editor.setValue(e)}},async mounted(){const e=ace.edit(this.$refs.editor,{value:this.modelValue,mode:this.modeSig,theme:this.themeSig});this.editor=e,e.setKeyboardHandler("ace/keyboard/vscode"),e.commands.removeCommand("addLineAfter"),e.commands.removeCommand("addLineBefore"),e.on("change",(()=>this.$emit("update:modelValue",e.getValue()))),e.session.on("changeAnnotation",(()=>{const t=JSON.stringify(this.errorNotes),i=JSON.stringify(this.infoNotes),n=JSON.stringify(this.warningNotes);this.annotations=e.getSession().getAnnotations();const{errorNotes:s,infoNotes:r,warningNotes:a}=this;t!==JSON.stringify(s)&&this.$emit("changeErrorNotes",s),i!==JSON.stringify(r)&&this.$emit("changeInfoNotes",r),n!==JSON.stringify(a)&&this.$emit("changeWarningNotes",a)})),e.textInput.getElement().addEventListener("keydown",(e=>{if(16===e.keyCode||17===e.keyCode||18===e.keyCode||91===e.keyCode||92===e.keyCode||93===e.keyCode)return;(e.metaKey||e.ctrlKey||e.altKey||e.shiftKey&&(e.key??"").length>1)&&this.$emit("keyCombo",e)}))},template:'<div ref="editor" :style="style"></div>'}}function getPrismComponentProps(){return{data:()=>({annotations:[]}),props:["code","isDark","language","lineNumbers","matchBraces"],computed:{html(){},preStyle(){return{filter:!1!==(this.isDark??!1)?"none":"invert(1) hue-rotate(180deg) brightness(1.1)",margin:0,paddingTop:"0.5em",paddingBottom:"0.5em"}}},watch:{code(){this.redraw()},language(){this.redraw()},lineNumbers(){this.redraw()},matchBraces(){this.redraw()}},methods:{async redraw(){const e=this.$refs.pre,t=this.$refs.code;t.textContent=this.code,t.className="language-javascript",e.className="";for(const t of["lineNumbers","matchBraces"])if(null!=this[t]){const i=t.replace(/[A-Z]+/g,"-$&").toLowerCase();e.className+=" "+i}Prism.highlightElement(t)}},async mounted(){await this.redraw()},template:'<pre ref="pre" :style="preStyle"><code ref="code"></code></pre>'}}function getIconComponentProps(){return{props:["name"],computed:{svgCode(){const e={missing:'<svg viewBox="0 0 32 32"><circle cx="16" cy="22.5" r="1.5" fill="currentColor"/><path fill="currentColor" d="M17 19h-2v-4h2c1.103 0 2-.897 2-2s-.897-2-2-2h-2c-1.103 0-2 .897-2 2v.5h-2V13c0-2.206 1.794-4 4-4h2c2.206 0 4 1.794 4 4s-1.794 4-4 4z"/><path fill="currentColor" d="M29.391 14.527L17.473 2.609A2.078 2.078 0 0 0 16 2c-.533 0-1.067.203-1.473.609L2.609 14.527C2.203 14.933 2 15.466 2 16s.203 1.067.609 1.473L14.526 29.39c.407.407.941.61 1.474.61s1.067-.203 1.473-.609L29.39 17.474c.407-.407.61-.94.61-1.474s-.203-1.067-.609-1.473M16 28.036L3.965 16L16 3.964L28.036 16z"/></svg>',trash:'<svg viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M5.5 1a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zM3 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1H11v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4h-.5a.5.5 0 0 1-.5-.5M5 4h5v8H5z" clip-rule="evenodd"/></svg>',play:'<svg viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M3.242 2.322a.5.5 0 0 1 .491-.014l9 4.75a.5.5 0 0 1 0 .884l-9 4.75A.5.5 0 0 1 3 12.25v-9.5a.5.5 0 0 1 .242-.428M4 3.579v7.842L11.429 7.5z" clip-rule="evenodd"/></svg>',refresh:'<svg viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M1.903 7.297c0 3.044 2.207 5.118 4.686 5.547a.521.521 0 1 1-.178 1.027C3.5 13.367.861 10.913.861 7.297c0-1.537.699-2.745 1.515-3.663c.585-.658 1.254-1.193 1.792-1.602H2.532a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V2.686l-.001.002c-.572.43-1.27.957-1.875 1.638c-.715.804-1.253 1.776-1.253 2.97m11.108.406c0-3.012-2.16-5.073-4.607-5.533a.521.521 0 1 1 .192-1.024c2.874.54 5.457 2.98 5.457 6.557c0 1.537-.699 2.744-1.515 3.663c-.585.658-1.254 1.193-1.792 1.602h1.636a.5.5 0 1 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 1 1 1 0v1.845h.002c.571-.432 1.27-.958 1.874-1.64c.715-.803 1.253-1.775 1.253-2.97" clip-rule="evenodd"/></svg>',horizontalView:'<svg viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M1.5 2h12a.5.5 0 0 1 .5.5V7H1V2.5a.5.5 0 0 1 .5-.5M1 8v4.5a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5V8zM0 2.5A1.5 1.5 0 0 1 1.5 1h12A1.5 1.5 0 0 1 15 2.5v10a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 0 12.5z" clip-rule="evenodd"/></svg>',verticalView:'<svg viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M8 2h5.5a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5H8zM7 2H1.5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5H7zm-7 .5A1.5 1.5 0 0 1 1.5 1h12A1.5 1.5 0 0 1 15 2.5v10a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 0 12.5z" clip-rule="evenodd"/></svg>',play:'<svg viewBox="0 0 16 16"><path fill="currentColor" d="M2 1v14l12-7z"/></svg>',error:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M11 15h2v2h-2zm0-8h2v6h-2zm1-5C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8a8 8 0 0 1 8-8a8 8 0 0 1 8 8a8 8 0 0 1-8 8"/></svg>'};return(e[this.name]??e.missing).replace("<svg",'$& xmlns="http://www.w3.org/2000/svg" style="height: 1em; width: 1em; display: inline-block; transform: translateY(0.1em);"')}},template:'<span v-html="svgCode"></span>'}}function getJSValueComponentProps(){return{props:["value"],data:()=>({isExpanded:!1,hasBeenExpanded:!1}),watch:{isExpanded(e){e&&!this.hasBeenExpanded&&(this.hasBeenExpanded=e)}},computed:{type(){const{value:e}=this;if(null===e)return"null";const t=typeof e;if("object"===t){const i=Object.prototype.toString.call(e).slice(8,-1);return"Date"!==i?e[Symbol.iterator]&&"number"==typeof e.length?"array-like":"Promise"===i?"promise":t:"date"}return t},isMultiline(){const{type:e}=this;return"function"===e||"array-like"===e||"object"===e||"string"===e&&/[\r\n]/.test(this.value)},string(){const{value:e,type:t}=this;return"date"===t?new Intl.DateTimeFormat(void 0,{year:"numeric",month:"short",day:"numeric",weekday:"short",hour:"numeric",minute:"numeric",second:"numeric",fractionalSecondDigits:3,timeZoneName:"long"}).format(e):e?.toString()??`${e}`}},template:'\n      <div v-if="isMultiline">\n        <div v-if="type === \'function\'" class="js-value function">{{ string }}</div>\n        <div v-if="type === \'array-like\'" class="js-value array-like">\n          <span @click="isExpanded = !isExpanded" :class="\'d-inline-block \' + (isExpanded ? \'rotated-90deg\' : \'\')">\n            <icon name="play"></icon>\n          </span>\n          <template v-if="Array.isArray(value)">Array({{ value.length }})</template>\n          <template v-if="!Array.isArray(value)">Iterable({{ value.length }})</template>\n          <table v-if="hasBeenExpanded" v-show="isExpanded">\n            <tr v-for="(item, index) in value">\n              <td class="align-top">{{ index }}</td>\n              <td><js-value :value="item"></js-value></td>\n            </tr>\n          </table>\n        </div>\n        <div v-if="type === \'object\'" class="js-value object">\n          <span @click="isExpanded = !isExpanded" :class="\'d-inline-block \' + (isExpanded ? \'rotated-90deg\' : \'\')">\n            <icon name="play"></icon>\n          </span>\n          <template v-if="true">Object({{ Object.keys(value).length }})</template>\n          <table v-if="hasBeenExpanded" v-show="isExpanded">\n            <tr v-for="keyValue in Object.entries(value)">\n              <td class="align-top">{{ keyValue[0] }}</td>\n              <td><js-value :value="keyValue[1]"></js-value></td>\n            </tr>\n          </table>\n        </div>\n        <div v-if="type === \'string\'" class="js-value string">{{ string }}</div>\n      </div>\n      <template v-else>\n        <div v-if="type === \'bigint\'" class="js-value bigint">{{ string }}</div>\n        <div v-if="type === \'boolean\'" class="js-value boolean">{{ string }}</div>\n        <div v-if="type === \'date\'" class="js-value date">{{ string }}</div>\n        <div v-if="type === \'null\'" class="js-value null">{{ string }}</div>\n        <div v-if="type === \'number\'" class="js-value number">{{ string }}</div>\n        <div v-if="type === \'promise\'" class="js-value promise">{{ string }}</div>\n        <div v-if="type === \'string\'" class="js-value string">{{ string }}</div>\n        <div v-if="type === \'symbol\'" class="js-value symbol">{{ string }}</div>\n        <div v-if="type === \'undefined\'" class="js-value undefined">{{ string }}</div>\n      </template>\n    '}}function parseJSCodeGroups(e){return e.split(/\r\n|\r|\n/).reduce(((e,t)=>{const i=e[e.length-1],n=/^\/\/[^]*\\\\$/.test(t),s=n?t.replace(/^\/+\s*|\s*\\+$/g,""):t;return!e.length||n&&!i.canAppendHeader?e.push({headerLines:n?[s]:[],lines:n?[]:[t],allLines:[t],canAppendHeader:n}):n?(i.headerLines.push(s),i.allLines.push(t)):(i.canAppendHeader=!1,i.lines.push(t),i.allLines.push(t)),e}),[]).reduce(((e,t)=>(t.canAppendHeader||(delete t.canAppendHeader,t.headerLines=t.headerLines.join("\n").trimEnd(),t.lines=t.lines.join("\n"),t.allLines=t.allLines.join("\n"),e.push(t)),e)),[])}function unindentMin(e,t){const i=(t=Object(t)).tabSize??4,n=t.trim??!0;if(e=e.replace(/\t/g," ".repeat(i)),!/(^|[\r\n])\S/.test(e)){const t=/(^|[\r\n])((?:(?!\r|\n)\s)+)(?=(\S)?)/g;let i=1/0;for(let n;n=t.exec(e);)n[3]&&(i=Math.min(i,n[2].length));e=e.replace(t,((e,t,n)=>t+n.slice(i)))}return n?e.replace(/^(\s*[\r\n]+)+|\s+$/g,""):e}delete window.Prism,Prism.plugins.autoloader.loadLanguages("javascript");
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