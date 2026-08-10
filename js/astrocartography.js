/* Астрокартография — планетни линии върху света със Leaflet карта */
const AstroCarto = (function() {
  'use strict';

  // Дата пикер константи
  const BG_MONTHS_GEN = (typeof window.BG_MONTHS_GEN !== 'undefined') ? window.BG_MONTHS_GEN : ['януари', 'февруари', 'март', 'април', 'май', 'юни', 'юли', 'август', 'септември', 'октомври', 'ноември', 'декември'];
  const BG_MONTHS = (typeof window.BG_MONTHS !== 'undefined') ? window.BG_MONTHS : ['Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни', 'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'];
  const BG_DAYS_ABBR = (typeof window.BG_DAYS_ABBR !== 'undefined') ? window.BG_DAYS_ABBR : ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const BG_DAYS_SHORT = (typeof window.BG_DAYS_SHORT !== 'undefined') ? window.BG_DAYS_SHORT : ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

  // Констани
  const DEG2RAD = Math.PI / 180;
  const RAD2DEG = 180 / Math.PI;
  const EPSILON = 23.43929111 * DEG2RAD;

  // Планетни данни
  const PLANETS_DATA = [
    { name: 'sun', nameBg: 'Слънце', symbol: '☉', color: '#FFD54F', meaning: 'Идентичност, видимост, магнетизъм и жизнена енергия' },
    { name: 'moon', nameBg: 'Луна', symbol: '☽', color: '#E8E8CC', meaning: 'Дом, емоционална принадлежност и вътрешен мир' },
    { name: 'mercury', nameBg: 'Меркурий', symbol: '☿', color: '#80CBC4', meaning: 'Комуникация, учене и интелектуална острота' },
    { name: 'venus', nameBg: 'Венера', symbol: '♀', color: '#F48FB1', meaning: 'Любов, красота, удоволствие и хармония' },
    { name: 'mars', nameBg: 'Марс', symbol: '♂', color: '#EF9A9A', meaning: 'Енергия, действие, завоевание и конфликт' },
    { name: 'jupiter', nameBg: 'Юпитер', symbol: '♃', color: '#FFCC80', meaning: 'Растеж, късмет, възможности и благодат' },
    { name: 'saturn', nameBg: 'Сатурн', symbol: '♄', color: '#B0BEC5', meaning: 'Дисциплина, отговорност, изпитания и структура' },
    { name: 'uranus', nameBg: 'Уран', symbol: '♅', color: '#80DEEA', meaning: 'Промяна, свобода, революция и оригиналност' },
    { name: 'neptune', nameBg: 'Нептун', symbol: '♆', color: '#9FA8DA', meaning: 'Вдъхновение, илюзии, мистика и духовност' },
    { name: 'pluto', nameBg: 'Плутон', symbol: '♇', color: '#CE93D8', meaning: 'Трансформация, интензивност, регенерация и власт' }
  ];

  // Световни градове за анализ
  const WORLD_CITIES = [
    ['София',42.70,23.32],['Лондон',51.51,-0.13],['Париж',48.85,2.35],['Берлин',52.52,13.40],
    ['Мадрид',40.42,-3.70],['Рим',41.90,12.50],['Виена',48.21,16.37],['Амстердам',52.37,4.90],
    ['Атина',37.98,23.73],['Лисабон',38.72,-9.14],['Дъблин',53.35,-6.26],['Брюксел',50.85,4.35],
    ['Цюрих',47.37,8.54],['Прага',50.08,14.44],['Варшава',52.23,21.01],['Будапеща',47.50,19.04],
    ['Букурещ',44.43,26.10],['Белград',44.79,20.45],['Загреб',45.81,15.98],['Копенхаген',55.68,12.57],
    ['Стокхолм',59.33,18.06],['Осло',59.91,10.75],['Хелзинки',60.17,24.94],['Киев',50.45,30.52],
    ['Москва',55.75,37.62],['Санкт Петербург',59.93,30.34],['Истанбул',41.01,28.98],['Милано',45.46,9.19],
    ['Барселона',41.39,2.17],['Мюнхен',48.14,11.58],
    ['Токио',35.68,139.69],['Пекин',39.90,116.41],['Шанхай',31.23,121.47],['Хонконг',22.32,114.17],
    ['Сеул',37.57,126.98],['Делхи',28.61,77.21],['Мумбай',19.08,72.88],['Бангалор',12.97,77.59],
    ['Банкок',13.76,100.50],['Джакарта',-6.21,106.85],['Манила',14.60,120.98],['Куала Лумпур',3.14,101.69],
    ['Сингапур',1.35,103.82],['Хо Ши Мин',10.82,106.63],['Ханой',21.03,105.85],['Тайпе',25.03,121.57],
    ['Осака',34.69,135.50],['Карачи',24.86,67.01],['Лахор',31.55,74.34],['Дамаск',33.51,36.29],
    ['Техеран',35.69,51.39],['Багдад',33.32,44.36],['Рияд',24.71,46.68],['Дубай',25.20,55.27],
    ['Абу Даби',24.45,54.38],['Доха',25.29,51.53],['Кувейт',29.38,47.99],['Йерусалим',31.77,35.21],
    ['Тел Авив',32.09,34.78],['Бейрут',33.89,35.50],['Аман',31.95,35.93],['Коломбо',6.93,79.86],
    ['Дака',23.81,90.41],['Катманду',27.72,85.32],['Ташкент',41.30,69.24],['Алмати',43.24,76.89],
    ['Улан Батор',47.89,106.91],
    ['Кайро',30.04,31.24],['Лагос',6.52,3.38],['Кейптаун',-33.92,18.42],['Йоханесбург',-26.20,28.05],
    ['Найроби',-1.29,36.82],['Казабланка',33.57,-7.59],['Тунис',36.81,10.18],['Алжир',36.75,3.06],
    ['Акра',5.60,-0.19],['Адис Абеба',9.03,38.74],['Дар ес Салам',-6.79,39.21],['Хартум',15.50,32.56],
    ['Луанда',-8.84,13.23],['Дакар',14.72,-17.47],['Абиджан',5.36,-4.01],['Триполи',32.89,13.19],
    ['Ню Йорк',40.71,-74.01],['Лос Анджелис',34.05,-118.24],['Чикаго',41.88,-87.63],['Торонто',43.65,-79.38],
    ['Мексико Сити',19.43,-99.13],['Хюстън',29.76,-95.37],['Маями',25.76,-80.19],['Ванкувър',49.28,-123.12],
    ['Монреал',45.50,-73.57],['Вашингтон',38.91,-77.04],['Сан Франциско',37.77,-122.42],['Бостън',42.36,-71.06],
    ['Сиатъл',47.61,-122.33],['Атланта',33.75,-84.39],['Далас',32.78,-96.80],['Хавана',23.11,-82.37],
    ['Гватемала',14.63,-90.51],['Панама',8.98,-79.52],
    ['Сао Пауло',-23.55,-46.63],['Рио де Жанейро',-22.91,-43.17],['Буенос Айрес',-34.60,-58.38],
    ['Лима',-12.05,-77.04],['Богота',4.71,-74.07],['Сантяго',-33.45,-70.67],['Каракас',10.48,-66.90],
    ['Кито',-0.18,-78.47],['Монтевидео',-34.90,-56.16],['Ла Пас',-16.50,-68.15],['Асунсион',-25.28,-57.63],
    ['Бразилия',-15.79,-47.88],['Меделин',6.24,-75.58],
    ['Сидни',-33.87,151.21],['Мелбърн',-37.81,144.96],['Бризбейн',-27.47,153.03],['Пърт',-31.95,115.86],
    ['Окланд',-36.85,174.76],['Уелингтън',-41.29,174.78],['Аделаида',-34.93,138.60],['Порт Морсби',-9.44,147.18],
  ];

  // Преобразуване еклиптични → екваториални координати (ФИКСИРАНО)
  function eclipticToEquatorial(lon, lat) {
    const l = lon * DEG2RAD;
    const b = lat * DEG2RAD;

    const sinL = Math.sin(l);
    const cosL = Math.cos(l);
    const sinB = Math.sin(b);
    const cosB = Math.cos(b);
    const sinE = Math.sin(EPSILON);
    const cosE = Math.cos(EPSILON);
    const tanB = Math.tan(b);

    // Правилна RA формула
    let ra = Math.atan2(sinL * cosE - tanB * sinE, cosL);
    // Правилна DEC формула
    let dec = Math.asin(sinB * cosE + cosB * sinE * sinL);

    if (ra < 0) ra += 2 * Math.PI;

    return { ra: ra * RAD2DEG, dec: dec * RAD2DEG };
  }

  function computeGST(jd) {
    const T = (jd - 2451545.0) / 36525.0;
    const GMST = 18.41667684 + 8640184.812866 * T + 0.093104 * T * T - 6.2e-6 * T * T * T;
    return (GMST % 24 + 24) % 24;
  }

  function normalizeLongitude(lon) {
    let l = lon;
    while (l > 180) l -= 360;
    while (l < -180) l += 360;
    return l;
  }

  function computeAcgLines(ra, dec, gst, placeLon, placeLat) {
    ra = ra * DEG2RAD;
    dec = dec * DEG2RAD;
    const gstRad = gst * 15 * DEG2RAD;
    const lon = placeLon * DEG2RAD;
    const lat = placeLat * DEG2RAD;

    const lines = {};

    const mcLon = normalizeLongitude((ra - gstRad) * RAD2DEG);
    lines.mc = { type: 'MC', lon: mcLon, latRange: [-85, 85] };

    const icLon = normalizeLongitude(mcLon + 180);
    lines.ic = { type: 'IC', lon: icLon, latRange: [-85, 85] };

    lines.asc = { type: 'ASC', points: [], validRanges: [] };
    lines.dsc = { type: 'DSC', points: [], validRanges: [] };

    let ascPoints = [];
    let dscPoints = [];
    let ascRange = [];
    let dscRange = [];

    for (let phi = -85; phi <= 85; phi += 2) {
      const phiRad = phi * DEG2RAD;
      const cosH = -Math.tan(phiRad) * Math.tan(dec);

      if (Math.abs(cosH) <= 1) {
        const H = Math.acos(cosH);

        const ascLonRad = ra - gstRad - H;
        const ascLon = normalizeLongitude(ascLonRad * RAD2DEG);
        ascPoints.push({ lat: phi, lon: ascLon });

        const dscLonRad = ra - gstRad + H;
        const dscLon = normalizeLongitude(dscLonRad * RAD2DEG);
        dscPoints.push({ lat: phi, lon: dscLon });
      } else {
        if (ascPoints.length > 0) {
          ascRange.push(ascPoints);
          ascPoints = [];
        }
        if (dscPoints.length > 0) {
          dscRange.push(dscPoints);
          dscPoints = [];
        }
      }
    }

    if (ascPoints.length > 0) ascRange.push(ascPoints);
    if (dscPoints.length > 0) dscRange.push(dscPoints);

    lines.asc.points = ascRange;
    lines.dsc.points = dscRange;

    return lines;
  }

  // Намери ВСИ значими попадения на град-линия според правилния астрокартографски подход
  // град → линия с орбис < 150км (силно), < 300км (слабо)
  function findCityLineMatches(lines) {
    const matches = [];

    for (const [cityName, cityLat, cityLon] of WORLD_CITIES) {
      // Обходи всяка планета и нейните линии
      for (let pIdx = 0; pIdx < PLANETS_DATA.length; pIdx++) {
        const planet = PLANETS_DATA[pIdx];
        const pLines = lines[pIdx];
        if (!pLines) continue;

        // Проверка на MC линия
        if (pLines.mc) {
          const lineLon = pLines.mc.lon;
          const dLon = normalizeLongitude(cityLon - lineLon);
          const distance = Math.abs(dLon) * Math.cos(cityLat * DEG2RAD) * 111;

          if (distance < 300) { // Орбис до 300км
            let pLat = cityLat, pLon = lineLon;
            // Валидирай координатите — ако lat > 90, разменя ги
            if (Math.abs(pLat) > 90) { const t = pLat; pLat = pLon; pLon = t; }
            matches.push({
              planet: planet,
              city: cityName,
              city_lat: cityLat,
              city_lon: cityLon,
              type: 'MC',
              distance: distance,
              point_lat: pLat,
              point_lon: pLon,
              strength: distance < 150 ? 1 : 2 // 1 = силно (< 150км), 2 = слабо (150-300км)
            });
          }
        }

        // Проверка на IC линия
        if (pLines.ic) {
          const lineLon = pLines.ic.lon;
          const dLon = normalizeLongitude(cityLon - lineLon);
          const distance = Math.abs(dLon) * Math.cos(cityLat * DEG2RAD) * 111;

          if (distance < 300) {
            let pLat = cityLat, pLon = lineLon;
            // Валидирай координатите — ако lat > 90, разменя ги
            if (Math.abs(pLat) > 90) { const t = pLat; pLat = pLon; pLon = t; }
            matches.push({
              planet: planet,
              city: cityName,
              city_lat: cityLat,
              city_lon: cityLon,
              type: 'IC',
              distance: distance,
              point_lat: pLat,
              point_lon: pLon,
              strength: distance < 150 ? 1 : 2
            });
          }
        }

        // Проверка на ASC криви
        if (pLines.asc && pLines.asc.points.length > 0) {
          for (const segment of pLines.asc.points) {
            let minDist = 1000;
            let closestPoint = null;

            // Намери най-близкото разстояние до някоя точка на кривата
            for (const point of segment) {
              const dLat = cityLat - point.lat;
              const dLon = normalizeLongitude(cityLon - point.lon);
              const dist = Math.sqrt(dLat * dLat + (dLon * Math.cos(cityLat * DEG2RAD)) * (dLon * Math.cos(cityLat * DEG2RAD))) * 111;

              if (dist < minDist) {
                minDist = dist;
                closestPoint = point;
              }
            }

            if (minDist < 300 && closestPoint) {
              let pLat = closestPoint.lat, pLon = closestPoint.lon;
              // Валидирай координатите — ако lat > 90, разменя ги
              if (Math.abs(pLat) > 90) { const t = pLat; pLat = pLon; pLon = t; }
              matches.push({
                planet: planet,
                city: cityName,
                city_lat: cityLat,
                city_lon: cityLon,
                type: 'ASC',
                distance: minDist,
                point_lat: pLat,
                point_lon: pLon,
                strength: minDist < 150 ? 1 : 2
              });
            }
          }
        }

        // Проверка на DSC криви
        if (pLines.dsc && pLines.dsc.points.length > 0) {
          for (const segment of pLines.dsc.points) {
            let minDist = 1000;
            let closestPoint = null;

            for (const point of segment) {
              const dLat = cityLat - point.lat;
              const dLon = normalizeLongitude(cityLon - point.lon);
              const dist = Math.sqrt(dLat * dLat + (dLon * Math.cos(cityLat * DEG2RAD)) * (dLon * Math.cos(cityLat * DEG2RAD))) * 111;

              if (dist < minDist) {
                minDist = dist;
                closestPoint = point;
              }
            }

            if (minDist < 300 && closestPoint) {
              let pLat = closestPoint.lat, pLon = closestPoint.lon;
              // Валидирай координатите — ако lat > 90, разменя ги
              if (Math.abs(pLat) > 90) { const t = pLat; pLat = pLon; pLon = t; }
              matches.push({
                planet: planet,
                city: cityName,
                city_lat: cityLat,
                city_lon: cityLon,
                type: 'DSC',
                distance: minDist,
                point_lat: pLat,
                point_lon: pLon,
                strength: minDist < 150 ? 1 : 2
              });
            }
          }
        }
      }
    }

    return matches;
  }

  let acgLeafletMap = null; // Съхрани Leaflet картата

  // Генериране с Leaflet със статични GeoJSON континенти
  async function renderAcgMapWithLeaflet(mapEl, lines, planets, birthLat, birthLon) {
    // Унищожи старата карта ако съществува
    if (acgLeafletMap) {
      acgLeafletMap.remove();
      acgLeafletMap = null;
    }

    // Зареди Leaflet
    const L = await loadLeaflet();
    if (!L) throw new Error('Leaflet не може да се зареди');

    // Инициализирай картата със правилни настройки (без дублиране и сива половина)
    acgLeafletMap = L.map(mapEl, {
      minZoom: 1,
      maxZoom: 6,
      maxBounds: [[-85, -180], [85, 180]],
      maxBoundsViscosity: 1,
      worldCopyJump: false
    }).setView([20, 0], 2);

    // Функция за рисуване на планетни линии, зенити и градове
    const drawMapContent = () => {
      // Рисувай планетни линии
      for (let pIdx = 0; pIdx < PLANETS_DATA.length; pIdx++) {
        const planet = PLANETS_DATA[pIdx];
        const pLines = lines[pIdx];
        if (!pLines) continue;

        // MC линия
        if (pLines.mc) {
          const lon = pLines.mc.lon;
          L.polyline([[85, lon], [-85, lon]], {
            color: planet.color,
            weight: 2.5,
            opacity: 0.85,
            className: 'acg-line'
          }).bindTooltip(`${planet.symbol} ${planet.nameBg} (MC)`, { permanent: false }).addTo(acgLeafletMap);
        }

        // IC линия
        if (pLines.ic) {
          const lon = pLines.ic.lon;
          L.polyline([[85, lon], [-85, lon]], {
            color: planet.color,
            weight: 2,
            opacity: 0.6,
            dashArray: '5, 3',
            className: 'acg-line'
          }).bindTooltip(`${planet.symbol} ${planet.nameBg} (IC)`, { permanent: false }).addTo(acgLeafletMap);
        }

        // ASC криви
        if (pLines.asc && pLines.asc.points.length > 0) {
          for (const segment of pLines.asc.points) {
            if (segment.length < 2) continue;
            const latlngs = segment.map(p => [p.lat, p.lon]);
            L.polyline(latlngs, {
              color: planet.color,
              weight: 2,
              opacity: 0.75,
              className: 'acg-line'
            }).bindTooltip(`${planet.symbol} ${planet.nameBg} (ASC)`, { permanent: false }).addTo(acgLeafletMap);
          }
        }

        // DSC криви
        if (pLines.dsc && pLines.dsc.points.length > 0) {
          for (const segment of pLines.dsc.points) {
            if (segment.length < 2) continue;
            const latlngs = segment.map(p => [p.lat, p.lon]);
            L.polyline(latlngs, {
              color: planet.color,
              weight: 2,
              opacity: 0.6,
              className: 'acg-line'
            }).bindTooltip(`${planet.symbol} ${planet.nameBg} (DSC)`, { permanent: false }).addTo(acgLeafletMap);
          }
        }
      }

      // Маркери за зенитите на планетите
      planets.forEach(p => {
        if (p.zenithLat >= -85 && p.zenithLat <= 85 && p.zenithLon >= -180 && p.zenithLon <= 180) {
          L.circleMarker([p.zenithLat, p.zenithLon], {
            radius: 8,
            fillColor: p.color,
            color: p.color,
            weight: 2.5,
            opacity: 1,
            fillOpacity: 0.8,
            dashArray: '2, 2'
          }).bindTooltip(`${p.symbol} ${p.nameBg} — зенит (планетата точно отгоре)`, { permanent: false }).addTo(acgLeafletMap);
        }
      });

      // Намери ВСИ значими попадения (град-линия < 150км, или 300км за слабо влияние)
      const matches = findCityLineMatches(lines);

      // Добави маркери за градове
      const markedCities = new Set();
      matches.forEach(m => {
        if (!markedCities.has(m.city)) {
          L.circleMarker([m.city_lat, m.city_lon], {
            radius: 5,
            fillColor: '#999999',
            color: '#999999',
            weight: 1.5,
            opacity: 0.7,
            fillOpacity: 0.5
          }).bindTooltip(`${m.city}`).addTo(acgLeafletMap);
          markedCities.add(m.city);
        }
      });

      // Рендер панел с градове и попадения
      const panelEl = document.getElementById('acg-cities-panel');
      if (panelEl) {
      // Групирай по град
      const byCity = {};
      matches.forEach(m => {
        if (!byCity[m.city]) byCity[m.city] = [];
        byCity[m.city].push(m);
      });

      let panelHtml = '<div style="padding:20px; font-size:13px; max-height:400px; overflow-y:auto;">' +
        '<h3 style="margin:0 0 15px 0; color:#E8E6ED; font-size:1rem;">Планетни линии в градовете:</h3>';

      // Зенити на планетите
      panelHtml += '<div style="margin-bottom:15px; padding:10px; background:rgba(182,157,232,0.1); border-radius:6px; border-left:3px solid #B69DE8;">' +
        '<h4 style="margin:0 0 10px 0; color:#E8C36A; font-size:12px;">🌍 ЗЕНИТИ НА ПЛАНЕТИТЕ:</h4>';
      planets.forEach(p => {
        const mapsUrl = `https://www.google.com/maps?q=${p.zenithLat.toFixed(2)},${p.zenithLon.toFixed(2)}`;
        panelHtml += `<div style="margin-bottom:6px; font-size:11px; color:${p.color};">
          ${p.symbol} ${p.nameBg}: ${p.zenithLat.toFixed(2)}, ${p.zenithLon.toFixed(2)} · ` +
          `<a href="${mapsUrl}" target="_blank" style="color:${p.color}; text-decoration:underline;">Виж на Google Maps →</a></div>`;
      });
      panelHtml += '</div>';

      // Град-линия попадения
      if (Object.keys(byCity).length > 0) {
        const sortedCities = Object.keys(byCity).sort();
        for (const city of sortedCities) {
          const cityMatches = byCity[city].sort((a, b) => {
            if (a.strength !== b.strength) return a.strength - b.strength; // Силни първо (< 150км)
            return a.distance - b.distance; // После по разстояние
          });

          panelHtml += `<div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid rgba(182,157,232,0.15);">
            <div style="font-weight:600; color:#E8E6ED; margin-bottom:8px; font-size:13px;">${city}</div>`;

          cityMatches.forEach(m => {
            const mapsUrl = `https://www.google.com/maps?q=${m.point_lat.toFixed(2)},${m.point_lon.toFixed(2)}`;
            const strengthLabel = m.strength === 1 ? '' : ' (слабо влияние)';
            panelHtml += `<div style="margin-bottom:8px; padding-left:10px; border-left:2px solid ${m.planet.color}; font-size:11px;">
              <div style="color:${m.planet.color}; font-weight:500; margin-bottom:2px;">
                ${m.planet.symbol} ${m.planet.nameBg} • ${m.type} • ${m.distance.toFixed(0)} км${strengthLabel}
              </div>
              <div style="color:#B0ACBA; font-size:10px; line-height:1.5; margin-bottom:2px;">
                ${m.planet.meaning}
              </div>
              <div style="font-size:10px; color:#9A9AA8;">
                📍 ${m.point_lat.toFixed(2)}, ${m.point_lon.toFixed(2)} ·
                <a href="${mapsUrl}" target="_blank" style="color:#B69DE8; text-decoration:underline;">Виж на Google Maps →</a>
              </div>
            </div>`;
          });

          panelHtml += `</div>`;
        }
      } else {
        panelHtml += '<p style="color:#B0ACBA; text-align:center; padding:20px 0;">Няма значими попадения в радиус 300км</p>';
      }

        panelHtml += '</div>';
        panelEl.innerHTML = panelHtml;
        panelEl.style.display = 'block';
      }

      // Инвалидирай картата след рисуване
      setTimeout(() => { acgLeafletMap.invalidateSize(true); }, 100);
      setTimeout(() => { acgLeafletMap.invalidateSize(true); }, 300);
    };

    // Зареди GeoJSON континентите и рисувай върху тях
    return new Promise((resolve, reject) => {
      fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
        .then(r => r.json())
        .then(topo => {
          if (typeof topojson !== 'undefined' && topojson.feature) {
            const geo = topojson.feature(topo, topo.objects.countries);
            L.geoJSON(geo, {
              style: {
                fillColor: '#2b3a5c',
                fillOpacity: 1,
                color: '#4a5f8a',
                weight: 0.6
              }
            }).addTo(acgLeafletMap);
          }
          // Рисувай линии, зенити, градове след като GeoJSON е добавен
          drawMapContent();
          resolve(true);
        })
        .catch(err => {
          console.error('GeoJSON зареждане неудачно:', err);
          // Пак рисувай, дори без континентите
          drawMapContent();
          resolve(true);
        });
    });
  }

  // Зареди Leaflet динамично
  function loadLeaflet() {
    return new Promise((resolve, reject) => {
      if (window.L) {
        resolve(window.L);
        return;
      }

      // Зареди CSS
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      document.head.appendChild(cssLink);

      // Зареди JS
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      script.onload = () => resolve(window.L);
      script.onerror = () => reject(new Error('Leaflet JS не може да се зареди'));
      document.head.appendChild(script);
    });
  }

  function pad2(n) { return String(n).padStart(2, '0'); }

  // Дата пикер
  function openAcgDatePicker(initial, onConfirm) {
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

  // Час пикер
  function openAcgTimePicker(initial, onConfirm) {
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

  // Инициализирай форма
  let acgBirthDate = null;
  let acgBirthTime = { h: 12, m: 0 };
  let acgSelectedCity = null;

  function initAcgForm() {
    const dateBtn = document.getElementById('acg-date-btn');
    const timeBtn = document.getElementById('acg-time-btn');
    const cityInput = document.getElementById('acg-city-input');
    const cityDropdown = document.getElementById('acg-city-dropdown');
    const cityError = document.getElementById('acg-city-error');

    if (dateBtn) {
      dateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openAcgDatePicker(acgBirthDate, (date) => {
          acgBirthDate = date;
          const months = ['Янв','Февр','Март','Апр','Май','Юни','Юли','Авг','Септ','Окт','Ноем','Дек'];
          document.getElementById('acg-date-value').textContent =
            date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
        });
      });
    }

    if (timeBtn) {
      timeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openAcgTimePicker(acgBirthTime, (time) => {
          acgBirthTime = time;
          document.getElementById('acg-time-value').textContent =
            String(time.h).padStart(2, '0') + ':' + String(time.m).padStart(2, '0');
        });
      });
    }

    if (cityInput) {
      function showCityMatches() {
        acgSelectedCity = null;
        cityError.textContent = '';
        const q = cityInput.value.trim().toLowerCase();

        if (!window.BG_CITIES || !window.BG_CITIES.places) {
          return;
        }

        if (!q) {
          cityDropdown.innerHTML = '';
          cityDropdown.classList.remove('open');
          return;
        }

        const starts = [], contains = [];
        const limit = 8;
        for (let i = 0; i < window.BG_CITIES.places.length; i++) {
          const nm = window.BG_CITIES.places[i][0].toLowerCase();
          const pos = nm.indexOf(q);
          if (pos === 0) { starts.push(window.BG_CITIES.places[i]); if (starts.length >= limit) break; }
          else if (pos > 0 && contains.length < limit) contains.push(window.BG_CITIES.places[i]);
        }
        const matches = starts.concat(contains).slice(0, 8);
        cityDropdown.innerHTML = '';

        if (matches.length > 0) {
          cityDropdown.classList.add('open');
          matches.forEach(p => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.innerHTML = '<span class="city-name">' + p[0] + '</span><span class="city-oblast"> · ' + (window.BG_CITIES.oblasti[p[1]] || '') + '</span>';
            btn.addEventListener('mousedown', () => {
              cityInput.value = p[0];
              acgSelectedCity = { name: p[0], lat: p[2], lon: p[3] };
              cityError.textContent = '';
              cityDropdown.innerHTML = '';
              cityDropdown.classList.remove('open');
            });
            cityDropdown.appendChild(btn);
          });
        } else {
          cityDropdown.classList.remove('open');
        }
      }

      cityInput.addEventListener('input', showCityMatches);
      cityInput.addEventListener('focus', showCityMatches);
      cityInput.addEventListener('blur', () => {
        setTimeout(() => {
          cityDropdown.classList.remove('open');
        }, 100);
      });
    }
  }

  function init() {
    const btnCalc = document.getElementById('acg-calc-btn');
    const btnPdf = document.getElementById('acg-pdf-btn');
    const btnFullscreen = document.getElementById('acg-fullscreen-btn');
    const msgEl = document.getElementById('acg-message');
    const containerEl = document.getElementById('acg-container');
    const mapEl = document.getElementById('acg-map');
    const legendEl = document.getElementById('acg-legend');

    if (!btnCalc) return;

    initAcgForm();

    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', (e) => {
        e.stopPropagation();
        mapEl.classList.toggle('fullscreen');
        btnFullscreen.textContent = mapEl.classList.contains('fullscreen') ? '✕' : '⛶';

        if (mapEl.classList.contains('fullscreen')) {
          setTimeout(() => {
            if (acgLeafletMap) acgLeafletMap.invalidateSize();
          }, 300);

          const closeFullscreen = (e) => {
            if (e.key === 'Escape') {
              mapEl.classList.remove('fullscreen');
              btnFullscreen.textContent = '⛶';
              setTimeout(() => {
                if (acgLeafletMap) acgLeafletMap.invalidateSize();
              }, 300);
              document.removeEventListener('keydown', closeFullscreen);
            }
          };
          document.addEventListener('keydown', closeFullscreen);
        } else {
          setTimeout(() => {
            if (acgLeafletMap) acgLeafletMap.invalidateSize();
          }, 300);
        }
      });
    }

    btnCalc.addEventListener('click', async () => {
      if (!acgBirthDate) {
        msgEl.className = 'acg-message error';
        msgEl.textContent = '❌ Избери дата на раждане.';
        return;
      }

      if (!acgSelectedCity) {
        msgEl.className = 'acg-message error';
        msgEl.textContent = '❌ Избери място на раждане от списъка.';
        return;
      }

      msgEl.textContent = 'Изчислява се…';
      msgEl.className = '';

      try {
        const opts = {
          year: acgBirthDate.getFullYear(),
          month: acgBirthDate.getMonth() + 1,
          day: acgBirthDate.getDate(),
          hour: acgBirthTime.h,
          minute: acgBirthTime.m,
          second: 0,
          utcOffset: 2,
          lat: acgSelectedCity.lat,
          lon: acgSelectedCity.lon,
          name: (document.getElementById('acg-name')?.value || '').trim(),
          placeName: acgSelectedCity.name
        };

        if (typeof AstroCore === 'undefined') {
          throw new Error('AstroCore библиотека не е заредена.');
        }

        let chart = AstroCore.computeChart ? AstroCore.computeChart(opts) : recalculateChartFromOpts(opts);
        if (!chart) {
          msgEl.className = 'acg-message error';
          msgEl.textContent = '❌ Грешка при изчисление на наталната карта.';
          return;
        }

        const acgData = calculateAstrocartography(chart);

        // Рендер с Leaflet
        await renderAcgMapWithLeaflet(mapEl, acgData.lines, acgData.planets, acgSelectedCity.lat, acgSelectedCity.lon);

        // Генериране на легенда
        legendEl.innerHTML = generateLegendHtml();

        containerEl.style.display = 'flex';
        msgEl.className = 'acg-message success';
        msgEl.textContent = '✅ Астрокартографска карта генерирана!';

        // PDF експорт
        btnPdf.onclick = null;
        btnPdf.addEventListener('click', () => exportToPdfAsync(chart));

      } catch (error) {
        console.error('ACG Error:', error);
        msgEl.className = 'acg-message error';
        msgEl.textContent = '❌ Грешка: ' + error.message;
      }
    });
  }

  function calculateAstrocartography(chart) {
    const lines = [];
    const planets = []; // Съхрани планетни данни за зенити
    const gst = computeGST(chart.jd);

    for (let pIdx = 0; pIdx < PLANETS_DATA.length; pIdx++) {
      const pData = PLANETS_DATA[pIdx];
      const planetPos = chart.planets[pData.name];

      if (!planetPos) continue;

      const eq = eclipticToEquatorial(planetPos.lon, planetPos.lat || 0);
      const birthLat = parseFloat(document.getElementById('birthLat')?.value || 0);
      const birthLon = parseFloat(document.getElementById('birthLon')?.value || 0);

      const acgLines = computeAcgLines(eq.ra, eq.dec, gst, birthLon, birthLat);
      acgLines.ra = eq.ra;  // Добави RA на планетата
      acgLines.dec = eq.dec; // Добави DEC на планетата
      lines.push(acgLines);

      // Смятане на зенитната точка: [dec, normalizeLongitude(ra - gst*15)]
      let zenithLat = eq.dec;
      let zenithLon = normalizeLongitude(eq.ra - gst * 15);
      // Валидирай координатите — ако lat > 90, разменя ги
      if (Math.abs(zenithLat) > 90) { const t = zenithLat; zenithLat = zenithLon; zenithLon = t; }
      planets.push({
        index: pIdx,
        name: pData.name,
        nameBg: pData.nameBg,
        symbol: pData.symbol,
        color: pData.color,
        zenithLat: zenithLat,
        zenithLon: zenithLon
      });
    }

    return { lines, planets };
  }

  function recalculateChartFromOpts(opts) {
    try {
      const jd = AstroCore.julianDay(opts.year, opts.month, opts.day, opts.hour, opts.minute, opts.second);
      const T = AstroCore.centuriesSinceJ2000(jd);
      const order = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
      const planets = {};
      order.forEach(name => {
        const pos = AstroCore.planetLongitude(name, T);
        planets[name] = Object.assign({ name, nameBg: AstroCore.PLANET_NAMES_BG[name] }, pos, AstroCore.longitudeToSign(pos.lon));
      });

      return { jd, T, now: new Date(), planets, order, opts };
    } catch (e) {
      console.error('Chart calculation error:', e);
      return null;
    }
  }

  function generateLegendHtml() {
    let html = '';
    for (let i = 0; i < PLANETS_DATA.length; i++) {
      const p = PLANETS_DATA[i];
      html += `
        <div class="acg-legend-item">
          <div class="acg-legend-symbol">${p.symbol}</div>
          <div>
            <strong>${p.nameBg}:</strong> ${p.meaning}
          </div>
        </div>
      `;
    }
    return html;
  }

  async function exportToPdfAsync(chart) {
    const mapEl = document.getElementById('acg-map');
    if (!mapEl || !acgLeafletMap) return;

    msgEl = document.getElementById('acg-message');
    msgEl.textContent = 'Подготвя PDF…';

    try {
      await new Promise(r => setTimeout(r, 800)); // Изчакай картата

      // Зареди библиотеките
      await Promise.all([
        typeof html2canvas !== 'undefined' ? Promise.resolve() : loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
        typeof jsPDF !== 'undefined' ? Promise.resolve() : loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
      ]);

      html2canvas(mapEl, { scale: 2, backgroundColor: '#0f0e12' }).then(canvas => {
        const { jsPDF } = window;
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });

        const imgData = canvas.toDataURL('image/png');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pageWidth - 20;
        const imgHeight = imgWidth / 2;
        const x = 10;
        const y = 10;

        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
        pdf.setFontSize(10);
        pdf.text('Астрокартография — планетни линии', x, y + imgHeight + 10);

        pdf.save('астрокартография.pdf');
        msgEl.textContent = '✅ PDF изтеглен успешно!';
        msgEl.className = 'acg-message success';
      }).catch(err => {
        console.error('PDF Error:', err);
        msgEl.textContent = '❌ Грешка при генериране на PDF.';
        msgEl.className = 'acg-message error';
      });
    } catch (err) {
      msgEl.textContent = '❌ ' + err.message;
      msgEl.className = 'acg-message error';
    }
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  return {
    init,
    calculateAstrocartography,
    openAcgDatePicker,
    openAcgTimePicker
  };
})();

// Инициализирай при зареждане
function initializeIfReady() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      AstroCarto.init();
    });
  } else {
    AstroCarto.init();
  }
}
initializeIfReady();
