/* ============================================================
   ACG SVG RENDER — Equirectangular астрокартография
   ============================================================
   Чист SVG рендер без Leaflet или външни CDN.
   Проекция: equirectangular (plate carrée) - линейна мащабируемост.
*/

(function (global) {
  'use strict';

  const DEG2RAD = Math.PI / 180;
  const ORBIS_STRONG = 150;   // км
  const ORBIS_WEAK = 350;     // км

  // Опростени контури на континентите в equirectangular проекция (2:1)
  const CONTINENT_GEOJSON = {"type":"FeatureCollection","features":[
    {"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-10,36],[-5,36],[0,38],[5,40],[10,41],[15,42],[20,44],[25,45],[30,47],[35,50],[40,52],[30,55],[25,56],[20,58],[10,60],[5,60],[0,59],[-5,58],[-10,55],[-10,36]]]}},
    {"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[40,50],[50,55],[60,55],[70,52],[80,50],[90,48],[100,46],[110,45],[120,44],[130,43],[140,45],[150,50],[160,55],[170,60],[180,65],[160,70],[140,68],[120,65],[100,60],[80,58],[60,56],[50,52],[40,50]]]}},
    {"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-20,37],[0,37],[20,36],[40,35],[50,32],[52,25],[50,15],[40,10],[30,5],[20,0],[10,-5],[5,-10],[0,-15],[-10,-20],[-20,-23],[-30,-25],[-40,-30],[-50,-32],[-60,-30],[-50,-15],[-40,-5],[-30,5],[-20,15],[-15,25],[-20,37]]]}},
    {"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-170,70],[-150,72],[-130,70],[-110,68],[-90,65],[-75,60],[-70,50],[-75,40],[-80,35],[-85,30],[-90,28],[-95,28],[-100,30],[-105,35],[-110,40],[-115,45],[-120,48],[-125,50],[-130,52],[-140,55],[-150,58],[-160,62],[-170,65],[-170,70]]]}},
    {"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-82,12],[-75,10],[-70,5],[-65,0],[-60,-5],[-55,-8],[-50,-10],[-45,-12],[-40,-15],[-35,-20],[-30,-25],[-25,-30],[-20,-35],[-15,-30],[-10,-25],[-5,-20],[-5,-10],[-10,0],[-20,5],[-30,8],[-40,10],[-50,12],[-60,13],[-70,12],[-75,10],[-82,12]]]}},
    {"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[115,-10],[125,-10],[135,-12],[145,-15],[155,-20],[160,-25],[155,-30],[145,-35],[135,-35],[125,-30],[115,-25],[110,-20],[115,-10]]]}}
  ]};

  // ~100 главни градове
  const WORLD_CITIES = [
    ['София',42.70,23.32],['Лондон',51.51,-0.13],['Париж',48.85,2.35],['Берлин',52.52,13.40],
    ['Мадрид',40.42,-3.70],['Рим',41.90,12.50],['Виена',48.21,16.37],['Амстердам',52.37,4.90],
    ['Атина',37.98,23.73],['Лисабон',38.72,-9.14],['Дъблин',53.35,-6.26],['Брюксел',50.85,4.35],
    ['Цюрих',47.37,8.54],['Прага',50.08,14.44],['Варшава',52.23,21.01],['Будапеща',47.50,19.04],
    ['Букурещ',44.43,26.10],['Белград',44.79,20.45],['Загреб',45.81,15.98],['Копенхаген',55.68,12.57],
    ['Токио',35.68,139.69],['Пекин',39.90,116.41],['Шанхай',31.23,121.47],['Хонконг',22.32,114.17],
    ['Сеул',37.57,126.98],['Делхи',28.61,77.21],['Мумбай',19.08,72.88],['Бангалор',12.97,77.59],
    ['Банкок',13.76,100.50],['Джакарта',-6.21,106.85],['Манила',14.60,120.98],
    ['Ню Йорк',40.71,-74.01],['Лос Анджелис',34.05,-118.24],['Чикаго',41.88,-87.63],['Мексико Сити',19.43,-99.13],
    ['Сао Пауло',-23.55,-46.63],['Рио де Жанейро',-22.91,-43.17],['Буенос Айрес',-34.60,-58.38],
    ['Сидни',-33.87,151.21],['Мелбърн',-37.81,144.96],['Окланд',-36.85,174.76],
    ['Кайро',30.04,31.24],['Джоаннесбург',-26.20,28.05],['Найроби',-1.29,36.82],
  ];

  function norm(x) { while(x>180)x-=360; while(x<-180)x+=360; return x; }

  function distToMeridian(cityLat, cityLon, lineLon) {
    return Math.abs(norm(cityLon - lineLon)) * Math.cos(cityLat * DEG2RAD) * 111;
  }

  function nearestOnCurve(segments, cityLat) {
    let best=null, bd=1e9;
    (segments||[]).forEach(seg=>{
      (seg||[]).forEach(pt=>{
        const d=Math.abs(pt.lat - cityLat);
        if(d<bd){ bd=d; best=pt; }
      });
    });
    return best;
  }

  function fixCoord(lat, lon) {
    if(Math.abs(lat) > 90 && Math.abs(lon) <= 90) { const t=lat; lat=lon; lon=t; }
    return [ +lat.toFixed(2), +lon.toFixed(2) ];
  }

  // Equirectangular проекция: x=(lon+180)/360*W, y=(90-lat)/180*H
  function project(lon, lat, W, H) {
    const x = (norm(lon) + 180) / 360 * W;
    const y = (90 - lat) / 180 * H;
    return [x, y];
  }

  // GeoJSON path → SVG path string за equirectangular
  function geoToPath(coords, W, H, depth=0) {
    if (!coords || coords.length === 0) return '';
    if (typeof coords[0] !== 'object') return '';

    // Nested array check — какъв тип е coords
    if (typeof coords[0][0] === 'number') {
      // [lon, lat]
      const pts = coords.map(c => project(c[0], c[1], W, H));
      return 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L');
    } else {
      // Polygon или MultiPolygon
      return coords.map((ring, i) => geoToPath(ring, W, H, depth+1)).filter(p => p).join(' ');
    }
  }

  // Рендериране на SVG астрокартографску карта
  function render(opts) {
    const { mapEl, hitsEl, legendEl, lines, planets, gstDeg } = opts;
    if (!mapEl) return;

    const W = 1000, H = 500;  // 2:1 equirectangular
    const vb = `0 0 ${W} ${H}`;

    let svg = `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" class="acg-svg-map">
      <defs>
        <style>
          .acg-svg-map { background: #0a0e27; font-family: inherit; }
          .acg-continent { fill: rgba(43, 58, 92, 0.15); stroke: #4a5f8a; stroke-width: 0.5; }
          .acg-grid-line { stroke: rgba(74, 95, 138, 0.15); stroke-width: 0.3; }
          .acg-grid-label { font-size: 10px; fill: rgba(200,200,200,0.4); }
          .acg-line { stroke-width: 1.2; fill: none; }
          .acg-line-label { font-size: 9px; font-weight: bold; text-anchor: middle; }
        </style>
      </defs>`;

    // Континенти
    CONTINENT_GEOJSON.features.forEach(feat => {
      const geom = feat.geometry;
      if (geom.type === 'Polygon') {
        const path = geoToPath(geom.coordinates, W, H);
        if (path) svg += `<path class="acg-continent" d="${path}"/>`;
      }
    });

    // Мрежа: меридиани (30° дължина)
    for (let lon = -180; lon <= 180; lon += 30) {
      const x = (lon + 180) / 360 * W;
      const opacity = Math.abs(lon) === 0 || lon === 180 ? 0.25 : (lon % 60 === 0 ? 0.15 : 0.1);
      svg += `<line class="acg-grid-line" x1="${x}" y1="0" x2="${x}" y2="${H}" style="opacity: ${opacity}"/>`;
      if (Math.abs(lon) <= 150) {
        svg += `<text class="acg-grid-label" x="${x}" y="${H+12}" text-anchor="middle">${lon}°</text>`;
      }
    }

    // Мрежа: паралели (30° ширина)
    for (let lat = 60; lat >= -60; lat -= 30) {
      const y = (90 - lat) / 180 * H;
      const opacity = lat === 0 ? 0.25 : 0.15;
      svg += `<line class="acg-grid-line" x1="0" y1="${y}" x2="${W}" y2="${y}" style="opacity: ${opacity}"/>`;
      svg += `<text class="acg-grid-label" x="-8" y="${y+3}" text-anchor="end">${lat > 0 ? lat+'°N' : (lat===0 ? '0°' : Math.abs(lat)+'°S')}</text>`;
    }

    // Планетарни линии
    const lineSymbols = { '☉': '#FDB813', '☽': '#D4D4D4', '☿': '#B59C3A', '♀': '#00B050',
                          '♂': '#E74C3C', '♃': '#E89B3C', '♄': '#FAD5A5' };
    const lineLabelMap = { mc: 'MC', ic: 'IC', asc: 'ASC', dsc: 'DSC' };

    lines.forEach(line => {
      if (!line || !line.lon) return;
      const color = lineSymbols[line.symbol] || '#888';
      const type = line.type || 'mc';

      if (type === 'mc' || type === 'ic') {
        // Вертикална линия
        const x = (norm(line.lon) + 180) / 360 * W;
        svg += `<line class="acg-line" x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${color}"/>`;
        // Означение на върха
        const label = lineLabelMap[type] || type.toUpperCase();
        svg += `<text class="acg-line-label" x="${x}" y="18" fill="${color}">${line.symbol}${label}</text>`;
      } else if (type === 'asc' || type === 'dsc') {
        // Крива (ASC/DSC) — опростено като полилиния
        if (line.segments && line.segments.length > 0) {
          let pathStr = '';
          line.segments[0].forEach((pt, i) => {
            const [x, y] = project(pt.lon, pt.lat, W, H);
            pathStr += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
          });
          svg += `<path class="acg-line" d="${pathStr}" stroke="${color}"/>`;
          // Означение на края
          if (line.segments[0] && line.segments[0].length > 0) {
            const lastPt = line.segments[0][line.segments[0].length - 1];
            const [x, y] = project(lastPt.lon, lastPt.lat, W, H);
            const label = lineLabelMap[type] || type.toUpperCase();
            svg += `<text class="acg-line-label" x="${x}" y="${y-5}" fill="${color}">${line.symbol}${label}</text>`;
          }
        }
      }
    });

    svg += `</svg>`;
    mapEl.innerHTML = svg;

    // Попадения на линии в градове
    const hits = [];
    WORLD_CITIES.forEach(([city, lat, lon]) => {
      lines.forEach(line => {
        if (!line || !line.lon) return;
        if (line.type === 'mc' || line.type === 'ic') {
          const d = distToMeridian(lat, lon, line.lon);
          if (d < ORBIS_STRONG) hits.push({ city, dist: d.toFixed(0), type: 'strong', symbol: line.symbol });
          else if (d < ORBIS_WEAK) hits.push({ city, dist: d.toFixed(0), type: 'weak', symbol: line.symbol });
        } else {
          const nearest = nearestOnCurve(line.segments, lat);
          if (nearest) {
            const d = Math.abs(nearest.lon - lon) * Math.cos(lat * DEG2RAD) * 111;
            if (d < ORBIS_STRONG) hits.push({ city, dist: d.toFixed(0), type: 'strong', symbol: line.symbol });
            else if (d < ORBIS_WEAK) hits.push({ city, dist: d.toFixed(0), type: 'weak', symbol: line.symbol });
          }
        }
      });
    });

    // Покажи попадения
    if (hitsEl) {
      hitsEl.innerHTML = '<h3>Попадения на линии</h3>' +
        (hits.length > 0 ?
          '<ul>' + hits.slice(0, 20).map(h =>
            `<li>${h.symbol} ${h.city}: ${h.dist}км (${h.type})</li>`
          ).join('') + '</ul>' :
          '<p>Без попадения</p>'
        );
    }

    // Легенда
    if (legendEl) {
      const legItem = lines.filter(l => l && l.symbol).map(l =>
        `<span style="color: ${lineSymbols[l.symbol] || '#888'}">${l.symbol} ${l.name || 'Планета'}</span>`
      );
      legendEl.innerHTML = '<h3>Легенда</h3><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
        legItem.join('') + '</div>';
    }
  }

  global.ACGSvg = { render, WORLD_CITIES };
})(window);
