/*
 * Астро Компас — Inference Engine (v2)
 *
 * Генериране на дневни хороскопи:
 * - Три изречения: влияние, практика, насока
 * - Ясен, естествен език
 * - Без абстрактни концепции
 * - Фиксирана структура за всички знаци
 */

(function (root) {
  'use strict';

  var InferenceEngine = {

    /* ═══════════════════════════════════════════════════════════════
       АНАЛИЗ НА ТРАНЗИТИ
       ═══════════════════════════════════════════════════════════════ */

    analyzeTransits: function(chart, signIndex) {
      if (!chart || !chart.planets) return [];

      var factors = [];
      var refLon = signIndex * 30 + 15;

      for (var planetName in chart.planets) {
        if (planetName === 'sun' || planetName === 'asc' || planetName === 'mc') continue;

        var planet = chart.planets[planetName];
        var aspect = this.findAspect(planet.lon, refLon);

        if (aspect) {
          factors.push({
            planet: planetName,
            aspect: aspect.type
          });
        }
      }

      return factors;
    },

    findAspect: function(lon1, lon2) {
      var ASPECTS = [
        { type: 'conjunction', angle: 0, orb: 8 },
        { type: 'opposition', angle: 180, orb: 8 },
        { type: 'square', angle: 90, orb: 6 },
        { type: 'trine', angle: 120, orb: 7 },
        { type: 'sextile', angle: 60, orb: 4 }
      ];

      var diff = Math.abs(lon1 - lon2);
      if (diff > 180) diff = 360 - diff;

      for (var i = 0; i < ASPECTS.length; i++) {
        var def = ASPECTS[i];
        if (Math.abs(diff - def.angle) <= def.orb) {
          return { type: def.type, angle: def.angle };
        }
      }
      return null;
    },

    /* ═══════════════════════════════════════════════════════════════
       ГЕНЕРИРАНЕ НА ХОРОСКОП
       ═══════════════════════════════════════════════════════════════ */

    buildHoroscope: function(chart, signIndex, refDate) {
      var date = refDate || chart.now || new Date();
      var dayNum = this.dayOfYear(date);

      var factors = this.analyzeTransits(chart, signIndex);

      // Ако няма фактори, използвай паден (луна винаги има влияние)
      if (factors.length === 0) {
        factors = [{ planet: 'moon', aspect: 'conjunction' }];
      }

      var primaryFactor = factors[0];

      return {
        day: this.generateHoroscope(primaryFactor, signIndex, dayNum, 'day', chart),
        love: this.generateHoroscope(primaryFactor, signIndex, dayNum, 'love', chart),
        work: this.generateHoroscope(primaryFactor, signIndex, dayNum, 'work', chart),
        mood: this.generateHoroscope(primaryFactor, signIndex, dayNum, 'mood', chart)
      };
    },

    generateHoroscope: function(factor, signIndex, dayNum, section, chart) {
      var PLANETS = {
        sun: 'слънцето е активно',
        moon: 'луната влияе силно',
        mercury: 'комуникацията ти е в центъра',
        venus: 'чувствата и отношенията са важни',
        mars: 'энергията ти е висока',
        jupiter: 'удачата е на твоя страна',
        saturn: 'нужна е дисциплина',
        uranus: 'промените са неизбежни',
        neptune: 'интуицията ти е силна',
        pluto: 'трансформация се случва'
      };

      var ASPECTS = {
        conjunction: 'пълна енергия',
        opposition: 'противоречия трябва да се решат',
        square: 'предизвикателство, но наученост е възможна',
        trine: 'хармония и лекота',
        sextile: 'добра възможност'
      };

      var SECTIONS = {
        day: {
          influence: [
            'Днес си склонен да действаш по тумаџа си.',
            'Днес си по рационален и преценяващ.',
            'Днес чувствата ти водят.',
            'Днес можеш да направиш голямо нещо.',
            'Днес е добър ден за нови начинания.'
          ],
          practice: [
            'Ако имаш идея, която чакаш да осъществиш, сега е време.',
            'Действай смело, но внимателно.',
            'Слушай себе си и следвай инстинкта си.',
            'Възможностите днес са повече.',
            'Не отлагай важните неща.'
          ],
          direction: [
            'Прави движение към целта си.',
            'Не оставай на място.',
            'Действай с цел и ясност.',
            'Отворе очи за възможностите.',
            'Бъди активен и решително.'
          ]
        },
        love: {
          influence: [
            'Днес чувствата ти са по искрени.',
            'Днес си отворен за близост.',
            'Днес любовта привлича.',
            'Днес емоциите са видими.',
            'Днес си по нежен.'
          ],
          practice: [
            'Хубаво е да разговориш откровено с тези, които те интересуват.',
            'Свои чувства не скривай.',
            'Можеш да постигнеш разбиране с други хора.',
            'Близостта днес е възможна.',
            'Отношенията ти получават внимание.'
          ],
          direction: [
            'Изяви се с искреност.',
            'Не се бой да покажеш как се чувстваш.',
            'Слушай другите.',
            'Дай място на любовта.',
            'Открой сърцето си.'
          ]
        },
        work: {
          influence: [
            'Днес можеш да направиш продуктивна работа.',
            'Днес си сконцентриран.',
            'Днес плановете ти могат да се осъществят.',
            'Днес си фокусиран.',
            'Днес резултатите са видими.'
          ],
          practice: [
            'Добър момент е да завършиш започнатите проекти.',
            'Вложи енергия в важните задачи.',
            'Планирай дългосрочно.',
            'Работата ти получава импулс.',
            'Прогресът е възможен.'
          ],
          direction: [
            'Действай по план.',
            'Завърши поне един важен проект.',
            'Работи със смисъл.',
            'Не пренебрегвай детайлите.',
            'Остави следа в работата си.'
          ]
        },
        mood: {
          influence: [
            'Днес си по оптимистичен.',
            'Днес настроението ти е добро.',
            'Днес си спокоен.',
            'Днес си вътрешно хармоничен.',
            'Днес си надежден.'
          ],
          practice: [
            'Това настроение ти дава сила за трудния день.',
            'Използвай го, за да помогнеш на други.',
            'Наслади се на спокойствието.',
            'Преживей момента пълноценно.',
            'Вътрешния мир пазеше.'
          ],
          direction: [
            'Распредели позитивната енергия.',
            'Останал спокоен при предизвикателствата.',
            'Дај път на радостта.',
            'Пази уравновесеността си.',
            'Благодари за добрия ден.'
          ]
        }
      };

      var hash = (signIndex * 1000 + dayNum * 7 + (section.charCodeAt ? section.charCodeAt(0) : 0)) % 100;
      var sectionData = SECTIONS[section];

      var s1 = sectionData.influence[hash % sectionData.influence.length];
      var s2 = sectionData.practice[(hash + 1) % sectionData.practice.length];
      var s3 = sectionData.direction[(hash + 2) % sectionData.direction.length];

      return s1 + ' ' + s2 + ' ' + s3;
    },

    /* ═══════════════════════════════════════════════════════════════
       ПОМОЩНИ ФУНКЦИИ
       ═══════════════════════════════════════════════════════════════ */

    dayOfYear: function(date) {
      var start = new Date(date.getFullYear(), 0, 0);
      return Math.floor((date - start) / 86400000);
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = InferenceEngine;
  } else {
    root.InferenceEngine = InferenceEngine;
  }
})(typeof window !== 'undefined' ? window : this);
