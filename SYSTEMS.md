# nikoletamakeup.com — how the three dynamic systems work

The site is a static page (`index.html` + a few JS files + images). Three parts are "alive" and
need a small amount of care. All three are designed to **degrade gracefully**: if the server
piece is missing, the page still works, just with a simpler behaviour.

| System | Where it lives | Works without the Worker? |
|---|---|---|
| 1. Contact form → email | `worker.js` route `POST /api/enquiry` | Yes, falls back to opening the visitor's email app |
| 2. Instagram feed | `worker.js` route `GET /api/instagram` + `ig.json` | Yes, shows the saved snapshot in `ig.json` |
| 3. Testimonials ("Kind words") | `testimonials.js` + `img/words/` | Yes, it is a plain data file |

The Worker is Cloudflare Workers. `wrangler.jsonc` is its config; `worker.js` is its code.
If you host the site on Cloudflare Workers, systems 1 and 2 run at full power. If you host it
on any other static hosting, skip `worker.js`/`wrangler.jsonc` and systems 1 and 2 run in
fallback mode. Nothing else changes.

---

## 1. Contact form → info@nikoletamakeup.com

**What happens:** the form in the Contact section sends a JSON `POST` to `/api/enquiry`.
The Worker (a) stores a copy in Cloudflare KV (`enquiry:<timestamp>-<ref>`, kept 90 days, so no
enquiry is ever lost), (b) sends an email to `ENQUIRY_TO` through the Resend API, with
`reply-to` set to the bride's email, (c) silently drops bot submissions that fill the hidden
`company` field. If the email cannot be sent (no API key, provider down) the page falls back to
opening the visitor's email app with everything pre-filled.

**One-time setup (free):**
1. Create an account at https://resend.com. Register it with **info@nikoletamakeup.com**:
   until the domain is verified, Resend only delivers mail sent from `onboarding@resend.dev`
   to the account owner's own address.
2. Resend → API Keys → Create → copy the key (starts with `re_`).
3. In the project folder: `npx wrangler secret put RESEND_API_KEY` and paste the key.
   Takes effect immediately, no redeploy needed.
4. Test:
   ```bash
   curl -s -X POST https://<your-worker-url>/api/enquiry -H 'content-type: application/json' \
     -d '{"name":"Test","email":"test@example.com","date":"2027-06-12","message":"form test"}'
   ```
   `{"ok":true,...}` = email delivered. `{"ok":false,"error":"not-configured"}` = key missing.

**Recommended later:** Resend → Domains → add `nikoletamakeup.com` and create the DKIM/SPF
records it gives you in Cloudflare DNS (they do not touch the MX records, so Google Workspace mail
is unaffected). Then change `ENQUIRY_FROM` in `wrangler.jsonc` to e.g.
`Nikoleta Makeup website <site@nikoletamakeup.com>` and run `npx wrangler deploy`.

**Reading stored enquiries:**
```bash
npx wrangler kv key list --remote --namespace-id <IG_KV id from wrangler.jsonc> --prefix enquiry:
npx wrangler kv key get  --remote --namespace-id <id> "enquiry:<key>"
```

## 2. Instagram feed ("Latest on Instagram")

**What happens:** the page requests `/api/instagram`. With a valid token the Worker calls the
Instagram Graph API (`graph.instagram.com/me/media`), caches the result for 1 hour and returns the
latest posts; a cron (1st and 15th of each month) refreshes the long-lived token automatically and
stores it in KV. Without a token, or if Instagram fails, the route returns the snapshot in
`ig.json` (12 posts captured in October 2026, thumbnails in `img/ig/`). The response header
`x-source: live|snapshot` tells you which one you are seeing.

**One-time setup (free, needs Nikoleta's Instagram login):**
1. Nikoleta's Instagram must be a **professional account (Creator or Business)**. Instagram app →
   Settings → Account type → switch to professional. Free; the profile does not change.
2. At https://developers.facebook.com create an app → use case **"Instagram"** (Instagram API with
   Instagram Login) → add the Instagram product.
3. Instagram → *API setup with Instagram login*: add her account as a tester (she accepts the invite
   in the app under Settings → Website and apps → Tester invites), then click **Generate token**
   while logged in as her. Permission needed: `instagram_business_basic`.
4. Exchange the short-lived token for a long-lived one (60 days, auto-renewed afterwards):
   ```bash
   curl -s "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=APP_SECRET&access_token=SHORT_TOKEN"
   ```
5. Store it: `npx wrangler secret put IG_TOKEN` (paste the long-lived token), then `npx wrangler deploy`.
6. Check: `curl -sI https://<your-worker-url>/api/instagram | grep x-source` must say `live`.

**If you prefer no API at all:** refresh the snapshot by hand now and then. Replace the 12 images in
`img/ig/` (540×720, portrait 3:4) and update the entries in `ig.json` (href, src, type, alt, date).

## 3. Testimonials ("Kind words")

**What happens:** `testimonials.js` is a plain list; the page renders it newest-first, 12 cards at a
time with a "Show more" button. No server involved.

**Adding one:** insert an object at the **top** of `window.TESTIMONIALS`:
```js
{y:2026, src:"ig", who:"Bride", text:"Original text, in the original language.", img:"img/words/name.jpg"},
```
- `src`: `ig` Instagram message/comment, `wa` WhatsApp, `mail` email, `google` Google review,
  `card` handwritten card, `press` article. The label is translated automatically.
- `who`: first name, handle or role ("Bride", "Mother of the bride"). No surnames, emails or phones.
- `img` is optional. Photos go in `img/words/`, full image uncropped, max ~1400 px, JPEG quality ~84.
- After editing, bump the version in `index.html` so browsers reload the file:
  `<script src="testimonials.js?v=YYYYMMDD">`.

**Weekly update from Instagram (current practice):** the source of new testimonials is the
"TESTIMONIAL" highlight on @nikoletamakeup. The Instagram API does not expose highlights, so there is
no way to automate this server-side. Today a weekly routine on Eduardo's computer reads the highlight
through a logged-in browser, transcribes the new stories and publishes them. If the site moves to
your hosting, either (a) keep sending the deploys to Eduardo and he pushes the updated
`testimonials.js` to the repository, or (b) do it by hand with the format above whenever Nikoleta
adds a new story to the highlight.

---

## Everything else (texts, prices, photos)

- **Texts and prices** live in the `i18n*.js` files, one line per language (EN, ES, CA, FR, DE,
  IT, PT, LT, RU); `index.html` holds the English defaults. Edit both, then bump the `?v=` on the
  changed script tag at the bottom of `index.html`.
- **Portfolio carousels** are `<figure>` lists inside `.track` containers in `index.html`; images
  live in `img/work/makeup/`, `img/work/hair/`, `img/work/ind/`. Add a figure, drop the image, done.
- **Deploy** (Cloudflare): `npx wrangler deploy` from the project folder. Static hosting: upload the
  files; `index.html` must be at the web root.

Technical contact: Eduardo Walneide · eduwalneide@gmail.com
