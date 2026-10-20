# nikoletamakeup.com — site handover (v5, October 2026)

This folder is the complete, production-ready website for Nikoleta Makeup & Team.
It is a **static site** (one HTML page, a few JS files, images) plus an **optional
Cloudflare Worker** that adds two server features. It can be hosted in two ways.

Live preview of exactly this build: https://nikoleta-v5.eduwalneide.workers.dev

---

## Option A — Cloudflare Workers (recommended, full features)

This is how the site runs today. Everything in this folder is deployed as-is.

Requirements: a Cloudflare account that holds the zone `nikoletamakeup.com`
(the domain already uses Cloudflare nameservers), Node.js 18+.

```bash
npm i -g wrangler          # or use: npx wrangler ...
wrangler login
# in this folder:
wrangler kv namespace create IG_KV      # copy the returned id into wrangler.jsonc → kv_namespaces[0].id
wrangler deploy
```

Then add the custom domain: Cloudflare dashboard → Workers & Pages → `nikoleta-v5`
→ Settings → Domains & Routes → **Add → Custom domain** → `nikoletamakeup.com`
(and `www.nikoletamakeup.com`). Cloudflare creates the DNS records itself.
**Do not touch the MX records** — email for the domain runs on Google Workspace.

Server features provided by `worker.js`:

| Route | What it does |
|---|---|
| `POST /api/enquiry` | Contact form. Stores a copy of every enquiry in KV (90 days) and emails it to `ENQUIRY_TO` (info@nikoletamakeup.com) through Resend. Needs the secret `RESEND_API_KEY` (see `ENQUIRY.md`). Without the key the site falls back to opening the visitor's email app, so nothing is lost. |
| `GET /api/instagram` | Live Instagram feed for the "Latest on Instagram" section. Needs the secret `IG_TOKEN` (see `INSTAGRAM.md`). Without it the site shows the snapshot in `ig.json`. |

Secrets are set once with `wrangler secret put RESEND_API_KEY` and `wrangler secret put IG_TOKEN`.
Variables (`ENQUIRY_TO`, `ENQUIRY_FROM`, `IG_ACCOUNT`) live in `wrangler.jsonc`.

## Option B — any static host (cPanel, Netlify, Vercel, S3, etc.)

Upload **everything except** `worker.js`, `wrangler.jsonc`, `.assetsignore` and the `*.md` files
to the web root. `index.html` must be the root document.

What changes without the Worker:
- The contact form opens the visitor's email app pre-filled to info@nikoletamakeup.com (automatic fallback).
- The Instagram section shows the saved snapshot (`ig.json`) instead of the live feed.

Everything else (9 languages, carousels, prices, testimonials, mobile menu) works unchanged.

---

## Files

| File | Purpose |
|---|---|
| `index.html` | the whole site (markup, CSS, JS) |
| `i18n.js`, `i18n-v3.js`, `i18n-v4.js`, `i18n-v5.js` | texts in EN, ES, CA, FR, DE, IT, PT, LT, RU (layered; load order matters and is already set in `index.html`) |
| `testimonials.js` | the "Kind words" list (newest first) |
| `beforeafter.js` | empty list; the Before & after section stays hidden until real pairs are added |
| `ig.json` | Instagram snapshot used as fallback |
| `img/` | all photos (already resized, max 1400–1600 px) |
| `worker.js`, `wrangler.jsonc` | Cloudflare Worker (Option A only) |
| `ENQUIRY.md`, `INSTAGRAM.md` | how to enable the form email and the live Instagram feed |

## Updating content later

- **Prices/texts:** edit the strings in the `i18n*.js` files (one line per language) and the defaults in `index.html`, then redeploy. When a JS file changes, bump its `?v=` query in the `<script>` tags at the bottom of `index.html` so browsers fetch the new version.
- **Testimonials:** add an object at the top of `window.TESTIMONIALS` in `testimonials.js` (format documented in the file header). Photos go in `img/words/`.
- **Portfolio carousels:** add `<figure>` entries inside the relevant `.track` in `index.html` and drop the image in `img/work/<section>/`.

Language is chosen by `?lang=xx` in the URL, then the visitor's saved choice, then the browser language.

## Contact for technical questions

Eduardo Walneide · eduwalneide@gmail.com
