/* Nikoleta Makeup & Team — runtime for the pre-rendered multi-page site.
   Texts are rendered at build time per language; only behaviour lives here. */
(function(){
  document.documentElement.classList.add('js');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var T = function(k){ return (window.__T && window.__T[k]) || ''; };
  var LANG = document.documentElement.lang || 'en';

  /* ————— legacy single-page URLs: /#services → /services/ ————— */
  (function(){
    var map = window.__HASHMAP || {}; var h = (location.hash || '').slice(1);
    if(h && map[h] && !document.getElementById(h)) location.replace(map[h]);
  })();

  /* ————— language menu (links, pre-rendered) ————— */
  var langBox = document.getElementById('lang'), langBtn = document.getElementById('langBtn');
  if(langBtn){
    langBtn.addEventListener('click', function(e){ e.stopPropagation(); var open = langBox.classList.toggle('is-open'); this.setAttribute('aria-expanded', open ? 'true' : 'false'); });
    document.addEventListener('click', function(){ langBox.classList.remove('is-open'); });
    try{ localStorage.setItem('nk-lang', LANG); }catch(e){}
  }

  /* ————— kind words: reveal 12 more per click (cards are pre-rendered) ————— */
  (function(){
    var more = document.getElementById('wallMore'); if(!more) return;
    function hiddenCards(){ return Array.prototype.slice.call(document.querySelectorAll('#wall .wcard[hidden]')); }
    function upd(){ more.hidden = hiddenCards().length === 0; }
    more.addEventListener('click', function(){ hiddenCards().slice(0, 12).forEach(function(c){ c.removeAttribute('hidden'); }); upd(); });
    upd();
  })();

  /* ————— enquiry form → /api/enquiry, mailto fallback ————— */
  (function(){
    var form = document.getElementById('enquiry'); if(!form) return;
    var hint = document.getElementById('hint'), btn = form.querySelector('button[type=submit]'), busy = false;
    var g = function(id){ var el = document.getElementById(id); return el ? (el.value || '').trim() : ''; };
    function setHint(key){ hint.textContent = T(key); }
    function viaMail(){
      var name = g('name');
      var body = ['Hello Nikoleta,','','Date: '+g('date'),'How many people in total for hair and makeup: '+g('people'),'What time do we all need to be ready by: '+g('ready'),'Location of preparation: '+g('location'),'Hair and makeup trial: '+g('trial'),'Phone / email: '+g('email'),'',g('message'),'',name].join('\n');
      var subject = 'Wedding enquiry' + (g('date') ? ' · ' + g('date') : '') + (name ? ' · ' + name : '');
      window.location.href = 'mailto:info@nikoletamakeup.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      setHint('hint_done');
    }
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(busy) return;
      if(!g('name') && !g('email') && !g('message')){ setHint('v5_f_empty'); document.getElementById('name').focus(); return; }
      busy = true; btn.disabled = true; setHint('v5_f_sending');
      var payload = { name: g('name'), email: g('email'), date: g('date'), ready: g('ready'), people: g('people'), trial: g('trial'), location: g('location'), message: g('message'), company: g('company'), lang: LANG, page: location.href };
      fetch('/api/enquiry', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) })
        .then(function(r){ return r.json().then(function(j){ return { ok: r.ok && j.ok, j: j }; }); })
        .then(function(res){ busy = false; btn.disabled = false; if(res.ok){ form.reset(); setHint('v5_f_sent'); } else { viaMail(); } })
        .catch(function(){ busy = false; btn.disabled = false; viaMail(); });
    });
  })();

  /* ————— services accordion ————— */
  var rows = Array.prototype.slice.call(document.querySelectorAll('#rows .row'));
  rows.forEach(function(row){
    row.querySelector('.row-head').addEventListener('click', function(){
      var open = row.classList.contains('is-open');
      rows.forEach(function(r){ r.classList.remove('is-open'); r.querySelector('.row-head').setAttribute('aria-expanded','false'); });
      if(!open){ row.classList.add('is-open'); row.querySelector('.row-head').setAttribute('aria-expanded','true'); }
    });
  });

  /* ————— instagram: live /api/instagram (Worker) with /ig.json fallback ————— */
  (function(){
    var grid = document.getElementById('igGrid'), more = document.getElementById('igMore'); if(!grid) return;
    var PLAY = '<span class="play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>';
    var MULTI = '<svg class="mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="8" y="3" width="13" height="13" rx="2"/><path d="M4 8v10a3 3 0 0 0 3 3h10"/></svg>';
    var shown = 0, items = [], next = null, loading = false;
    function render(count){
      items.slice(shown, shown+count).forEach(function(it){
        var a = document.createElement('a'); a.href = it.href; a.target = '_blank'; a.rel = 'noopener';
        a.innerHTML = '<img alt="" loading="lazy">' + (it.type==='video' ? PLAY : (it.type==='carousel' ? MULTI : '')) + '<span class="igcap"></span>';
        a.querySelector('img').src = it.src.charAt(0) === '/' || /^https?:/.test(it.src) ? it.src : '/' + it.src;
        a.querySelector('.igcap').textContent = it.alt || ''; a.setAttribute('aria-label', it.alt || 'Instagram post');
        grid.appendChild(a);
      });
      shown = Math.min(items.length, shown+count); more.hidden = shown >= items.length && !next;
    }
    function apply(data){ items = items.concat(data.items || []); next = data.next || null; }
    function load(url){ return fetch(url, { cache:'no-store' }).then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); }); }
    load('/api/instagram').catch(function(){ return load('/ig.json'); }).then(function(data){ apply(data); render(8); }).catch(function(){ grid.parentNode.hidden = true; });
    more.addEventListener('click', function(){
      if(shown < items.length){ render(4); return; }
      if(next && !loading){ loading = true; more.disabled = true;
        load('/api/instagram?after=' + encodeURIComponent(next)).then(function(d){ apply(d); render(4); }).catch(function(){ next = null; more.hidden = true; }).then(function(){ loading = false; more.disabled = false; }); }
    });
  })();

  /* ————— carousels: hover the arrow to glide, click to step ————— */
  document.querySelectorAll('.car').forEach(function(c){
    var t = c.querySelector('.track'), prev = c.querySelector('.prev'), next = c.querySelector('.next'), raf = null;
    function step(){ var f = t.querySelector('figure'); return f ? f.getBoundingClientRect().width + 12 : 300; }
    function atEnd(){ return t.scrollLeft + t.clientWidth >= t.scrollWidth - 2; }
    function upd(){ prev.hidden = t.scrollLeft <= 2; next.hidden = atEnd(); }
    function stop(){ if(raf){ cancelAnimationFrame(raf); raf = null; } }
    function glide(dir){
      stop();
      var last = performance.now(), SPEED = 150;
      (function run(now){
        var dt = Math.min(now - last, 250); last = now;
        t.scrollLeft += dir * SPEED * dt / 1000; upd();
        if((dir > 0 && atEnd()) || (dir < 0 && t.scrollLeft <= 0)){ raf = null; return; }
        raf = requestAnimationFrame(run);
      })(last);
    }
    [[prev,-1],[next,1]].forEach(function(p){
      var b = p[0], d = p[1];
      b.addEventListener('mouseenter', function(){ if(matchMedia('(hover:hover)').matches) glide(d); });
      b.addEventListener('mouseleave', stop);
      b.addEventListener('click', function(){ stop(); t.scrollBy({ left: d * step(), behavior: 'smooth' }); });
    });
    t.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  });

  /* ————— mobile menu (hamburger) ————— */
  (function(){
    var hdr = document.querySelector('header'), btn = document.getElementById('burger'), nav = document.getElementById('mainNav'); if(!btn) return;
    function setHdr(){ document.documentElement.style.setProperty('--hdr', hdr.offsetHeight + 'px'); }
    function close(){ hdr.classList.remove('is-open'); document.body.classList.remove('nav-open'); btn.setAttribute('aria-expanded','false'); }
    btn.addEventListener('click', function(e){
      e.stopPropagation(); setHdr();
      var open = hdr.classList.toggle('is-open');
      document.body.classList.toggle('nav-open', open); btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', close); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });
    window.addEventListener('resize', function(){ setHdr(); if(window.innerWidth > 900) close(); });
    setHdr();
  })();

  /* ————— smooth anchors (same page only) ————— */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href'); if(id.length < 2) return;
      var el = document.querySelector(id); if(!el) return;
      e.preventDefault();
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: reduce ? 'auto' : 'smooth' });
    });
  });
  document.querySelectorAll('.cats a').forEach(function(a){ a.addEventListener('click', function(){ document.querySelectorAll('.cats a').forEach(function(x){ x.classList.remove('is-on'); }); a.classList.add('is-on'); }); });

  /* ————— gentle reveals ————— */
  var els = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(entries){ entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } }); }, { rootMargin:'0px 0px -6% 0px', threshold:.05 });
    els.forEach(function(el, i){ el.style.transitionDelay = Math.min(i % 4, 3) * 70 + 'ms'; io.observe(el); });
    setTimeout(function(){ els.forEach(function(el){ el.classList.add('in'); }); }, 4000);
  } else { els.forEach(function(el){ el.classList.add('in'); }); }
})();
