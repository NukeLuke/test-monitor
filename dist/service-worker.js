if(!self.define){let e,n={};const i=(i,r)=>(i=new URL(i+".js",r).href,n[i]||new Promise((n=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=n,document.head.appendChild(e)}else e=i,importScripts(i),n()})).then((()=>{let e=n[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(r,s)=>{const l=e||("document"in self?document.currentScript.src:"")||location.href;if(n[l])return;let o={};const t=e=>i(e,l),u={module:{uri:l},exports:o,require:t};n[l]=Promise.all(r.map((e=>u[e]||t(e)))).then((e=>(s(...e),o)))}}define(["./workbox-6716fad7"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"chunk/1.53510e10.css",revision:null},{url:"chunk/dll.7875788d.js",revision:null},{url:"chunk/main.fa04f1d9.js",revision:null},{url:"chunk/vendors.341acc84.js",revision:null},{url:"index.html",revision:"99a7aca3f27e5734e2379da103852668"}],{})}));
