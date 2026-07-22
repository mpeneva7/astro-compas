/*
 * Астро Компас — генериране на дневни хороскопи от Lexicon
 *
 * Детерминиран избор (не случаен) на елементи:
 * - Планета: (номер на зодия + ден от годината) % брой планети
 * - Тон: ден от седмицата (0-6)
 * - Елемент глагол: зависи от стихията на зодията
 * - 2-4 изречения на хороскоп
 */

(function (root) {
  'use strict';

  var DailyHoroscope = {

    buildReading: function(chart, signIndex, refDate) {
      if (!root.InferenceEngine) {
        console.error('InferenceEngine not loaded');
        return { day: '', love: '', work: '', mood: '' };
      }

      // Използва новия Inference Engine
      return root.InferenceEngine.buildHoroscope(chart, signIndex, refDate);
    },

    aspectsToSignMid: function(chart, signIndex) {
      var refLon = signIndex * 30 + 15;
      var hits = [];
      chart.order.forEach(function (name) {
        if (name === 'sun') return;
        var asp = AstroCore.findAspect(chart.planets[name].lon, refLon);
        if (asp) hits.push(Object.assign({ planet: name }, asp));
      });
      hits.sort(function (a, b) { return a.orb - b.orb; });
      return hits;
    },

    dayOfYear: dayOfYear
  };

  /* ─────────────────────────────────────────────────────────────── */

  var PLANET_ORDER = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  var SIGN_ELEMENTS = ['fire', 'earth', 'air', 'water', 'fire', 'earth', 'air', 'water', 'fire', 'earth', 'air', 'water'];

  function dayOfYear(date) {
    var start = new Date(date.getFullYear(), 0, 0);
    return Math.floor((date - start) / 86400000);
  }

  function pickIndex(base, offset, poolLength) {
    return (base + (offset || 0)) % poolLength;
  }

  function buildHoroscopeText(signIndex, dayNum, dayOfWeek, section, chart) {
    var Lex = root.Lexicon;
    var base = signIndex + dayNum * 7;
    var sectionOffset = getSectionOffset(section);
    var element = SIGN_ELEMENTS[signIndex];

    // Изберете планета
    var planetIdx = pickIndex(base, sectionOffset, PLANET_ORDER.length);
    var planetKey = PLANET_ORDER[planetIdx];
    var planet = Lex.planets[planetKey];

    if (!planet) return '';

    // Изберете тема на планета
    var themeIdx = pickIndex(base, sectionOffset + 1, planet.themes.length);
    var theme = planet.themes[themeIdx];

    // Изберете положително/напрежение на базата на аспекти
    var isPositive = (base + sectionOffset + 2) % 2 === 0;
    var keywordPool = isPositive ? planet.positive : planet.tension;
    var keywordIdx = pickIndex(base, sectionOffset + 3, keywordPool.length);
    var keyword = keywordPool[keywordIdx];

    // Изберете тон по ден от седмицата
    var tones = Object.keys(Lex.tones);
    var toneKey = tones[dayOfWeek % tones.length];
    var toneTemplates = Lex.tones[toneKey];
    var toneIdx = pickIndex(base, sectionOffset + 4, toneTemplates.length);
    var tone = toneTemplates[toneIdx];

    // Изберете глагол (приоритет: елемент-специфичен)
    var verb = pickVerb(element, base, sectionOffset);

    // Изберете аспект ако има
    var aspect = '';
    if (chart && chart.planets) {
      var hits = root.DailyHoroscope.aspectsToSignMid(chart, signIndex);
      if (hits.length > 0) {
        var aspectIdx = pickIndex(base, sectionOffset + 5, Lex.aspects[hits[0].type].keywords.length);
        aspect = Lex.aspects[hits[0].type].keywords[aspectIdx];
      }
    }

    // Генериране на 2-4 изречения
    return generateSentences(tone, theme, keyword, verb, aspect, isPositive, base);
  }

  function getSectionOffset(section) {
    var offsets = { day: 0, love: 3, work: 6, mood: 9 };
    return offsets[section] || 0;
  }

  function pickVerb(element, base, offset) {
    var Lex = root.Lexicon;
    var elementVerbPool = Lex.elementVerbs[element] || Lex.elementVerbs.air;
    var verbIdx = pickIndex(base, offset + 10, elementVerbPool.length);
    return elementVerbPool[verbIdx];
  }

  function generateSentences(tone, theme, keyword, verb, aspect, isPositive, base) {
    var sentences = [];
    var Lex = root.Lexicon;

    // Първо изречение: тон + тема
    var sent1 = tone + ' ' + theme.toLowerCase();
    if (keyword) sent1 += ' (' + keyword.toLowerCase() + ')';
    sentences.push(sent1.charAt(0).toUpperCase() + sent1.slice(1) + '.');

    // Второ изречение: глагол + резултат
    var sent2 = 'Днес ' + verb + ' силата на ' + theme.toLowerCase();
    if (isPositive) {
      sent2 += ' в твоя полза.';
    } else {
      sent2 += ' до вътрешен баланс.';
    }
    sentences.push(sent2.charAt(0).toUpperCase() + sent2.slice(1));

    // Трето изречение (опционално): аспект/условие
    if (aspect && (base % 5) >= 2) {
      var sent3 = 'Позволите на ' + keyword.toLowerCase() + ' да ' + aspect.toLowerCase() + ' твоята намерение.';
      sentences.push(sent3.charAt(0).toUpperCase() + sent3.slice(1));
    }

    // Четвърто изречение (опционално): съвет/затваряне
    if ((base % 7) >= 3) {
      var advice = 'Останете отворени към промените днес.';
      if (isPositive) {
        advice = 'Този момент е в ваша полза — действайте!';
      }
      sentences.push(advice);
    }

    return sentences.slice(0, (base % 3) + 2).join(' ');
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DailyHoroscope;
  } else {
    root.DailyHoroscope = DailyHoroscope;
  }
})(typeof window !== 'undefined' ? window : this);
