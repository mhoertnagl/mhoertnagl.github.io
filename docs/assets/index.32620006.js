import{d as a,r as g,c as h,o as u,e as p,l as d,a as v,b as y,f as l,t as f,u as c,g as b}from"./vendor.d2cb0d34.js";const S=function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const s of t.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function r(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function o(e){if(e.ep)return;e.ep=!0;const t=r(e);fetch(e.href,t)}};S();const L=a({setup(i){const n=`
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
`;return(r,o)=>{const e=g("article-renderer");return u(),h(e,{source:n})}}});const x=["innerHTML"],M=a({props:{source:null},setup(i){const n=i;p.setOptions({highlight:(t,s)=>{const _=d.getLanguage(s)?s:"plaintext";return d.highlight(t,{language:_}).value},langPrefix:"hljs language-"});const r=n.source.trim(),o=v(r),e=p(o.__content);return(t,s)=>(u(),y("article",null,[l("h1",null,f(c(o).title),1),l("h5",null,f(c(o).date),1),l("section",{innerHTML:c(e)},null,8,x)]))}});var O=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",default:M});function j(i){var r;const n={"./components/ArticleRenderer.vue":O};for(const[o,e]of Object.entries(n)){const t=(r=o.split("/").pop())==null?void 0:r.replace(/\.\w+$/,"");t&&i.component(t,e.default)}}const m=b(L);j(m);m.mount("#app");
