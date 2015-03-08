'use strict';

var onkundic = require('./onkundic');
var hirakata = require('./hirakata');
var utils = require('./utils');


/**
 * Returns true iff a kanji has a specified on/kun reading.
 *
 * @param {String} kanji A kanji
 * @param {String} c A hiragana/katakana/romaji.
 * @returns {Boolean} true iff kanji has a specified on/kun reading
 */
var _containOnKun = function containOnKun(kanji, c) {
  var readings = onkundic[kanji];
  if (!readings) return false;
  c = hirakata.toHira(c);
  return readings.some(function(r) { return r.indexOf(c) > -1; });
};

/**
 * Fuzzy-searches query string through an array of items.
 *
 * @param {String} query A query string
 * @param {Array} bucket An array of items
 * @param {String|Function|null} extractor Extractor string/function
 * @param {Object} options Options
 * @returns {Array} An ordered array of matched items
 */
var search = function search(query, bucket, extractor, options) {
  if (!query) return [];

  options = utils.merge({ threshold: 0 }, options);

  var qlen = query.length;

  var extract = (function() {
    if (typeof extractor === 'string') return function(item) { return item[extractor]; };
    if (typeof extractor === 'function') return extractor;
    else return function(item) { return item; };
  })();

  var threshold = options.threshold;
  var ranking = {};

  bucket.forEach(function(item) {
    var itemStr = extract(item);
    var ilen = itemStr.length;
    var unmatches = 0;
    var distance = ilen; // Shorter is better
    outer: for (var i = 0; i < qlen; ++i) {
      var qc = query[i];
      for (var j = 0; j < ilen; ++j) {
        var ic = itemStr[j];
        if (qc === ic || _containOnKun(ic, qc)) {
          distance += i > j ? i - j : j - i;
          continue outer;
        }
      }
      ++unmatches;
    }
    if (unmatches > threshold) return;
    if (!ranking[unmatches]) ranking[unmatches] = {};
    if (!ranking[unmatches][distance]) ranking[unmatches][distance] = [];
    ranking[unmatches][distance].push(item);
  });

  var unmatchKeys = Object.keys(ranking);
  unmatchKeys.sort(function(a, b) { return a - b; });

  return unmatchKeys.reduce(function(result, unmatchKey) {
    var distanceKeys = Object.keys(ranking[unmatchKey]);
    distanceKeys.sort(function(a, b) { return a - b; });
    return result.concat(distanceKeys.reduce(function(arr, distanceKey) {
      return arr.concat(ranking[unmatchKey][distanceKey]);
    }, []));
  }, []);
};


module.exports = {
  search: search
};
