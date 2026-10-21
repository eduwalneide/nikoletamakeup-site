#!/usr/bin/env node
/* Build: src/template.html + src/i18n*.js + src/testimonials.js  →  dist/ (one page per section × language)
   Usage: node build.js            (SITE_URL from src/seo.js, override with SITE_URL=https://… node build.js) */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto');
const cheerio = require('cheerio');
const SEO = require('./src/seo');

const ROOT = __dirname, SRC = path.join(ROOT, 'src'), DIST = path.join(ROOT, 'dist');
const SITE_URL = (process.env.SITE_URL || SEO.SITE_URL).replace(/\/$/, '');
const { LANGS, DEFAULT_LANG, PAGES, SECTIONS, ANCHOR_PAGE, PAGE_MAIN_ANCHOR, NAV_PAGE, SLUGS, NAMES, META } = SEO;

/* ---------- load data ---------- */
const w = {};
for (const f of ['i18n.js', 'i18n-v3.js', 'i18n-v4.js', 'i18n-v5.js', 'testimonials.js', 'beforeafter.js'])
  vm.runInNewContext(fs.readFileSync(path.join(SRC, f), 'utf8'), { window: w });
const I18N = w.I18N, TESTIMONIALS = w.TESTIMONIALS || [], BEFORE_AFTER = w.BEFORE_AFTER || [];
const tpl = fs.readFileSync(path.join(SRC, 'template.html'), 'utf8');
const RUNTIME_KEYS = ['hint_done', 'v5_f_sending', 'v5_f_sent', 'v5_f_empty'];

/* ---------- urls ---------- */
const langPrefix = l => (l === DEFAULT_LANG ? '' : '/' + l);
const pagePath = (l, p) => (p === 'home' ? langPrefix(l) + '/' : langPrefix(l) + '/' + SLUGS[l][p] + '/');
const absUrl = (l, p) => SITE_URL + pagePath(l, p);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- assets: css from template, js from src/site.js, hashed ---------- */
const extraCss = `
.lang-menu li{padding:0}.lang-menu li a{display:flex;justify-content:space-between;gap:14px;width:100%;padding:8px 14px;color:inherit}
.lang-menu li.is-on a{font-weight:700;color:var(--ink)}
nav.main .lang-menu li a{padding:10px 0}
.foot-langs a{font-size:13px;color:var(--dark-mute)}.foot-langs a.is-on{color:#fff;font-weight:700}
nav.main > a[aria-current="page"]{text-decoration:underline;text-underline-offset:6px;text-decoration-thickness:1px}
.page-intro{padding:72px var(--pad) 0}
.page-intro .crumbs{font-size:13px;color:var(--mute);display:flex;gap:8px;flex-wrap:wrap}
.page-intro .crumbs a{color:var(--mute)}
.p404{padding:120px var(--pad);min-height:60vh}.p404 h1{font-size:clamp(48px,8vw,120px);line-height:.9;letter-spacing:-.05em;margin-bottom:24px}
@media (max-width:900px){.page-intro{padding-top:40px}}
`;
const css = tpl.match(/<style>([\s\S]*?)<\/style>/)[1] + extraCss;
const js = fs.readFileSync(path.join(SRC, 'site.js'), 'utf8');
const hash = s => crypto.createHash('sha1').update(s).digest('hex').slice(0, 8);
const CSS_FILE = `/assets/site.${hash(css)}.css`, JS_FILE = `/assets/site.${hash(js)}.js`;

/* ---------- template pieces ---------- */
const $t = cheerio.load(tpl, { decodeEntities: false });
const headerHtml = $t.html('header');
const footerHtml = $t.html('footer');
const sectionHtml = sel => $t.html(sel);

/* services → OfferCatalog (from the EN template, prices only) */
function offers(lang) {
  const d = I18N[lang]; const out = [];
  $t('#rows .row').each((i, row) => {
    const $r = $t(row);
    const nameKey = $r.find('.name [data-i18n]').first().attr('data-i18n') || $r.find('.name').attr('data-i18n');
    const descKey = $r.find('.desc').attr('data-i18n');
    const price = ($r.find('.price').first().text().match(/€\s?([\d.,]+)/) || [])[1];
    if (!nameKey || !price) return;
    out.push({ '@type': 'Offer', name: d[nameKey] || I18N.en[nameKey], description: d[descKey] || I18N.en[descKey] || undefined, price: price.replace(/,/g, ''), priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: absUrl(lang, 'services') });
  });
  return out;
}

function jsonLd(lang, page) {
  const d = I18N[lang];
  const business = {
    '@type': 'BeautySalon', '@id': SITE_URL + '/#business', name: 'Nikoleta Makeup & Team', alternateName: 'Nikoleta Makeup and Hairstyling',
    url: SITE_URL + '/', image: SITE_URL + '/img/work/hero-side.jpg', telephone: '+34 633 953 257', email: 'info@nikoletamakeup.com',
    foundingDate: '2008', priceRange: '€€€', address: { '@type': 'PostalAddress', addressLocality: 'Barcelona', addressCountry: 'ES' },
    areaServed: ['Barcelona', 'Catalonia', 'Spain', 'Europe'], sameAs: ['https://www.instagram.com/nikoletamakeup/', 'https://www.pinterest.es/nikoletamakeup/'],
    knowsLanguage: LANGS, description: META[lang].home[1]
  };
  const graph = [business];
  if (page !== 'home') graph.push({ '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: NAMES[lang].home, item: absUrl(lang, 'home') },
    { '@type': 'ListItem', position: 2, name: NAMES[lang][page], item: absUrl(lang, page) }] });
  if (page === 'services') graph.push({ '@type': 'Service', name: META[lang].services[0].split('|')[0].trim(), provider: { '@id': SITE_URL + '/#business' }, areaServed: ['Barcelona', 'Spain', 'Europe'], hasOfferCatalog: { '@type': 'OfferCatalog', name: NAMES[lang].services, itemListElement: offers(lang) } });
  if (page === 'reviews') graph.push({ '@type': 'ItemList', name: NAMES[lang].reviews, numberOfItems: TESTIMONIALS.length, itemListElement: TESTIMONIALS.slice(0, 10).map((t, i) => ({ '@type': 'Review', position: i + 1, itemReviewed: { '@id': SITE_URL + '/#business' }, author: { '@type': 'Person', name: t.who }, reviewBody: t.text, datePublished: String(t.y) })) });
  graph.push({ '@type': 'WebPage', '@id': absUrl(lang, page), url: absUrl(lang, page), name: META[lang][page][0], description: META[lang][page][1], inLanguage: lang, isPartOf: { '@type': 'WebSite', url: SITE_URL + '/', name: 'Nikoleta Makeup & Team' } });
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

/* ---------- i18n application ---------- */
function applyI18n($, lang) {
  const d = I18N[lang], en = I18N.en;
  const get = k => (k in d ? d[k] : en[k]);
  $('[data-i18n]').each((i, el) => { const k = $(el).attr('data-i18n'); const v = get(k); if (v === undefined) return; if (/_h$/.test(k)) $(el).html(v); else $(el).text(v); });
  $('[data-i18n-ph]').each((i, el) => { const v = get($(el).attr('data-i18n-ph')); if (v !== undefined) $(el).attr('placeholder', v); });
  $('[data-i18n-alt]').each((i, el) => { const v = get($(el).attr('data-i18n-alt')); if (v !== undefined) $(el).attr('alt', v); });
  $('[data-i18n-aria]').each((i, el) => { const v = get($(el).attr('data-i18n-aria')); if (v !== undefined) $(el).attr('aria-label', v); });
}

/* ---------- page build ---------- */
function buildPage(lang, page) {
  const d = I18N[lang]; const [title, description] = META[lang][page];
  const body = SECTIONS[page].map(sectionHtml).join('\n');
  const $ = cheerio.load(`<!doctype html><html lang="${lang}"><head></head><body>${headerHtml}<main>${body}</main>${footerHtml}</body></html>`, { decodeEntities: false });

  /* testimonials pre-render */
  if (page === 'reviews') {
    const wall = $('#wall');
    TESTIMONIALS.forEach((t, i) => {
      const img = t.img ? `<img src="/${t.img.replace(/^\//, '')}" alt="" loading="lazy">` : '';
      wall.append(`<figure class="wcard"${i >= 12 ? ' hidden' : ''}>${img}<p>${esc(t.text)}</p><div class="meta"><b>${esc(t.who)}</b><span class="src">${esc(d['v4_src_' + t.src] || t.src)}</span><span>${t.y}</span></div></figure>`);
    });
    if (TESTIMONIALS.length <= 12) $('#wallMore').remove();
  }
  /* before & after: only when real pairs exist */
  if (page === 'portfolio') {
    if (!BEFORE_AFTER.length) $('#before-after').remove();
    else { const grid = $('#baGrid'); BEFORE_AFTER.forEach(p => grid.append(`<figure><div class="pair"><div><span class="lbl" data-i18n="v5_ba_before">Before</span><img src="${p.before}" alt=""></div><div><span class="lbl after" data-i18n="v5_ba_after">After</span><img src="${p.after}" alt=""></div></div><figcaption><b>${esc(p.who || '')}</b><span>${esc(p.kind || '')}</span></figcaption></figure>`)); $('#before-after').removeAttr('hidden'); }
  }
  if (!BEFORE_AFTER.length) $('#navBa').remove(); else $('#navBa').removeAttr('hidden');

  applyI18n($, lang);

  /* links: anchors → pages */
  const onPage = id => $('#' + id).length > 0;
  $('a[href^="#"]').each((i, el) => {
    const id = $(el).attr('href').slice(1); if (!id) return;
    const target = ANCHOR_PAGE[id]; if (!target) return;
    if (onPage(id) && target === page) return;
    const hashPart = PAGE_MAIN_ANCHOR[target] === id ? '' : '#' + id;
    $(el).attr('href', pagePath(lang, target) + hashPart);
  });
  $('header .brand').attr('href', pagePath(lang, 'home'));
  $('nav.main > a').each((i, el) => { const k = $(el).attr('data-i18n'); if (NAV_PAGE[k] === page && !/#/.test($(el).attr('href') || '')) $(el).attr('aria-current', 'page'); });

  /* language menus as links */
  $('#langCur').text(lang.toUpperCase());
  $('#langMenu').html(LANGS.map(l => `<li role="option"${l === lang ? ' class="is-on"' : ''}><a href="${pagePath(l, page)}" hreflang="${l}" lang="${l}">${I18N[l]._name}<small>${l}</small></a></li>`).join(''));
  $('#footLangs').html(LANGS.map(l => `<a href="${pagePath(l, page)}" hreflang="${l}" lang="${l}" title="${I18N[l]._name}"${l === lang ? ' class="is-on"' : ''}>${l.toUpperCase()}</a>`).join(''));

  /* absolute asset paths */
  $('img[src]').each((i, el) => { const s = $(el).attr('src'); if (/^img\//.test(s)) $(el).attr('src', '/' + s); });
  $('[data-i18n],[data-i18n-ph],[data-i18n-alt],[data-i18n-aria]').removeAttr('data-i18n data-i18n-ph data-i18n-alt data-i18n-aria');

  /* head */
  const alternates = LANGS.map(l => `<link rel="alternate" hreflang="${l}" href="${absUrl(l, page)}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${absUrl(DEFAULT_LANG, page)}">`;
  const hashmap = {}; Object.keys(ANCHOR_PAGE).forEach(id => { if (ANCHOR_PAGE[id] !== page) hashmap[id] = pagePath(lang, ANCHOR_PAGE[id]) + (PAGE_MAIN_ANCHOR[ANCHOR_PAGE[id]] === id ? '' : '#' + id); });
  const runtime = {}; RUNTIME_KEYS.forEach(k => { runtime[k] = d[k] || I18N.en[k]; });
  $('head').html(`
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${absUrl(lang, page)}">
${alternates}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Nikoleta Makeup &amp; Team">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${absUrl(lang, page)}">
<meta property="og:image" content="${SITE_URL}/img/work/hero-side.jpg">
<meta property="og:locale" content="${lang}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#ffffff">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Archivo:wght@400;500;700&display=swap">
<link rel="stylesheet" href="${CSS_FILE}">
<script type="application/ld+json">${jsonLd(lang, page)}</script>
<script>window.__T=${JSON.stringify(runtime)};window.__HASHMAP=${JSON.stringify(hashmap)};</script>
<script defer src="${JS_FILE}"></script>`);

  /* hero only on home: other pages get a light intro with breadcrumbs */
  if (page !== 'home') {
    $('main').prepend(`<div class="page-intro"><nav class="crumbs" aria-label="Breadcrumb"><a href="${pagePath(lang, 'home')}">${esc(NAMES[lang].home)}</a><span>›</span><span>${esc(NAMES[lang][page])}</span></nav></div>`);
  }
  return '<!doctype html>\n' + $.html().replace(/^<!doctype html>\s*/i, '');
}

/* ---------- write ---------- */
function writeFile(rel, content) { const f = path.join(DIST, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, content); }
/* clean previous generated html + assets (keep img/, ig.json) */
function cleanDist() {
  for (const e of fs.readdirSync(DIST)) {
    const p = path.join(DIST, e);
    if (e === 'img' || e === 'ig.json') continue;
    fs.rmSync(p, { recursive: true, force: true });
  }
}
cleanDist();
writeFile(CSS_FILE.slice(1), css);
writeFile(JS_FILE.slice(1), js);

const urls = [];
for (const lang of LANGS) for (const page of PAGES) {
  const html = buildPage(lang, page);
  writeFile(pagePath(lang, page).slice(1) + 'index.html', html);
  urls.push({ lang, page });
}

/* sitemap, robots, 404 */
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  urls.map(({ lang, page }) => `  <url><loc>${absUrl(lang, page)}</loc>${LANGS.map(l => `<xhtml:link rel="alternate" hreflang="${l}" href="${absUrl(l, page)}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${absUrl(DEFAULT_LANG, page)}"/><changefreq>${page === 'reviews' ? 'weekly' : 'monthly'}</changefreq><priority>${page === 'home' ? '1.0' : '0.8'}</priority></url>`).join('\n') + '\n</urlset>\n';
writeFile('sitemap.xml', sitemap);
writeFile('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
const $404 = cheerio.load(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Page not found · Nikoleta Makeup &amp; Team</title><meta name="robots" content="noindex"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Archivo:wght@400;500;700&display=swap"><link rel="stylesheet" href="${CSS_FILE}"></head><body>${headerHtml}<main><section class="p404"><h1>Page <span class="it">not found.</span></h1><p class="lead">The page you were looking for does not exist. <a href="/" style="border-bottom:1px solid var(--ink)">Back to the home page</a>.</p></section></main>${footerHtml}<script defer src="${JS_FILE}"></script></body></html>`, { decodeEntities: false });
applyI18n($404, 'en');
$404('a[href^="#"]').each((i, el) => { const id = $404(el).attr('href').slice(1); const t = ANCHOR_PAGE[id]; if (t) $404(el).attr('href', pagePath('en', t) + (PAGE_MAIN_ANCHOR[t] === id ? '' : '#' + id)); });
$404('#langMenu').html(LANGS.map(l => `<li role="option"><a href="${pagePath(l, 'home')}">${I18N[l]._name}<small>${l}</small></a></li>`).join(''));
$404('#footLangs').html(LANGS.map(l => `<a href="${pagePath(l, 'home')}">${l.toUpperCase()}</a>`).join(''));
$404('#navBa').remove();
$404('[data-i18n],[data-i18n-ph],[data-i18n-alt],[data-i18n-aria]').removeAttr('data-i18n data-i18n-ph data-i18n-alt data-i18n-aria');
writeFile('404.html', '<!doctype html>\n' + $404.html().replace(/^<!doctype html>\s*/i, ''));

console.log(`built ${urls.length} pages in ${LANGS.length} languages → dist/  (css ${CSS_FILE}, js ${JS_FILE}, site ${SITE_URL})`);
