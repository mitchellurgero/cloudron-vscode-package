!function(e,n){for(var r in n)e[r]=n[r]}(exports,function(e){var n={};function r(t){if(n[t])return n[t].exports;var o=n[t]={i:t,l:!1,exports:{}};return e[t].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=n,r.d=function(e,n,t){r.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,n){if(1&n&&(e=r(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(r.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)r.d(t,o,function(n){return e[n]}.bind(null,o));return t},r.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(n,"a",n),n},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},r.p="",r(r.s=169)}({0:function(e,n){e.exports=require("path")},169:function(e,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0});const t=r(3),o=r(7),a=r(170),s=o.loadMessageBundle(r(0).join(__dirname,"askpass-main.ts"));function i(e){console.error(s(0,null)),console.error(e),process.exit(1)}!function(e){if(5!==e.length)return i("Wrong number of arguments");if(!process.env.VSCODE_GIT_ASKPASS_PIPE)return i("Missing pipe");if("fetch"===process.env.VSCODE_GIT_COMMAND&&process.env.VSCODE_GIT_FETCH_SILENT)return i("Skip silent fetch commands");const n=process.env.VSCODE_GIT_ASKPASS_PIPE,r=e[2],o=e[4].replace(/^["']+|["']+$/g,"");new a.IPCClient("askpass").call({request:r,host:o}).then(e=>{t.writeFileSync(n,e+"\n"),setTimeout(()=>process.exit(0),0)}).catch(e=>i(e))}(process.argv)},170:function(e,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.IPCClient=void 0;const t=r(18);n.IPCClient=class{constructor(e){this.handlerName=e;const n=process.env.VSCODE_GIT_IPC_HANDLE;if(!n)throw new Error("Missing VSCODE_GIT_IPC_HANDLE");this.ipcHandlePath=n}call(e){const n={socketPath:this.ipcHandlePath,path:"/"+this.handlerName,method:"POST"};return new Promise((r,o)=>{const a=t.request(n,e=>{if(200!==e.statusCode)return o(new Error("Bad status code: "+e.statusCode));const n=[];e.on("data",e=>n.push(e)),e.on("end",()=>r(JSON.parse(Buffer.concat(n).toString("utf8"))))});a.on("error",e=>o(e)),a.write(JSON.stringify(e)),a.end()})}}},18:function(e,n){e.exports=require("http")},3:function(e,n){e.exports=require("fs")},7:function(e,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var t,o,a,s,i,l=r(0),c=r(3),u=Object.prototype.toString;function f(e){return void 0!==e}function d(e){return"[object Number]"===u.call(e)}function g(e){return"[object String]"===u.call(e)}function p(e){return JSON.parse(c.readFileSync(e,"utf8"))}function v(e,n){return i&&(e="［"+e.replace(/[aouei]/g,"$&$&")+"］"),0===n.length?e:e.replace(/\{(\d+)\}/g,(function(e,r){var t=r[0],o=n[t],a=e;return"string"==typeof o?a=o:"number"!=typeof o&&"boolean"!=typeof o&&null!=o||(a=String(o)),a}))}function h(e){return function(n,r){for(var t=[],o=2;o<arguments.length;o++)t[o-2]=arguments[o];return d(n)?n>=e.length?void console.error("Broken localize call found. Index out of bounds. Stacktrace is\n: "+new Error("").stack):v(e[n],t):g(r)?(console.warn("Message "+r+" didn't get externalized correctly."),v(r,t)):void console.error("Broken localize call found. Stacktrace is\n: "+new Error("").stack)}}function m(e,n){for(var r=[],t=2;t<arguments.length;t++)r[t-2]=arguments[t];return v(n,r)}function S(e,n){return a[e]=n,n}function b(e,n){var r,t,o,a=l.join(s.cacheRoot,e.id+"-"+e.hash+".json"),i=!1,u=!1;try{return r=JSON.parse(c.readFileSync(a,{encoding:"utf8",flag:"r"})),t=a,o=new Date,c.utimes(t,o,o,(function(){})),r}catch(e){if("ENOENT"===e.code)u=!0;else{if(!(e instanceof SyntaxError))throw e;console.log("Syntax error parsing message bundle: "+e.message+"."),c.unlink(a,(function(e){e&&console.error("Deleting corrupted bundle "+a+" failed.")})),i=!0}}if(!(r=function(e,n){var r=s.translationsConfig[e.id];if(r){var t=p(r).contents,o=p(l.join(n,"nls.metadata.json")),a=Object.create(null);for(var i in o){var c=o[i],u=t[e.outDir+"/"+i];if(u){for(var f=[],d=0;d<c.keys.length;d++){var v=c.keys[d],h=u[g(v)?v:v.key];void 0===h&&(h=c.messages[d]),f.push(h)}a[i]=f}else a[i]=c.messages}return a}}(e,n))||i)return r;if(u)try{c.writeFileSync(a,JSON.stringify(r),{encoding:"utf8",flag:"wx"})}catch(e){if("EEXIST"===e.code)return r;throw e}return r}function y(e){try{return function(e){var n=p(l.join(e,"nls.metadata.json")),r=Object.create(null);for(var t in n){var o=n[t];r[t]=o.messages}return r}(e)}catch(e){return void console.log("Generating default bundle from meta data failed.",e)}}function _(e,n){var r;if(!0===s.languagePackSupport&&void 0!==s.cacheRoot&&void 0!==s.languagePackId&&void 0!==s.translationsConfigFile&&void 0!==s.translationsConfig)try{r=b(e,n)}catch(e){console.log("Load or create bundle failed ",e)}if(!r){if(s.languagePackSupport)return y(n);var t=function(e){for(var n=s.locale;n;){var r=l.join(e,"nls.bundle."+n+".json");if(c.existsSync(r))return r;var t=n.lastIndexOf("-");n=t>0?n.substring(0,t):void 0}if(void 0===n){r=l.join(e,"nls.bundle.json");if(c.existsSync(r))return r}}(n);if(t)try{return p(t)}catch(e){console.log("Loading in the box message bundle failed.",e)}r=y(n)}return r}function O(e){if(!e)return m;var n=l.extname(e);if(n&&(e=e.substr(0,e.length-n.length)),s.messageFormat===t.both||s.messageFormat===t.bundle){var r=function(e){for(var n,r=l.dirname(e);n=l.join(r,"nls.metadata.header.json"),!c.existsSync(n);){var t=l.dirname(r);if(t===r){n=void 0;break}r=t}return n}(e);if(r){var o=l.dirname(r),u=a[o];if(void 0===u)try{var d=JSON.parse(c.readFileSync(r,"utf8"));try{var g=_(d,o);u=S(o,g?{header:d,nlsBundle:g}:null)}catch(e){console.error("Failed to load nls bundle",e),u=S(o,null)}}catch(e){console.error("Failed to read header file",e),u=S(o,null)}if(u){var v=e.substr(o.length+1).replace(/\\/g,"/"),b=u.nlsBundle[v];return void 0===b?(console.error("Messages for file "+e+" not found. See console for details."),function(){return"Messages not found."}):h(b)}}}if(s.messageFormat===t.both||s.messageFormat===t.file)try{var y=p(function(e){var n;if(s.cacheLanguageResolution&&n)n=n;else{if(i||!s.locale)n=".nls.json";else for(var r=s.locale;r;){var t=".nls."+r+".json";if(c.existsSync(e+t)){n=t;break}var o=r.lastIndexOf("-");o>0?r=r.substring(0,o):(n=".nls.json",r=null)}s.cacheLanguageResolution&&(n=n)}return e+n}(e));return Array.isArray(y)?h(y):f(y.messages)&&f(y.keys)?h(y.messages):(console.error("String bundle '"+e+"' uses an unsupported format."),function(){return"File bundle has unsupported format. See console for details"})}catch(e){"ENOENT"!==e.code&&console.error("Failed to load single file bundle",e)}return console.error("Failed to load message bundle for file "+e),function(){return"Failed to load message bundle. See console for details."}}!function(e){e.file="file",e.bundle="bundle",e.both="both"}(t=n.MessageFormat||(n.MessageFormat={})),function(e){e.is=function(e){var n=e;return n&&f(n.key)&&f(n.comment)}}(o||(o={})),function(){if(s={locale:void 0,languagePackSupport:!1,cacheLanguageResolution:!0,messageFormat:t.bundle},g(process.env.VSCODE_NLS_CONFIG))try{var e=JSON.parse(process.env.VSCODE_NLS_CONFIG);if(g(e.locale)&&(s.locale=e.locale.toLowerCase()),(!0===(n=e._languagePackSupport)||!1===n)&&(s.languagePackSupport=e._languagePackSupport),g(e._cacheRoot)&&(s.cacheRoot=e._cacheRoot),g(e._languagePackId)&&(s.languagePackId=e._languagePackId),g(e._translationsConfigFile)){s.translationsConfigFile=e._translationsConfigFile;try{s.translationsConfig=p(s.translationsConfigFile)}catch(n){e._corruptedFile&&c.writeFile(e._corruptedFile,"corrupted","utf8",(function(e){console.error(e)}))}}}catch(e){}var n;i="pseudo"===s.locale,void 0,a=Object.create(null)}(),n.loadMessageBundle=O,n.config=function(e){return e&&(g(e.locale)&&(s.locale=e.locale.toLowerCase(),void 0,a=Object.create(null)),void 0!==e.messageFormat&&(s.messageFormat=e.messageFormat)),i="pseudo"===s.locale,O}}}));
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/undefined/extensions/git/dist/askpass-main.js.map