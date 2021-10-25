import{d as f,r as x,c as v,o as _,a as y,e as u,l as m,b as A,f as $,g as d,t as g,u as p,h as b}from"./vendor.bc49b3e7.js";const S=function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function s(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerpolicy&&(r.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?r.credentials="include":e.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(e){if(e.ep)return;e.ep=!0;const r=s(e);fetch(e.href,r)}};S();const w=f({setup(i){const n=`
---
title: Test
date: 2021-10-24 12:41
tags: test
---
# Heading 1

> Quote

\`test\`

\`\`\`js
function foo() { return 0; }
\`\`\`

\xA7\xA7\xA7
stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
\xA7\xA7\xA7

$$$
sum^{n}_{i=0} i
$$$
`;return(s,a)=>{const e=x("article-renderer");return _(),v(e,{source:n})}}});var L=(i,n)=>{for(const[s,a]of n)i[s]=a;return i};const M=["innerHTML"],O=f({props:{source:null},setup(i){const n=i;y.initialize({});const s={walkTokens(t){const{type:o,raw:l}=t;console.log("RAW: "+l),o==="paragraph"&&l.startsWith(`\xA7\xA7\xA7
`)&&l.endsWith(`
\xA7\xA7\xA7`)&&(t.type="code",t.lang="mermaid",t.text=t.raw.slice(3,-3).trim(),t.tokens.length=0,console.log(t))},renderer:{code(t,o){return o==="mermaid"?`<div class="mermaid">${t}</div>`:!1}}},a={walkTokens(t){const{type:o,raw:l}=t;o==="paragraph"&&l.startsWith(`$$$
`)&&l.endsWith(`
$$$`)&&(t.type="code",t.lang="latex",t.text=t.raw.slice(3,-3).trim(),t.tokens.length=0)},renderer:{code(t,o){return o==="latex"?t:!1}}};u.setOptions({highlight:(t,o)=>{const l=m.getLanguage(o)?o:"plaintext";return m.highlight(t,{language:l}).value},langPrefix:"hljs language-"}),u.use(s),u.use(a);const e=n.source.trim(),r=A(e),c=u(r.__content);return(t,o)=>(_(),$("article",null,[d("h1",null,g(p(r).title),1),d("h5",null,g(p(r).date),1),d("section",{innerHTML:p(c)},null,8,M)]))}});var T=L(O,[["__scopeId","data-v-1ad7bacb"]]),j=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",default:T});function C(i){var s;const n={"./components/ArticleRenderer.vue":j};for(const[a,e]of Object.entries(n)){const r=(s=a.split("/").pop())==null?void 0:s.replace(/\.\w+$/,"");r&&i.component(r,e.default)}}const h=b(w);C(h);h.mount("#app");
