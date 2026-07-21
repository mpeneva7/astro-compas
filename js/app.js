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

  var ASPECT_TONE = {
    'съвпад': 'поставя силен акцент върху', 'опозиция': 'създава напрежение около',
    'квадрат': 'изпитва търпението ви около', 'тригон': 'носи лекота и подкрепа на',
    'секстил': 'отваря благоприятна възможност за'
  };
  var ASPECT_COLOR = { 'тригон': '#4CAF50', 'секстил': '#4CAF50', 'квадрат': '#EF5350', 'опозиция': '#EF5350', 'съвпад': '#E8C36A' };

  var DAY_THEME = {
    sun: 'личната ви жизненост и себеизява', moon: 'емоциите и вътрешния ви свят', mercury: 'мисленето и общуването',
    venus: 'любовта, хармонията и финансите', mars: 'енергията и амбициите', jupiter: 'растежа и възможностите',
    saturn: 'дисциплината и границите', uranus: 'промените и неочакваните обрати', neptune: 'интуицията и вдъхновението',
    pluto: 'трансформацията и дълбоките промени'
  };
  var LOVE_THEME = {
    venus: 'привличането и хармонията във връзките', mars: 'страстта и инициативата в любовта', moon: 'емоционалната близост',
    sun: 'начина, по който се показвате в отношенията', mercury: 'разговорите с партньора', jupiter: 'доверието във връзката',
    saturn: 'обвързаността и границите', uranus: 'нуждата от свобода в отношенията', neptune: 'романтиката и идеализацията',
    pluto: 'интензивността и дълбочината на връзката'
  };
  var WORK_THEME = {
    saturn: 'дисциплината и дългосрочните цели', jupiter: 'възможностите за растеж', mercury: 'комуникацията и преговорите',
    sun: 'лидерската ви позиция', mars: 'темпото и инициативността', venus: 'сътрудничеството в екип',
    moon: 'нуждата от комфортна работна среда', uranus: 'неочакваните промени в плановете', neptune: 'нуждата от яснота в задачите',
    pluto: 'властовите динамики на работното място'
  };
  var MOOD_THEME = {
    moon: 'вътрешното ви равновесие', neptune: 'сънищата и интуицията', venus: 'усещането за удовлетвореност',
    mars: 'нивото на енергия', saturn: 'усещането за отговорност', sun: 'самочувствието', mercury: 'умствената яснота',
    jupiter: 'оптимизма', uranus: 'неспокойствието и жаждата за промяна', pluto: 'дълбоки вътрешни трансформации'
  };

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
  var BG_WEEKDAYS = ['неделя', 'понеделник', 'вторник', 'сряда', 'четвъртък', 'петък', 'събота'];
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

  var ARTICLES = [
    { id: 1, title: 'Ретрограден Меркурий: Какво означава за вас', cat: 'Ретрограден Меркурий', readTime: '5 мин',
      excerpt: 'Когато Меркурий върви назад, комуникацията и технологиите изпитват смущения. Научете как да навигирате тези периоди с изящество.',
      more: 'Технически, Меркурий не се движи назад — това е оптична илюзия, причинена от разликата в орбиталните скорости на Земята и Меркурий. Тези периоди се случват около 3–4 пъти годишно и траят около три седмици.',
      grad: 'linear-gradient(135deg, #1a1040 0%, #2d1b5e 100%)', kw: ['меркурий', 'ретрограден', 'комуникация'] },
    { id: 2, title: 'Пълнолунието в Козирог: Трансформация на амбициите', cat: 'Луна', readTime: '4 мин',
      excerpt: 'Предстоящото пълнолуние активира сектора на кариерата. Разберете кои знаци ще усетят най-силно тази лунна енергия.',
      more: 'Пълнолунията винаги активират оста на знака и неговия противоположен знак — в случая Козирог и Рак, засягайки баланса между кариера и дом.',
      grad: 'linear-gradient(135deg, #0d1b3e 0%, #1a3464 100%)', kw: ['луна', 'пълнолуние', 'козирог'] },
    { id: 3, title: 'Юпитер в Близнаци: Година на разширението', cat: 'Планети', readTime: '6 мин',
      excerpt: 'Голямата планета на щастието преминава през знака на комуникацията, носейки потенциал за учене и пътувания.',
      more: 'Юпитер обикаля Слънцето за около 12 години, като прекарва приблизително по една година във всеки зодиакален знак.',
      grad: 'linear-gradient(135deg, #3a2000 0%, #6b3a00 100%)', kw: ['юпитер', 'близнаци', 'планети'] },
    { id: 4, title: 'Вашият Асцендент: Маската, която носим', cat: 'Зодии', readTime: '7 мин',
      excerpt: 'Асцендентът определя как светът ни вижда. Разберете дълбокото влияние на изгряващия знак върху личността.',
      more: 'За разлика от слънчевия знак, асцендентът се променя на всеки около два часа, затова точният час на раждане е ключов за неговото изчисляване.',
      grad: 'linear-gradient(135deg, #2d1030 0%, #5a1f5e 100%)', kw: ['асцендент', 'натална карта', 'зодии'] },
    { id: 5, title: 'Луната в Скорпион: Дълбока емоционална трансформация', cat: 'Луна', readTime: '4 мин',
      excerpt: 'Когато Луната транзитира Скорпион, емоциите се задълбочават и интензивността нараства значително.',
      more: 'Луната преминава през целия зодиак за около 27.3 дни, задържайки се средно по 2–3 дни във всеки знак.',
      grad: 'linear-gradient(135deg, #3a0808 0%, #6b1515 100%)', kw: ['луна', 'скорпион', 'емоции', 'трансформация'] },
    { id: 6, title: 'Сатурн: Учителят на Зодиака', cat: 'Планети', readTime: '8 мин',
      excerpt: 'Сатурн, планетата на дисциплината и кармата, ни учи чрез предизвикателства. Как неговата позиция формира характера ни?',
      more: 'Сатурн обикаля Слънцето за около 29.5 години — период, известен като „завръщането на Сатурн", което много астролози свързват със значими житейски преходи около 29-годишна възраст.',
      grad: 'linear-gradient(135deg, #1a1a2e 0%, #2e2e4a 100%)', kw: ['сатурн', 'планети', 'карма', 'дисциплина'] }
  ];

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

  /* ───────────────────────── Дневен хороскоп ───────────────────────── */

  function aspectsToSignMid(chart, signIndex) {
    var refLon = signIndex * 30 + 15;
    var hits = [];
    chart.order.forEach(function (name) {
      if (name === 'sun') return;
      var asp = AstroCore.findAspect(chart.planets[name].lon, refLon);
      if (asp) hits.push(Object.assign({ planet: name }, asp));
    });
    hits.sort(function (a, b) { return a.orb - b.orb; });
    return hits;
  }

  function pickThemed(hits, themeMap, fallback) {
    for (var i = 0; i < hits.length; i++) {
      if (themeMap[hits[i].planet]) {
        var h = hits[i];
        return AstroCore.PLANET_SYMBOLS[h.planet] + ' ' + AstroCore.PLANET_NAMES_BG[h.planet] + ' ' +
          (ASPECT_TONE[h.type] || 'влияе върху') + ' ' + themeMap[h.planet] + '.';
      }
    }
    return fallback;
  }

  function buildSignReading(chart, idx) {
    var name = AstroCore.SIGNS[idx];
    var hits = aspectsToSignMid(chart, idx);
    var top = hits.slice(0, 2);

    var day = top.length
      ? top.map(function (h) {
          return AstroCore.PLANET_SYMBOLS[h.planet] + ' ' + AstroCore.PLANET_NAMES_BG[h.planet] + ' ' +
            (ASPECT_TONE[h.type] || 'влияе върху') + ' ' + (DAY_THEME[h.planet] || 'важна за вас сфера') + '.';
        }).join(' ')
      : 'Небето е сравнително спокойно за ' + name + ' днес — добър момент за рутина и вътрешно съсредоточаване.';

    var love = pickThemed(hits, LOVE_THEME, 'Без силни любовни транзити днес — спокоен момент за отношенията.');
    var work = pickThemed(hits, WORK_THEME, 'Работният ден е сравнително неутрален — фокусирайте се върху рутинните задачи.');
    var mood = pickThemed(hits, MOOD_THEME, 'Настроението е стабилно, без силни външни влияния.');

    return { day: day, love: love, work: work, mood: mood };
  }

  var openSignIndex = null;

  function signCardHTML(chart, i) {
    var sign = SIGN_INFO[i];
    var reading = buildSignReading(chart, i);
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

    SIGN_INFO.forEach(function (sign, i) {
      var card = document.createElement('div');
      card.className = 'sign-card';
      card.dataset.index = i;
      card.addEventListener('click', function () {
        openSignIndex = (openSignIndex === i) ? null : i;
        Array.prototype.forEach.call(grid.children, refreshCard);
      });
      refreshCard(card);
      grid.appendChild(card);
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

  function initNatalForm() {
    initCityAutocomplete();

    $('natal-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var dateVal = $('birth-date').value;
      var timeVal = $('birth-time').value || '12:00';
      if (!dateVal) return;

      var city = resolveCity();
      var btn = $('calc-btn'), label = $('calc-btn-label');
      btn.disabled = true;
      label.textContent = 'Изчислява се...';
      btn.insertAdjacentHTML('afterbegin', '<span class="spinner" id="calc-spinner"></span>');
      $('calc-btn').querySelector('svg').style.display = 'none';

      setTimeout(function () {
        var parts = dateVal.split('-').map(Number);
        var tparts = timeVal.split(':').map(Number);
        var opts = {
          year: parts[0], month: parts[1], day: parts[2],
          hour: tparts[0], minute: tparts[1], second: 0,
          utcOffset: guessBulgariaOffset(parts[1]),
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

  /* ───────────────────────── Верификация ───────────────────────── */

  var REFERENCE = {
    year: 1990, month: 6, day: 7, hour: 2, minute: 20, utcOffset: 3, lat: 42.6977, lon: 23.3219,
    expected: {
      sun: ['Близнаци', 15, 59], moon: ['Скорпион', 29, 40], mercury: ['Телец', 22, 46], venus: ['Телец', 8, 47],
      mars: ['Овен', 4, 53], jupiter: ['Рак', 14, 4], saturn: ['Козирог', 24, 29], uranus: ['Козирог', 8, 29],
      neptune: ['Козирог', 13, 56], pluto: ['Скорпион', 15, 36]
    },
    asc: ['Риби', 27, 9], mc: ['Стрелец', 28, 34]
  };

  function diffFromExpected(actualLon, exp) {
    var expLon = AstroCore.SIGNS.indexOf(exp[0]) * 30 + exp[1] + exp[2] / 60;
    return AstroCore.angleDiff(actualLon, expLon);
  }

  function initVerify() {
    $('verify-btn').addEventListener('click', function () {
      var chart = AstroCore.computeChart(REFERENCE);
      var rows = [];
      var allOk = true;

      Object.keys(REFERENCE.expected).forEach(function (name) {
        var exp = REFERENCE.expected[name];
        var p = chart.planets[name];
        var diff = diffFromExpected(p.lon, exp);
        var ok = diff <= 1.0;
        if (!ok) allOk = false;
        rows.push({ label: p.nameBg, expected: exp[0] + ' ' + exp[1] + '°' + exp[2], got: p.sign + ' ' + p.degree + '°' + p.minute, diff: diff, ok: ok });
      });
      var ascDiff = diffFromExpected(chart.asc.longitude, REFERENCE.asc);
      var mcDiff = diffFromExpected(chart.mc.longitude, REFERENCE.mc);
      if (ascDiff > 1) allOk = false;
      if (mcDiff > 1) allOk = false;
      rows.push({ label: 'Асцендент', expected: REFERENCE.asc.join(' ').replace(' ', ' ') , got: chart.asc.sign + ' ' + chart.asc.degree + '°' + chart.asc.minute, diff: ascDiff, ok: ascDiff <= 1 });
      rows.push({ label: 'MC', expected: REFERENCE.mc[0] + ' ' + REFERENCE.mc[1] + '°' + REFERENCE.mc[2], got: chart.mc.sign + ' ' + chart.mc.degree + '°' + chart.mc.minute, diff: mcDiff, ok: mcDiff <= 1 });

      $('verify-tbody').innerHTML = rows.map(function (r) {
        return '<tr><td>' + r.label + '</td><td>' + r.expected + '</td><td>' + r.got + '</td>' +
          '<td class="' + (r.ok ? 'verify-ok' : 'verify-warn') + '">' + r.diff.toFixed(2) + '° ' + (r.ok ? '✓' : '✗') + '</td></tr>';
      }).join('');
      $('verify-summary').textContent = allOk ? '✓ Всички стойности са в рамките на толеранс от 1°.' : '✗ Има стойности извън толеранса.';
      $('verify-summary').className = 'verify-summary ' + (allOk ? 'verify-ok' : 'verify-warn');
      $('verify-result').style.display = '';
    });
  }

  /* ───────────────────────── Статии ───────────────────────── */

  function renderArticles(filterQ) {
    var q = (filterQ || '').trim().toLowerCase();
    var list = q.length > 1
      ? ARTICLES.filter(function (a) {
          return a.title.toLowerCase().indexOf(q) !== -1 ||
            a.kw.some(function (k) { return k.indexOf(q) !== -1; }) ||
            a.cat.toLowerCase().indexOf(q) !== -1;
        })
      : ARTICLES;

    var grid = $('articles-grid');
    grid.innerHTML = list.map(function (a) {
      return '<div class="article-card">' +
        '<div class="article-cover" style="background:' + a.grad + ';"><span class="article-cat">' + a.cat + '</span></div>' +
        '<div class="article-body">' +
        '<h3>' + a.title + '</h3>' +
        '<p class="article-excerpt">' + a.excerpt + '</p>' +
        '<p class="article-more" id="more-' + a.id + '">' + a.more + '</p>' +
        '<div class="article-footer-row"><span class="article-readtime">' + a.readTime + ' четене</span>' +
        '<button class="article-readmore" data-id="' + a.id + '">Прочети →</button></div>' +
        '</div></div>';
    }).join('');

    grid.querySelectorAll('.article-readmore').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var more = $('more-' + btn.dataset.id);
        var showing = more.classList.toggle('show');
        btn.textContent = showing ? 'Скрий ↑' : 'Прочети →';
      });
    });

    $('no-articles').style.display = list.length ? 'none' : '';
    if (!list.length) $('no-articles').textContent = 'Няма намерени статии за „' + filterQ + '"';
  }

  function initArticles() {
    renderArticles('');
    $('article-search-input').addEventListener('input', function (e) { renderArticles(e.target.value); });
  }

  /* ───────────────────────── Инициализация ───────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    initChrome();
    var nowChart = getNowChart();
    renderMoon(nowChart);
    renderHoroscope(nowChart);
    initNatalForm();
    initVerify();
    initArticles();
  });
})();
