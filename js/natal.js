/* Астро Компас — логика на наталния калкулатор */
(function () {
  'use strict';

  var CITIES = {
    'sofia': { label: 'София', lat: 42.6977, lon: 23.3219 },
    'plovdiv': { label: 'Пловдив', lat: 42.1354, lon: 24.7453 },
    'varna': { label: 'Варна', lat: 43.2141, lon: 27.9147 },
    'burgas': { label: 'Бургас', lat: 42.5048, lon: 27.4626 },
    'ruse': { label: 'Русе', lat: 43.8564, lon: 25.9704 },
    'stara-zagora': { label: 'Стара Загора', lat: 42.4258, lon: 25.6345 },
    'pleven': { label: 'Плевен', lat: 43.4170, lon: 24.6067 },
    'blagoevgrad': { label: 'Благоевград', lat: 42.0195, lon: 23.0943 },
    'veliko-tarnovo': { label: 'Велико Търново', lat: 43.0757, lon: 25.6172 },
    'custom': { label: 'Друго (ръчно въвеждане)', lat: null, lon: null }
  };

  var REFERENCE = {
    year: 1990, month: 6, day: 7, hour: 2, minute: 20,
    utcOffset: 3, lat: 42.6977, lon: 23.3219,
    expected: {
      sun: { sign: 'Близнаци', deg: 15, min: 59 },
      moon: { sign: 'Скорпион', deg: 29, min: 40 },
      mercury: { sign: 'Телец', deg: 22, min: 46 },
      venus: { sign: 'Телец', deg: 8, min: 47 },
      mars: { sign: 'Овен', deg: 4, min: 53 },
      jupiter: { sign: 'Рак', deg: 14, min: 4 },
      saturn: { sign: 'Козирог', deg: 24, min: 29 },
      uranus: { sign: 'Козирог', deg: 8, min: 29 },
      neptune: { sign: 'Козирог', deg: 13, min: 56 },
      pluto: { sign: 'Скорпион', deg: 15, min: 36 }
    },
    ascExpected: { sign: 'Риби', deg: 27, min: 9 },
    mcExpected: { sign: 'Стрелец', deg: 28, min: 34 }
  };

  function $(id) { return document.getElementById(id); }

  function guessBulgariaOffset(year, month) {
    // Груба евристика за лятно/зимно часово време в България (април-октомври ≈ UTC+3)
    return (month >= 4 && month <= 10) ? 3 : 2;
  }

  function populateCitySelect() {
    var sel = $('city');
    Object.keys(CITIES).forEach(function (key) {
      var opt = document.createElement('option');
      opt.value = key;
      opt.textContent = CITIES[key].label;
      sel.appendChild(opt);
    });
    sel.value = 'sofia';
  }

  function onCityChange() {
    var key = $('city').value;
    var city = CITIES[key];
    var customFields = $('custom-location-fields');
    if (key === 'custom') {
      customFields.style.display = '';
    } else {
      customFields.style.display = 'none';
      $('lat').value = city.lat;
      $('lon').value = city.lon;
    }
  }

  function setDefaults() {
    var now = new Date();
    $('year').value = now.getFullYear();
    $('month').value = now.getMonth() + 1;
    $('day').value = now.getDate();
    $('hour').value = now.getHours();
    $('minute').value = now.getMinutes();
    $('utcOffset').value = guessBulgariaOffset(now.getFullYear(), now.getMonth() + 1);
    $('lat').value = CITIES.sofia.lat;
    $('lon').value = CITIES.sofia.lon;
  }

  function readForm() {
    return {
      year: parseInt($('year').value, 10),
      month: parseInt($('month').value, 10),
      day: parseInt($('day').value, 10),
      hour: parseInt($('hour').value, 10) || 0,
      minute: parseInt($('minute').value, 10) || 0,
      second: 0,
      utcOffset: parseFloat($('utcOffset').value),
      lat: parseFloat($('lat').value),
      lon: parseFloat($('lon').value)
    };
  }

  function renderPlanets(chart) {
    var tbody = $('planets-tbody');
    tbody.innerHTML = '';
    chart.order.forEach(function (name) {
      var p = chart.planets[name];
      var house = AstroCore.houseOfLongitude(p.lon, chart.houses);
      var retro = AstroCore.isRetrograde(name, chart.T);
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td><span class="sym">' + AstroCore.PLANET_SYMBOLS[name] + '</span> ' + p.nameBg + '</td>' +
        '<td><span class="sym">' + p.symbol + '</span> ' + p.sign + '</td>' +
        '<td>' + p.degree + '°' + String(p.minute).padStart(2, '0') + '′</td>' +
        '<td>Дом ' + house + '</td>' +
        '<td>' + (retro ? '<span class="pill retro">℞ ретрограден</span>' : '—') + '</td>';
      tbody.appendChild(tr);
    });
  }

  function renderAngles(chart) {
    $('asc-result').textContent = chart.asc.symbol + ' ' + chart.asc.sign + ' ' + chart.asc.degree + '°' + String(chart.asc.minute).padStart(2, '0') + '′';
    $('mc-result').textContent = chart.mc.symbol + ' ' + chart.mc.sign + ' ' + chart.mc.degree + '°' + String(chart.mc.minute).padStart(2, '0') + '′';
  }

  function renderHouses(chart) {
    var tbody = $('houses-tbody');
    tbody.innerHTML = '';
    for (var h = 1; h <= 12; h++) {
      var info = AstroCore.longitudeToSign(chart.houses[h]);
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>Дом ' + h + '</td>' +
        '<td><span class="sym">' + info.symbol + '</span> ' + info.sign + '</td>' +
        '<td>' + info.degree + '°' + String(info.minute).padStart(2, '0') + '′</td>';
      tbody.appendChild(tr);
    }
  }

  function renderAspects(chart) {
    var tbody = $('aspects-tbody');
    tbody.innerHTML = '';
    var longs = {};
    chart.order.forEach(function (n) { longs[n] = { lon: chart.planets[n].lon }; });
    var aspects = AstroCore.computeAspects(longs, chart.order);
    if (aspects.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4">Няма значими аспекти в рамките на стандартния орбис.</td></tr>';
      return;
    }
    aspects.sort(function (a, b) { return a.orb - b.orb; });
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

  function calculateAndRender(opts) {
    var chart = AstroCore.computeChart(opts);
    renderPlanets(chart);
    renderAngles(chart);
    renderHouses(chart);
    renderAspects(chart);
    $('results').style.display = '';
    return chart;
  }

  function signDegDiff(actual, expectedSign, expectedDeg, expectedMin) {
    var expectedLon = AstroCore.SIGNS.indexOf(expectedSign) * 30 + expectedDeg + expectedMin / 60;
    return AstroCore.angleDiff(actual, expectedLon);
  }

  function runVerification() {
    var opts = {
      year: REFERENCE.year, month: REFERENCE.month, day: REFERENCE.day,
      hour: REFERENCE.hour, minute: REFERENCE.minute, second: 0,
      utcOffset: REFERENCE.utcOffset, lat: REFERENCE.lat, lon: REFERENCE.lon
    };
    var chart = AstroCore.computeChart(opts);

    var rows = [];
    var allOk = true;
    var tolerance = 1.0;

    Object.keys(REFERENCE.expected).forEach(function (name) {
      var exp = REFERENCE.expected[name];
      var p = chart.planets[name];
      var diff = signDegDiff(p.lon, exp.sign, exp.deg, exp.min);
      var ok = diff <= tolerance;
      if (!ok) allOk = false;
      rows.push({
        label: p.nameBg,
        expected: exp.sign + ' ' + exp.deg + '°' + exp.min,
        got: p.sign + ' ' + p.degree + '°' + p.minute,
        diff: diff,
        ok: ok
      });
    });

    var ascDiff = signDegDiff(chart.asc.longitude, REFERENCE.ascExpected.sign, REFERENCE.ascExpected.deg, REFERENCE.ascExpected.min);
    var mcDiff = signDegDiff(chart.mc.longitude, REFERENCE.mcExpected.sign, REFERENCE.mcExpected.deg, REFERENCE.mcExpected.min);
    if (ascDiff > tolerance) allOk = false;
    if (mcDiff > tolerance) allOk = false;
    rows.push({
      label: 'Асцендент', expected: REFERENCE.ascExpected.sign + ' ' + REFERENCE.ascExpected.deg + '°' + REFERENCE.ascExpected.min,
      got: chart.asc.sign + ' ' + chart.asc.degree + '°' + chart.asc.minute, diff: ascDiff, ok: ascDiff <= tolerance
    });
    rows.push({
      label: 'MC', expected: REFERENCE.mcExpected.sign + ' ' + REFERENCE.mcExpected.deg + '°' + REFERENCE.mcExpected.min,
      got: chart.mc.sign + ' ' + chart.mc.degree + '°' + chart.mc.minute, diff: mcDiff, ok: mcDiff <= tolerance
    });

    var tbody = $('verify-tbody');
    tbody.innerHTML = '';
    rows.forEach(function (r) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + r.label + '</td>' +
        '<td>' + r.expected + '</td>' +
        '<td>' + r.got + '</td>' +
        '<td class="' + (r.ok ? 'verify-ok' : 'verify-warn') + '">' + r.diff.toFixed(2) + '° ' + (r.ok ? '✓' : '✗') + '</td>';
      tbody.appendChild(tr);
    });

    $('verify-summary').textContent = allOk
      ? '✓ Всички стойности са в рамките на толеранс от 1°.'
      : '✗ Има стойности извън толеранса от 1° — вижте таблицата.';
    $('verify-summary').className = allOk ? 'verify-ok' : 'verify-warn';
    $('verify-result').style.display = '';
  }

  function init() {
    populateCitySelect();
    setDefaults();
    $('city').addEventListener('change', onCityChange);
    $('natal-form').addEventListener('submit', function (e) {
      e.preventDefault();
      calculateAndRender(readForm());
      document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    });
    $('verify-btn').addEventListener('click', runVerification);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
