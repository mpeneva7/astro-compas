/*
 * Астро Компас — Optimized Inference Engine
 *
 * Детерминистичен анализ на астрологични транзити
 * + Разумно генериране на персонални хороскопи
 *
 * Правила:
 * - Всеки ден, всеки знак → СЪЩИЯ текст (детерминистично)
 * - Без повтаряне на глаголи в един текст
 * - Без едни и същи начала на фрази за всички 12 знака
 * - Естествен, личен, практичен тон
 */

(function (root) {
  'use strict';

  var InferenceEngine = {

    // Съхраняване на генерирани текстове за проверка на разнообразие
    generatedToday: {},

    /* ═══════════════════════════════════════════════════════════════
       АНАЛИЗ НА ТРАНЗИТИ
       Включва: планети, аспекти, лунни възли, ретроградни движения
       ═══════════════════════════════════════════════════════════════ */

    analyzeTransits: function(chart, signIndex) {
      var KB = root.KnowledgeBase;
      if (!KB || !chart || !chart.planets) {
        return [];
      }

      var factors = [];
      var refLon = signIndex * 30 + 15; // Средата на знака

      // Анализирай планетите
      for (var planetName in chart.planets) {
        if (planetName === 'sun' || planetName === 'asc' || planetName === 'mc') continue;

        var planet = chart.planets[planetName];
        var aspect = this.findAspect(planet.lon, refLon);

        if (aspect) {
          var KB_planet = KB.planets[planetName];
          var KB_aspect = KB.aspects[aspect.type];

          if (KB_planet && KB_aspect) {
            // Провери ако планетата е ретроградна
            var isRetrograde = planet.retrograde || false;
            var retrogradeThemes = isRetrograde ? KB.retrograde.themes : [];

            factors.push({
              planet: planetName,
              planetName: KB_planet.name,
              planetWeight: KB_planet.weight,
              aspect: aspect.type,
              aspectName: KB_aspect.name,
              aspectWeight: KB_aspect.weight,
              importance: KB_planet.weight * KB_aspect.weight * (isRetrograde ? 1.2 : 1),
              themes: KB_planet.themes.concat(KB_aspect.themes).concat(retrogradeThemes),
              emotions: KB_planet.emotions.concat(KB_aspect.emotions),
              positive: isRetrograde ? KB.retrograde.positive : KB_planet.positive,
              negative: isRetrograde ? KB.retrograde.negative : KB_planet.negative,
              verbs: KB_planet.verbs,
              advice: isRetrograde ? KB.retrograde.advice : KB_planet.advice,
              retrograde: isRetrograde
            });
          }
        }
      }

      // Анализирай лунни възли ако са налични
      if (chart.nodes) {
        var northNode = chart.nodes.northNode;
        var southNode = chart.nodes.southNode;

        if (northNode) {
          var northAspect = this.findAspect(northNode.lon, refLon);
          if (northAspect) {
            factors.push({
              planet: 'north_node',
              planetName: KB.lunarNodes.northNode.name,
              planetWeight: 1.1,
              aspect: northAspect.type,
              aspectName: KB.aspects[northAspect.type].name,
              aspectWeight: KB.aspects[northAspect.type].weight,
              importance: 1.1 * KB.aspects[northAspect.type].weight,
              themes: KB.lunarNodes.northNode.themes.concat(KB.aspects[northAspect.type].themes),
              emotions: KB.lunarNodes.northNode.emotions,
              positive: KB.lunarNodes.northNode.positive,
              negative: KB.lunarNodes.northNode.negative,
              verbs: KB.lunarNodes.northNode.verbs,
              advice: KB.lunarNodes.northNode.advice
            });
          }
        }
      }

      factors.sort(function(a, b) { return b.importance - a.importance; });
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
       ДЕТЕРМИНИСТИЧЕН ИЗБОР НА ЕЛЕМЕНТИ
       ═══════════════════════════════════════════════════════════════ */

    hashKey: function(signIndex, dayNum, section, offset) {
      var sectionValue = typeof section === 'string' ? section.charCodeAt(0) : section;
      return (signIndex * 1000 + dayNum * 3 + sectionValue + offset) % 1000000;
    },

    pickFromArray: function(array, hash) {
      if (!array || array.length === 0) return null;
      return array[Math.abs(hash) % array.length];
    },

    pickVerbDeterministic: function(verbs, factor, hash, usedVerbs) {
      // Избери глагол, който не е вече използван
      for (var i = 0; i < verbs.length; i++) {
        var idx = (Math.abs(hash + i) % verbs.length);
        var verb = verbs[idx];
        if (usedVerbs.indexOf(verb) === -1) {
          return verb;
        }
      }
      return verbs[0];
    },

    /* ═══════════════════════════════════════════════════════════════
       ГЕНЕРИРАНЕ НА ПЕРСОНАЛЕН ХОРОСКОП
       ═══════════════════════════════════════════════════════════════ */

    buildHoroscope: function(chart, signIndex, refDate) {
      var KB = root.KnowledgeBase;
      if (!KB) {
        return { day: 'Звездите днес ти намекват на спокойствие.', love: 'Отворено сърце', work: 'Практично действие', mood: 'Хармония' };
      }

      var date = refDate || chart.now || new Date();
      var dayNum = this.dayOfYear(date);

      // Анализирай транзити
      var factors = this.analyzeTransits(chart, signIndex);
      if (factors.length === 0) {
        return {
          day: 'Днес звездите ти даруват спокойствие и вътрешен баланс.',
          love: 'Периода е благоприятен за близост и взаиморазбиране.',
          work: 'Фокусирай се на практични стъпки и дългосрочни цели.',
          mood: 'Позволи си да почувствуваш хармонията на момента.'
        };
      }

      var primaryFactor = factors[0];

      var result = {
        day: this.generateText(primaryFactor, factors, signIndex, dayNum, 0, chart) || 'Звездите говорят за промяна.',
        love: this.generateText(primaryFactor, factors, signIndex, dayNum, 1, chart) || 'Емоции и чувства днес са силни.',
        work: this.generateText(primaryFactor, factors, signIndex, dayNum, 2, chart) || 'Фокус върху работата е необходим.',
        mood: this.generateText(primaryFactor, factors, signIndex, dayNum, 3, chart) || 'Психическо благополучие е в центъра.'
      };

      return result;
    },

    generateText: function(primaryFactor, factors, signIndex, dayNum, sectionIdx, chart) {
      var KB = root.KnowledgeBase;

      // Детерминистичен hash за този текст
      var hash = this.hashKey(signIndex, dayNum, sectionIdx, 0);

      // Събери использованные глаголи (за избягване на повтаряние)
      var usedVerbs = [];

      // Изберете главния глагол (от основния фактор)
      var mainVerb = this.pickVerbDeterministic(
        primaryFactor.verbs, primaryFactor, hash, usedVerbs
      );
      usedVerbs.push(mainVerb);

      // Изберете тема
      var themes = primaryFactor.themes;
      var theme = themes[(hash + 1) % themes.length];

      // Определи тон (позитивен/напрегнат)
      var isPositive = (hash % 2) === 0;
      var statePool = isPositive ? primaryFactor.positive : primaryFactor.negative;
      var state = statePool[(hash + 2) % statePool.length];

      // Изберете съвет
      var advice = primaryFactor.advice[(hash + 3) % primaryFactor.advice.length];

      // Преходна фраза (разнообразие в началото)
      var vocab = KB.vocabulary;
      var transitionIdx = (hash % vocab.transitionPhrases.length);
      var transition = vocab.transitionPhrases[transitionIdx];

      // Генерирай текст със структура
      var text = this.assembleHoroscope(
        transition, primaryFactor, theme, state, mainVerb, advice, isPositive
      );

      // Валидирай
      return this.validateHoroscope(text, signIndex, dayNum, sectionIdx);
    },

    assembleHoroscope: function(transition, factor, theme, state, verb, advice, isPositive) {
      // Структура: Влияние → Последствие → Съвет

      var part1 = transition + ' ' + factor.aspectName.toLowerCase() +
                  ' на ' + factor.planetName.toLowerCase() + '.';

      var part2 = 'Това те насочва към ' + theme.toLowerCase() +
                  ', към ' + state.toLowerCase() + '.';

      var part3 = 'Съветът: ' + verb + ' ' + advice.toLowerCase() + '.';

      return part1 + ' ' + part2 + ' ' + part3;
    },

    /* ═══════════════════════════════════════════════════════════════
       ВАЛИДАЦИЯ И СЪКРАЩАВАНЕ
       ═══════════════════════════════════════════════════════════════ */

    validateHoroscope: function(text, signIndex, dayNum, section) {
      // Очист белези
      text = text.replace(/\s+/g, ' ').trim();

      // Съкрати до 200 символа
      if (text.length > 200) {
        var shortened = text.substring(0, 197).trim();
        // Намери последния период или запетая
        var lastDot = shortened.lastIndexOf('.');
        var lastComma = shortened.lastIndexOf(',');
        var cutAt = Math.max(lastDot, lastComma);
        if (cutAt > 120) {
          text = shortened.substring(0, cutAt + 1);
        } else {
          text = shortened + '.';
        }
      }

      // Премахни забранени думи
      var forbidden = [
        'ужасен', 'фатално', 'катастрофа', 'съдбата', 'гарантирано',
        'неизбежно', '100%', 'сигурно ще', 'без съмнение', 'лош късмет'
      ];

      forbidden.forEach(function(word) {
        var regex = new RegExp('\\b' + word + '\\b', 'gi');
        text = text.replace(regex, '[редактирано]');
      });

      // Проверка: няма ли с главна буква на средина на изречение
      text = text.replace(/([.!?]\s+)([a-zа-я])/g, function(match, p1, p2) {
        return p1 + p2.toUpperCase();
      });

      return text;
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
