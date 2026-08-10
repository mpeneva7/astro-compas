/* ============================================================
   ACG RENDER MODULE — заместител на счупените рендер-части
   ============================================================ */
(function (global) {
  'use strict';

  const DEG2RAD = Math.PI / 180;

  // ~120 световни столици и големи градове: [име, lat, lon]
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
    ['Окланд',-36.85,174.76],['Уелингтън',-41.29,174.78],['Аделаида',-34.93,138.60],['Порт Морсби',-9.44,147.18]
  ];

  const ORBIS_STRONG = 150;   // км — реално попадение
  const ORBIS_WEAK   = 350;   // км — слабо влияние
  const GEOJSON_URL  = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

  function norm(x){ while(x>180)x-=360; while(x<-180)x+=360; return x; }

  function distToMeridian(cityLat, cityLon, lineLon){
    return Math.abs(norm(cityLon - lineLon)) * Math.cos(cityLat * DEG2RAD) * 111;
  }

  function nearestOnCurve(segments, cityLat){
    let best=null, bd=1e9;
    (segments||[]).forEach(seg=>{
      (seg||[]).forEach(pt=>{
        const d=Math.abs(pt.lat - cityLat);
        if(d<bd){ bd=d; best=pt; }
      });
    });
    return best;
  }

  function fixCoord(lat, lon){
    if(Math.abs(lat) > 90 && Math.abs(lon) <= 90){ const t=lat; lat=lon; lon=t; }
    return [ +lat.toFixed(2), +lon.toFixed(2) ];
  }

  function loadScript(src){
    return new Promise((res,rej)=>{
      if([...document.scripts].some(s=>s.src===src)) return res();
      const s=document.createElement('script'); s.src=src; s.onload=res; s.onerror=rej;
      document.head.appendChild(s);
    });
  }

  function loadCss(href){
    if([...document.styleSheets].some(s=>s.href===href)) return;
    const l=document.createElement('link'); l.rel='stylesheet'; l.href=href; document.head.appendChild(l);
  }

  async function ensureDeps(){
    loadCss('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css');
    if(typeof global.L === 'undefined')
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js');
    if(typeof global.topojson === 'undefined')
      await loadScript('https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js');
  }

  let _map = null;

  async function render(opts){
    const { mapEl, hitsEl, legendEl, lines, planets, gstDeg } = opts;
    await ensureDeps();
    const L = global.L;

    if(_map){ _map.remove(); _map = null; }
    mapEl.innerHTML = '';
    mapEl.style.background = '#0f1424';

    _map = L.map(mapEl, {
      worldCopyJump:false, minZoom:1, maxZoom:6,
      maxBounds:[[-85,-180],[85,180]], maxBoundsViscosity:1,
      attributionControl:false
    }).setView([20,10], 1);
    global._acgMap = _map;

    let geo;
    try{
      const topo = await fetch(GEOJSON_URL).then(r=>r.json());
      geo = global.topojson.feature(topo, topo.objects.countries);
    }catch(e){ console.error('GeoJSON load failed:', e); }

    if(geo){
      L.geoJSON(geo, { style:{ fillColor:'#2b3a5c', fillOpacity:1, color:'#4a5f8a', weight:0.6 } }).addTo(_map);
    }

    const hits = [];
    planets.forEach((p, idx)=>{
      const pl = lines[idx];
      if(!pl) return;
      const color = p.color || '#ffd54f';

      if(pl.mc && typeof pl.mc.lon === 'number'){
        L.polyline([[85, pl.mc.lon],[-85, pl.mc.lon]], {color, weight:2.4, opacity:.9})
          .bindTooltip(p.symbol+' '+p.nameBg+' MC', {sticky:true}).addTo(_map);
      }
      if(pl.ic && typeof pl.ic.lon === 'number'){
        L.polyline([[85, pl.ic.lon],[-85, pl.ic.lon]], {color, weight:1.8, opacity:.6, dashArray:'6,4'})
          .bindTooltip(p.symbol+' '+p.nameBg+' IC', {sticky:true}).addTo(_map);
      }
      [['asc', pl.asc, 0.75], ['dsc', pl.dsc, 0.6]].forEach(([key, obj, op])=>{
        if(!obj || !obj.points) return;
        obj.points.forEach(seg=>{
          if(!seg || seg.length < 2) return;
          const latlngs = seg.map(pt=>[pt.lat, pt.lon]);
          L.polyline(latlngs, {color, weight:2, opacity:op})
            .bindTooltip(p.symbol+' '+p.nameBg+' '+key.toUpperCase(), {sticky:true}).addTo(_map);
        });
      });

      const dec = (pl.dec != null) ? pl.dec : (pl.mc ? pl.mcDec : null);
      if(pl.mc && typeof pl.mc.lon==='number' && typeof dec==='number'){
        L.circleMarker([dec, pl.mc.lon], {radius:5, color:'#fff', weight:2, fillColor:color, fillOpacity:1})
          .bindTooltip(p.symbol+' '+p.nameBg+' — зенит (планетата точно отгоре)', {sticky:true}).addTo(_map);
      }

      WORLD_CITIES.forEach(c=>{
        const [name, clat, clon] = c;
        [['MC', pl.mc], ['IC', pl.ic]].forEach(([type, line])=>{
          if(!line || typeof line.lon!=='number') return;
          const d = distToMeridian(clat, clon, line.lon);
          if(d <= ORBIS_WEAK){
            const [la,lo] = fixCoord(clat, line.lon);
            hits.push({p, type, city:name, dist:Math.round(d), lat:la, lon:lo, weak:d>ORBIS_STRONG});
          }
        });
        [['ASC', pl.asc], ['DSC', pl.dsc]].forEach(([type, obj])=>{
          if(!obj || !obj.points) return;
          const pt = nearestOnCurve(obj.points, clat);
          if(!pt) return;
          const d = distToMeridian(clat, clon, pt.lon);
          if(d <= ORBIS_WEAK){
            const [la,lo] = fixCoord(pt.lat, pt.lon);
            hits.push({p, type, city:name, dist:Math.round(d), lat:la, lon:lo, weak:d>ORBIS_STRONG});
          }
        });
      });
    });

    const hitCities = new Set(hits.map(h=>h.city));
    WORLD_CITIES.forEach(c=>{
      if(!hitCities.has(c[0])) return;
      L.circleMarker([c[1], c[2]], {radius:3.5, color:'#fff', weight:1.4, fillColor:'#ffd54f', fillOpacity:.9})
        .bindTooltip(c[0]).addTo(_map);
    });

    setTimeout(()=>_map.invalidateSize(true), 200);
    setTimeout(()=>_map.invalidateSize(true), 600);

    renderHits(hitsEl, hits);
    if(legendEl) renderLegend(legendEl, planets);

    return _map;
  }

  function renderHits(hitsEl, hits){
    if(!hitsEl) return;
    const seen = new Set(), uniq = [];
    hits.sort((a,b)=>a.dist-b.dist).forEach(h=>{
      const k = h.city+h.p.nameBg+h.type;
      if(!seen.has(k)){ seen.add(k); uniq.push(h); }
    });

    hitsEl.innerHTML = '<h3 style="margin:0 0 12px; font-size:16px; font-weight:600;">Планетни линии близо до градове</h3>';
    if(uniq.length === 0){
      hitsEl.innerHTML += '<p style="color:var(--text-muted,#9a92b0); font-size:14px;">Няма големи градове близо до линиите (в рамките на '+ORBIS_WEAK+' км).</p>';
      return;
    }

    const byCity = {};
    uniq.forEach(h=>{ (byCity[h.city] = byCity[h.city] || []).push(h); });

    Object.keys(byCity).forEach(city=>{
      const rows = byCity[city];
      const cityCard = document.createElement('div');
      cityCard.style.cssText = 'background:var(--surface-1,#1a1726); border:0.5px solid var(--border,#2c2740); border-radius:14px; padding:16px 18px; margin-bottom:12px;';
      let inner = '<div style="font-size:16px; font-weight:600; margin-bottom:12px;">'+city+'</div>';
      rows.forEach(h=>{
        const c = h.p.color || '#ffd54f';
        inner +=
          '<div style="border-left:3px solid '+c+'; padding:2px 0 2px 12px; margin-bottom:12px;">'+
            '<div style="display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;">'+
              '<span style="font-size:14px; color:'+c+'; font-weight:500;">'+h.p.symbol+' '+h.p.nameBg+' · '+h.type+' линия</span>'+
              '<span style="font-size:12px; color:var(--text-muted,#9a92b0); white-space:nowrap;">'+h.dist+' км'+(h.weak?' · слабо влияние':'')+'</span>'+
            '</div>'+
            '<div style="font-size:13px; color:var(--text-secondary,#c8c2d8); margin:4px 0 6px;">'+(h.p.meaning||'')+'</div>'+
            '<a href="https://www.google.com/maps?q='+h.lat+','+h.lon+'" target="_blank" rel="noopener" '+
              'style="display:inline-flex; align-items:center; gap:5px; font-size:12px; color:var(--text-accent,#b39ddb); text-decoration:none;">'+
              '📍 '+h.lat+', '+h.lon+' · Виж на Google Maps →</a>'+
          '</div>';
      });
      cityCard.innerHTML = inner;
      hitsEl.appendChild(cityCard);
    });
  }

  function renderLegend(legendEl, planets){
    legendEl.innerHTML = '';
    legendEl.style.cssText =
      'display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:8px 24px; '+
      'background:var(--surface-1,#1a1726); border:0.5px solid var(--border,#2c2740); '+
      'border-radius:14px; padding:16px 20px;';
    planets.forEach(p=>{
      const row = document.createElement('div');
      row.style.cssText = 'display:flex; align-items:baseline; gap:8px; font-size:13px; line-height:1.4;';
      row.innerHTML =
        '<span style="font-size:15px; color:'+(p.color||'#ffd54f')+'; flex-shrink:0;">'+p.symbol+'</span>'+
        '<span><strong>'+p.nameBg+':</strong> <span style="color:var(--text-secondary,#c8c2d8);;">'+(p.meaning||'')+'</span></span>';
      legendEl.appendChild(row);
    });
  }

  global.ACGRender = { render, WORLD_CITIES };
})(window);
