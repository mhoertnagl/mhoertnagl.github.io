import{d as f,r as y,c as x,o as p,j as S,a as b,e as l,l as m,b as k,f as u,t as g,u as d,k as _,g as L}from"./vendor.fd277545.js";const M=function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const c of t.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}};M();const j=f({setup(i){const o=`
---
title: Test
date: 2021-10-24 12:41
tags: test
---
# Heading 1

> Quote

Inline KaTeX \`katex \\sum^{n}_{i=0} i\`

\`\`\`js
function foo() { return 0; }
\`\`\`

\`\`\`mermaid
stateDiagram-v2
    [*] --> Still
    Still --> [*]

    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
\`\`\`

\`\`\`katex
\\sum^{n}_{i=0} i
\`\`\`
`;return(n,r)=>{const e=y("article-renderer");return p(),x(e,{source:o})}}});function O(i){const n=/^(-{3}(?:\n|\r)([\w\W]+?)(?:\n|\r)-{3})?([\w\W]*)*/.exec(i),r={meta:{},contents:""};return n&&(r.meta=S.load(n[2]),r.contents=n[3]),r}const T=["innerHTML"],C=f({props:{source:null},setup(i){const o=i;b.initialize({});const n={renderer:{code(s,a){return a==="mermaid"?`<div class="mermaid">${s}</div>`:!1}}},r={renderer:{code(s,a){return a==="katex"?_.renderToString(s,{displayMode:!0}):!1},codespan(s){return s.startsWith("katex")?_.renderToString(s.substring(5)):!1}}};l.setOptions({highlight:(s,a)=>{const v=m.getLanguage(a)?a:"plaintext";return m.highlight(s,{language:v}).value},langPrefix:"hljs language-"}),l.use(n),l.use(r);const e=o.source.trim(),t=O(e),c=l(t.contents);return(s,a)=>(p(),k("article",null,[u("h1",null,g(d(t).meta.title),1),u("h5",null,g(d(t).meta.date),1),u("section",{innerHTML:d(c)},null,8,T)]))}});var E=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",default:C});function w(i){var n;const o={"./components/ArticleRenderer.vue":E};for(const[r,e]of Object.entries(o)){const t=(n=r.split("/").pop())==null?void 0:n.replace(/\.\w+$/,"");t&&i.component(t,e.default)}}const h=L(j);w(h);h.mount("#app");
