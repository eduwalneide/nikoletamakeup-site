/* Nikoleta v3 — static site + /api/instagram (Instagram Graph API with Instagram Login).
   Token: KV "ig_token" (refreshed on a cron) or the IG_TOKEN secret as the seed.
   Without a token, or if the API fails, the route serves the snapshot in ig.json. */

const GRAPH = 'https://graph.instagram.com';
const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
const TTL = 3600; // seconds of edge cache for the feed

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/instagram') return instagram(request, env, ctx, url);
    if (url.pathname === '/api/enquiry') return enquiry(request, env, ctx);
    return env.ASSETS.fetch(request);
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(refreshToken(env));
  }
};

async function getToken(env) {
  try { const t = await env.IG_KV.get('ig_token'); if (t) return t; } catch (e) {}
  return env.IG_TOKEN || null;
}

async function refreshToken(env) {
  const token = await getToken(env);
  if (!token) return;
  const r = await fetch(`${GRAPH}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`);
  if (!r.ok) return;
  const j = await r.json();
  if (j.access_token) await env.IG_KV.put('ig_token', j.access_token, { metadata: { refreshed: new Date().toISOString(), expires_in: j.expires_in } });
}

async function snapshot(request, env, reason) {
  const res = await env.ASSETS.fetch(new Request(new URL('/ig.json', request.url), { method: 'GET' }));
  const data = res.ok ? await res.json() : { items: [] };
  return json({ source: 'snapshot', reason, profile: { username: data.account, avatar: data.avatar, posts: data.posts }, items: data.items || [], next: null }, 300);
}

async function instagram(request, env, ctx, url) {
  const token = await getToken(env);
  if (!token) return snapshot(request, env, 'no-token');

  const after = url.searchParams.get('after') || '';
  const cacheKey = new Request(`${url.origin}/api/instagram?after=${encodeURIComponent(after)}`);
  const cache = caches.default;
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  try {
    const q = new URLSearchParams({ fields: FIELDS, limit: '12', access_token: token });
    if (after) q.set('after', after);
    const [mediaRes, profRes] = await Promise.all([
      fetch(`${GRAPH}/me/media?${q}`),
      after ? Promise.resolve(null) : fetch(`${GRAPH}/me?fields=username,profile_picture_url,media_count&access_token=${encodeURIComponent(token)}`)
    ]);
    if (!mediaRes.ok) throw new Error('media ' + mediaRes.status);
    const media = await mediaRes.json();
    const prof = profRes && profRes.ok ? await profRes.json() : null;
    const items = (media.data || []).map(m => ({
      href: m.permalink,
      src: m.media_type === 'VIDEO' ? (m.thumbnail_url || m.media_url) : m.media_url,
      type: m.media_type === 'VIDEO' ? 'video' : (m.media_type === 'CAROUSEL_ALBUM' ? 'carousel' : 'image'),
      alt: (m.caption || '').slice(0, 220),
      date: m.timestamp
    }));
    const body = {
      source: 'live',
      profile: prof ? { username: prof.username, avatar: prof.profile_picture_url, posts: prof.media_count } : undefined,
      items,
      next: media.paging && media.paging.cursors ? media.paging.cursors.after : null
    };
    const res = json(body, TTL);
    ctx.waitUntil(cache.put(cacheKey, res.clone()));
    return res;
  } catch (e) {
    return snapshot(request, env, 'api-error');
  }
}

/* ————— enquiry form → email to ENQUIRY_TO (Resend) + copy in KV ————— */
const ENQUIRY_FIELDS = ['name', 'email', 'date', 'ready', 'people', 'trial', 'location', 'message', 'lang', 'page'];

async function enquiry(request, env, ctx) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors() });
  if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 0, 405);
  let data;
  try { data = await request.json(); } catch (e) { return json({ ok: false, error: 'bad-json' }, 0, 400); }
  if (data.company) return json({ ok: true, spam: true }, 0); // honeypot: silently accept
  const d = {};
  for (const k of ENQUIRY_FIELDS) d[k] = String(data[k] || '').slice(0, k === 'message' ? 4000 : 300).trim();
  if (!d.name && !d.email && !d.message) return json({ ok: false, error: 'empty' }, 0, 400);

  const id = new Date().toISOString().replace(/[:.]/g, '-') + '-' + Math.random().toString(36).slice(2, 8);
  const to = env.ENQUIRY_TO || 'info@nikoletamakeup.com';
  const subject = 'Wedding enquiry' + (d.date ? ' · ' + d.date : '') + (d.name ? ' · ' + d.name : '');
  const lines = [
    ['Name', d.name], ['Email / phone', d.email], ['Wedding date', d.date], ['Ready-by time', d.ready],
    ['People for hair & makeup', d.people], ['Trial', d.trial], ['Location of preparation', d.location],
    ['Message', d.message], ['Language', d.lang], ['Page', d.page], ['Received', new Date().toISOString()], ['Ref', id]
  ];
  const text = lines.map(([k, v]) => k + ': ' + (v || '—')).join('\n');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const html = '<div style="font:15px/1.6 -apple-system,Helvetica,Arial,sans-serif;color:#0e0e0e"><h2 style="font-weight:600;margin:0 0 16px">' + esc(subject) + '</h2><table cellpadding="6" style="border-collapse:collapse">' +
    lines.map(([k, v]) => '<tr><td style="color:#777;vertical-align:top;white-space:nowrap">' + esc(k) + '</td><td style="white-space:pre-wrap">' + esc(v || '—') + '</td></tr>').join('') +
    '</table></div>';

  // 1) always keep a copy in KV (90 days), so nothing is lost even if email fails
  let kvError = null;
  try { await env.IG_KV.put('enquiry:' + id, JSON.stringify({ ...d, received: new Date().toISOString() }), { expirationTtl: 60 * 60 * 24 * 90 }); } catch (e) { kvError = String(e && e.message || e); }

  // 2) send the email
  if (!env.RESEND_API_KEY) return json({ ok: false, error: 'not-configured', ref: id, kvError }, 0, 503);
  const replyTo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email) ? d.email : undefined;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'authorization': 'Bearer ' + env.RESEND_API_KEY, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: env.ENQUIRY_FROM || 'Nikoleta Makeup website <onboarding@resend.dev>',
        to: [to], subject, text, html, reply_to: replyTo
      })
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return json({ ok: false, error: 'send-failed', detail: j && j.message, ref: id }, 0, 502);
    return json({ ok: true, ref: id, mail: j.id }, 0);
  } catch (e) {
    return json({ ok: false, error: 'send-error', ref: id }, 0, 502);
  }
}

function cors() {
  return { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type' };
}

function json(obj, maxAge, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': maxAge ? `public, max-age=${maxAge}` : 'no-store',
      'x-source': obj.source || 'unknown',
      ...cors()
    }
  });
}
