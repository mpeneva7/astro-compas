/* Астро Компас — приложна логика (Material 3 единична страница) */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var pad2 = function (n) { return String(n).padStart(2, '0'); };

  /* ───────────────────────── Данни ───────────────────────── */

  var SIGN_INFO = [
    { name: 'Овен', g: '♈', dates: '21 март – 19 апр', c: '#FF7043', el: 'Огън', ruler: 'Марс', focus: 'смелостта и инициативата' },
    { name: 'Телец', g: '♉', dates: '20 апр – 20 май', c: '#66BB6A', el: 'Земя', ruler: 'Венера', focus: 'стабилността и сетивните удоволствия' },
    { name: 'Близнаци', g: '♊', dates: '21 май – 20 юни', c: '#FFD740', el: 'Въздух', ruler: 'Меркурий', focus: 'общуването и обмена на идеи' },
    { name: 'Рак', g: '♋', dates: '21 юни – 22 юли', c: '#4FC3F7', el: 'Вода', ruler: 'Луна', focus: 'дома и емоционалната сигурност' },
    { name: 'Лъв', g: '♌', dates: '23 юли – 22 авг', c: '#FFA726', el: 'Огън', ruler: 'Слънце', focus: 'себеизразяването и творчеството' },
    { name: 'Дева', g: '♍', dates: '23 авг – 22 септ', c: '#81C784', el: 'Земя', ruler: 'Меркурий', focus: 'реда и полезните грижи' },
    { name: 'Везни', g: '♎', dates: '23 септ – 22 окт', c: '#CE93D8', el: 'Въздух', ruler: 'Венера', focus: 'връзките и баланса' },
    { name: 'Скорпион', g: '♏', dates: '23 окт – 21 ноем', c: '#EF5350', el: 'Вода', ruler: 'Плутон', focus: 'дълбочината и трансформацията' },
    { name: 'Стрелец', g: '♐', dates: '22 ноем – 21 дек', c: '#FFCA28', el: 'Огън', ruler: 'Юпитер', focus: 'разширяването на хоризонтите' },
    { name: 'Козирог', g: '♑', dates: '22 дек – 19 яну', c: '#90A4AE', el: 'Земя', ruler: 'Сатурн', focus: 'структурата и дългосрочните цели' },
    { name: 'Водолей', g: '♒', dates: '20 яну – 18 фев', c: '#4DD0E1', el: 'Въздух', ruler: 'Уран', focus: 'общността и нестандартните идеи' },
    { name: 'Риби', g: '♓', dates: '19 фев – 20 март', c: '#9FA8DA', el: 'Вода', ruler: 'Нептун', focus: 'интуицията и вътрешния свят' }
  ];

  var PLANET_META = {
    sun: { c: '#FFD54F' }, moon: { c: '#E8E8CC' }, mercury: { c: '#80CBC4' }, venus: { c: '#F48FB1' },
    mars: { c: '#EF9A9A' }, jupiter: { c: '#FFCC80' }, saturn: { c: '#B0BEC5' }, uranus: { c: '#80DEEA' },
    neptune: { c: '#9FA8DA' }, pluto: { c: '#CE93D8' }, asc: { c: '#B69DE8' }, mc: { c: '#E8C36A' }
  };

  var ASPECT_COLOR = { 'тригон': '#4CAF50', 'секстил': '#4CAF50', 'квадрат': '#EF5350', 'опозиция': '#EF5350', 'съвпад': '#E8C36A' };

  var PHASE_TEXT = {
    'Новолуние': { d: 'Идеален момент за нови начала и заявяване на намерения.', a: 'Избягвайте прибързани решения — енергията тепърва набира сила.' },
    'Растяща сърповидна': { d: 'Време за първи стъпки и изграждане на увереност в новите начинания.', a: 'Не се обезсърчавайте от бавния напредък — той е естествен на този етап.' },
    'Първа четвърт': { d: 'Момент на действие и преодоляване на съпротивата.', a: 'Избягвайте прекалената драматичност — насочете енергията конструктивно.' },
    'Растяща изпъкнала': { d: 'Прецизирайте детайлите и настройвайте плановете си.', a: 'Останете гъвкави пред неочаквани промени.' },
    'Пълнолуние': { d: 'Кулминация и яснота — резултатите от посятото стават видими.', a: 'Избягвайте импулсивни емоционални реакции под напрежение.' },
    'Намаляваща изпъкнала': { d: 'Споделяйте наученото и благодарете за постигнатото.', a: 'Не се вкопчвайте в остарели цели.' },
    'Последна четвърт': { d: 'Освобождавайте се от това, което вече не ви служи.', a: 'Избягвайте да започвате мащабни нови проекти точно сега.' },
    'Намаляваща сърповидна': { d: 'Останете в покой и обобщете изминалия цикъл.', a: 'Не насилвайте темпото — почивката е продуктивна.' }
  };

  var BG_MONTHS_GEN = ['януари', 'февруари', 'март', 'април', 'май', 'юни', 'юли', 'август', 'септември', 'октомври', 'ноември', 'декември'];
  var BG_MONTHS = ['Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни', 'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'];
  var BG_WEEKDAYS = ['неделя', 'понеделник', 'вторник', 'сряда', 'четвъртък', 'петък', 'събота'];
  var BG_DAYS_ABBR = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']; // за getDay() (0=неделя)
  var BG_DAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']; // за седмичния хедър (започва в понеделник)
  var ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

  // Изчерпателен списък от js/cities.js (window.BG_CITIES: { oblasti, places }).
  // places = [име, индекс_на_област, ширина, дължина], сортирани по население.
  var CITY_DB = (window.BG_CITIES && window.BG_CITIES.places) || [];
  var CITY_OBLASTI = (window.BG_CITIES && window.BG_CITIES.oblasti) || [];

  /* ───────────────────────── Помощни ───────────────────────── */

  function guessBulgariaOffset(month) { return (month >= 4 && month <= 10) ? 3 : 2; }

  function fmtDeg(p) { return p.degree + '°' + pad2(p.minute) + "'"; }

  function svg(tag, attrs, children) {
    var s = '<' + tag;
    for (var k in attrs) s += ' ' + k + '="' + attrs[k] + '"';
    if (children === undefined) return s + '/>';
    return s + '>' + children + '</' + tag + '>';
  }

  /* ───────────────────────── Топ лента / drawer ───────────────────────── */

  function initChrome() {
    var appbar = $('appbar');
    window.addEventListener('scroll', function () {
      appbar.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });

    var overlay = $('drawer-overlay');
    $('menu-open-btn').addEventListener('click', function () { overlay.classList.add('open'); });
    $('drawer-close-btn').addEventListener('click', function () { overlay.classList.remove('open'); });
    $('drawer-scrim').addEventListener('click', function () { overlay.classList.remove('open'); });
    overlay.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { overlay.classList.remove('open'); });
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.07 });
    document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });
  }

  /* ───────────────────────── "Сега" карта (за Луна + Хороскоп) ───────────────────────── */

  function getNowChart() {
    var now = new Date();
    var jd = AstroCore.julianDay(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    var T = AstroCore.centuriesSinceJ2000(jd);
    var order = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
    var planets = {};
    order.forEach(function (name) {
      var pos = AstroCore.planetLongitude(name, T);
      planets[name] = Object.assign({ name: name, nameBg: AstroCore.PLANET_NAMES_BG[name] }, pos, AstroCore.longitudeToSign(pos.lon));
    });
    return { jd: jd, T: T, now: now, planets: planets, order: order };
  }

  /* ───────────────────────── Луна ───────────────────────── */

  function moonIllustrationSVG(phaseAngleDeg) {
    var phase = (phaseAngleDeg % 360) / 360;
    var cx = 100, cy = 100, r = 74;
    var theta = phase * 2 * Math.PI;
    var rx = Math.abs(r * Math.cos(theta));
    var sweepOuter, sweepInner;
    if (phase < 0.5) { sweepOuter = 1; sweepInner = (phase < 0.25) ? 1 : 0; }
    else { sweepOuter = 0; sweepInner = (phase < 0.75) ? 1 : 0; }
    var top = cx + ',' + (cy - r), bottom = cx + ',' + (cy + r);
    var litPath = 'M ' + top + ' A ' + r + ',' + r + ' 0 0 ' + sweepOuter + ' ' + bottom +
      ' A ' + rx + ',' + r + ' 0 0 ' + sweepInner + ' ' + top + ' Z';

    return '<svg viewBox="0 0 200 200" width="140" height="140" style="filter:drop-shadow(0 0 28px rgba(182,157,232,0.45))">' +
      '<defs>' +
      '<radialGradient id="mglow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#B69DE8" stop-opacity="0.3"/><stop offset="65%" stop-color="#B69DE8" stop-opacity="0.08"/><stop offset="100%" stop-color="#B69DE8" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="mlit" cx="65%" cy="35%" r="60%"><stop offset="0%" stop-color="#F5F0DC"/><stop offset="55%" stop-color="#C4C0A4"/><stop offset="100%" stop-color="#88846C"/></radialGradient>' +
      '<clipPath id="mclip"><circle cx="100" cy="100" r="74"/></clipPath>' +
      '</defs>' +
      '<circle cx="100" cy="100" r="96" fill="url(#mglow)"/>' +
      '<circle cx="100" cy="100" r="74" fill="#241A30"/>' +
      '<path d="' + litPath + '" fill="url(#mlit)"/>' +
      '<g clip-path="url(#mclip)" opacity="0.18"><circle cx="128" cy="72" r="8" fill="#908A70"/><circle cx="140" cy="110" r="5" fill="#908A70"/><circle cx="118" cy="132" r="10" fill="#908A70"/><circle cx="133" cy="89" r="4" fill="#908A70"/></g>' +
      '<circle cx="100" cy="100" r="74" fill="none" stroke="rgba(182,157,232,0.25)" stroke-width="1"/>' +
      '</svg>';
  }

  function renderMoon(chart) {
    var sun = chart.planets.sun, moon = chart.planets.moon;
    var phase = AstroCore.moonPhase(sun.lon, moon.lon);

    $('moon-illustration').innerHTML = moonIllustrationSVG(phase.angle);
    $('moon-illum-fill').style.width = Math.round(phase.illumination * 100) + '%';
    $('moon-illum-label').textContent = Math.round(phase.illumination * 100) + '% осветена';
    $('moon-phase-name').textContent = phase.name;
    $('moon-sign-line').innerHTML = 'Луната в <strong>' + moon.sign + '</strong>';

    var pt = PHASE_TEXT[phase.name] || PHASE_TEXT['Новолуние'];
    var signInfo = SIGN_INFO[moon.signIndex];
    $('moon-guidance').innerHTML =
      '<p>' + pt.d + ' Луната в ' + moon.sign + ' насочва фокуса към ' + signInfo.focus + '.</p>' +
      '<p>' + pt.a + '</p>';

    var now = chart.now;
    $('moon-meta').textContent = now.getDate() + ' ' + BG_MONTHS_GEN[now.getMonth()] + ' ' + now.getFullYear() + ' г.';
  }

  /* ───────────────────────── Дневен хороскоп ─────────────────────────
     Текстовите варианти живеят в js/daily.js (DailyHoroscope модул).
  ───────────────────────────────────────────────────────────────────── */

  var openSignIndex = null;

  function shortenText(text) {
    var sentences = text.split(/(?<=[.!?])\s+/);
    var result = sentences[0] || text;
    if (sentences.length > 1) {
      result += ' ' + sentences[1];
    }
    return result;
  }

  function signCardHTML(chart, i) {
    var sign = SIGN_INFO[i];
    var reading = DailyHoroscope.buildReading(chart, i, chart.now);
    var isOpen = openSignIndex === i;
    var html =
      '<div class="sign-card-inner">' +
      '<div class="sign-glyph-circle" style="background:' + sign.c + '18; border:1px solid ' + sign.c + '40; color:' + sign.c + ';">' + sign.g + '</div>' +
      '<h3>' + sign.name + '</h3>' +
      '<p class="sign-dates">' + sign.dates + '</p>' +
      '<p class="sign-day-text">' + shortenText(reading.day) + '</p>';
    if (isOpen) {
      html += '<div class="sign-detail">' +
        '<div class="sign-detail-item"><p class="label" style="color:#EF9A9A;">♥ Любов</p><p>' + reading.love + '</p></div>' +
        '<div class="sign-detail-item"><p class="label" style="color:#E8C36A;">★ Работа</p><p>' + reading.work + '</p></div>' +
        '<div class="sign-detail-item"><p class="label" style="color:#B69DE8;">☾ Настроение</p><p>' + reading.mood + '</p></div>' +
        '<div class="sign-tags">' +
        '<span class="sign-tag" style="background:' + sign.c + '18; color:' + sign.c + '; border:1px solid ' + sign.c + '38;">' + sign.el + '</span>' +
        '<span class="sign-tag muted">' + sign.ruler + '</span>' +
        '</div></div>';
    }
    html += '<div class="sign-expand-row"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></div>';
    html += '</div>';
    return html;
  }

  function renderHoroscope(chart) {
    var now = chart.now;
    $('horoscope-date').textContent = BG_WEEKDAYS[now.getDay()].replace(/^./, function (c) { return c.toUpperCase(); }) +
      ', ' + now.getDate() + ' ' + BG_MONTHS_GEN[now.getMonth()] + ' ' + now.getFullYear();

    var grid = $('horoscope-grid');
    grid.innerHTML = '';

    function refreshCard(card) {
      var i = parseInt(card.dataset.index, 10);
      var sign = SIGN_INFO[i];
      var isOpen = openSignIndex === i;
      card.classList.toggle('open', isOpen);
      card.style.borderColor = isOpen ? sign.c + '45' : '';
      card.innerHTML = signCardHTML(chart, i);
    }

    function refreshAll() { Array.prototype.forEach.call(grid.children, refreshCard); }

    SIGN_INFO.forEach(function (sign, i) {
      var card = document.createElement('div');
      card.className = 'sign-card';
      card.dataset.index = i;
      card.addEventListener('click', function (e) {
        e.stopPropagation(); // да не се задейства "клик извън картата"
        openSignIndex = (openSignIndex === i) ? null : i;
        refreshAll();
      });
      refreshCard(card);
      grid.appendChild(card);
    });

    // Затваряне на отворена карта при клик извън мрежата или клавиш Esc
    document.addEventListener('click', function () {
      if (openSignIndex !== null) { openSignIndex = null; refreshAll(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && openSignIndex !== null) { openSignIndex = null; refreshAll(); }
    });
  }

  /* ───────────────────────── Натална карта — град автодовършване ───────────────────────── */

  var selectedCity = null; // избраното място: place-масив [име, областИдкс, lat, lon]

  function placeLabel(p) {
    return p[0] + ' · обл. ' + (CITY_OBLASTI[p[1]] || '');
  }

  // Търси по представка на името; CITY_DB е сортиран по население, така че
  // по-големите места излизат първи при еднакво съвпадение.
  function matchCities(q, limit) {
    q = q.trim().toLowerCase();
    if (!q) return [];
    var starts = [], contains = [];
    for (var i = 0; i < CITY_DB.length; i++) {
      var nm = CITY_DB[i][0].toLowerCase();
      var pos = nm.indexOf(q);
      if (pos === 0) { starts.push(CITY_DB[i]); if (starts.length >= limit) break; }
      else if (pos > 0 && contains.length < limit) contains.push(CITY_DB[i]);
    }
    return starts.concat(contains).slice(0, limit);
  }

  function initCityAutocomplete() {
    var input = $('city-input');
    var dropdown = $('city-dropdown');

    function showMatches() {
      var matches = matchCities(input.value, 8);
      if (!matches.length) { dropdown.classList.remove('open'); dropdown.innerHTML = ''; return; }
      dropdown.innerHTML = '';
      matches.forEach(function (p) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.innerHTML = '<span class="city-name">' + p[0] + '</span><span class="city-oblast">обл. ' + (CITY_OBLASTI[p[1]] || '') + '</span>';
        btn.addEventListener('mousedown', function () {
          input.value = p[0];
          selectedCity = p;
          clearCityError();
          dropdown.classList.remove('open');
        });
        dropdown.appendChild(btn);
      });
      dropdown.classList.add('open');
    }

    input.addEventListener('input', function () { selectedCity = null; clearCityError(); showMatches(); });
    input.addEventListener('focus', showMatches);
    input.addEventListener('blur', function () { setTimeout(function () { dropdown.classList.remove('open'); }, 160); });
  }

  // Връща { name, lat, lon } за въведения град или null, ако не е в списъка.
  function resolveCity() {
    var typed = $('city-input').value.trim();
    if (!typed) return null;
    // избраното от списъка има приоритет (важно при еднакви имена)
    if (selectedCity && selectedCity[0].toLowerCase() === typed.toLowerCase()) {
      return { name: placeLabel(selectedCity), lat: selectedCity[2], lon: selectedCity[3] };
    }
    // иначе точно съвпадение по име (първото = най-голямото по население)
    var lc = typed.toLowerCase();
    for (var i = 0; i < CITY_DB.length; i++) {
      if (CITY_DB[i][0].toLowerCase() === lc) {
        return { name: placeLabel(CITY_DB[i]), lat: CITY_DB[i][2], lon: CITY_DB[i][3] };
      }
    }
    return null; // няма такъв град в списъка
  }

  function showCityError(msg) {
    var err = $('city-error'), box = $('city-field-box');
    err.textContent = msg;
    err.classList.add('show');
    box.classList.add('error');
    $('city-input').focus();
  }
  function clearCityError() {
    $('city-error').classList.remove('show');
    $('city-field-box').classList.remove('error');
  }

  /* ───────────────────────── Натална карта — колело (SVG) ───────────────────────── */

  function buildWheelSVG(chart) {
    var cx = 250, cy = 250;
    var R = { zo: 226, zi: 188, ho: 152, pl: 126, as: 66 };
    function toA(deg) { return (deg - 90) * Math.PI / 180; }
    function pt(r, deg) { return { x: cx + r * Math.cos(toA(deg)), y: cy + r * Math.sin(toA(deg)) }; }
    function arc(s, e, ro, ri) {
      var a = pt(ro, s), b = pt(ro, e), c2 = pt(ri, e), d = pt(ri, s);
      return 'M ' + a.x + ' ' + a.y + ' A ' + ro + ' ' + ro + ' 0 0 1 ' + b.x + ' ' + b.y +
        ' L ' + c2.x + ' ' + c2.y + ' A ' + ri + ' ' + ri + ' 0 0 0 ' + d.x + ' ' + d.y + ' Z';
    }

    var zHTML = '';
    SIGN_INFO.forEach(function (z, i) {
      var s = i * 30, e = s + 30, mid = s + 15;
      var mp = pt((R.zo + R.zi) / 2, mid);
      zHTML += '<path d="' + arc(s, e, R.zo, R.zi) + '" fill="' + z.c + '" fill-opacity="0.1" stroke="' + z.c + '" stroke-opacity="0.28" stroke-width="0.5"/>';
      zHTML += '<text x="' + mp.x + '" y="' + mp.y + '" text-anchor="middle" dominant-baseline="central" font-size="13" fill="' + z.c + '" fill-opacity="0.88" font-family="serif">' + z.g + '</text>';
    });

    var houseHTML = '';
    for (var h = 1; h <= 12; h++) {
      var angular = (h === 1 || h === 4 || h === 7 || h === 10);
      var a1 = pt(R.as, chart.houses[h]), b1 = pt(R.zi, chart.houses[h]);
      houseHTML += '<line x1="' + a1.x + '" y1="' + a1.y + '" x2="' + b1.x + '" y2="' + b1.y + '" stroke="' +
        (angular ? '#B69DE8' : '#4A3F54') + '" stroke-width="' + (angular ? 1 : 0.4) + '" stroke-opacity="' + (angular ? 0.5 : 0.28) + '"/>';
    }

    var aspects = AstroCore.computeAspects(chart.planets, chart.order);
    var aspHTML = '';
    aspects.forEach(function (a) {
      var p1 = pt(R.as - 3, chart.planets[a.p1].lon), p2 = pt(R.as - 3, chart.planets[a.p2].lon);
      var color = ASPECT_COLOR[a.type] || '#E8C36A';
      aspHTML += '<line x1="' + p1.x + '" y1="' + p1.y + '" x2="' + p2.x + '" y2="' + p2.y + '" stroke="' + color + '" stroke-width="0.9" stroke-opacity="0.55"/>';
    });

    var plHTML = '';
    chart.order.forEach(function (name) {
      var p = chart.planets[name];
      var pos = pt(R.pl, p.lon);
      var color = PLANET_META[name].c;
      plHTML += '<g filter="url(#pg)"><circle cx="' + pos.x + '" cy="' + pos.y + '" r="11" fill="#1E1428" stroke="' + color + '" stroke-width="1.1"/>' +
        '<text x="' + pos.x + '" y="' + pos.y + '" text-anchor="middle" dominant-baseline="central" font-size="9.5" fill="' + color + '" font-family="serif">' + AstroCore.PLANET_SYMBOLS[name] + '</text></g>';
    });

    var ascPt = pt(R.ho + 10, chart.asc.longitude), mcPt = pt(R.ho + 10, chart.mc.longitude);

    return '<svg viewBox="0 0 500 500" style="animation: spinIn 1.1s cubic-bezier(.22,1,.36,1) both;">' +
      '<defs>' +
      '<radialGradient id="wbg" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#251A32"/><stop offset="100%" stop-color="#140A1E"/></radialGradient>' +
      '<filter id="pg"><feGaussianBlur stdDeviation="1.2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
      '</defs>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R.zo + 14) + '" fill="url(#wbg)"/>' +
      zHTML +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + R.zi + '" fill="none" stroke="rgba(74,63,84,0.45)" stroke-width="0.5"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + R.ho + '" fill="#140A1E" fill-opacity="0.82" stroke="rgba(74,63,84,0.45)" stroke-width="0.5"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + R.as + '" fill="#1E1428" stroke="rgba(182,157,232,0.4)" stroke-width="0.8"/>' +
      houseHTML + aspHTML + plHTML +
      '<text x="' + cx + '" y="' + cy + '" text-anchor="middle" dominant-baseline="central" font-size="20" fill="#E8C36A" filter="url(#pg)">✦</text>' +
      '<text x="' + ascPt.x + '" y="' + ascPt.y + '" text-anchor="middle" dominant-baseline="central" font-size="8" fill="#B69DE8" font-weight="bold">ASC</text>' +
      '<text x="' + mcPt.x + '" y="' + mcPt.y + '" text-anchor="middle" dominant-baseline="central" font-size="8" fill="#E8C36A" font-weight="bold">MC</text>' +
      '</svg>';
  }

  /* ───────────────────────── Натална карта — резултати ───────────────────────── */

  var lastChart = null;

  function renderNatalResults(chart) {
    lastChart = chart;

    $('wheel-container').innerHTML = buildWheelSVG(chart);

    var big3 = [
      { label: '☉ Слънце', p: chart.planets.sun, desc: 'Вашата жизнена сила и его', c: PLANET_META.sun.c },
      { label: '☽ Луна', p: chart.planets.moon, desc: 'Вашият емоционален свят', c: PLANET_META.moon.c },
      { label: 'AC Асцендент', p: chart.asc, desc: 'Как светът ви вижда', c: PLANET_META.asc.c }
    ];
    $('bigthree-container').innerHTML = big3.map(function (t) {
      return '<div class="bigthree-item" style="background:var(--card-2); border:1px solid ' + t.c + '28;">' +
        '<div class="bigthree-avatar" style="background:' + t.c + '1a; color:' + t.c + ';">' + t.label.slice(0, 2) + '</div>' +
        '<div><p class="k">' + t.label + '</p>' +
        '<p class="v" style="color:' + t.c + ';">' + t.p.sign + '<small>' + fmtDeg(t.p) + '</small></p>' +
        '<p class="d">' + t.desc + '</p></div></div>';
    }).join('');

    var rows = [];
    chart.order.forEach(function (name) {
      var p = chart.planets[name];
      var house = AstroCore.houseOfLongitude(p.lon, chart.houses);
      var retro = AstroCore.isRetrograde(name, chart.T);
      rows.push({ g: AstroCore.PLANET_SYMBOLS[name], name: p.nameBg, sign: p.sign, deg: fmtDeg(p), house: ROMAN[house], c: PLANET_META[name].c, retro: retro });
    });
    rows.push({ g: 'AC', name: 'Асцендент', sign: chart.asc.sign, deg: fmtDeg(chart.asc), house: 'I', c: PLANET_META.asc.c, retro: false });
    rows.push({ g: 'MC', name: 'Средно небе', sign: chart.mc.sign, deg: fmtDeg(chart.mc), house: 'X', c: PLANET_META.mc.c, retro: false });

    $('planets-table').innerHTML = rows.map(function (r) {
      return '<div class="planet-row">' +
        '<div class="planet-avatar" style="background:' + r.c + '18; color:' + r.c + '; border:1px solid ' + r.c + '30;">' + r.g + '</div>' +
        '<div class="pname">' + r.name + (r.retro ? ' <span class="pretro">℞</span>' : '') + '</div>' +
        '<div class="psign">' + r.sign + '</div>' +
        '<div class="pdeg">' + r.deg + '</div>' +
        '<div class="phouse-chip">Дом ' + r.house + '</div>' +
        '</div>';
    }).join('');

    var aspects = AstroCore.computeAspects(chart.planets, chart.order).sort(function (a, b) { return a.orb - b.orb; });
    $('aspects-list').innerHTML = aspects.length ? aspects.map(function (a) {
      var color = ASPECT_COLOR[a.type] || '#E8C36A';
      return '<div class="aspect-row">' +
        '<div class="aspect-dot-ring" style="background:' + color + '18; border:1px solid ' + color + '38;"><div class="aspect-dot" style="background:' + color + ';"></div></div>' +
        '<p class="aspect-text"><strong>' + AstroCore.PLANET_SYMBOLS[a.p1] + ' ' + chart.planets[a.p1].nameBg + '</strong> <span class="asp-name">' + a.symbol + ' ' + a.type + '</span> <strong>' + AstroCore.PLANET_SYMBOLS[a.p2] + ' ' + chart.planets[a.p2].nameBg + '</strong></p>' +
        '<span class="aspect-orb">орб ' + a.orb.toFixed(1) + '°</span>' +
        '</div>';
    }).join('') : '<div class="aspect-row"><p class="aspect-text">Няма значими аспекти в рамките на стандартния орбис.</p></div>';

    $('natal-results').classList.add('show');
  }

  /* ───────────────────────── PDF експорт ───────────────────────── */

  // Официална българска транслитерация кирилица -> латиница (за име на файл)
  var TRANSLIT = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ж':'zh','з':'z','и':'i','й':'y',
    'к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u',
    'ф':'f','х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'sht','ъ':'a','ь':'y','ю':'yu','я':'ya'
  };
  function translitToLatin(s) {
    return (s || '').split('').map(function (ch) {
      var low = ch.toLowerCase();
      var mapped = TRANSLIT[low];
      if (mapped === undefined) return (/[a-zA-Z0-9]/.test(ch) ? ch : (/\s/.test(ch) ? ' ' : ''));
      return (ch !== low) ? (mapped.charAt(0).toUpperCase() + mapped.slice(1)) : mapped;
    }).join('');
  }
  function slugify(s) {
    return translitToLatin(s).replace(/\s+/g, '-').replace(/[^A-Za-z0-9\-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }

  // Светла (за печат) версия на колелото — бял фон, тъмни линии, без филтри/
  // градиенти (svg2pdf не ги поддържа), шрифт AstroSans за глифите.
  function buildPrintWheelSVG(chart) {
    var cx = 250, cy = 250;
    var R = { zo: 226, zi: 188, ho: 152, pl: 126, as: 66 };
    function toA(deg) { return (deg - 90) * Math.PI / 180; }
    function pt(r, deg) { return { x: cx + r * Math.cos(toA(deg)), y: cy + r * Math.sin(toA(deg)) }; }
    function arc(s, e, ro, ri) {
      var a = pt(ro, s), b = pt(ro, e), c2 = pt(ri, e), d = pt(ri, s);
      return 'M ' + a.x + ' ' + a.y + ' A ' + ro + ' ' + ro + ' 0 0 1 ' + b.x + ' ' + b.y +
        ' L ' + c2.x + ' ' + c2.y + ' A ' + ri + ' ' + ri + ' 0 0 0 ' + d.x + ' ' + d.y + ' Z';
    }
    function txt(x, y, size, color, s, weight) {
      return '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" font-family="AstroSans" font-size="' + size + '"' +
        (weight ? ' font-weight="' + weight + '"' : '') + ' fill="' + color + '">' + s + '</text>';
    }

    var INK = '#2A2440', MUTED = '#8A7E9A', GOLD = '#B8860B', GRID = '#C9BFD6';

    var zHTML = '';
    SIGN_INFO.forEach(function (z, i) {
      var s = i * 30, e = s + 30, mid = s + 15;
      var mp = pt((R.zo + R.zi) / 2, mid);
      zHTML += '<path d="' + arc(s, e, R.zo, R.zi) + '" fill="' + z.c + '" fill-opacity="0.14" stroke="' + z.c + '" stroke-opacity="0.55" stroke-width="0.6"/>';
      zHTML += txt(mp.x, mp.y, 14, z.c, z.g);
    });

    var houseHTML = '';
    for (var h = 1; h <= 12; h++) {
      var angular = (h === 1 || h === 4 || h === 7 || h === 10);
      var a1 = pt(R.as, chart.houses[h]), b1 = pt(R.zi, chart.houses[h]);
      houseHTML += '<line x1="' + a1.x + '" y1="' + a1.y + '" x2="' + b1.x + '" y2="' + b1.y + '" stroke="' +
        (angular ? GOLD : GRID) + '" stroke-width="' + (angular ? 1 : 0.5) + '" stroke-opacity="' + (angular ? 0.8 : 0.7) + '"/>';
    }

    var aspects = AstroCore.computeAspects(chart.planets, chart.order);
    var aspHTML = '';
    aspects.forEach(function (a) {
      var p1 = pt(R.as - 3, chart.planets[a.p1].lon), p2 = pt(R.as - 3, chart.planets[a.p2].lon);
      var color = ASPECT_COLOR[a.type] || GOLD;
      aspHTML += '<line x1="' + p1.x + '" y1="' + p1.y + '" x2="' + p2.x + '" y2="' + p2.y + '" stroke="' + color + '" stroke-width="0.8" stroke-opacity="0.7"/>';
    });

    var plHTML = '';
    chart.order.forEach(function (name) {
      var p = chart.planets[name];
      var pos = pt(R.pl, p.lon);
      var color = PLANET_META[name].c;
      var dark = shadeForPrint(color);
      plHTML += '<circle cx="' + pos.x + '" cy="' + pos.y + '" r="11" fill="#FFFFFF" stroke="' + dark + '" stroke-width="1.2"/>' +
        txt(pos.x, pos.y, 11, dark, AstroCore.PLANET_SYMBOLS[name]);
    });

    var ascPt = pt(R.ho + 11, chart.asc.longitude), mcPt = pt(R.ho + 11, chart.mc.longitude);

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R.zo + 14) + '" fill="#FFFFFF"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R.zo + 13) + '" fill="none" stroke="' + GRID + '" stroke-width="0.6"/>' +
      zHTML +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + R.zi + '" fill="none" stroke="' + GRID + '" stroke-width="0.6"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + R.ho + '" fill="none" stroke="' + GRID + '" stroke-width="0.6"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + R.as + '" fill="#FBF9F4" stroke="' + GOLD + '" stroke-width="0.9"/>' +
      houseHTML + aspHTML + plHTML +
      txt(cx, cy, 20, GOLD, '✦') +
      txt(ascPt.x, ascPt.y, 9, GOLD, 'ASC', 'bold') +
      txt(mcPt.x, mcPt.y, 9, GOLD, 'MC', 'bold') +
      '</svg>';
  }

  // Затъмнява ярък цвят, за да се чете върху бял фон (за печат)
  function shadeForPrint(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex);
    if (!m) return '#333333';
    var n = parseInt(m[1], 16);
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    var f = 0.62; // към по-тъмно
    r = Math.round(r * f); g = Math.round(g * f); b = Math.round(b * f);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  function buildPDF(chart) {
    if (!window.jspdf || !window.jspdf.jsPDF) { alert('PDF модулът не е зареден.'); return; }
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    doc.setFont('AstroSans', 'normal');

    var PW = 210, PH = 297, M = 14;
    var GOLD = [184, 134, 11], INK = [42, 36, 64], MUTED = [120, 112, 140], LINE = [222, 216, 228];
    var o = chart.opts;

    // ── Заглавие ──
    doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.setFont('AstroSans', 'bold');
    doc.setFontSize(24);
    doc.text('Астро Компас', PW / 2, 22, { align: 'center' });

    // ── Данни за раждане ──
    var months = ['януари','февруари','март','април','май','юни','юли','август','септември','октомври','ноември','декември'];
    var info = [];
    if (o.name) info.push(o.name);
    info.push(o.day + ' ' + months[o.month - 1] + ' ' + o.year);
    info.push(pad2(o.hour) + ':' + pad2(o.minute) + ' ч.');
    if (o.placeName) info.push(o.placeName);
    doc.setFont('AstroSans', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(INK[0], INK[1], INK[2]);
    doc.text(info.join('  ·  '), PW / 2, 30, { align: 'center' });

    doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.setLineWidth(0.4);
    doc.line(M + 40, 34, PW - M - 40, 34);

    // ── Колело (векторно чрез svg2pdf) ──
    var wheelSize = 92; // mm
    var wheelX = (PW - wheelSize) / 2, wheelY = 38;
    var holder = document.createElement('div');
    holder.style.position = 'fixed'; holder.style.left = '-9999px'; holder.style.top = '0';
    holder.innerHTML = buildPrintWheelSVG(chart);
    document.body.appendChild(holder);
    var svgEl = holder.querySelector('svg');

    return doc.svg(svgEl, { x: wheelX, y: wheelY, width: wheelSize, height: wheelSize })
      .then(function () {
        holder.remove();
        var y = wheelY + wheelSize + 8;

        // ── Голямата тройка ──
        var big3 = [
          { l: '☉ Слънце', p: chart.planets.sun },
          { l: '☽ Луна', p: chart.planets.moon },
          { l: 'AC Асцендент', p: chart.asc }
        ];
        var bw = (PW - 2 * M - 2 * 6) / 3, bh = 20;
        big3.forEach(function (b, i) {
          var x = M + i * (bw + 6);
          doc.setFillColor(251, 249, 244);
          doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
          doc.setLineWidth(0.3);
          doc.roundedRect(x, y, bw, bh, 2, 2, 'FD');
          doc.setFontSize(8);
          doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
          doc.setFont('AstroSans', 'normal');
          doc.text(b.l, x + bw / 2, y + 6, { align: 'center' });
          doc.setFontSize(12);
          doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
          doc.setFont('AstroSans', 'bold');
          doc.text(b.p.sign, x + bw / 2, y + 12.5, { align: 'center' });
          doc.setFontSize(9);
          doc.setTextColor(INK[0], INK[1], INK[2]);
          doc.setFont('AstroSans', 'normal');
          doc.text(fmtDeg(b.p), x + bw / 2, y + 17.5, { align: 'center' });
        });
        y += bh + 8;

        // ── Таблица с позиции ──
        doc.setFont('AstroSans', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.text('Планети и позиции', M, y);
        y += 4;

        var cols = [
          { t: 'Планета', x: M + 2, w: 60 },
          { t: 'Знак', x: M + 62, w: 55 },
          { t: 'Градус', x: M + 117, w: 35 },
          { t: 'Дом', x: M + 152, w: 28 }
        ];
        doc.setFontSize(7.5);
        doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
        doc.setFont('AstroSans', 'normal');
        cols.forEach(function (c) { doc.text(c.t.toUpperCase(), c.x, y); });
        y += 1.5;
        doc.setDrawColor(LINE[0], LINE[1], LINE[2]);
        doc.setLineWidth(0.2);
        doc.line(M, y, PW - M, y);
        y += 4;

        var rows = [];
        chart.order.forEach(function (name) {
          var p = chart.planets[name];
          var house = AstroCore.houseOfLongitude(p.lon, chart.houses);
          var retro = AstroCore.isRetrograde(name, chart.T);
          rows.push([AstroCore.PLANET_SYMBOLS[name] + '  ' + p.nameBg + (retro ? '  ℞' : ''), p.symbol + '  ' + p.sign, fmtDeg(p), 'Дом ' + ROMAN[house]]);
        });
        rows.push(['AC  Асцендент', chart.asc.symbol + '  ' + chart.asc.sign, fmtDeg(chart.asc), 'Дом I']);
        rows.push(['MC  Средно небе', chart.mc.symbol + '  ' + chart.mc.sign, fmtDeg(chart.mc), 'Дом X']);

        doc.setFontSize(9.5);
        rows.forEach(function (r, i) {
          if (i % 2 === 1) {
            doc.setFillColor(248, 246, 251);
            doc.rect(M, y - 3.4, PW - 2 * M, 6.4, 'F');
          }
          doc.setTextColor(INK[0], INK[1], INK[2]);
          doc.setFont('AstroSans', 'normal');
          doc.text(r[0], cols[0].x, y);
          doc.text(r[1], cols[1].x, y);
          doc.text(r[2], cols[2].x, y);
          doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
          doc.text(r[3], cols[3].x, y);
          y += 6.4;
        });

        // ── Долен ред ──
        doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.setLineWidth(0.3);
        doc.line(M, PH - 16, PW - M, PH - 16);
        doc.setFontSize(8);
        doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
        doc.setFont('AstroSans', 'normal');
        doc.text('Изчислено по VSOP87 / Placidus', M, PH - 11);
        doc.text('astrology-compass.com', PW - M, PH - 11, { align: 'right' });

        // ── Име на файла ──
        var namePart = o.name ? (slugify(o.name) || '') : '';
        var datePart = o.year + '-' + pad2(o.month) + '-' + pad2(o.day);
        var fname = 'natalna-karta' + (namePart ? '-' + namePart : '') + '-' + datePart + '.pdf';
        doc.save(fname);
      })
      .catch(function (err) {
        holder.remove();
        console.error('PDF грешка:', err);
        alert('Възникна грешка при създаването на PDF: ' + err.message);
      });
  }

  /* ───────────────────────── M3 дата/час пикери ───────────────────────── */

  function openDatePicker(initial, onConfirm) {
    var today = new Date();
    var sel = initial ? new Date(initial.getFullYear(), initial.getMonth(), initial.getDate()) : null;
    var viewYear = (sel || today).getFullYear();
    var viewMonth = (sel || today).getMonth();
    var mode = 'day';
    var YEAR_START = 1900, YEAR_END = today.getFullYear();

    var overlay = document.createElement('div');
    overlay.className = 'm3-modal-overlay';
    document.body.appendChild(overlay);
    function close() { overlay.remove(); }
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

    function render() {
      var hdText = sel ? (BG_DAYS_ABBR[sel.getDay()] + ', ' + sel.getDate() + ' ' + BG_MONTHS_GEN[sel.getMonth()] + ' ' + sel.getFullYear()) : 'Изберете дата';
      var html = '<div class="m3-modal-panel">';
      html += '<div class="m3-modal-header"><p class="m3-modal-eyebrow">ИЗБЕРЕТЕ ДАТА</p><p class="m3-modal-title' + (sel ? '' : ' placeholder') + '">' + hdText + '</p></div>';

      if (mode === 'day') {
        html += '<div class="m3-nav-row">' +
          '<button type="button" class="m3-icon-btn" data-act="prevmonth" aria-label="Предишен месец"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>' +
          '<button type="button" class="m3-nav-label" data-act="toyear">' + BG_MONTHS[viewMonth] + ' ' + viewYear + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></button>' +
          '<button type="button" class="m3-icon-btn" data-act="nextmonth" aria-label="Следващ месец"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>' +
          '</div>';
        html += '<div class="m3-day-head">' + BG_DAYS_SHORT.map(function (d) { return '<span>' + d + '</span>'; }).join('') + '</div>';

        var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
        var startDow = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
        var prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();
        var cells = [];
        for (var i = 0; i < startDow; i++) cells.push({ d: prevMonthDays - startDow + 1 + i, kind: 'prev' });
        for (var d = 1; d <= daysInMonth; d++) cells.push({ d: d, kind: 'cur' });
        while (cells.length < 42) cells.push({ d: cells.length - startDow - daysInMonth + 1, kind: 'next' });

        html += '<div class="m3-day-grid">';
        cells.forEach(function (c) {
          var cur = c.kind === 'cur';
          var isSel = cur && sel && sel.getDate() === c.d && sel.getMonth() === viewMonth && sel.getFullYear() === viewYear;
          var isToday = cur && c.d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
          var cls = 'm3-day-cell' + (cur ? '' : ' outside') + (isSel ? ' selected' : '') + (isToday && !isSel ? ' today' : '');
          html += '<button type="button" class="' + cls + '" ' + (cur ? 'data-act="pickday" data-day="' + c.d + '"' : 'disabled') + '>' + c.d + '</button>';
        });
        html += '</div>';
      } else if (mode === 'month') {
        html += '<div class="m3-nav-row"><span style="flex:1;"></span>' +
          '<button type="button" class="m3-nav-label" data-act="toyear" style="flex:0 0 auto; padding-left:14px; padding-right:14px;">' + viewYear + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></button>' +
          '<button type="button" class="m3-icon-btn" data-act="todayview" aria-label="Затвори"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
          '</div>';
        html += '<div class="m3-month-grid">';
        BG_MONTHS.forEach(function (name, i) {
          var active = i === viewMonth;
          var isCurMonth = viewYear === today.getFullYear() && i === today.getMonth();
          html += '<button type="button" class="m3-chip' + (active ? ' selected' : '') + (isCurMonth && !active ? ' today' : '') + '" data-act="pickmonth" data-month="' + i + '">' + name + '</button>';
        });
        html += '</div>';
      } else {
        html += '<div class="m3-nav-row"><span style="flex:1; text-align:center; font-family:var(--font-body); font-weight:600; font-size:0.9rem; color:var(--foreground); padding-left:40px;">Изберете година</span>' +
          '<button type="button" class="m3-icon-btn" data-act="todayview" aria-label="Затвори"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
          '</div>';
        html += '<div class="m3-year-scroll" id="m3-year-scroll"><div class="m3-year-grid-inner">';
        for (var y = YEAR_START; y <= YEAR_END; y++) {
          var activeY = y === viewYear;
          html += '<button type="button" class="m3-chip' + (activeY ? ' selected' : '') + (y === today.getFullYear() && !activeY ? ' today' : '') + '" data-act="pickyear" data-year="' + y + '" ' + (activeY ? 'data-selected="1"' : '') + '>' + y + '</button>';
        }
        html += '</div></div>';
      }

      html += '<div class="m3-modal-divider"></div>';
      html += '<div class="m3-modal-actions">' +
        '<button type="button" class="m3-modal-btn" data-act="cancel">Отказ</button>' +
        '<button type="button" class="m3-modal-btn filled" data-act="ok"' + (sel ? '' : ' disabled') + '>OK</button>' +
        '</div></div>';

      overlay.innerHTML = html;

      overlay.querySelectorAll('[data-act]').forEach(function (el) {
        el.addEventListener('click', function () {
          var act = el.dataset.act;
          if (act === 'prevmonth') { if (viewMonth === 0) { viewMonth = 11; viewYear--; } else viewMonth--; render(); }
          else if (act === 'nextmonth') { if (viewMonth === 11) { viewMonth = 0; viewYear++; } else viewMonth++; render(); }
          else if (act === 'toyear') { mode = 'year'; render(); }
          else if (act === 'todayview') { mode = 'day'; render(); }
          else if (act === 'pickday') { sel = new Date(viewYear, viewMonth, parseInt(el.dataset.day, 10)); render(); }
          else if (act === 'pickmonth') { viewMonth = parseInt(el.dataset.month, 10); mode = 'day'; render(); }
          else if (act === 'pickyear') { viewYear = parseInt(el.dataset.year, 10); mode = 'month'; render(); }
          else if (act === 'cancel') { close(); }
          else if (act === 'ok') { if (sel) { onConfirm(sel); close(); } }
        });
      });

      if (mode === 'year') {
        var container = overlay.querySelector('#m3-year-scroll');
        var target = overlay.querySelector('[data-selected="1"]');
        if (container && target) container.scrollTop = target.offsetTop - container.clientHeight / 2 + target.clientHeight / 2;
      }
    }

    render();
  }

  function openTimePicker(initial, onConfirm) {
    var hourRaw = initial ? pad2(initial.h) : '';
    var minRaw = initial ? pad2(initial.m) : '';

    var overlay = document.createElement('div');
    overlay.className = 'm3-modal-overlay';
    overlay.innerHTML =
      '<div class="m3-modal-panel">' +
      '<div class="m3-modal-header"><p class="m3-modal-eyebrow">ИЗБЕРЕТЕ ЧАС</p><p class="m3-time-hint" style="padding:0; margin-top:4px;">Въведете часа директно (24-часов формат)</p></div>' +
      '<div class="m3-time-row">' +
      '<div class="m3-time-box" id="m3-hour-box"><input type="text" inputmode="numeric" maxlength="2" id="m3-hour-input" placeholder="ЧЧ" value="' + hourRaw + '"><span class="m3-time-sub" id="m3-hour-sub">Час</span></div>' +
      '<span class="m3-time-colon">:</span>' +
      '<div class="m3-time-box" id="m3-min-box"><input type="text" inputmode="numeric" maxlength="2" id="m3-min-input" placeholder="ММ" value="' + minRaw + '"><span class="m3-time-sub" id="m3-min-sub">Минути</span></div>' +
      '</div>' +
      '<div class="m3-modal-divider"></div>' +
      '<div class="m3-modal-actions">' +
      '<button type="button" class="m3-modal-btn" data-act="cancel">Отказ</button>' +
      '<button type="button" class="m3-modal-btn filled" id="m3-time-ok" disabled>OK</button>' +
      '</div></div>';
    document.body.appendChild(overlay);
    function close() { overlay.remove(); }
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

    var hInput = overlay.querySelector('#m3-hour-input'), mInput = overlay.querySelector('#m3-min-input');
    var hBox = overlay.querySelector('#m3-hour-box'), mBox = overlay.querySelector('#m3-min-box');
    var hSub = overlay.querySelector('#m3-hour-sub'), mSub = overlay.querySelector('#m3-min-sub');
    var okBtn = overlay.querySelector('#m3-time-ok');
    var hourErr = false, minErr = false;

    function refreshOk() { okBtn.disabled = !(hourRaw !== '' && minRaw !== '' && !hourErr && !minErr); }

    hInput.addEventListener('input', function () {
      var raw = hInput.value.replace(/[^0-9]/g, '').slice(0, 2);
      hInput.value = raw; hourRaw = raw;
      var n = parseInt(raw, 10);
      hourErr = raw !== '' && (isNaN(n) || n < 0 || n > 23);
      hBox.classList.toggle('err', hourErr);
      hSub.textContent = hourErr ? '0–23' : 'Час';
      refreshOk();
      if (raw.length === 2 && !hourErr) { mInput.focus(); }
    });
    mInput.addEventListener('input', function () {
      var raw = mInput.value.replace(/[^0-9]/g, '').slice(0, 2);
      mInput.value = raw; minRaw = raw;
      var n = parseInt(raw, 10);
      minErr = raw !== '' && (isNaN(n) || n < 0 || n > 59);
      mBox.classList.toggle('err', minErr);
      mSub.textContent = minErr ? '0–59' : 'Минути';
      refreshOk();
    });
    hInput.addEventListener('focus', function () { hBox.classList.add('focus'); });
    hInput.addEventListener('blur', function () { hBox.classList.remove('focus'); if (hourRaw && !hourErr) { hourRaw = pad2(parseInt(hourRaw, 10)); hInput.value = hourRaw; } });
    mInput.addEventListener('focus', function () { mBox.classList.add('focus'); });
    mInput.addEventListener('blur', function () { mBox.classList.remove('focus'); if (minRaw && !minErr) { minRaw = pad2(parseInt(minRaw, 10)); mInput.value = minRaw; } });

    overlay.querySelector('[data-act="cancel"]').addEventListener('click', close);
    okBtn.addEventListener('click', function () {
      if (okBtn.disabled) return;
      onConfirm({ h: parseInt(hourRaw, 10), m: parseInt(minRaw, 10) });
      close();
    });

    refreshOk();
    hInput.focus();
  }

  /* ───────────────────────── Натална форма ───────────────────────── */

  var selectedBirthDate = null; // Date (само ден/месец/година)
  var selectedBirthTime = null; // {h, m}

  function updateDateField() {
    var label = $('date-field-label'), value = $('date-field-value');
    if (selectedBirthDate) {
      value.textContent = selectedBirthDate.getDate() + ' ' + BG_MONTHS_GEN[selectedBirthDate.getMonth()] + ' ' + selectedBirthDate.getFullYear();
      value.classList.add('filled'); label.classList.add('filled');
    } else {
      value.textContent = ''; value.classList.remove('filled'); label.classList.remove('filled');
    }
  }
  function updateTimeField() {
    var label = $('time-field-label'), value = $('time-field-value');
    if (selectedBirthTime) {
      value.textContent = pad2(selectedBirthTime.h) + ':' + pad2(selectedBirthTime.m);
      value.classList.add('filled'); label.classList.add('filled');
    } else {
      value.textContent = ''; value.classList.remove('filled'); label.classList.remove('filled');
    }
  }

  function initNatalForm() {
    initCityAutocomplete();
    updateDateField();
    updateTimeField();

    $('date-field-btn').addEventListener('click', function () {
      openDatePicker(selectedBirthDate, function (d) { selectedBirthDate = d; updateDateField(); });
    });
    $('time-field-btn').addEventListener('click', function () {
      openTimePicker(selectedBirthTime, function (t) { selectedBirthTime = t; updateTimeField(); });
    });

    $('natal-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!selectedBirthDate) { openDatePicker(null, function (d) { selectedBirthDate = d; updateDateField(); }); return; }

      var time = selectedBirthTime || { h: 12, m: 0 };
      var city = resolveCity();
      if (!city) {
        var typed = $('city-input').value.trim();
        showCityError(typed
          ? 'Няма населено място „' + typed + '" в списъка. Изберете от предложенията.'
          : 'Моля, изберете място на раждане от списъка.');
        return;
      }
      var btn = $('calc-btn'), label = $('calc-btn-label');
      btn.disabled = true;
      label.textContent = 'Изчислява се...';
      btn.insertAdjacentHTML('afterbegin', '<span class="spinner" id="calc-spinner"></span>');
      $('calc-btn').querySelector('svg').style.display = 'none';

      setTimeout(function () {
        var opts = {
          year: selectedBirthDate.getFullYear(), month: selectedBirthDate.getMonth() + 1, day: selectedBirthDate.getDate(),
          hour: time.h, minute: time.m, second: 0,
          utcOffset: guessBulgariaOffset(selectedBirthDate.getMonth() + 1),
          lat: city.lat, lon: city.lon,
          name: ($('birth-name').value || '').trim(),
          placeName: city.name
        };
        var chart = AstroCore.computeChart(opts);
        chart.opts = opts;
        renderNatalResults(chart);

        btn.disabled = false;
        label.textContent = 'Изчисли картата';
        var sp = $('calc-spinner'); if (sp) sp.remove();
        btn.querySelector('svg').style.display = '';

        $('natal-results').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    });

    $('download-pdf-btn').addEventListener('click', function () {
      if (!lastChart) return;
      var btn = $('download-pdf-btn'), label = $('download-pdf-label');
      var prev = label.textContent;
      btn.disabled = true;
      label.textContent = 'Създава се PDF…';
      Promise.resolve(buildPDF(lastChart)).then(function () {
        btn.disabled = false; label.textContent = prev;
      }, function () {
        btn.disabled = false; label.textContent = prev;
      });
    });
  }

  /* ───────────────────────── Инициализация ───────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    initChrome();
    var nowChart = getNowChart();
    renderMoon(nowChart);
    renderHoroscope(nowChart);
    initNatalForm();
  });
})();
