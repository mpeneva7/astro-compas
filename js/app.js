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

  var CITY_COORDS = {
    'София': [42.6977, 23.3219], 'Пловдив': [42.1354, 24.7453], 'Варна': [43.2141, 27.9147],
    'Бургас': [42.5048, 27.4626], 'Русе': [43.8564, 25.9704], 'Стара Загора': [42.4258, 25.6345],
    'Плевен': [43.4170, 24.6067], 'Сливен': [42.6816, 26.3181], 'Добрич': [43.5726, 27.8273],
    'Шумен': [43.2712, 26.9223], 'Перник': [42.6053, 23.0375], 'Хасково': [41.9344, 25.5551],
    'Ямбол': [42.4839, 26.5106], 'Пазарджик': [42.1924, 24.3338], 'Благоевград': [42.0195, 23.0943],
    'Враца': [43.2109, 23.5578], 'Габрово': [42.8747, 25.3277], 'Асеновград': [42.0106, 24.8753],
    'Видин': [43.9910, 22.8672], 'Казанлък': [42.6186, 25.3980], 'Кюстендил': [42.2833, 22.6900],
    'Монтана': [43.4125, 23.2249], 'Смолян': [41.5767, 24.7128], 'Петрич': [41.4047, 23.2058],
    'Карлово': [42.6386, 24.8064], 'Велико Търново': [43.0757, 25.6172], 'Ловеч': [43.1349, 24.7140]
  };
  var BG_CITIES = Object.keys(CITY_COORDS);

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

  function signCardHTML(chart, i) {
    var sign = SIGN_INFO[i];
    var reading = DailyHoroscope.buildReading(chart, i, chart.now);
    var isOpen = openSignIndex === i;
    var html =
      '<div class="sign-card-inner">' +
      '<div class="sign-glyph-circle" style="background:' + sign.c + '18; border:1px solid ' + sign.c + '40; color:' + sign.c + ';">' + sign.g + '</div>' +
      '<h3>' + sign.name + '</h3>' +
      '<p class="sign-dates">' + sign.dates + '</p>' +
      '<p class="sign-day-text">' + reading.day + '</p>';
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

  var selectedCity = { name: '', lat: null, lon: null };

  function initCityAutocomplete() {
    var input = $('city-input');
    var dropdown = $('city-dropdown');

    function showMatches() {
      var q = input.value.trim().toLowerCase();
      if (!q) { dropdown.classList.remove('open'); return; }
      var matches = BG_CITIES.filter(function (c) { return c.toLowerCase().indexOf(q) === 0; }).slice(0, 6);
      if (!matches.length) { dropdown.classList.remove('open'); return; }
      dropdown.innerHTML = '';
      matches.forEach(function (c) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = c;
        btn.addEventListener('mousedown', function () {
          input.value = c;
          selectedCity = { name: c, lat: CITY_COORDS[c][0], lon: CITY_COORDS[c][1] };
          dropdown.classList.remove('open');
        });
        dropdown.appendChild(btn);
      });
      dropdown.classList.add('open');
    }

    input.addEventListener('input', showMatches);
    input.addEventListener('focus', showMatches);
    input.addEventListener('blur', function () { setTimeout(function () { dropdown.classList.remove('open'); }, 160); });
  }

  function resolveCity() {
    var typed = $('city-input').value.trim();
    if (selectedCity.name && selectedCity.name.toLowerCase() === typed.toLowerCase()) return selectedCity;
    var exact = BG_CITIES.filter(function (c) { return c.toLowerCase() === typed.toLowerCase(); })[0];
    if (exact) return { name: exact, lat: CITY_COORDS[exact][0], lon: CITY_COORDS[exact][1] };
    return { name: 'София (по подразбиране)', lat: CITY_COORDS['София'][0], lon: CITY_COORDS['София'][1] };
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

  function buildICS(chart, cityName) {
    var utcMillis = Date.UTC(chart.opts.year, chart.opts.month - 1, chart.opts.day, chart.opts.hour, chart.opts.minute) - chart.opts.utcOffset * 3600000;
    var d = new Date(utcMillis);
    var dt = d.getUTCFullYear() + pad2(d.getUTCMonth() + 1) + pad2(d.getUTCDate()) + 'T' + pad2(d.getUTCHours()) + pad2(d.getUTCMinutes()) + '00Z';
    var now = new Date();
    var stamp = now.getUTCFullYear() + pad2(now.getUTCMonth() + 1) + pad2(now.getUTCDate()) + 'T' + pad2(now.getUTCHours()) + pad2(now.getUTCMinutes()) + pad2(now.getUTCSeconds()) + 'Z';

    var lines = [];
    chart.order.forEach(function (name) {
      var p = chart.planets[name];
      lines.push(p.nameBg + ': ' + p.sign + ' ' + fmtDeg(p));
    });
    lines.push('Асцендент: ' + chart.asc.sign + ' ' + fmtDeg(chart.asc));
    lines.push('MC: ' + chart.mc.sign + ' ' + fmtDeg(chart.mc));

    function esc(s) { return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }

    var ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//АстроКомпас//Натална карта//BG',
      'BEGIN:VEVENT',
      'UID:' + dt + '-astrokompas@local',
      'DTSTAMP:' + stamp,
      'DTSTART:' + dt,
      'SUMMARY:' + esc('Натална карта — ' + cityName),
      'DESCRIPTION:' + esc(lines.join('\n')),
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');

    var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'natalna-karta.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
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
          lat: city.lat, lon: city.lon
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

    $('download-ics-btn').addEventListener('click', function () {
      if (!lastChart) return;
      buildICS(lastChart, resolveCity().name);
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
