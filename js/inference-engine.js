/*
 * Астро Компас — Inference Engine
 *
 * Анализира реални астрологични транзити и генерира персонален хороскоп
 *
 * Процес:
 * 1. Анализира транзити (планета, аспект, знак)
 * 2. Оценява тежест (aspect weight × planet weight)
 * 3. Комбинира влияния (събира теми, емоции)
 * 4. Определя емоционален тон
 * 5. Избира 1-2 доминиращи теми
 * 6. Генерира персонален хороскоп
 * 7. Валидира качеството
 */

(function (root) {
  'use strict';

  var InferenceEngine = {

    /* ═══════════════════════════════════════════════════════════════
       АНАЛИЗ НА ТРАНЗИТИ
       ═══════════════════════════════════════════════════════════════ */

    analyzeTransits: function(chart, signIndex) {
      var KB = root.KnowledgeBase;
      if (!KB || !chart || !chart.planets) {
        return { factors: [], themes: [], emotions: [], tone: 'harmonious' };
      }

      var factors = [];
      var refLon = signIndex * 30 + 15; // средата на знака

      // Всяка планета → аспект към средата на знака
      for (var planetName in chart.planets) {
        if (planetName === 'sun') continue; // Слънцето вече е във всеки знак

        var planet = chart.planets[planetName];
        var aspect = this.findAspect(planet.lon, refLon);

        if (aspect) {
          var KB_planet = KB.planets[planetName];
          var KB_aspect = KB.aspects[aspect.type];

          if (KB_planet && KB_aspect) {
            factors.push({
              planet: planetName,
              planetWeight: KB_planet.weight,
              aspect: aspect.type,
              aspectWeight: KB_aspect.weight,
              importance: KB_planet.weight * KB_aspect.weight,
              themes: this.combineArrays(KB_planet.themes, KB_aspect.themes),
              emotions: this.combineArrays(KB_planet.emotions, KB_aspect.emotions)
            });
          }
        }
      }

      // Сортирай по importance (най-силните първо)
      factors.sort(function(a, b) { return b.importance - a.importance; });

      return factors;
    },

    findAspect: function(lon1, lon2) {
      var ASPECT_ORBS = [
        { type: 'conjunction', angle: 0, orb: 8 },
        { type: 'opposition', angle: 180, orb: 8 },
        { type: 'square', angle: 90, orb: 6 },
        { type: 'trine', angle: 120, orb: 7 },
        { type: 'sextile', angle: 60, orb: 4 }
      ];

      var diff = Math.abs(lon1 - lon2);
      if (diff > 180) diff = 360 - diff;

      for (var i = 0; i < ASPECT_ORBS.length; i++) {
        var def = ASPECT_ORBS[i];
        if (Math.abs(diff - def.angle) <= def.orb) {
          return { type: def.type, angle: def.angle };
        }
      }
      return null;
    },

    /* ═══════════════════════════════════════════════════════════════
       КОМБИНИРАНЕ НА ВЛИЯНИЯ
       ═══════════════════════════════════════════════════════════════ */

    combineArrays: function(arr1, arr2) {
      return arr1.concat(arr2);
    },

    aggregateInfluences: function(factors) {
      var themeCounts = {};
      var emotionCounts = {};

      factors.forEach(function(factor) {
        // Преброй появяванията на теми
        factor.themes.forEach(function(theme) {
          themeCounts[theme] = (themeCounts[theme] || 0) + factor.importance;
        });

        // Преброй емоции
        factor.emotions.forEach(function(emotion) {
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + factor.importance;
        });
      });

      // Сортирай по честота
      var sortedThemes = Object.keys(themeCounts)
        .sort(function(a, b) { return themeCounts[b] - themeCounts[a]; });
      var sortedEmotions = Object.keys(emotionCounts)
        .sort(function(a, b) { return emotionCounts[b] - emotionCounts[a]; });

      return {
        themes: sortedThemes,
        emotions: sortedEmotions,
        themeCounts: themeCounts,
        emotionCounts: emotionCounts
      };
    },

    /* ═══════════════════════════════════════════════════════════════
       ОПРЕДЕЛЯНЕ НА ЕМОЦИОНАЛЕН ТОН
       ═══════════════════════════════════════════════════════════════ */

    determineTone: function(factors, aggregated) {
      var KB = root.KnowledgeBase;
      var toneScores = {};

      // Инициализирай всички тонове
      Object.keys(KB.emotionalTones).forEach(function(toneKey) {
        toneScores[toneKey] = 0;
      });

      // Брой точки на базата на триггерите
      factors.forEach(function(factor) {
        Object.keys(KB.emotionalTones).forEach(function(toneKey) {
          var tone = KB.emotionalTones[toneKey];
          if (tone.triggers.indexOf(factor.planet) !== -1 ||
              tone.triggers.indexOf(factor.aspect) !== -1) {
            toneScores[toneKey] += factor.importance;
          }
        });
      });

      // Намери най-високия тон
      var maxTone = 'harmonious';
      var maxScore = 0;
      Object.keys(toneScores).forEach(function(toneKey) {
        if (toneScores[toneKey] > maxScore) {
          maxScore = toneScores[toneKey];
          maxTone = toneKey;
        }
      });

      return maxTone || 'harmonious';
    },

    /* ═══════════════════════════════════════════════════════════════
       ИЗБОР НА РЕЧНИК
       ═══════════════════════════════════════════════════════════════ */

    selectVocabulary: function(themes, tone) {
      var KB = root.KnowledgeBase;
      var tones = KB.emotionalTones[tone];
      var baseVocab = KB.vocabulary;

      return {
        verbs: baseVocab.verbs,
        adjectives: baseVocab.adjectives,
        concerns: baseVocab.concerns,
        toneVocab: tones ? tones.vocabulary : []
      };
    },

    /* ═══════════════════════════════════════════════════════════════
       ГЕНЕРИРАНЕ НА ХОРОСКОП
       ═══════════════════════════════════════════════════════════════ */

    buildHoroscope: function(chart, signIndex, refDate) {
      var KB = root.KnowledgeBase;
      if (!KB) {
        return { day: '', love: '', work: '', mood: '' };
      }

      // Анализирай транзити
      var factors = this.analyzeTransits(chart, signIndex);
      if (factors.length === 0) {
        return { day: '', love: '', work: '', mood: '' };
      }

      // Комбинирай влияния
      var aggregated = this.aggregateInfluences(factors);

      // Определи емоционален тон
      var tone = this.determineTone(factors, aggregated);

      // Избери речник
      var vocab = this.selectVocabulary(aggregated.themes, tone);

      // Генерирай хороскопи за всяка секция
      var reading = {
        day: this.generateHoroscopeText(
          factors, aggregated, tone, vocab, 'day', signIndex, chart, refDate
        ),
        love: this.generateHoroscopeText(
          factors, aggregated, tone, vocab, 'love', signIndex, chart, refDate
        ),
        work: this.generateHoroscopeText(
          factors, aggregated, tone, vocab, 'work', signIndex, chart, refDate
        ),
        mood: this.generateHoroscopeText(
          factors, aggregated, tone, vocab, 'mood', signIndex, chart, refDate
        )
      };

      return reading;
    },

    generateHoroscopeText: function(factors, aggregated, tone, vocab, section, signIndex, chart, refDate) {
      var KB = root.KnowledgeBase;
      var primaryTheme = aggregated.themes[0];
      var primaryEmotion = aggregated.emotions[0];

      if (!primaryTheme) {
        return 'Днес силата на небето те насочва към равновесие и хармония.';
      }

      // Намери доминиращия фактор (планета + аспект)
      var dominantFactor = factors[0];
      var KB_planet = KB.planets[dominantFactor.planet];

      // Структура: Влияние → Последствие → Съвет
      var influence = this.describeInfluence(dominantFactor, KB_planet, tone, vocab);
      var consequence = this.describeConsequence(primaryTheme, primaryEmotion, tone, vocab);
      var advice = this.generateAdvice(primaryTheme, KB_planet, vocab, tone);

      var text = influence + ' ' + consequence + ' ' + advice;

      // Валидирай и съкрати до 200 символа
      text = this.validateAndShorten(text, 200);

      return text;
    },

    describeInfluence: function(factor, planet, tone, vocab) {
      var KB = root.KnowledgeBase;
      var aspect = KB.aspects[factor.aspect];

      var templates = [
        'Днес ' + aspect.name.toLowerCase() + ' на ' + planet.name.toLowerCase() + ' те влияе силно.',
        'Планетата ' + planet.name + ' със ' + aspect.name.toLowerCase() + ' влияние тварди днес.',
        'Под влиянието на ' + planet.name + ' в ' + aspect.name.toLowerCase() + ' намираш се днес.'
      ];

      return templates[Math.floor(Math.random() * templates.length)];
    },

    describeConsequence: function(theme, emotion, tone, vocab) {
      var templates = [
        'Това те насочва към ' + theme + ', което ти носи ' + emotion.toLowerCase() + '.',
        'Резултатът е ясен — ' + theme + ' е в центъра, със чувство на ' + emotion.toLowerCase() + '.',
        'Следствието е свързано с ' + theme + ' и дълбока ' + emotion.toLowerCase() + '.'
      ];

      return templates[Math.floor(Math.random() * templates.length)];
    },

    generateAdvice: function(theme, planet, vocab, tone) {
      var KB = root.KnowledgeBase;
      var toneInfo = KB.emotionalTones[tone];
      var concerns = vocab.concerns;

      var templates = [
        'Съветът: ' + concerns[Math.floor(Math.random() * concerns.length)].toLowerCase() + '.',
        'Насока: ' + concerns[Math.floor(Math.random() * concerns.length)].toLowerCase() + '.',
        'Действие: ' + concerns[Math.floor(Math.random() * concerns.length)].toLowerCase() + '.'
      ];

      return templates[Math.floor(Math.random() * templates.length)];
    },

    /* ═══════════════════════════════════════════════════════════════
       ВАЛИДАЦИЯ И СЪКРАЩАВАНЕ
       ═══════════════════════════════════════════════════════════════ */

    validateAndShorten: function(text, maxChars) {
      // Премахни повече от един интервал
      text = text.replace(/\s+/g, ' ').trim();

      // Съкрати до максимум
      if (text.length > maxChars) {
        text = text.substring(0, maxChars - 1).trim() + '.';
      }

      // Проверка за забранени думи
      var forbidden = [
        'ужасен', 'фатално', 'катастрофа', 'лош късмет', 'съдбата',
        'гарантирано', 'неизбежно', '100%', 'сигурно ще', 'без съмнение'
      ];

      forbidden.forEach(function(word) {
        var regex = new RegExp(word, 'gi');
        text = text.replace(regex, '[редактирано]');
      });

      return text;
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = InferenceEngine;
  } else {
    root.InferenceEngine = InferenceEngine;
  }
})(typeof window !== 'undefined' ? window : this);
