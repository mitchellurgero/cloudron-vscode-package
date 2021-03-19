(function(){"use strict";const D=navigator.vendor&&navigator.vendor.indexOf("Apple")>-1&&navigator.userAgent&&navigator.userAgent.indexOf("CriOS")===-1&&navigator.userAgent.indexOf("FxiOS")===-1,I=({onFocus:t,onBlur:m})=>{const g=50;let p=document.hasFocus();setInterval(()=>{const s=document.hasFocus();s!==p&&(p=s,s?t():m())},g)},b=()=>document.getElementById("active-frame"),h=()=>document.getElementById("pending-frame"),O=`
	html {
		scrollbar-color: var(--vscode-scrollbarSlider-background) var(--vscode-editor-background);
	}

	body {
		background-color: transparent;
		color: var(--vscode-editor-foreground);
		font-family: var(--vscode-font-family);
		font-weight: var(--vscode-font-weight);
		font-size: var(--vscode-font-size);
		margin: 0;
		padding: 0 20px;
	}

	img {
		max-width: 100%;
		max-height: 100%;
	}

	a {
		color: var(--vscode-textLink-foreground);
	}

	a:hover {
		color: var(--vscode-textLink-activeForeground);
	}

	a:focus,
	input:focus,
	select:focus,
	textarea:focus {
		outline: 1px solid -webkit-focus-ring-color;
		outline-offset: -1px;
	}

	code {
		color: var(--vscode-textPreformat-foreground);
	}

	blockquote {
		background: var(--vscode-textBlockQuote-background);
		border-color: var(--vscode-textBlockQuote-border);
	}

	kbd {
		color: var(--vscode-editor-foreground);
		border-radius: 3px;
		vertical-align: middle;
		padding: 1px 3px;

		background-color: hsla(0,0%,50%,.17);
		border: 1px solid rgba(71,71,71,.4);
		border-bottom-color: rgba(88,88,88,.4);
		box-shadow: inset 0 -1px 0 rgba(88,88,88,.4);
	}
	.vscode-light kbd {
		background-color: hsla(0,0%,87%,.5);
		border: 1px solid hsla(0,0%,80%,.7);
		border-bottom-color: hsla(0,0%,73%,.7);
		box-shadow: inset 0 -1px 0 hsla(0,0%,73%,.7);
	}

	::-webkit-scrollbar {
		width: 10px;
		height: 10px;
	}

	::-webkit-scrollbar-corner {
		background-color: var(--vscode-editor-background);
	}

	::-webkit-scrollbar-thumb {
		background-color: var(--vscode-scrollbarSlider-background);
	}
	::-webkit-scrollbar-thumb:hover {
		background-color: var(--vscode-scrollbarSlider-hoverBackground);
	}
	::-webkit-scrollbar-thumb:active {
		background-color: var(--vscode-scrollbarSlider-activeBackground);
	}`;function P(t,m){const g=m?encodeURIComponent(m):void 0;return`
			globalThis.acquireVsCodeApi = (function() {
				const originalPostMessage = window.parent.postMessage.bind(window.parent);
				const targetOrigin = '*';
				let acquired = false;

				let state = ${m?`JSON.parse(decodeURIComponent("${g}"))`:void 0};

				return () => {
					if (acquired && !${t}) {
						throw new Error('An instance of the VS Code API has already been acquired');
					}
					acquired = true;
					return Object.freeze({
						postMessage: function(msg) {
							return originalPostMessage({ command: 'onmessage', data: msg }, targetOrigin);
						},
						setState: function(newState) {
							state = newState;
							originalPostMessage({ command: 'do-update-state', data: JSON.stringify(newState) }, targetOrigin);
							return newState;
						},
						getState: function() {
							return state;
						}
					});
				};
			})();
			delete window.parent;
			delete window.top;
			delete window.frameElement;
		`}function S(t){let m=!0,g,p=[];const s={initialScrollProgress:void 0},v=(e,a)=>{if(!!e&&(a&&(a.classList.remove("vscode-light","vscode-dark","vscode-high-contrast"),a.classList.add(s.activeTheme),a.dataset.vscodeThemeKind=s.activeTheme,a.dataset.vscodeThemeName=s.themeName||""),s.styles)){const r=e.documentElement.style;for(let n=r.length-1;n>=0;n--){const i=r[n];i&&i.startsWith("--vscode-")&&r.removeProperty(i)}for(const n of Object.keys(s.styles))r.setProperty(`--${n}`,s.styles[n])}},T=e=>{if(!(!e||!e.view||!e.view.document)){let a=e.view.document.getElementsByTagName("base")[0],r=e.target;for(;r;){if(r.tagName&&r.tagName.toLowerCase()==="a"&&r.href){if(r.getAttribute("href")==="#")e.view.scrollTo(0,0);else if(r.hash&&(r.getAttribute("href")===r.hash||a&&r.href.indexOf(a.href)>=0)){let n=e.view.document.getElementById(r.hash.substr(1,r.hash.length-1));n&&n.scrollIntoView()}else t.postMessage("did-click-link",r.href.baseVal||r.href);e.preventDefault();break}r=r.parentNode}}},N=e=>{if(!(!e.view||!e.view.document)&&e.button===1){let a=e.target;for(;a;){if(a.tagName&&a.tagName.toLowerCase()==="a"&&a.href){e.preventDefault();break}a=a.parentNode}}},K=e=>{if(F(e))e.preventDefault();else if(W(e))if(t.onElectron)e.preventDefault();else return;t.postMessage("did-keydown",{key:e.key,keyCode:e.keyCode,code:e.code,shiftKey:e.shiftKey,altKey:e.altKey,ctrlKey:e.ctrlKey,metaKey:e.metaKey,repeat:e.repeat})};function W(e){const a=e.ctrlKey||e.metaKey,r=e.shiftKey&&e.key.toLowerCase()==="insert";return a&&["c","v","x"].includes(e.key.toLowerCase())||r}function F(e){return(e.ctrlKey||e.metaKey)&&["z","y"].includes(e.key.toLowerCase())}let w=!1;const q=e=>{w||t.postMessage("did-scroll-wheel",{deltaMode:e.deltaMode,deltaX:e.deltaX,deltaY:e.deltaY,deltaZ:e.deltaZ,detail:e.detail,type:e.type})},B=e=>{if(!(!e.target||!e.target.body)&&!w){const a=e.currentTarget.scrollY/e.target.body.clientHeight;isNaN(a)||(w=!0,window.requestAnimationFrame(()=>{try{t.postMessage("did-scroll",a)}catch(r){}w=!1}))}};function Y(e){const a=e.options,r=e.contents,n=new DOMParser().parseFromString(r,"text/html");if(n.querySelectorAll("a").forEach(c=>{c.title||(c.title=c.getAttribute("href"))}),a.allowScripts){const c=n.createElement("script");c.id="_vscodeApiScript",c.textContent=P(a.allowMultipleAPIAcquire,e.state),n.head.prepend(c)}const i=n.createElement("style");i.id="_defaultStyles",i.textContent=O,n.head.prepend(i),v(n,n.body);const l=n.querySelector('meta[http-equiv="Content-Security-Policy"]');if(!l)t.postMessage("no-csp-found");else try{l.setAttribute("content",t.rewriteCSP(l.getAttribute("content"),e.endpoint))}catch(c){console.error(`Could not rewrite csp: ${c}`)}return`<!DOCTYPE html>
`+n.documentElement.outerHTML}document.addEventListener("DOMContentLoaded",()=>{const e=document.location.search.match(/\bid=([\w-]+)/),a=e?e[1]:void 0;if(!!document.body){t.onMessage("styles",(n,i)=>{s.styles=i.styles,s.activeTheme=i.activeTheme,s.themeName=i.themeName;const l=b();!l||l.contentDocument&&v(l.contentDocument,l.contentDocument.body)}),t.onMessage("focus",()=>{const n=b();!n||!n.contentWindow||document.activeElement!==n&&n.contentWindow.focus()});let r=0;t.onMessage("content",async(n,i)=>{const l=++r;if(await t.ready,l===r){const c=i.options,M=Y(i),y=b(),_=m;let k;if(m)m=!1,k=(o,u)=>{isNaN(s.initialScrollProgress)||u.scrollY===0&&u.scroll(0,o.clientHeight*s.initialScrollProgress)};else{const o=y&&y.contentDocument&&y.contentDocument.body?y.contentWindow.scrollY:0;k=(u,f)=>{f.scrollY===0&&f.scroll(0,o)}}const x=h();x&&(x.setAttribute("id",""),document.body.removeChild(x)),_||(p=[]);const d=document.createElement("iframe");d.setAttribute("id","pending-frame"),d.setAttribute("frameborder","0"),d.setAttribute("sandbox",c.allowScripts?"allow-scripts allow-forms allow-same-origin allow-pointer-lock allow-downloads":"allow-same-origin allow-pointer-lock"),t.fakeLoad&&(d.src=`./fake.html?id=${a}`),d.style.cssText="display: block; margin: 0; overflow: hidden; position: absolute; width: 100%; height: 100%; visibility: hidden",document.body.appendChild(d),t.fakeLoad||d.contentDocument.open();function C(o){setTimeout(()=>{t.fakeLoad&&(o.open(),o.write(M),o.close(),E(d)),o&&v(o,o.body)},0)}if(t.fakeLoad&&!c.allowScripts&&D){const o=setInterval(()=>{if(!d.parentElement){clearInterval(o);return}d.contentDocument.readyState!=="loading"&&(clearInterval(o),C(d.contentDocument))},10)}else d.contentWindow.addEventListener("DOMContentLoaded",o=>{const u=o.target?o.target:void 0;C(u)});const L=(o,u)=>{o&&o.body&&k(o.body,u);const f=h();if(f&&f.contentDocument&&f.contentDocument===o){const A=b();A&&document.body.removeChild(A),v(f.contentDocument,f.contentDocument.body),f.setAttribute("id","active-frame"),f.style.visibility="visible",t.focusIframeOnCreate&&f.contentWindow.focus(),u.addEventListener("scroll",B),u.addEventListener("wheel",q),p.forEach(H=>{u.postMessage(H,"*")}),p=[]}t.postMessage("did-load")};function E(o){clearTimeout(g),g=void 0,g=setTimeout(()=>{clearTimeout(g),g=void 0,L(o.contentDocument,o.contentWindow)},200),o.contentWindow.addEventListener("load",function(u){const f=u.target;g&&(clearTimeout(g),g=void 0,L(f,this))}),o.contentWindow.addEventListener("click",T),o.contentWindow.addEventListener("auxclick",N),o.contentWindow.addEventListener("keydown",K),o.contentWindow.addEventListener("contextmenu",u=>u.preventDefault()),t.onIframeLoaded&&t.onIframeLoaded(o)}t.fakeLoad||E(d),t.fakeLoad||(d.contentDocument.write(M),d.contentDocument.close()),t.postMessage("did-set-content",void 0)}}),t.onMessage("message",(n,i)=>{if(!h()){const c=b();if(c){c.contentWindow.postMessage(i,"*");return}}p.push(i)}),t.onMessage("initial-scroll-position",(n,i)=>{s.initialScrollProgress=i}),t.onMessage("execCommand",(n,i)=>{const l=b();!l||l.contentDocument.execCommand(i)}),I({onFocus:()=>t.postMessage("did-focus"),onBlur:()=>t.postMessage("did-blur")}),t.postMessage("webview-ready",{})}})}typeof module!="undefined"?module.exports=S:window.createWebviewManager=S})();

//# sourceMappingURL=main.js.map
