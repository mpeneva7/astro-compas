/*
 * Астро Компас — изчислително ядро
 * Юлиански дни, GMST/LAST, слънчева/лунна позиция, планетарни позиции
 * (елиптични орбитални елементи, VSOP-съвместим клас точност),
 * ASC/MC и домове по Placidus.
 *
 * Базирано на Jean Meeus, "Astronomical Algorithms", 2nd ed., и
 * стандартните кеплерови елементи на JPL (Standish & Williams,
 * "Keplerian Elements for Approximate Positions of the Major Planets",
 * валидни за 1800–2050 г.).
 *
 * Точност: изчислените еклиптични дължини на планетите са верни в
 * рамките на около ±1 дъгова минута за Меркурий–Марс и няколко дъгови
 * минути за Юпитер–Плутон в диапазона 1800–2050 — напълно достатъчно
 * за астрологични цели (толеранс 1°).
 */
(function (root) {
  'use strict';

  var DEG2RAD = Math.PI / 180;
  var RAD2DEG = 180 / Math.PI;

  function sinD(x) { return Math.sin(x * DEG2RAD); }
  function cosD(x) { return Math.cos(x * DEG2RAD); }
  function tanD(x) { return Math.tan(x * DEG2RAD); }
  function asinD(x) { return Math.asin(x) * RAD2DEG; }
  function acosD(x) { return Math.acos(x) * RAD2DEG; }
  function atanD(x) { return Math.atan(x) * RAD2DEG; }
  function atan2D(y, x) { return Math.atan2(y, x) * RAD2DEG; }

  function norm360(x) {
    var r = x % 360;
    if (r < 0) r += 360;
    return r;
  }

  function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }

  // ---------------------------------------------------------------------
  // Юлиански ден (Meeus, гл. 7). Очаква година/месец/ден по UT (григориан).
  // ---------------------------------------------------------------------
  function julianDay(year, month, day, hour, minute, second) {
    hour = hour || 0; minute = minute || 0; second = second || 0;
    var dayFrac = day + (hour + minute / 60 + second / 3600) / 24;
    var y = year, m = month;
    if (m <= 2) { y -= 1; m += 12; }
    var A = Math.floor(y / 100);
    var B = 2 - A + Math.floor(A / 4);
    var jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + dayFrac + B - 1524.5;
    return jd;
  }

  // Локална дата/час + часова зона (в часове, източно положителна) -> JD (UT)
  function julianDayFromLocal(year, month, day, hour, minute, second, utcOffsetHours) {
    var jdLocal = julianDay(year, month, day, hour, minute, second);
    return jdLocal - utcOffsetHours / 24;
  }

  function centuriesSinceJ2000(jd) {
    return (jd - 2451545.0) / 36525;
  }

  // ---------------------------------------------------------------------
  // Средно и истинско наклонение на еклиптиката (Meeus 22.2/22.3, ниска точност)
  // ---------------------------------------------------------------------
  function meanObliquity(T) {
    var seconds = 21.448 - T * (46.8150 + T * (0.00059 - T * 0.001813));
    return 23 + (26 + seconds / 60) / 60;
  }

  function nutation(T) {
    var omega = 125.04452 - 1934.136261 * T;
    var Lsun = 280.4665 + 36000.7698 * T;
    var Lmoon = 218.3165 + 481267.8813 * T;
    var dPsi = (-17.20 * sinD(omega) - 1.32 * sinD(2 * Lsun) - 0.23 * sinD(2 * Lmoon) + 0.21 * sinD(2 * omega)) / 3600;
    var dEps = (9.20 * cosD(omega) + 0.57 * cosD(2 * Lsun) + 0.10 * cosD(2 * Lmoon) - 0.09 * cosD(2 * omega)) / 3600;
    return { dPsi: dPsi, dEps: dEps, omega: omega };
  }

  function trueObliquity(T) {
    var nut = nutation(T);
    return meanObliquity(T) + nut.dEps;
  }

  // ---------------------------------------------------------------------
  // GMST / LAST (Meeus 12.4)
  // ---------------------------------------------------------------------
  function gmst(jd, T) {
    var g = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000;
    return norm360(g);
  }

  function localSiderealTime(jd, T, geoLongitudeEast) {
    var nut = nutation(T);
    var eps = meanObliquity(T) + nut.dEps;
    var gst = gmst(jd, T);
    var eqEq = nut.dPsi * cosD(eps); // уравнение на равноденствията
    var gast = gst + eqEq;
    return norm360(gast + geoLongitudeEast);
  }

  // ---------------------------------------------------------------------
  // Слънце — ниска точност по Meeus, гл. 25 (апарентна геоцентрична дължина)
  // ---------------------------------------------------------------------
  function sunLongitude(T) {
    var L0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
    var M = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
    var C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sinD(M)
      + (0.019993 - 0.000101 * T) * sinD(2 * M)
      + 0.000289 * sinD(3 * M);
    var trueLong = L0 + C;
    var omega = 125.04 - 1934.136 * T;
    var apparent = trueLong - 0.00569 - 0.00478 * sinD(omega);
    return norm360(apparent);
  }

  // ---------------------------------------------------------------------
  // Луна — ниска точност (главни членове на Meeus гл. 47, точност ~0.3°-0.5°)
  // ---------------------------------------------------------------------
  function moonPosition(T) {
    var Lp = norm360(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T);
    var D = norm360(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T);
    var M = norm360(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T);
    var Mp = norm360(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T);
    var F = norm360(93.2720950 + 483202.0175233 * T - 0.0036539 * T * T);

    var lon = Lp
      + 6.289 * sinD(Mp)
      - 1.274 * sinD(Mp - 2 * D)
      + 0.658 * sinD(2 * D)
      - 0.186 * sinD(M)
      - 0.059 * sinD(2 * Mp - 2 * D)
      - 0.057 * sinD(Mp - 2 * D + M)
      + 0.053 * sinD(Mp + 2 * D)
      + 0.046 * sinD(2 * D - M)
      + 0.041 * sinD(Mp - M)
      - 0.035 * sinD(D)
      - 0.031 * sinD(Mp + M)
      - 0.015 * sinD(2 * F - 2 * D)
      + 0.011 * sinD(Mp - 4 * D);

    var lat = 5.128 * sinD(F)
      + 0.281 * sinD(Mp + F)
      + 0.278 * sinD(Mp - F)
      + 0.173 * sinD(2 * D - F)
      + 0.055 * sinD(2 * D - Mp + F)
      + 0.046 * sinD(2 * D - Mp - F)
      + 0.033 * sinD(2 * D + F)
      + 0.017 * sinD(2 * Mp + F);

    var nut = nutation(T);
    return { lon: norm360(lon + nut.dPsi), lat: lat, meanElongation: D, meanAnomalySun: M };
  }

  // ---------------------------------------------------------------------
  // Планети Меркурий–Плутон: кеплерови елементи (J2000, средна еклиптика)
  // Източник: Standish & Williams (JPL), таблица за 1800–2050 г.
  // ---------------------------------------------------------------------
  var ELEMENTS = {
    mercury: { a: [0.38709927, 0.00000037], e: [0.20563593, 0.00001906], i: [7.00497902, -0.00594749], L: [252.25032350, 149472.67411175], peri: [77.45779628, 0.16047689], node: [48.33076593, -0.12534081] },
    venus: { a: [0.72333566, 0.00000390], e: [0.00677672, -0.00004107], i: [3.39467605, -0.00078890], L: [181.97909950, 58517.81538729], peri: [131.60246718, 0.00268329], node: [76.67984255, -0.27769418] },
    earth: { a: [1.00000261, 0.00000562], e: [0.01671123, -0.00004392], i: [-0.00001531, -0.01294668], L: [100.46457166, 35999.37244981], peri: [102.93768193, 0.32327364], node: [0, 0] },
    mars: { a: [1.52371034, 0.00001847], e: [0.09339410, 0.00007882], i: [1.84969142, -0.00813131], L: [-4.55343205, 19140.30268499], peri: [-23.94362959, 0.44441088], node: [49.55953891, -0.29257343] },
    jupiter: { a: [5.20288700, -0.00011607], e: [0.04838624, -0.00013253], i: [1.30439695, -0.00183714], L: [34.39644051, 3034.74612775], peri: [14.72847983, 0.21252668], node: [100.47390909, 0.20469106] },
    saturn: { a: [9.53667594, -0.00125060], e: [0.05386179, -0.00050991], i: [2.48599187, 0.00193609], L: [49.95424423, 1222.49362201], peri: [92.59887831, -0.41897216], node: [113.66242448, -0.28867794] },
    uranus: { a: [19.18916464, -0.00196176], e: [0.04725744, -0.00004397], i: [0.77263783, -0.00242939], L: [313.23810451, 428.48202785], peri: [170.95427630, 0.40805281], node: [74.01692503, 0.04240589] },
    neptune: { a: [30.06992276, 0.00026291], e: [0.00859048, 0.00005105], i: [1.77004347, 0.00035372], L: [-55.12002969, 218.45945325], peri: [44.96476227, -0.32241464], node: [131.78422574, -0.00508664] },
    pluto: { a: [39.48211675, -0.00031596], e: [0.24882730, 0.00005170], i: [17.14001206, 0.00004818], L: [238.92903833, 145.20780515], peri: [224.06891629, -0.04062942], node: [110.30393684, -0.01183482] }
  };

  function heliocentricPosition(name, T) {
    var el = ELEMENTS[name];
    var a = el.a[0] + el.a[1] * T;
    var e = el.e[0] + el.e[1] * T;
    var i = el.i[0] + el.i[1] * T;
    var L = el.L[0] + el.L[1] * T;
    var peri = el.peri[0] + el.peri[1] * T; // дължина на перихелия (ϖ)
    var node = el.node[0] + el.node[1] * T; // дължина на възходящия възел (Ω)

    var M = norm360(L - peri); // средна аномалия
    var argPeri = peri - node; // аргумент на перихелия (ω)

    // Решаване на уравнението на Кеплер: M = E - e*sin(E) (E в градуси)
    var Mrad = norm360(M);
    if (Mrad > 180) Mrad -= 360;
    var Erad = Mrad * DEG2RAD;
    var eRad = e;
    for (var iter = 0; iter < 30; iter++) {
      var dE = (Erad - eRad * Math.sin(Erad) - Mrad * DEG2RAD) / (1 - eRad * Math.cos(Erad));
      Erad -= dE;
      if (Math.abs(dE) < 1e-10) break;
    }
    var E = Erad * RAD2DEG;

    // Координати в орбиталната равнина
    var xOrb = a * (Math.cos(Erad) - e);
    var yOrb = a * Math.sqrt(1 - e * e) * Math.sin(Erad);

    // Завъртане в еклиптична координатна система (J2000)
    var cosO = cosD(node), sinO = sinD(node);
    var cosW = cosD(argPeri), sinW = sinD(argPeri);
    var cosI = cosD(i), sinI = sinD(i);

    var x = (cosO * cosW - sinO * sinW * cosI) * xOrb + (-cosO * sinW - sinO * cosW * cosI) * yOrb;
    var y = (sinO * cosW + cosO * sinW * cosI) * xOrb + (-sinO * sinW + cosO * cosW * cosI) * yOrb;
    var z = (sinW * sinI) * xOrb + (cosW * sinI) * yOrb;

    return { x: x, y: y, z: z };
  }

  // Прецесия от еклиптика/равноденствие J2000 към дата T (Julian centuries, Meeus 21.7)
  function precessionCorrection(T) {
    return 1.396971 * T + 0.000308889 * T * T;
  }

  function planetGeocentric(name, T) {
    var earth = heliocentricPosition('earth', T);
    var body = heliocentricPosition(name, T);
    var x = body.x - earth.x;
    var y = body.y - earth.y;
    var z = body.z - earth.z;

    var lon = norm360(atan2D(y, x));
    var dist = Math.sqrt(x * x + y * y + z * z);
    var lat = asinD(z / dist);

    var nut = nutation(T);
    lon = norm360(lon + precessionCorrection(T) + nut.dPsi);

    return { lon: lon, lat: lat, dist: dist };
  }

  // ---------------------------------------------------------------------
  // ASC / MC (стандартни формули на сферичната астрономия)
  // ---------------------------------------------------------------------
  function midheaven(ramc, eps) {
    return norm360(atan2D(sinD(ramc), cosD(ramc) * cosD(eps)));
  }

  function ascendant(ramc, eps, phi) {
    // tan(ASC) = -cos(RAMC) / (sin(RAMC)cos(ε) + tan(φ)sin(ε));
    // атан2 се взима с обратен знак на числителя и знаменателя, за да
    // избере клона на изгряващата (а не залязващата) точка.
    var num = -cosD(ramc);
    var den = sinD(ramc) * cosD(eps) + tanD(phi) * sinD(eps);
    var asc = atan2D(-num, -den);
    return norm360(asc);
  }

  // ---------------------------------------------------------------------
  // Домове по Placidus (итеративен метод на полудъгите)
  // ---------------------------------------------------------------------
  function raToLongitude(ra, eps) {
    return norm360(atan2D(sinD(ra), cosD(ra) * cosD(eps)));
  }

  function declinationOf(lon, eps) {
    return asinD(sinD(eps) * sinD(lon));
  }

  function solvePlacidusCusp(ramcRef, fraction, eps, phi, diurnal) {
    var lon = norm360(ramcRef + fraction * 90); // начално приближение
    for (var iter = 0; iter < 25; iter++) {
      var decl = declinationOf(lon, eps);
      var arg = diurnal ? -tanD(phi) * tanD(decl) : tanD(phi) * tanD(decl);
      arg = clamp(arg, -1, 1);
      var arc = acosD(arg); // SDA или SNA в градуси
      var ra = diurnal ? (ramcRef + fraction * arc) : (ramcRef - fraction * arc);
      var newLon = raToLongitude(ra, eps);
      if (Math.abs(norm360(newLon - lon + 180) - 180) < 1e-8) { lon = newLon; break; }
      lon = newLon;
    }
    return norm360(lon);
  }

  function placidusHouses(ramc, eps, phi) {
    var mc = midheaven(ramc, eps);
    var asc = ascendant(ramc, eps, phi);
    var ramcIC = norm360(ramc + 180);

    var c11 = solvePlacidusCusp(ramc, 1 / 3, eps, phi, true);
    var c12 = solvePlacidusCusp(ramc, 2 / 3, eps, phi, true);
    var c3 = solvePlacidusCusp(ramcIC, 1 / 3, eps, phi, false);
    var c2 = solvePlacidusCusp(ramcIC, 2 / 3, eps, phi, false);

    var cusps = new Array(13); // 1-индексирано: cusps[1]..cusps[12]
    cusps[1] = asc;
    cusps[2] = c2;
    cusps[3] = c3;
    cusps[4] = norm360(mc + 180);
    cusps[5] = norm360(c11 + 180);
    cusps[6] = norm360(c12 + 180);
    cusps[7] = norm360(asc + 180);
    cusps[8] = norm360(c2 + 180);
    cusps[9] = norm360(c3 + 180);
    cusps[10] = mc;
    cusps[11] = c11;
    cusps[12] = c12;
    return cusps;
  }

  // ---------------------------------------------------------------------
  // Зодии и форматиране
  // ---------------------------------------------------------------------
  var SIGNS = ['Овен', 'Телец', 'Близнаци', 'Рак', 'Лъв', 'Дева', 'Везни', 'Скорпион', 'Стрелец', 'Козирог', 'Водолей', 'Риби'];
  var SIGN_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

  function longitudeToSign(lon) {
    lon = norm360(lon);
    var signIndex = Math.floor(lon / 30);
    var degInSign = lon - signIndex * 30;
    var deg = Math.floor(degInSign);
    var minFloat = (degInSign - deg) * 60;
    var min = Math.floor(minFloat);
    return {
      signIndex: signIndex,
      sign: SIGNS[signIndex],
      symbol: SIGN_SYMBOLS[signIndex],
      degree: deg,
      minute: min,
      longitude: lon,
      formatted: deg + '°' + (min < 10 ? '0' : '') + min + '′ ' + SIGNS[signIndex]
    };
  }

  // ---------------------------------------------------------------------
  // Пълно изчисление на карта
  // ---------------------------------------------------------------------
  var PLANET_NAMES_BG = {
    sun: 'Слънце', moon: 'Луна', mercury: 'Меркурий', venus: 'Венера', mars: 'Марс',
    jupiter: 'Юпитер', saturn: 'Сатурн', uranus: 'Уран', neptune: 'Нептун', pluto: 'Плутон'
  };

  var PLANET_SYMBOLS = {
    sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
    jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇'
  };

  // Средно дневно движение (градуси/ден) — за откриване на ретрограден статус
  function isRetrograde(name, T) {
    if (name === 'sun' || name === 'moon') return false;
    var dt = 1 / 36525; // 1 ден в столетия
    var lon1 = planetLongitude(name, T - dt).lon;
    var lon2 = planetLongitude(name, T + dt).lon;
    var diff = lon2 - lon1;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return diff < 0;
  }

  function houseOfLongitude(lon, houses) {
    lon = norm360(lon);
    for (var h = 1; h <= 12; h++) {
      var start = houses[h];
      var end = houses[h === 12 ? 1 : h + 1];
      var span = norm360(end - start);
      var pos = norm360(lon - start);
      if (pos < span || (span === 0 && pos === 0)) return h;
    }
    return 12;
  }

  function planetLongitude(name, T) {
    if (name === 'sun') return { lon: sunLongitude(T), lat: 0, dist: 1 };
    if (name === 'moon') { var m = moonPosition(T); return { lon: m.lon, lat: m.lat, dist: 0 }; }
    return planetGeocentric(name, T);
  }

  function computeChart(opts) {
    var jd = julianDayFromLocal(opts.year, opts.month, opts.day, opts.hour, opts.minute, opts.second || 0, opts.utcOffset);
    var T = centuriesSinceJ2000(jd);
    var eps = trueObliquity(T);
    var ramc = localSiderealTime(jd, T, opts.lon);

    var planets = {};
    var order = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
    order.forEach(function (name) {
      var pos = planetLongitude(name, T);
      planets[name] = Object.assign({ name: name, nameBg: PLANET_NAMES_BG[name] }, pos, longitudeToSign(pos.lon));
    });

    var mc = midheaven(ramc, eps);
    var asc = ascendant(ramc, eps, opts.lat);
    var houses = placidusHouses(ramc, eps, opts.lat);

    return {
      jd: jd,
      T: T,
      eps: eps,
      ramc: ramc,
      planets: planets,
      order: order,
      asc: Object.assign({ longitude: asc }, longitudeToSign(asc)),
      mc: Object.assign({ longitude: mc }, longitudeToSign(mc)),
      houses: houses
    };
  }

  // ---------------------------------------------------------------------
  // Аспекти
  // ---------------------------------------------------------------------
  var ASPECT_DEFS = [
    { name: 'съвпад', nameEn: 'conjunction', angle: 0, orb: 8, symbol: '☌' },
    { name: 'опозиция', nameEn: 'opposition', angle: 180, orb: 8, symbol: '☍' },
    { name: 'тригон', nameEn: 'trine', angle: 120, orb: 7, symbol: '△' },
    { name: 'квадрат', nameEn: 'square', angle: 90, orb: 6, symbol: '□' },
    { name: 'секстил', nameEn: 'sextile', angle: 60, orb: 4, symbol: '✱' }
  ];

  function angleDiff(a, b) {
    var d = Math.abs(norm360(a - b));
    if (d > 180) d = 360 - d;
    return d;
  }

  function findAspect(lon1, lon2) {
    var diff = angleDiff(lon1, lon2);
    for (var i = 0; i < ASPECT_DEFS.length; i++) {
      var def = ASPECT_DEFS[i];
      var orbDiff = Math.abs(diff - def.angle);
      if (orbDiff <= def.orb) {
        return { type: def.name, typeEn: def.nameEn, symbol: def.symbol, angle: def.angle, orb: orbDiff, exact: diff };
      }
    }
    return null;
  }

  function computeAspects(planets, names) {
    var list = [];
    names = names || Object.keys(planets);
    for (var i = 0; i < names.length; i++) {
      for (var j = i + 1; j < names.length; j++) {
        var p1 = names[i], p2 = names[j];
        var asp = findAspect(planets[p1].lon, planets[p2].lon);
        if (asp) {
          list.push(Object.assign({ p1: p1, p2: p2 }, asp));
        }
      }
    }
    return list;
  }

  // ---------------------------------------------------------------------
  // Лунна фаза
  // ---------------------------------------------------------------------
  var MOON_PHASES_BG = [
    { max: 22.5, name: 'Новолуние', symbol: '●' },
    { max: 67.5, name: 'Растяща сърповидна', symbol: '◒' },
    { max: 112.5, name: 'Първа четвърт', symbol: '◐' },
    { max: 157.5, name: 'Растяща изпъкнала', symbol: '◒' },
    { max: 202.5, name: 'Пълнолуние', symbol: '○' },
    { max: 247.5, name: 'Намаляваща изпъкнала', symbol: '◑' },
    { max: 292.5, name: 'Последна четвърт', symbol: '◓' },
    { max: 337.5, name: 'Намаляваща сърповидна', symbol: '◑' },
    { max: 360.1, name: 'Новолуние', symbol: '●' }
  ];

  function moonPhase(sunLon, moonLon) {
    var angle = norm360(moonLon - sunLon);
    var phaseInfo = null;
    for (var i = 0; i < MOON_PHASES_BG.length; i++) {
      if (angle <= MOON_PHASES_BG[i].max) { phaseInfo = MOON_PHASES_BG[i]; break; }
    }
    var illumination = (1 - Math.cos(angle * DEG2RAD)) / 2;
    return { angle: angle, name: phaseInfo.name, symbol: phaseInfo.symbol, illumination: illumination };
  }

  // ---------------------------------------------------------------------
  // Публичен интерфейс
  // ---------------------------------------------------------------------
  var AstroCore = {
    DEG2RAD: DEG2RAD, RAD2DEG: RAD2DEG,
    norm360: norm360,
    julianDay: julianDay,
    julianDayFromLocal: julianDayFromLocal,
    centuriesSinceJ2000: centuriesSinceJ2000,
    meanObliquity: meanObliquity,
    trueObliquity: trueObliquity,
    nutation: nutation,
    gmst: gmst,
    localSiderealTime: localSiderealTime,
    sunLongitude: sunLongitude,
    moonPosition: moonPosition,
    planetGeocentric: planetGeocentric,
    planetLongitude: planetLongitude,
    midheaven: midheaven,
    ascendant: ascendant,
    placidusHouses: placidusHouses,
    longitudeToSign: longitudeToSign,
    computeChart: computeChart,
    computeAspects: computeAspects,
    findAspect: findAspect,
    angleDiff: angleDiff,
    moonPhase: moonPhase,
    SIGNS: SIGNS,
    SIGN_SYMBOLS: SIGN_SYMBOLS,
    PLANET_NAMES_BG: PLANET_NAMES_BG,
    PLANET_SYMBOLS: PLANET_SYMBOLS,
    ASPECT_DEFS: ASPECT_DEFS,
    isRetrograde: isRetrograde,
    houseOfLongitude: houseOfLongitude
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AstroCore;
  } else {
    root.AstroCore = AstroCore;
  }
})(typeof window !== 'undefined' ? window : this);
