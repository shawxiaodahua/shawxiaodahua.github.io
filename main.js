/* shawxiaodahua.github.io — shared behaviour, no dependencies. */
(function () {
  'use strict';

  function initBrandMark() {
    var host = document.querySelector('[data-brand-mark]');
    if (!host) return;
    var name = (host.getAttribute('data-brand-mark') || '').trim();
    if (!name) return;
    var parts = name.split(/\s+/);
    host.textContent = ((parts[0] || '')[0] || '').toUpperCase() + ((parts[1] || '')[0] || '').toUpperCase();
  }

  function initRailNav() {
    // Fragment links are left to the browser. CSS already applies
    // scroll-behavior: smooth, and reduced motion is honoured in CSS too,
    // so overriding here would only cost us focus movement and a shareable
    // URL. The only job left is marking the clicked item current.
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('.rail-nav a[href^="#"]') : null;
      if (!a) return;
      if (!document.querySelector(a.getAttribute('href'))) return;
      document.querySelectorAll('.rail-nav a[href^="#"]').forEach(function (other) {
        var on = other === a;
        other.classList.toggle('is-active', on);
        if (on) other.setAttribute('aria-current', 'true');
        else other.removeAttribute('aria-current');
      });
    });
  }

  function initSectionSpy() {
    var links = [].slice.call(document.querySelectorAll('.rail-nav a[href^="#"]'));
    if (!links.length || !('IntersectionObserver' in window)) return;
    var byId = {};
    var targets = links.map(function (a) {
      var id = a.getAttribute('href').slice(1);
      byId[id] = a;
      return document.getElementById(id);
    }).filter(Boolean);
    if (!targets.length) return;

    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });

      // Pick the first intersecting target in document order. Ranking by
      // intersectionRatio would compare a fraction of each element's own
      // area, so a tall section and a short one are not on the same scale.
      var best = null;
      for (var i = 0; i < targets.length; i++) {
        if (visible[targets[i].id]) { best = targets[i].id; break; }
      }
      // At the very bottom no target may intersect the band; keep the last
      // section marked rather than dropping the indicator entirely.
      if (!best && window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
        best = targets[targets.length - 1].id;
      }
      if (!best) return;
      links.forEach(function (a) {
        var on = byId[best] === a;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    }, { rootMargin: '-20% 0px -55% 0px', threshold: 0 });

    targets.forEach(function (t) { io.observe(t); });
  }

  function initWeChatCopy() {
    var btns = [].slice.call(document.querySelectorAll('[data-copy-text]'));
    if (!btns.length) return;

    function legacyCopy(text) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      try {
        ta.select();
        return document.execCommand('copy');
      } catch (e) {
        return false;
      } finally {
        if (ta.parentNode) ta.parentNode.removeChild(ta);
      }
    }

    btns.forEach(function (btn) {
      var label = btn.querySelector('.label');
      var status = btn.querySelector('[data-copy-status]');
      var original = label ? label.textContent : '';
      var timer;
      function flash(text) {
        if (label) label.textContent = text;
        // Mirror the change into a live region: the visible label swap is
        // invisible to a screen reader, which would otherwise announce nothing.
        if (status) status.textContent = text;
        var failed = text !== 'Copied';
        btn.classList.toggle('is-failed', failed);
        btn.classList.toggle('is-copied', !failed);
        clearTimeout(timer);
        timer = setTimeout(function () {
          if (label) label.textContent = original;
          if (status) status.textContent = '';
          btn.classList.remove('is-copied');
          btn.classList.remove('is-failed');
        }, 1600);
      }
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-copy-text') || '';
        var done = (navigator.clipboard && window.isSecureContext)
          ? navigator.clipboard.writeText(text)
          : legacyCopy(text);
        Promise.resolve(done).then(
          function (v) { flash(v === false ? 'Copy failed' : 'Copied'); },
          function () { flash('Copy failed'); }
        );
      });
    });
  }

  function initMarkdownReader() {
    var section = document.getElementById('writing');
    if (!section) return;
    var list = document.getElementById('post-list');
    var reader = document.getElementById('post-reader');
    var titleEl = document.getElementById('reader-title');
    var metaEl = document.getElementById('reader-meta');
    var statusEl = document.getElementById('reader-status');
    var bodyEl = document.getElementById('reader-body');
    if (!list || !reader || !bodyEl) {
      var missing = [['#post-list', list], ['#post-reader', reader], ['#reader-body', bodyEl]]
        .filter(function (p) { return !p[1]; })
        .map(function (p) { return p[0]; });
      if (window.console) console.warn('main.js: markdown reader disabled, missing ' + missing.join(', '));
      return;
    }

    function setStatus(msg) {
      if (!statusEl) return;
      statusEl.textContent = msg || '';
      statusEl.style.display = msg ? 'block' : 'none';
    }

    function renderMarkdown(text) {
      if (typeof marked === 'undefined') {
        var pre = document.createElement('pre');
        pre.textContent = text;
        return pre;
      }
      marked.setOptions({ gfm: true, breaks: false });
      var host = document.createElement('div');
      host.innerHTML = marked.parse(text);
      return host;
    }

    var seq = 0;

    function openPost(src, meta, title) {
      var mine = ++seq;
      section.classList.add('is-reading');
      list.style.display = 'none';
      reader.style.display = 'block';
      bodyEl.innerHTML = '';
      if (titleEl) titleEl.textContent = title || '';
      if (metaEl) metaEl.textContent = meta || '';
      window.scrollTo(0, 0);
      setStatus('Loading...');

      if (location.protocol === 'file:') {
        setStatus('Cannot preview over file://. Run "python3 -m http.server" in the project root and open http://localhost:8000/writing.html. The Markdown parser is also blocked on file:// origins.');
        return;
      }

      var url = new URL(src, location.href).href;
      fetch(url, { cache: 'no-cache' })
        .then(function (r) {
          if (r.status === 404) throw Object.assign(new Error('404'), { notFound: true });
          if (!r.ok) throw new Error(String(r.status));
          return r.text();
        })
        .then(function (raw) {
          if (mine !== seq) return;
          bodyEl.innerHTML = '';
          bodyEl.appendChild(renderMarkdown(raw));
          setStatus('');
        })
        .catch(function (err) {
          if (mine !== seq) return;
          bodyEl.innerHTML = '';
          if (err && err.notFound) {
            setStatus('This post has not been pushed to GitHub yet. Expected at: ' + url);
          } else {
            setStatus('Could not load this post (HTTP ' + (err && err.message) + ').');
          }
        });
    }

    function closePost() {
      section.classList.remove('is-reading');
      list.style.display = '';
      reader.style.display = 'none';
      bodyEl.innerHTML = '';
      setStatus('');
    }

    document.querySelectorAll('.post-link').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        openPost(a.getAttribute('data-md'), a.getAttribute('data-meta') || '', a.getAttribute('data-title') || '');
      });
    });

    var backs = document.querySelectorAll('.reader-back, #reader-back');
    if (!backs.length && window.console) {
      console.warn('main.js: markdown reader has no way back, missing .reader-back or #reader-back');
    }
    [].slice.call(backs).forEach(function (b) { b.addEventListener('click', closePost); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePost(); });
  }

  function boot() {
    [['initBrandMark', initBrandMark],
     ['initRailNav', initRailNav],
     ['initSectionSpy', initSectionSpy],
     ['initWeChatCopy', initWeChatCopy],
     ['initMarkdownReader', initMarkdownReader]].forEach(function (p) {
      try { p[1](); } catch (e) { if (window.console) console.warn('main.js: ' + p[0] + ' failed', e); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
