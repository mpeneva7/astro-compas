/*
 * Астро Компас — Inference Engine (v4)
 *
 * Избира по едно ЦЯЛО изречение за всяка секция от Knowledge Base.
 * Никакво съшиване на фрагменти.
 *
 * Детерминизъм: един и същ ден + една и съща зодия => същият текст.
 * Различните секции ползват различни отмествания, за да не съвпадат.
 */

(function (root) {
  'use strict';

  var InferenceEngine = {

    /* Транзитен анализ — оставен за наталната част и бъдещо ползване */
    analyzeTransits: function(chart, signIndex) {
      if (!chart || !chart.planets) return { planet: 'moon', aspect: 'trine' };

      var refLon = signIndex * 30 + 15;
      for (var planetName in chart.planets) {
        if (planetName === 'sun' || planetName === 'asc' || planetName === 'mc') continue;
        var planet = chart.planets[planetName];
        var aspect = this.findAspect(planet.lon, refLon);
        if (aspect) {
          return { planet: planetName, aspect: aspect.type };
        }
      }
      return { planet: 'moon', aspect: 'trine' };
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
      if (!KB || !KB.horoscopes || !KB.horoscopes[signIndex]) {
        return { day: '', love: '', work: '', mood: '' };
      }

      var date = refDate || (chart && chart.now) || new Date();
      var dayNum = this.dayOfYear(date);
      var blocks = KB.horoscopes[signIndex];

      // Различно отместване на секция, за да не се падне една и съща позиция
      return {
        day:  this.pick(blocks.day,  signIndex, dayNum, 0),
        love: this.pick(blocks.love, signIndex, dayNum, 1),
        work: this.pick(blocks.work, signIndex, dayNum, 2),
        mood: this.pick(blocks.mood, signIndex, dayNum, 3)
      };
    },

    // Детерминистичен избор на едно цяло изречение от масива
    pick: function(arr, signIndex, dayNum, sectionOffset) {
      if (!arr || arr.length === 0) return '';
      var idx = (dayNum + signIndex + sectionOffset * 2) % arr.length;
      return arr[idx];
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
