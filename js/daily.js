/* Астро Компас — логика на дневния хороскоп */
(function () {
  'use strict';

  var REF_LOCATION = { lat: 42.6977, lon: 23.3219 }; // София — само за референтна ориентация

  var MONTHS_BG = ['януари', 'февруари', 'март', 'април', 'май', 'юни', 'юли', 'август', 'септември', 'октомври', 'ноември', 'декември'];

  var PLANET_THEMES = {
    sun: 'личната ви жизненост и себеизява',
    moon: 'емоциите и вътрешния ви свят',
    mercury: 'мисленето и общуването',
    venus: 'любовта, хармонията и финансите',
    mars: 'енергията, действието и амбициите',
    jupiter: 'растежа, късмета и възможностите',
    saturn: 'дисциплината, отговорностите и границите',
    uranus: 'промените и неочакваните обрати',
    neptune: 'интуицията, мечтите и вдъхновението',
    pluto: 'трансформацията и дълбоките промени'
  };

  var ASPECT_TONE = {
    'съвпад': 'поставя силен акцент върху',
    'опозиция': 'създава напрежение около',
    'квадрат': 'изпитва търпението ви във връзка с',
    'тригон': 'носи лекота и подкрепа в',
    'секстил': 'отваря благоприятна възможност в'
  };

  var ASPECT_FAVORABLE = { 'тригон': 1, 'секстил': 1, 'съвпад': 0, 'опозиция': -1, 'квадрат': -1 };

  function $(id) { return document.getElementById(id); }

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

  function renderHeader(chart) {
    var now = chart.now;
    var dateStr = now.getDate() + ' ' + MONTHS_BG[now.getMonth()] + ' ' + now.getFullYear() + ' г.';
    $('today-date').textContent = dateStr;
    var sun = chart.planets.sun;
    $('today-sun').textContent = 'Слънцето е в ' + sun.sign + ' (' + sun.degree + '°' + String(sun.minute).padStart(2, '0') + '′)';
  }

  function renderMoonPhase(chart) {
    var sun = chart.planets.sun, moon = chart.planets.moon;
    var phase = AstroCore.moonPhase(sun.lon, moon.lon);
    $('moon-phase-name').textContent = phase.symbol + ' ' + phase.name;
    $('moon-sign').textContent = 'Луната е в ' + moon.symbol + ' ' + moon.sign + ' ' + moon.degree + '°' + String(moon.minute).padStart(2, '0') + '′';
    $('moon-illum').textContent = 'Осветеност: ' + Math.round(phase.illumination * 100) + '%';
  }

  function renderRetrogrades(chart) {
    var box = $('retro-list');
    box.innerHTML = '';
    var any = false;
    chart.order.forEach(function (name) {
      if (name === 'sun' || name === 'moon') return;
      if (AstroCore.isRetrograde(name, chart.T)) {
        any = true;
        var span = document.createElement('span');
        span.className = 'pill retro';
        span.textContent = '℞ ' + AstroCore.PLANET_SYMBOLS[name] + ' ' + AstroCore.PLANET_NAMES_BG[name];
        box.appendChild(span);
      }
    });
    if (!any) {
      var span = document.createElement('span');
      span.className = 'pill';
      span.textContent = 'Няма ретроградни планети днес';
      box.appendChild(span);
    }
  }

  function renderAspects(chart) {
    var tbody = $('daily-aspects-tbody');
    tbody.innerHTML = '';
    var aspects = AstroCore.computeAspects(chart.planets, chart.order);
    aspects.sort(function (a, b) { return a.orb - b.orb; });
    if (aspects.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4">Няма значими аспекти между транзитните планети днес.</td></tr>';
      return;
    }
    aspects.forEach(function (a) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + AstroCore.PLANET_SYMBOLS[a.p1] + ' ' + chart.planets[a.p1].nameBg + '</td>' +
        '<td><span class="sym">' + a.symbol + '</span> ' + a.type + '</td>' +
        '<td>' + AstroCore.PLANET_SYMBOLS[a.p2] + ' ' + chart.planets[a.p2].nameBg + '</td>' +
        '<td>орбис ' + a.orb.toFixed(1) + '°</td>';
      tbody.appendChild(tr);
    });
  }

  function aspectsToSign(chart, signIndex) {
    var refLon = signIndex * 30 + 15; // среда на знака
    var hits = [];
    chart.order.forEach(function (name) {
      if (name === 'sun') return; // Слънцето само определя знака, не се "аспектира" със себе си
      var asp = AstroCore.findAspect(chart.planets[name].lon, refLon);
      if (asp) hits.push(Object.assign({ planet: name }, asp));
    });
    hits.sort(function (a, b) { return a.orb - b.orb; });
    return hits;
  }

  function generateSignText(chart, signIndex) {
    var signName = AstroCore.SIGNS[signIndex];
    var hits = aspectsToSign(chart, signIndex).slice(0, 3);
    if (hits.length === 0) {
      return 'Днес небето е сравнително спокойно за ' + signName + ' — добър ден за рутинни задачи и вътрешно съсредоточаване, без силни външни влияния.';
    }
    var sentences = hits.map(function (h) {
      var tone = ASPECT_TONE[h.type] || 'влияе върху';
      var theme = PLANET_THEMES[h.planet] || 'важна за вас сфера';
      return AstroCore.PLANET_SYMBOLS[h.planet] + ' ' + AstroCore.PLANET_NAMES_BG[h.planet] + ' ' + tone + ' ' + theme + '.';
    });
    var score = hits.reduce(function (sum, h) { return sum + (ASPECT_FAVORABLE[h.type] || 0); }, 0);
    var closing;
    if (score > 0) closing = 'Като цяло денят предразполага към положително развитие на нещата.';
    else if (score < 0) closing = 'Препоръчва се повече търпение и внимание към детайлите днес.';
    else closing = 'Смесени влияния — запазете баланс между действие и наблюдение.';
    return sentences.join(' ') + ' ' + closing;
  }

  function renderSignGrid(chart) {
    var grid = $('sign-grid');
    var detailBox = $('sign-detail-box');
    grid.innerHTML = '';

    AstroCore.SIGNS.forEach(function (signName, idx) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sign-btn';
      btn.dataset.index = idx;
      btn.innerHTML = '<span class="glyph">' + AstroCore.SIGN_SYMBOLS[idx] + '</span><span class="label">' + signName + '</span>';
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(grid.children, function (c) { c.classList.remove('active'); });
        btn.classList.add('active');
        showSignDetail(chart, idx);
      });
      grid.appendChild(btn);
    });

    // Покажи по подразбиране знака, в който е Слънцето днес
    var sunSignIndex = chart.planets.sun.signIndex;
    grid.children[sunSignIndex].classList.add('active');
    showSignDetail(chart, sunSignIndex);
  }

  function showSignDetail(chart, idx) {
    var box = $('sign-detail-box');
    var text = generateSignText(chart, idx);
    box.innerHTML =
      '<h3><span class="sym">' + AstroCore.SIGN_SYMBOLS[idx] + '</span> ' + AstroCore.SIGNS[idx] + '</h3>' +
      '<p>' + text + '</p>';
  }

  function init() {
    var chart = getNowChart();
    renderHeader(chart);
    renderMoonPhase(chart);
    renderRetrogrades(chart);
    renderAspects(chart);
    renderSignGrid(chart);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
