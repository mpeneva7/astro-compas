/* Астрокартография — планетни линии върху света */
const AstroCarto = (function() {
  'use strict';

  // Констани
  const DEG2RAD = Math.PI / 180;
  const RAD2DEG = 180 / Math.PI;
  const EPSILON = 23.43929111 * DEG2RAD; // Наклон на еклиптиката (за J2000.0)

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

  // Преобразуване еклиптични → екваториални координати
  function eclipticToEquatorial(lon, lat) {
    const l = lon * DEG2RAD;
    const b = lat * DEG2RAD;

    const sinL = Math.sin(l);
    const cosL = Math.cos(l);
    const sinB = Math.sin(b);
    const cosB = Math.cos(b);
    const sinE = Math.sin(EPSILON);
    const cosE = Math.cos(EPSILON);

    let ra = Math.atan2(sinL * cosE - Math.tan(b) * sinE, cosL);
    let dec = Math.asin(sinB * cosE + cosB * sinE * sinL);

    // Нормализирай RA към 0..2π
    if (ra < 0) ra += 2 * Math.PI;

    return { ra: ra * RAD2DEG, dec: dec * RAD2DEG };
  }

  // GST (Гринуичко звездно време) от Julian Day
  function computeGST(jd) {
    const T = (jd - 2451545.0) / 36525.0;
    const GMST = 18.41667684 + 8640184.812866 * T + 0.093104 * T * T - 6.2e-6 * T * T * T;
    return (GMST % 24 + 24) % 24; // Часове (0..24)
  }

  // Нормализирай дължина към −180..180
  function normalizeLongitude(lon) {
    let l = lon;
    while (l > 180) l -= 360;
    while (l < -180) l += 360;
    return l;
  }

  // Изчисли астрокартографските линии за планета
  function computeAcgLines(ra, dec, gst, placeLon, placeLat) {
    ra = ra * DEG2RAD;
    dec = dec * DEG2RAD;
    const gstRad = gst * 15 * DEG2RAD; // GST в радиани (часове → градуси)
    const lon = placeLon * DEG2RAD;
    const lat = placeLat * DEG2RAD;

    const lines = {};

    // MC линия (вертикална): дължина, където планетата е на MC
    const mcLon = normalizeLongitude((ra - gstRad) * RAD2DEG);
    lines.mc = { type: 'MC', lon: mcLon, latRange: [-85, 85] };

    // IC линия (вертикална): противоположната страна
    const icLon = normalizeLongitude(mcLon + 180);
    lines.ic = { type: 'IC', lon: icLon, latRange: [-85, 85] };

    // ASC линия (изгряваща): крива
    lines.asc = { type: 'ASC', points: [], validRanges: [] };

    // DSC линия (залязваща): крива
    lines.dsc = { type: 'DSC', points: [], validRanges: [] };

    // За всяка ширина φ от −85° до +85°
    let ascPoints = [];
    let dscPoints = [];
    let ascRange = [];
    let dscRange = [];

    for (let phi = -85; phi <= 85; phi += 2) {
      const phiRad = phi * DEG2RAD;
      const cosH = -Math.tan(phiRad) * Math.tan(dec);

      // Провери дали планетата изгрява/залязва на тази ширина
      if (Math.abs(cosH) <= 1) {
        // Планетата изгрява и залязва на тази ширина
        const H = Math.acos(cosH);

        // Изгряваща (ASC): часов ъгъл е отрицателен
        const ascLonRad = ra - gstRad - H;
        const ascLon = normalizeLongitude(ascLonRad * RAD2DEG);
        ascPoints.push({ lat: phi, lon: ascLon });

        // Залязваща (DSC): часов ъгъл е положителен
        const dscLonRad = ra - gstRad + H;
        const dscLon = normalizeLongitude(dscLonRad * RAD2DEG);
        dscPoints.push({ lat: phi, lon: dscLon });
      } else {
        // Прекъсни линията (планетата не изгрява на тази ширина)
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

  // Проект для SVG: equirectangular (plate carrée)
  function projectCoord(lat, lon, width, height) {
    const x = ((lon + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return { x, y };
  }

  // Опростена карта на света (вграда контури на континентите)
  function getWorldMapSvg(width, height) {
    // Генериране на пълна карта със континенти, мрежа и етикети
    const gridLon = 30, gridLat = 30; // меридиани и паралели на всеки 30°

    // Основни приблизителни paths на континентите в equirectangular проекция
    const continents = [
      // Африка
      { points: [[35, -15], [35, 50], [-35, 50], [-35, -15]], name: 'Африка' },
      // Евразия (разбити на части за простота)
      { points: [[40, 30], [40, 180], [70, 180], [70, 30]], name: 'Азия' },
      { points: [[45, -30], [45, 40], [65, 40], [65, -30]], name: 'Европа' },
      // Америки
      { points: [[10, -130], [10, -50], [60, -50], [60, -130]], name: 'С. Америка' },
      { points: [[-10, -85], [-10, -35], [-55, -35], [-55, -85]], name: 'Ю. Америка' },
      // Австралия
      { points: [[-10, 110], [-10, 160], [-45, 160], [-45, 110]], name: 'Австралия' },
    ];

    let svg = `<!-- Фон -->
      <rect width="${width}" height="${height}" fill="#0f0e12"/>

      <!-- Мрежа (меридиани) -->`;

    // Меридиани
    for (let lon = -180; lon <= 180; lon += gridLon) {
      const x = ((lon + 180) / 360) * width;
      const isMain = (lon === 0 || lon === -180 || lon === 180);
      svg += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="rgba(182,157,232,${isMain ? 0.2 : 0.08})" stroke-width="${isMain ? 1 : 0.5}"/>`;
    }

    // Паралели
    for (let lat = -90; lat <= 90; lat += gridLat) {
      const y = ((90 - lat) / 180) * height;
      const isMain = (lat === 0);
      svg += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="rgba(182,157,232,${isMain ? 0.2 : 0.08})" stroke-width="${isMain ? 1 : 0.5}"/>`;
    }

    svg += `<!-- Континенти -->
      <g fill="rgba(182,157,232,0.12)" stroke="rgba(182,157,232,0.25)" stroke-width="0.8">`;

    for (const continent of continents) {
      let pathD = '';
      for (let i = 0; i < continent.points.length; i++) {
        const [lat, lon] = continent.points[i];
        const proj = projectCoord(lat, lon, width, height);
        pathD += (i === 0 ? 'M' : 'L') + ` ${proj.x} ${proj.y}`;
      }
      pathD += ' Z';
      svg += `<path d="${pathD}"/>`;
    }

    svg += `</g>

      <!-- Етикети на дължини (долу) -->
      <g font-size="10" fill="rgba(182,157,232,0.5)" text-anchor="middle" font-family="monospace">`;

    for (let lon = -180; lon <= 180; lon += 60) {
      const x = ((lon + 180) / 360) * width;
      const label = lon === 0 ? '0°' : (lon > 0 ? lon + '°E' : Math.abs(lon) + '°W');
      svg += `<text x="${x}" y="${height + 14}">${label}</text>`;
    }

    svg += `</g>

      <!-- Етикели на ширини (ляво) -->
      <g font-size="10" fill="rgba(182,157,232,0.5)" text-anchor="end" font-family="monospace">`;

    for (let lat = 60; lat >= -60; lat -= 30) {
      const y = ((90 - lat) / 180) * height;
      const label = lat === 0 ? '0°' : (lat > 0 ? lat + '°N' : Math.abs(lat) + '°S');
      svg += `<text x="-8" y="${y + 4}">${label}</text>`;
    }

    svg += `</g>

      <!-- Граница на карта -->
      <rect width="${width}" height="${height}" fill="none" stroke="rgba(182,157,232,0.4)" stroke-width="1"/>`;

    return svg;
  }

  // Генериране на SVG линии за всички планети със означения
  function generateAcgSvg(lines, width, height) {
    let svg = `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="display:block; margin:0 auto; max-width:100%; height:auto;">`;
    svg += getWorldMapSvg(width, height);

    // За всяка планета рисувай линиите
    for (let pIdx = 0; pIdx < PLANETS_DATA.length; pIdx++) {
      const planet = PLANETS_DATA[pIdx];
      const pLines = lines[pIdx];
      if (!pLines) continue;

      // MC линия
      if (pLines.mc) {
        const x = projectCoord(0, pLines.mc.lon, width, height).x;
        svg += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="${planet.color}" stroke-width="2.5" opacity="0.85" data-planet="${planet.nameBg}" data-type="MC"/>`;
        // Означение за MC (горе)
        svg += `<g transform="translate(${x},10)" text-anchor="middle">
          <text font-size="12" fill="${planet.color}" font-weight="bold">${planet.symbol}</text>
          <text font-size="8" fill="${planet.color}" opacity="0.7" y="12">MC</text>
        </g>`;
      }

      // IC линия
      if (pLines.ic) {
        const x = projectCoord(0, pLines.ic.lon, width, height).x;
        svg += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="${planet.color}" stroke-width="2" opacity="0.6" stroke-dasharray="5,3" data-planet="${planet.nameBg}" data-type="IC"/>`;
        // Означение за IC (долу)
        svg += `<g transform="translate(${x},${height - 5})" text-anchor="middle">
          <text font-size="12" fill="${planet.color}" font-weight="bold">${planet.symbol}</text>
          <text font-size="8" fill="${planet.color}" opacity="0.7" y="-12">IC</text>
        </g>`;
      }

      // ASC линия (криви)
      if (pLines.asc && pLines.asc.points.length > 0) {
        let hasLabel = false;
        for (let segIdx = 0; segIdx < pLines.asc.points.length; segIdx++) {
          const segment = pLines.asc.points[segIdx];
          if (segment.length < 2) continue;

          let pathData = `M ${projectCoord(segment[0].lat, segment[0].lon, width, height).x} ${projectCoord(segment[0].lat, segment[0].lon, width, height).y}`;
          for (let i = 1; i < segment.length; i++) {
            const p = projectCoord(segment[i].lat, segment[i].lon, width, height);
            pathData += ` L ${p.x} ${p.y}`;
          }
          svg += `<path d="${pathData}" stroke="${planet.color}" stroke-width="2" fill="none" opacity="0.75" data-planet="${planet.nameBg}" data-type="ASC"/>`;

          // Означение за ASC (на първа точка)
          if (!hasLabel && segment.length > 0) {
            const p = projectCoord(segment[0].lat, segment[0].lon, width, height);
            svg += `<g transform="translate(${p.x},${p.y - 8})" text-anchor="middle" pointer-events="none">
              <text font-size="11" fill="${planet.color}" font-weight="bold">${planet.symbol}</text>
              <text font-size="7" fill="${planet.color}" opacity="0.7" y="10">ASC</text>
            </g>`;
            hasLabel = true;
          }
        }
      }

      // DSC линия (криви)
      if (pLines.dsc && pLines.dsc.points.length > 0) {
        let hasLabel = false;
        for (let segIdx = 0; segIdx < pLines.dsc.points.length; segIdx++) {
          const segment = pLines.dsc.points[segIdx];
          if (segment.length < 2) continue;

          let pathData = `M ${projectCoord(segment[0].lat, segment[0].lon, width, height).x} ${projectCoord(segment[0].lat, segment[0].lon, width, height).y}`;
          for (let i = 1; i < segment.length; i++) {
            const p = projectCoord(segment[i].lat, segment[i].lon, width, height);
            pathData += ` L ${p.x} ${p.y}`;
          }
          svg += `<path d="${pathData}" stroke="${planet.color}" stroke-width="2" fill="none" opacity="0.6" data-planet="${planet.nameBg}" data-type="DSC"/>`;

          // Означение за DSC (на първа точка)
          if (!hasLabel && segment.length > 0) {
            const p = projectCoord(segment[0].lat, segment[0].lon, width, height);
            svg += `<g transform="translate(${p.x},${p.y + 12})" text-anchor="middle" pointer-events="none">
              <text font-size="11" fill="${planet.color}" font-weight="bold">${planet.symbol}</text>
              <text font-size="7" fill="${planet.color}" opacity="0.7" y="10">DSC</text>
            </g>`;
            hasLabel = true;
          }
        }
      }
    }

    svg += `</svg>`;
    return svg;
  }

  // Главна функция: изчисли астрокартография
  function calculateAstrocartography(chart) {
    console.log('📍 Calculating astrocartography for:', chart);

    const lines = [];
    const gst = computeGST(chart.jd);
    console.log('GST:', gst.toFixed(6), 'hours');

    // За всяка планета изчисли линиите
    for (let pIdx = 0; pIdx < PLANETS_DATA.length; pIdx++) {
      const pData = PLANETS_DATA[pIdx];
      const planetPos = chart.planets[pData.name];

      if (!planetPos) continue;

      console.log(`${pData.nameBg}: ecliptic lon=${planetPos.lon.toFixed(2)}°, lat=${planetPos.lat ? planetPos.lat.toFixed(2) : 0}°`);

      // Преобразуй еклиптични → екваториални координати
      const eq = eclipticToEquatorial(planetPos.lon, planetPos.lat || 0);
      console.log(`  RA=${eq.ra.toFixed(4)}°, DEC=${eq.dec.toFixed(4)}°`);

      // Изчисли ACG линиите (използвай място от натална форма)
      const birthLat = parseFloat(document.getElementById('birthLat')?.value || 0);
      const birthLon = parseFloat(document.getElementById('birthLon')?.value || 0);

      const acgLines = computeAcgLines(eq.ra, eq.dec, gst, birthLon, birthLat);
      lines.push(acgLines);

      console.log(`  MC lon=${acgLines.mc.lon.toFixed(2)}°, IC lon=${acgLines.ic.lon.toFixed(2)}°`);
    }

    return lines;
  }

  // Генериране на легенда
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

  // Основен контролен интерфейс
  function init() {
    const btnCalc = document.getElementById('acg-calc-btn');
    const btnPdf = document.getElementById('acg-pdf-btn');
    const btnFullscreen = document.getElementById('acg-fullscreen-btn');
    const msgEl = document.getElementById('acg-message');
    const containerEl = document.getElementById('acg-container');
    const mapEl = document.getElementById('acg-map');
    const legendEl = document.getElementById('acg-legend');

    if (!btnCalc) return;

    // Fullscreen функция
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', (e) => {
        e.stopPropagation();
        mapEl.classList.toggle('fullscreen');
        btnFullscreen.textContent = mapEl.classList.contains('fullscreen') ? '✕' : '⛶';

        // Затвори fullscreen при ESC
        if (mapEl.classList.contains('fullscreen')) {
          const closeFullscreen = (e) => {
            if (e.key === 'Escape') {
              mapEl.classList.remove('fullscreen');
              btnFullscreen.textContent = '⛶';
              document.removeEventListener('keydown', closeFullscreen);
            }
          };
          document.addEventListener('keydown', closeFullscreen);
        }
      });
    }

    btnCalc.addEventListener('click', () => {
      // Провери дали наталната форма е попълнена
      const birthDate = document.getElementById('birth-date')?.value;
      const birthTime = document.getElementById('birth-time')?.value;
      const birthLat = document.getElementById('birthLat')?.value;
      const birthLon = document.getElementById('birthLon')?.value;

      console.log('ACG button clicked:', { birthDate, birthTime, birthLat, birthLon, hasLastChart: !!window.lastNatalChart });

      if (!birthDate || !birthTime || !birthLat || !birthLon) {
        msgEl.className = 'acg-message error';
        msgEl.textContent = '❌ Попълни наталните данни горе (дата, час, място) и щракни "Виж карта".';
        return;
      }

      msgEl.textContent = 'Изчислява се…';
      msgEl.className = '';

      // Получи наталната карта от съществуващия калкулатор
      try {
        // Вземи вече изчислената карта ако е налична, или преизчисли
        let chart = window.lastNatalChart;
        if (!chart) {
          console.log('lastNatalChart not found, recalculating...');
          chart = recalculateChart();
        } else {
          console.log('Using existing lastNatalChart');
        }

        if (!chart) {
          msgEl.className = 'acg-message error';
          msgEl.textContent = '❌ Грешка при изчисление на наталната карта. Опитай отново.';
          console.error('Chart is null after calculation');
          return;
        }

        console.log('Chart calculated successfully:', chart);

        // Изчисли ACG
        console.log('Calculating astrocartography...');
        const acgLines = calculateAstrocartography(chart);
        console.log('ACG lines calculated:', acgLines.length, 'lines');

        // Генериране на SVG
        console.log('Generating SVG...');
        const mapSvg = generateAcgSvg(acgLines, 900, 500);

        if (!mapSvg) {
          throw new Error('SVG generation returned empty result');
        }

        mapEl.innerHTML = mapSvg;
        console.log('SVG rendered to DOM');

        // Генериране на легенда
        legendEl.innerHTML = generateLegendHtml();

        // Покажи контейнера
        containerEl.style.display = 'flex';
        msgEl.className = 'acg-message success';
        msgEl.textContent = '✅ Астрокартографска карта генерирана успешно!';

        // Активирай PDF бутона
        btnPdf.onclick = null;
        btnPdf.addEventListener('click', () => exportToPdf(chart));
        console.log('Map generation complete');

      } catch (error) {
        console.error('ACG Error:', error);
        msgEl.className = 'acg-message error';
        msgEl.textContent = '❌ Грешка: ' + error.message;
      }
    });
  }

  // Функция за преизчисление на наталната карта (копира логика)
  function recalculateChart() {
    const birthDate = document.getElementById('birth-date')?.value;
    const birthTime = document.getElementById('birth-time')?.value;
    const birthLat = parseFloat(document.getElementById('birthLat')?.value || 0);
    const birthLon = parseFloat(document.getElementById('birthLon')?.value || 0);

    if (!birthDate || !birthTime) return null;

    // Парсирай дата и час (формат може да варира)
    // Това е опростение; наложа ще се хвърли в точната логика на наталния калкулатор

    try {
      const [year, month, day] = birthDate.split('-').map(Number);
      const [hours, minutes] = birthTime.split(':').map(Number);

      const jd = AstroCore.julianDay(year, month, day, hours, minutes, 0);
      const T = AstroCore.centuriesSinceJ2000(jd);
      const order = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
      const planets = {};
      order.forEach(name => {
        const pos = AstroCore.planetLongitude(name, T);
        planets[name] = Object.assign({ name, nameBg: AstroCore.PLANET_NAMES_BG[name] }, pos, AstroCore.longitudeToSign(pos.lon));
      });

      return { jd, T, now: new Date(), planets, order };
    } catch (e) {
      console.error('Chart calculation error:', e);
      return null;
    }
  }

  // PDF експорт
  function exportToPdf(chart) {
    const mapEl = document.getElementById('acg-map');
    if (!mapEl) return;

    // Попълни в PDF с html2canvas
    Promise.all([
      typeof html2canvas !== 'undefined' ? Promise.resolve() : loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
      typeof jsPDF !== 'undefined' ? Promise.resolve() : loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
    ]).then(() => {
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

        // Картата е 2:1, така че задай съотношение
        const imgWidth = pageWidth - 20;
        const imgHeight = imgWidth / 2;
        const x = 10;
        const y = 10;

        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

        // Добави легенда под картата
        const legendY = y + imgHeight + 10;
        pdf.setFontSize(10);
        pdf.text('Астрокартография — планетни линии', x, legendY);

        pdf.save('астрокартография.pdf');
      }).catch(err => {
        console.error('Грешка при конвертирането на картата:', err);
        alert('Грешка при изтегляне на PDF-а.');
      });
    }).catch(err => {
      console.error('Грешка при зареждането на библиотеките:', err);
      alert('Грешка при зареждането на PDF библиотеките.');
    });
  }

  // Помощна функция за зареждане на скрипти
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
    generateAcgSvg,
    eclipticToEquatorial,
    computeGST
  };
})();

// Инициализирай при зареждане
document.addEventListener('DOMContentLoaded', () => {
  AstroCarto.init();
});
