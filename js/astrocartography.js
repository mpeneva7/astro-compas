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
    // Това е опростена карта на света като SVG path
    // Для простоту, използвам вградени контури на главните континенти
    return `
      <!-- Фон -->
      <rect width="${width}" height="${height}" fill="#1a1625" stroke="#3a3f4a" stroke-width="0.5"/>
      <!-- Решетка (меридиани и паралели) -->
      ${Array.from({length: 7}, (_, i) => {
        const lon = -180 + i * 60;
        const x = ((lon + 180) / 360) * width;
        return `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="rgba(182,157,232,0.1)" stroke-width="0.5"/>`;
      }).join('')}
      ${Array.from({length: 4}, (_, i) => {
        const lat = 60 - i * 60;
        const y = ((90 - lat) / 180) * height;
        return `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="rgba(182,157,232,0.1)" stroke-width="0.5"/>`;
      }).join('')}
      <!-- Основни континенти (опростено) -->
      <g fill="rgba(182,157,232,0.08)" stroke="rgba(182,157,232,0.3)" stroke-width="0.5">
        <!-- Африка (приблизително) -->
        <path d="M ${projectCoord(-30, 20, width, height).x} ${projectCoord(-30, 20, width, height).y}
                 L ${projectCoord(-30, 55, width, height).x} ${projectCoord(-30, 55, width, height).y}
                 L ${projectCoord(35, 55, width, height).x} ${projectCoord(35, 55, width, height).y}
                 L ${projectCoord(35, 20, width, height).x} ${projectCoord(35, 20, width, height).y} Z"/>
        <!-- Евразия (приблизително) -->
        <path d="M ${projectCoord(35, 50, width, height).x} ${projectCoord(35, 50, width, height).y}
                 L ${projectCoord(35, 180, width, height).x} ${projectCoord(35, 180, width, height).y}
                 L ${projectCoord(70, 180, width, height).x} ${projectCoord(70, 180, width, height).y}
                 L ${projectCoord(70, 50, width, height).x} ${projectCoord(70, 50, width, height).y} Z"/>
        <!-- Америки (приблизително) -->
        <path d="M ${projectCoord(-55, -130, width, height).x} ${projectCoord(-55, -130, width, height).y}
                 L ${projectCoord(-55, -40, width, height).x} ${projectCoord(-55, -40, width, height).y}
                 L ${projectCoord(70, -40, width, height).x} ${projectCoord(70, -40, width, height).y}
                 L ${projectCoord(70, -130, width, height).x} ${projectCoord(70, -130, width, height).y} Z"/>
        <!-- Австралия (приблизително) -->
        <path d="M ${projectCoord(-45, 110, width, height).x} ${projectCoord(-45, 110, width, height).y}
                 L ${projectCoord(-45, 160, width, height).x} ${projectCoord(-45, 160, width, height).y}
                 L ${projectCoord(-10, 160, width, height).x} ${projectCoord(-10, 160, width, height).y}
                 L ${projectCoord(-10, 110, width, height).x} ${projectCoord(-10, 110, width, height).y} Z"/>
      </g>
      <!-- Граница на карта -->
      <rect width="${width}" height="${height}" fill="none" stroke="rgba(182,157,232,0.4)" stroke-width="1"/>
    `;
  }

  // Генериране на SVG линии за всички планети
  function generateAcgSvg(lines, width, height) {
    let svg = `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    svg += getWorldMapSvg(width, height);

    // За всяка планета рисувай линиите
    for (let pIdx = 0; pIdx < PLANETS_DATA.length; pIdx++) {
      const planet = PLANETS_DATA[pIdx];
      const pLines = lines[pIdx];
      if (!pLines) continue;

      // MC линия
      if (pLines.mc) {
        const x = projectCoord(0, pLines.mc.lon, width, height).x;
        svg += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="${planet.color}" stroke-width="2" opacity="0.8" data-planet="${planet.nameBg}" data-type="MC"/>`;
      }

      // IC линия
      if (pLines.ic) {
        const x = projectCoord(0, pLines.ic.lon, width, height).x;
        svg += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="${planet.color}" stroke-width="2" opacity="0.6" stroke-dasharray="4,4" data-planet="${planet.nameBg}" data-type="IC"/>`;
      }

      // ASC линия (криви)
      if (pLines.asc && pLines.asc.points.length > 0) {
        for (let segIdx = 0; segIdx < pLines.asc.points.length; segIdx++) {
          const segment = pLines.asc.points[segIdx];
          if (segment.length < 2) continue;

          let pathData = `M ${projectCoord(segment[0].lat, segment[0].lon, width, height).x} ${projectCoord(segment[0].lat, segment[0].lon, width, height).y}`;
          for (let i = 1; i < segment.length; i++) {
            const p = projectCoord(segment[i].lat, segment[i].lon, width, height);
            pathData += ` L ${p.x} ${p.y}`;
          }
          svg += `<path d="${pathData}" stroke="${planet.color}" stroke-width="1.5" fill="none" opacity="0.7" data-planet="${planet.nameBg}" data-type="ASC"/>`;
        }
      }

      // DSC линия (криви)
      if (pLines.dsc && pLines.dsc.points.length > 0) {
        for (let segIdx = 0; segIdx < pLines.dsc.points.length; segIdx++) {
          const segment = pLines.dsc.points[segIdx];
          if (segment.length < 2) continue;

          let pathData = `M ${projectCoord(segment[0].lat, segment[0].lon, width, height).x} ${projectCoord(segment[0].lat, segment[0].lon, width, height).y}`;
          for (let i = 1; i < segment.length; i++) {
            const p = projectCoord(segment[i].lat, segment[i].lon, width, height);
            pathData += ` L ${p.x} ${p.y}`;
          }
          svg += `<path d="${pathData}" stroke="${planet.color}" stroke-width="1.5" fill="none" opacity="0.5" stroke-dasharray="2,2" data-planet="${planet.nameBg}" data-type="DSC"/>`;
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
    const msgEl = document.getElementById('acg-message');
    const containerEl = document.getElementById('acg-container');
    const mapEl = document.getElementById('acg-map');
    const legendEl = document.getElementById('acg-legend');

    if (!btnCalc) return;

    btnCalc.addEventListener('click', () => {
      // Провери дали наталната форма е попълнена
      const birthName = document.getElementById('birth-name')?.value;
      const birthDate = document.getElementById('birth-date')?.value;
      const birthTime = document.getElementById('birth-time')?.value;
      const birthLat = document.getElementById('birthLat')?.value;
      const birthLon = document.getElementById('birthLon')?.value;

      if (!birthDate || !birthTime || !birthLat || !birthLon) {
        msgEl.className = 'acg-message error';
        msgEl.textContent = '❌ Попълни наталните данни горе (дата, час, място).';
        return;
      }

      msgEl.textContent = '';
      msgEl.className = '';

      // Получи наталната карта от съществуващия калкулатор
      try {
        // Вземи вече изчислената карта ако е налична, или преизчисли
        const chart = window.lastNatalChart || recalculateChart();

        if (!chart) {
          msgEl.className = 'acg-message error';
          msgEl.textContent = '❌ Грешка при изчисление на наталната карта.';
          return;
        }

        // Изчисли ACG
        const acgLines = calculateAstrocartography(chart);

        // Генериране на SVG
        const mapSvg = generateAcgSvg(acgLines, 900, 500);
        mapEl.innerHTML = mapSvg;

        // Генериране на легенда
        legendEl.innerHTML = generateLegendHtml();

        // Покажи контейнера
        containerEl.style.display = 'flex';
        msgEl.className = 'acg-message';
        msgEl.textContent = '✅ Астрокартографска карта генерирана успешно!';

        // Активирай PDF бутона
        btnPdf.addEventListener('click', () => exportToPdf(chart));

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

  // PDF експорт (stub за сега)
  function exportToPdf(chart) {
    alert('PDF експортът е под разработка.');
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
