import{d as p,r as y,c as x,o as f,a as b,e as c,l as m,b as S,f as k,g as u,t as g,u as d,k as _,h as L}from"./vendor.208a6bd9.js";const M=function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const l of t.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function o(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(e){if(e.ep)return;e.ep=!0;const t=o(e);fetch(e.href,t)}};M();const O=p({setup(a){const n=`
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
`;return(o,s)=>{const e=y("article-renderer");return f(),x(e,{source:n})}}});const T=["innerHTML"],j=p({props:{source:null},setup(a){const n=a;b.initialize({});const o={renderer:{code(r,i){return i==="mermaid"?`<div class="mermaid">${r}</div>`:!1}}},s={renderer:{code(r,i){return i==="katex"?_.renderToString(r,{displayMode:!0}):!1},codespan(r){return r.startsWith("katex")?_.renderToString(r.substring(5)):!1}}};c.setOptions({highlight:(r,i)=>{const v=m.getLanguage(i)?i:"plaintext";return m.highlight(r,{language:v}).value},langPrefix:"hljs language-"}),c.use(o),c.use(s);const e=n.source.trim(),t=S(e),l=c(t.__content);return(r,i)=>(f(),k("article",null,[u("h1",null,g(d(t).title),1),u("h5",null,g(d(t).date),1),u("section",{innerHTML:d(l)},null,8,T)]))}});var C=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",default:j});function E(a){var o;const n={"./components/ArticleRenderer.vue":C};for(const[s,e]of Object.entries(n)){const t=(o=s.split("/").pop())==null?void 0:o.replace(/\.\w+$/,"");t&&a.component(t,e.default)}}const h=L(O);E(h);h.mount("#app");
