/* Visitor analytics for shawxiaodahua.github.io.
   Static-site friendly: counterapi.dev stores aggregate totals; ipwho.is supplies
   country-level geolocation. No cookies, names, or precise locations are stored. */
(function () {
  'use strict';

  var API_ROOT = 'https://api.counterapi.dev/v1/shawxiaodahua-github-io-2026';
  var TOTAL_KEY = 'visits-total';
  var GEO_URL = 'https://ipwho.is/?fields=success,country,country_code';
  var TRACK_TTL = 12 * 60 * 60 * 1000;
  var CACHE_TTL = 10 * 60 * 1000;
  var GEO_TTL = 24 * 60 * 60 * 1000;
  var STORE_PREFIX = 'cv-visitors-v1:';

  var COUNTRIES = {
    CN: { en: 'China', zh: '中国', lat: 35.0, lon: 104.0 },
    HK: { en: 'Hong Kong', zh: '中国香港', lat: 22.3, lon: 114.2 },
    MO: { en: 'Macao', zh: '中国澳门', lat: 22.2, lon: 113.5 },
    TW: { en: 'Taiwan', zh: '中国台湾', lat: 23.7, lon: 121.0 },
    SG: { en: 'Singapore', zh: '新加坡', lat: 1.35, lon: 103.8 },
    JP: { en: 'Japan', zh: '日本', lat: 36.2, lon: 138.2 },
    KR: { en: 'South Korea', zh: '韩国', lat: 36.5, lon: 127.8 },
    VN: { en: 'Vietnam', zh: '越南', lat: 16.0, lon: 108.0 },
    TH: { en: 'Thailand', zh: '泰国', lat: 15.0, lon: 101.0 },
    MY: { en: 'Malaysia', zh: '马来西亚', lat: 4.2, lon: 101.9 },
    ID: { en: 'Indonesia', zh: '印度尼西亚', lat: -2.0, lon: 118.0 },
    PH: { en: 'Philippines', zh: '菲律宾', lat: 12.9, lon: 121.8 },
    IN: { en: 'India', zh: '印度', lat: 22.0, lon: 79.0 },
    PK: { en: 'Pakistan', zh: '巴基斯坦', lat: 30.0, lon: 70.0 },
    BD: { en: 'Bangladesh', zh: '孟加拉国', lat: 23.7, lon: 90.4 },
    LK: { en: 'Sri Lanka', zh: '斯里兰卡', lat: 7.8, lon: 80.7 },
    NP: { en: 'Nepal', zh: '尼泊尔', lat: 28.4, lon: 84.1 },
    US: { en: 'United States', zh: '美国', lat: 39.0, lon: -98.0 },
    CA: { en: 'Canada', zh: '加拿大', lat: 56.0, lon: -106.0 },
    MX: { en: 'Mexico', zh: '墨西哥', lat: 23.0, lon: -102.0 },
    BR: { en: 'Brazil', zh: '巴西', lat: -10.0, lon: -52.0 },
    AR: { en: 'Argentina', zh: '阿根廷', lat: -34.0, lon: -64.0 },
    CL: { en: 'Chile', zh: '智利', lat: -33.0, lon: -71.0 },
    CO: { en: 'Colombia', zh: '哥伦比亚', lat: 4.0, lon: -73.0 },
    PE: { en: 'Peru', zh: '秘鲁', lat: -10.0, lon: -75.0 },
    GB: { en: 'United Kingdom', zh: '英国', lat: 54.0, lon: -2.0 },
    IE: { en: 'Ireland', zh: '爱尔兰', lat: 53.0, lon: -8.0 },
    DE: { en: 'Germany', zh: '德国', lat: 51.0, lon: 10.0 },
    FR: { en: 'France', zh: '法国', lat: 46.2, lon: 2.2 },
    NL: { en: 'Netherlands', zh: '荷兰', lat: 52.1, lon: 5.3 },
    BE: { en: 'Belgium', zh: '比利时', lat: 50.5, lon: 4.5 },
    CH: { en: 'Switzerland', zh: '瑞士', lat: 46.8, lon: 8.2 },
    AT: { en: 'Austria', zh: '奥地利', lat: 47.5, lon: 14.5 },
    SE: { en: 'Sweden', zh: '瑞典', lat: 60.0, lon: 15.0 },
    NO: { en: 'Norway', zh: '挪威', lat: 61.0, lon: 9.0 },
    DK: { en: 'Denmark', zh: '丹麦', lat: 56.0, lon: 10.0 },
    FI: { en: 'Finland', zh: '芬兰', lat: 64.0, lon: 26.0 },
    ES: { en: 'Spain', zh: '西班牙', lat: 40.0, lon: -4.0 },
    PT: { en: 'Portugal', zh: '葡萄牙', lat: 39.5, lon: -8.0 },
    IT: { en: 'Italy', zh: '意大利', lat: 42.8, lon: 12.8 },
    PL: { en: 'Poland', zh: '波兰', lat: 52.0, lon: 19.0 },
    CZ: { en: 'Czechia', zh: '捷克', lat: 49.8, lon: 15.5 },
    RO: { en: 'Romania', zh: '罗马尼亚', lat: 45.9, lon: 25.0 },
    GR: { en: 'Greece', zh: '希腊', lat: 39.0, lon: 22.0 },
    RU: { en: 'Russia', zh: '俄罗斯', lat: 61.0, lon: 105.0 },
    UA: { en: 'Ukraine', zh: '乌克兰', lat: 49.0, lon: 32.0 },
    TR: { en: 'Türkiye', zh: '土耳其', lat: 39.0, lon: 35.0 },
    IL: { en: 'Israel', zh: '以色列', lat: 31.5, lon: 34.8 },
    AE: { en: 'United Arab Emirates', zh: '阿联酋', lat: 24.0, lon: 54.0 },
    SA: { en: 'Saudi Arabia', zh: '沙特阿拉伯', lat: 24.0, lon: 45.0 },
    ZA: { en: 'South Africa', zh: '南非', lat: -29.0, lon: 24.0 },
    EG: { en: 'Egypt', zh: '埃及', lat: 27.0, lon: 30.0 },
    NG: { en: 'Nigeria', zh: '尼日利亚', lat: 9.0, lon: 8.0 },
    KE: { en: 'Kenya', zh: '肯尼亚', lat: 0.0, lon: 37.0 },
    MA: { en: 'Morocco', zh: '摩洛哥', lat: 32.0, lon: -6.0 },
    AU: { en: 'Australia', zh: '澳大利亚', lat: -25.0, lon: 134.0 },
    NZ: { en: 'New Zealand', zh: '新西兰', lat: -41.0, lon: 174.0 }
  };

  var COUNTRY_CODES = Object.keys(COUNTRIES);
  var MAP_COLS = 60;
  var MAP_ROWS = 30;

  /* A compact, hand-tuned land mask rendered as a dot grid. It keeps the
     widget self-contained while still reading clearly as a world map. */
  var LAND_MASK = [
    '                                                            ',
    '                                                            ',
    '            ##             ####                              ',
    '        ##########       ########                           ',
    '      ###############    #########                          ',
    '     #################    ########    #############         ',
    '    ###################    ######   ################        ',
    '    ###################     ####   ##################       ',
    '     #################      ##    ###################       ',
    '      ##############             ####################       ',
    '       ############             #####################       ',
    '        #########              #####################        ',
    '         #######         ############  ##############       ',
    '          #####          #############  ############        ',
    '           ###           ############# #############        ',
    '            ##           ############   ###########         ',
    '             ###         ############    #########          ',
    '             #####       ###########      ######            ',
    '             ######      ##########        ####             ',
    '              #####      #########        ######            ',
    '              ######     ########         ########          ',
    '               #####     ########        ########           ',
    '                ###      #######          ######            ',
    '                 ##      ######            ###              ',
    '                  #      ######                             ',
    '                           ###                              ',
    '                                                            ',
    '                                                            ',
    '                                                            ',
    '                                                            '
  ];

  var state = null;
  var loading = false;
  var mapBuilt = false;
  var trackingPromise = Promise.resolve();
  var geoPromise = null;

  function pick(en, zh) {
    return document.body.classList.contains('lang-zh') ? zh : en;
  }

  function readStore(key) {
    try { return window.localStorage.getItem(STORE_PREFIX + key); } catch (e) { return null; }
  }

  function writeStore(key, value) {
    try { window.localStorage.setItem(STORE_PREFIX + key, value); } catch (e) { /* private mode */ }
  }

  function removeStore(key) {
    try { window.localStorage.removeItem(STORE_PREFIX + key); } catch (e) { /* private mode */ }
  }

  function readJSONStore(key) {
    var raw = readStore(key);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function writeJSONStore(key, value) {
    try { writeStore(key, JSON.stringify(value)); } catch (e) { /* private mode */ }
  }

  function trackingAllowed() {
    if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return false;
    if (navigator.globalPrivacyControl === true) return false;
    return window.location.protocol === 'http:' || window.location.protocol === 'https:';
  }

  function fetchJSON(url, timeout) {
    return new Promise(function (resolve, reject) {
      var settled = false;
      var controller = typeof AbortController === 'function' ? new AbortController() : null;
      var timer = setTimeout(function () {
        if (controller) controller.abort();
        if (!settled) { settled = true; reject(new Error('timeout')); }
      }, timeout || 7000);

      fetch(url, {
        cache: 'no-store',
        mode: 'cors',
        signal: controller ? controller.signal : undefined
      }).then(function (response) {
        if (!response.ok) {
          var httpError = new Error('HTTP ' + response.status);
          httpError.status = response.status;
          throw httpError;
        }
        return response.json();
      }).then(function (data) {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(data);
      }).catch(function (error) {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(error);
      });
    });
  }

  function countFrom(data) {
    if (!data || typeof data !== 'object') return 0;
    var n = data.count;
    if (n === undefined) n = data.value;
    if (n === undefined) n = data.hits;
    n = Number(n);
    return isFinite(n) && n > 0 ? Math.floor(n) : 0;
  }

  function counterGet(key) {
    return fetchJSON(API_ROOT + '/' + encodeURIComponent(key), 7000)
      .then(countFrom)
      .catch(function (error) { return error && error.status === 404 ? 0 : null; });
  }

  function counterHit(key) {
    return fetchJSON(API_ROOT + '/' + encodeURIComponent(key) + '/up', 7000)
      .then(countFrom)
      .catch(function () { return null; });
  }

  function getGeo() {
    if (!geoPromise) geoPromise = loadGeo();
    return geoPromise;
  }

  function loadGeo() {
    if (!trackingAllowed()) return Promise.resolve(null);
    var cached = readJSONStore('geo');
    if (cached && cached.ts && Date.now() - cached.ts < GEO_TTL && cached.code) {
      return Promise.resolve({ country: cached.country, country_code: cached.code });
    }
    return fetchJSON(GEO_URL, 7000).then(function (data) {
      if (!data || data.success === false || !data.country_code) return null;
      var geo = {
        country: String(data.country || data.country_code),
        country_code: String(data.country_code).toUpperCase()
      };
      writeJSONStore('geo', { ts: Date.now(), country: geo.country, code: geo.country_code });
      return geo;
    }).catch(function () { return null; });
  }

  function trackVisit() {
    if (!trackingAllowed()) return Promise.resolve();
    var last = Number(readStore('visit-stamp') || 0);
    if (last && Date.now() - last < TRACK_TTL) return Promise.resolve();

    return getGeo().then(function (geo) {
      var jobs = [counterHit(TOTAL_KEY)];
      if (geo && /^[A-Z]{2}$/.test(geo.country_code)) {
        jobs.push(counterHit('country-' + geo.country_code.toLowerCase()));
      }
      return Promise.all(jobs).then(function (results) {
        var succeeded = results.some(function (value) { return value !== null; });
        if (succeeded) writeStore('visit-stamp', String(Date.now()));
      });
    }).catch(function () { /* Analytics must never break the page. */ });
  }

  function pool(items, limit, worker) {
    var results = new Array(items.length);
    var cursor = 0;
    var runners = [];
    var size = Math.min(limit, items.length);

    for (var i = 0; i < size; i++) {
      runners.push((function run() {
        var index = cursor++;
        if (index >= items.length) return Promise.resolve();
        return Promise.resolve(worker(items[index], index)).then(function (value) {
          results[index] = value;
          return run();
        });
      })());
    }
    return Promise.all(runners).then(function () { return results; });
  }

  function fetchCountryCounts() {
    return pool(COUNTRY_CODES, 6, function (code) {
      return counterGet('country-' + code.toLowerCase()).then(function (count) {
        return { code: code, count: count || 0 };
      });
    });
  }

  function readStatsCache() {
    var cached = readJSONStore('stats');
    if (!cached || !cached.ts || !Array.isArray(cached.countries)) return null;
    if (Date.now() - cached.ts > CACHE_TTL) return null;
    return cached;
  }

  function writeStatsCache(stats) {
    writeJSONStore('stats', {
      ts: Date.now(),
      total: stats.total,
      countries: stats.countries,
      geo: stats.geo,
      updated: stats.updated
    });
  }

  function setStatus(message, type) {
    var el = document.getElementById('visitor-status');
    if (!el) return;
    el.textContent = message || '';
    el.setAttribute('data-state', type || 'idle');
    el.style.display = message ? 'block' : 'none';
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function flagEmoji(code) {
    if (!/^[A-Z]{2}$/.test(code || '')) return '🌐';
    return String.fromCodePoint.apply(null, code.split('').map(function (letter) {
      return 127397 + letter.charCodeAt(0);
    }));
  }

  function countryName(code) {
    var meta = COUNTRIES[code];
    if (meta) return pick(meta.en, meta.zh);
    return code || pick('Unknown', '未知');
  }

  function formatNumber(n) {
    try { return Number(n).toLocaleString(document.documentElement.lang || 'en'); }
    catch (e) { return String(n); }
  }

  function formatUpdated(ts) {
    if (!ts) return '';
    try {
      return pick('Updated ', '更新于 ') + new Date(ts).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) { return ''; }
  }

  function buildMapBase() {
    if (mapBuilt) return;
    var grid = document.getElementById('visitor-map-grid');
    var land = document.getElementById('visitor-map-land');
    var svg = document.getElementById('visitor-map');
    if (!grid || !land || !svg) return;
    var ns = 'http://www.w3.org/2000/svg';
    var i;

    for (i = 1; i < 6; i++) {
      var v = document.createElementNS(ns, 'line');
      v.setAttribute('x1', String(i * 120));
      v.setAttribute('x2', String(i * 120));
      v.setAttribute('y1', '0');
      v.setAttribute('y2', '360');
      v.setAttribute('class', 'visitor-map-gridline');
      grid.appendChild(v);
    }
    for (i = 1; i < 4; i++) {
      var h = document.createElementNS(ns, 'line');
      h.setAttribute('x1', '0');
      h.setAttribute('x2', '720');
      h.setAttribute('y1', String(i * 90));
      h.setAttribute('y2', String(i * 90));
      h.setAttribute('class', 'visitor-map-gridline');
      grid.appendChild(h);
    }

    for (var row = 0; row < LAND_MASK.length; row++) {
      var line = LAND_MASK[row];
      for (var col = 0; col < MAP_COLS; col++) {
        if (line.charAt(col) !== '#') continue;
        var dot = document.createElementNS(ns, 'circle');
        dot.setAttribute('cx', String((col + 0.5) * (720 / MAP_COLS)));
        dot.setAttribute('cy', String((row + 0.5) * (360 / MAP_ROWS)));
        dot.setAttribute('r', '1.15');
        dot.setAttribute('class', 'visitor-map-land-dot');
        land.appendChild(dot);
      }
    }
    mapBuilt = true;
  }

  function project(lat, lon) {
    return {
      x: (Number(lon) + 180) / 360 * 720,
      y: (90 - Number(lat)) / 180 * 360
    };
  }

  function renderMap(countries, geo) {
    buildMapBase();
    var points = document.getElementById('visitor-map-points');
    var svg = document.getElementById('visitor-map');
    if (!points || !svg) return;
    while (points.firstChild) points.removeChild(points.firstChild);

    var ns = 'http://www.w3.org/2000/svg';
    var visible = countries.filter(function (item) {
      return item.count > 0 && COUNTRIES[item.code];
    }).sort(function (a, b) { return b.count - a.count; });
    var max = visible.length ? visible[0].count : 1;

    visible.forEach(function (item) {
      var meta = COUNTRIES[item.code];
      var p = project(meta.lat, meta.lon);
      var size = Math.min(15, 3.8 + Math.sqrt(item.count / max) * 9.5);
      var current = geo && geo.country_code === item.code;
      var group = document.createElementNS(ns, 'g');
      group.setAttribute('class', 'visitor-map-point' + (current ? ' is-current' : ''));
      group.setAttribute('tabindex', '0');
      group.setAttribute('role', 'img');
      group.setAttribute('aria-label', countryName(item.code) + ': ' + item.count + ' ' + pick('visits', '次访问'));

      var halo = document.createElementNS(ns, 'circle');
      halo.setAttribute('cx', String(p.x));
      halo.setAttribute('cy', String(p.y));
      halo.setAttribute('r', String(size + 4));
      halo.setAttribute('class', 'visitor-map-halo');
      group.appendChild(halo);

      var dot = document.createElementNS(ns, 'circle');
      dot.setAttribute('cx', String(p.x));
      dot.setAttribute('cy', String(p.y));
      dot.setAttribute('r', String(size));
      dot.setAttribute('class', 'visitor-map-dot');
      group.appendChild(dot);

      var title = document.createElementNS(ns, 'title');
      title.textContent = countryName(item.code) + ' — ' + formatNumber(item.count) + ' ' + pick('visits', '次访问');
      group.appendChild(title);
      points.appendChild(group);
    });

    svg.setAttribute('aria-label', pick(
      'World map showing visitor counts by country. ' + visible.length + ' countries have visits.',
      '按国家显示访问人数的世界地图，共有 ' + visible.length + ' 个国家/地区有访问记录。'
    ));
  }

  function renderCountries(countries) {
    var host = document.getElementById('visitor-country-list');
    if (!host) return;
    host.innerHTML = '';
    var items = countries.filter(function (item) {
      return item.count > 0;
    }).sort(function (a, b) { return b.count - a.count; }).slice(0, 10);

    if (!items.length) {
      var empty = document.createElement('p');
      empty.className = 'visitor-empty';
      empty.textContent = pick(
        'No country-level visits yet. The first visit will appear here.',
        '暂无国家/地区访问记录，第一位访客会出现在这里。'
      );
      host.appendChild(empty);
      return;
    }

    var max = items[0].count || 1;
    items.forEach(function (item) {
      var row = document.createElement('div');
      row.className = 'visitor-country';

      var name = document.createElement('div');
      name.className = 'visitor-country-name';
      var flag = document.createElement('span');
      flag.className = 'visitor-country-flag';
      flag.setAttribute('aria-hidden', 'true');
      flag.textContent = flagEmoji(item.code);
      var label = document.createElement('span');
      label.textContent = countryName(item.code);
      name.appendChild(flag);
      name.appendChild(label);

      var bar = document.createElement('div');
      bar.className = 'visitor-country-bar';
      var fill = document.createElement('span');
      fill.style.width = Math.max(4, item.count / max * 100) + '%';
      bar.appendChild(fill);

      var value = document.createElement('strong');
      value.className = 'visitor-country-count';
      value.textContent = formatNumber(item.count);

      row.appendChild(name);
      row.appendChild(bar);
      row.appendChild(value);
      host.appendChild(row);
    });
  }

  function renderStats(stats) {
    state = stats;
    var countries = stats.countries || [];
    var active = countries.filter(function (item) { return item.count > 0; });

    setText('visitor-total', formatNumber(stats.total || 0));
    setText('visitor-countries', formatNumber(active.length));
    setText('visitor-region', stats.geo && stats.geo.country_code
      ? countryName(stats.geo.country_code)
      : pick('Unknown', '未知'));
    setText('visitor-updated', formatUpdated(stats.updated));
    renderMap(countries, stats.geo);
    renderCountries(countries);

    if (!stats.total && !active.length) {
      setStatus(pick(
        'The live counter is ready. You may be the first recorded visitor.',
        '实时计数器已就绪，你可能是第一位记录的访客。'
      ), 'ready');
    } else {
      setStatus('', 'ready');
    }
  }

  function loadStats(force) {
    if (loading) return Promise.resolve();
    var cached = force ? null : readStatsCache();
    if (cached && Date.now() - cached.ts < 2 * 60 * 1000) {
      renderStats(cached);
      return Promise.resolve();
    }
    if (cached) renderStats(cached);

    loading = true;
    var button = document.getElementById('visitor-refresh');
    if (button) button.disabled = true;
    setStatus(pick('Loading live statistics…', '正在加载实时统计…'), 'loading');

    return Promise.all([counterGet(TOTAL_KEY), getGeo()]).then(function (first) {
      if (first[0] === null) throw new Error('counter unavailable');
      return Promise.all([first[0], fetchCountryCounts(), first[1]]);
    }).then(function (result) {
      var total = result[0];
      var countries = result[1].filter(function (item) { return item && item.code; });
      var geo = result[2];

      var stats = {
        total: total,
        countries: countries,
        geo: geo,
        updated: Date.now()
      };
      writeStatsCache(stats);
      renderStats(stats);
    }).catch(function () {
      var fallback = readStatsCache() || cached;
      if (fallback) {
        renderStats(fallback);
        setStatus(pick(
          'Live statistics are temporarily unavailable. Showing the last cached snapshot.',
          '实时统计暂时不可用，当前显示上次缓存的快照。'
        ), 'error');
      } else {
        setStatus(pick(
          'Live statistics are temporarily unavailable. Please try again later.',
          '实时统计暂时不可用，请稍后重试。'
        ), 'error');
      }
    }).then(function () {
      loading = false;
      if (button) button.disabled = false;
    });
  }

  function init() {
    if (!document.getElementById('visitor-total')) return;
    buildMapBase();

    var button = document.getElementById('visitor-refresh');
    if (button) {
      button.addEventListener('click', function () {
        removeStore('stats');
        loadStats(true);
      });
    }

    document.addEventListener('panelchange', function (event) {
      if (event && event.detail && event.detail.panel === 'visitors') loadStats(false);
    });

    var langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      langToggle.addEventListener('click', function () {
        window.setTimeout(function () {
          if (state) renderStats(state);
          else {
            setText('visitor-region', pick('Unknown', '未知'));
            setStatus('', 'idle');
          }
        }, 0);
      });
    }

    trackingPromise = trackVisit();
    var active = document.querySelector('.view-panel.is-active');
    if (active && active.getAttribute('data-panel') === 'visitors') loadStats(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
