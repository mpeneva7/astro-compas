/*
 * Астро Компас — Inference Engine (v3)
 *
 * Персонализирано генериране на хороскопи
 * Всяка зодия, всяка планета = уникален текст
 */

(function (root) {
  'use strict';

  var InferenceEngine = {

    analyzeTransits: function(chart, signIndex) {
      if (!chart || !chart.planets) return { planet: 'moon', aspect: 'trine' };

      var factors = [];
      var refLon = signIndex * 30 + 15;

      for (var planetName in chart.planets) {
        if (planetName === 'sun' || planetName === 'asc' || planetName === 'mc') continue;

        var planet = chart.planets[planetName];
        var aspect = this.findAspect(planet.lon, refLon);

        if (aspect) {
          factors.push({ planet: planetName, aspect: aspect.type });
        }
      }

      return factors.length > 0 ? factors[0] : { planet: 'moon', aspect: 'trine' };
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
          return { type: def.type };
        }
      }
      return null;
    },

    buildHoroscope: function(chart, signIndex, refDate) {
      var KB = root.KnowledgeBase;
      if (!KB) return { day: 'Нямам данни.', love: 'Нямам данни.', work: 'Нямам данни.', mood: 'Нямам данни.' };

      var date = refDate || chart.now || new Date();
      var dayNum = this.dayOfYear(date);

      var factor = this.analyzeTransits(chart, signIndex);
      var sign = KB.signs[signIndex];
      var aspect = KB.aspects[factor.aspect];

      return {
        day: this.buildText(factor, sign, aspect, signIndex, dayNum, 'day'),
        love: this.buildText(factor, sign, aspect, signIndex, dayNum, 'love'),
        work: this.buildText(factor, sign, aspect, signIndex, dayNum, 'work'),
        mood: this.buildText(factor, sign, aspect, signIndex, dayNum, 'mood')
      };
    },

    buildText: function(factor, sign, aspect, signIndex, dayNum, section) {
      // Изберете три изречения от аспекта (детерминирано по знак и ден)
      var aspectTexts = aspect.daily;
      var idx1 = (signIndex + dayNum) % aspectTexts.length;
      var idx2 = (signIndex * 2 + dayNum) % aspectTexts.length;
      var idx3 = (signIndex * 3 + dayNum) % aspectTexts.length;

      var s1 = aspectTexts[idx1];
      var s2 = aspectTexts[idx2];
      var s3 = aspectTexts[idx3];

      return s1 + ' ' + s2 + ' ' + s3;
    },

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
