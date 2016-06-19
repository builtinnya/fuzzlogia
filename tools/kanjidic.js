#!/usr/bin/env node
/**
 * Downloads and converts KANJIDIC into various formats.
 *
 * Usage: kanjidic <filename> [--converter=<converter>] [--format=<format>]
 */

'use strict';

var _ = require('lodash');
var argv = require('minimist')(process.argv.slice(2));
var request = require('superagent');
var P = require('bluebird');
var fs = P.promisifyAll(require('fs'));
var Iconv = require('iconv').Iconv;
var debug = require('debug')('kanjidic');

var repos = require('./repositories');
var hirakata = require('../src/hirakata');

/**
 * Fetches a gzipped dictionary from a given URI.
 *
 * @param {String} uri URI
 * @param {Function} callback Callback
 */
var fetch = P.promisify(function fetch(uri, callback) {
  request
    .get(uri)
    .set('Accept-Encoding', 'gzip')
    .parse(function(res, fn) {
      // Collects chunks as buffer to later convert character encoding
      var chunks = [];
      res.on('data', function(chunk) { chunks.push(chunk); });
      res.on('end', function() { fn(null, Buffer.concat(chunks)); });
    })
    .end(function(err, res) {
      if (err) callback(err);
      else callback(null, res.body);
    });
});

/**
 * Converts a given String or Buffer to UTF-8 string.
 *
 * @param {String|Buffer} body Data body
 * @returns {String} UTF-8 string
 */
var toUtf8 = function toUtf8(body, from) {
  var iconv = new Iconv(from, 'utf8//TRANSLIT//IGNORE');
  return iconv.convert(body).toString();
};

/**
 * Field definitions.
 *
 * @see http://www.edrdg.org/kanjidic/kanjidic_doc.html
 * @see http://www.csse.monash.edu.au/~jwb/kanjidic.html
 */
var fieldDefs = {
  /**
   * Positional keys
   */
  0: { key: 'kanji', required: true },
  1: { key: 'jis', required: true },

  /**
   * Keys
   */
  U:  { key: 'unicode' },
  B:  { key: 'bushu' },
  C:  { key: 'classicalBushu' },
  G:  { key: 'grade' },
  S:  { key: 'strokes', many: true },
  X:  { key: 'crossRef', many: true },
  F:  { key: 'freqRank' },
  J:  { key: 'jlptLevel' },
  N:  { key: 'classicNelson' },
  V:  { key: 'newNelson', many: true },
  H:  { key: 'halpernNjedcIndex' },
  DP: { key: 'halpernKkdIndex' },
  DK: { key: 'halpernKldIndex' },
  DL: { key: 'halpernKld2ndIndex' },
  L:  { key: 'heisigIndex' },
  DN: { key: 'heisig6thIndex' },
  K:  { key: 'gakkenIndex' },
  O:  { key: 'oneillJnIndex', many: true },
  DO: { key: 'oneillEkIndex' },
  MN: { key: 'morohashiIndex' },
  MP: { key: 'morohashiVolPage' },
  E:  { key: 'henshallIndex' },
  IN: { key: 'shkkIndex' },
  DF: { key: 'jkf1' },
  DT: { key: 'tkc' },
  DJ: { key: 'kicIndex' },
  DG: { key: 'kckgIndex' },
  DM: { key: 'mlkIndex' },
  P:  { key: 'skip' },
  I:  { key: 'shkdDescriptor' },
  Q:  { key: 'fcCode', many: true },
  DR: { key: 'drCode' },
  Y:  { key: 'pinyinReadings', many: true },
  W:  { key: 'koreanReadings', many: true },
  DS: { key: 'rwj1stIndex' },
  DH: { key: 'rwj3rdIndex' },
  DC: { key: 'crowleyIndex' },
  Z:  { key: 'misclassificationCode', many: true },
  DB: { key: 'jfbpIndex' },

  /**
   * Remaining fields
   */
  args: {
    required: true,
    fn: function(args) {

      var isOnReading = function isOnReading(field) {
        return hirakata.isKata(field.replace(/[\-\.]/g, ''));
      };

      var isKunReading = function isKunReading(field) {
        return hirakata.isHira(field.replace(/[\-\.]/g, ''));
      };

      var isNanoriMarker = function isNanoriMarker(field) {
        return field === 'T1';
      };

      var isRadicalNameMarker = function isRadicalNameMarker(field) {
        return field === 'T2';
      };

      var isEnglishMeaning = function isEnglishMeaning(field) {
        return _.startsWith(field, '{');
      };

      var obj = {};
      var missedFields = [];

      args = args.filter(function(field) {
        var t = isOnReading(field) || isKunReading(field) ||
              isEnglishMeaning(field) || isNanoriMarker(field) ||
              isRadicalNameMarker(field);
        if (!t) missedFields.push(field);
        return t;
      });

      if (!_.isEmpty(missedFields)) debug('missed fields = ' + missedFields);

      // These are inefficient but don't care
      // We want our code to be stateless enough

      obj.onReadings = _.chain(args).takeWhile(isOnReading).value();
      obj.kunReadings = _.chain(args).dropWhile(isOnReading).takeWhile(isKunReading).value();

      // Doesn't work. slice(1) seems not working in this case
      //
      // obj.nanoriReadings = _.chain(args).dropWhile(_.negate(isNanoriMarker)).slice(1)
      //   .takeWhile(isKunReading).value();
      var a1 = _.chain(args).dropWhile(_.negate(isNanoriMarker)).slice(1).value();
      obj.nanoriReadings = _.chain(a1).takeWhile(isKunReading).value();

      // Doesn't work. slice(1) seems not working in this case
      //
      // obj.radicalNames = _.chain(args).dropWhile(_.negate(isRadicalNameMarker)).slice(1)
      //   .takeWhile(isKunReading).value();
      var a2 = _.chain(args).dropWhile(_.negate(isRadicalNameMarker)).slice(1).value();
      obj.radicalNames = _.chain(a2).takeWhile(isKunReading).value();

      obj.englishMeanings = _.chain(args).dropWhile(_.negate(isEnglishMeaning)).value();

      return obj;
    }
  }
};

/**
 * Parses an entry.
 *
 * @param {String} entry An entry
 * @returns {Object} A parsed entry or null if failed
 *
 * @see http://www.edrdg.org/kanjidic/kanjidic_doc.html
 * @see http://www.csse.monash.edu.au/~jwb/kanjidic.html
 */
var parseEntry = function parseEntry(fieldDefs, entry) {
  fieldDefs = _.clone(fieldDefs);

  var fields = entry.match(/(\{[^{}]+\})|([^\s]+)/g);
  var args = [];

  var result = fields.reduce(function(acc, field, index) {
    var defpair = (function() {
      // Finds positional field definition
      if (fieldDefs[index]) {
        return (function(posDef) {
          posDef.args = [ field ];
          delete fieldDefs[index];
          return [ index, posDef ];
        })(fieldDefs[index]);
      }
      // Finds key field definition
      var key = _.chain(fieldDefs).keys().find(function(key) {
        if (_.startsWith(field, key)) {
          fieldDefs[key].args = [ field.slice(key.length) ];
          return true;
        }
        return false;
      }).value();
      if (key) {
        return (function(value) {
          if (!value.many) delete fieldDefs[key];
          return [ key, value ];
        })(fieldDefs[key]);
      }
      // No definition for the field found.
      args.push(field);
      return null;
    })();

    if (!defpair) return acc;

    var key = defpair[0];
    var def = defpair[1];

    if (!def || def.ignore) return acc;

    // Doing this for each entry is inefficient but don't care
    def.fn = def.fn || _.identity;
    def.key = def.key === undefined ? key : def.key;

    // Applies field definition
    var obj = {};
    var val = def.fn.apply(this, def.args);
    obj[def.key] = def.many ? [ val ] : val;

    return _.merge(acc, obj, function(a, b) {
      return _.isArray(a) ? a.concat(b) : undefined;
    });
  }, {});

  // Applies the remaining arguments definition
  if (fieldDefs.args && fieldDefs.args.fn && !_.isEmpty(args)) {
    result = _.merge(result, fieldDefs.args.fn(args));
    delete fieldDefs.args;
  }

  var unprocessed = _.chain(fieldDefs).keys().filter(function(key) {
    return !fieldDefs[key].many && fieldDefs[key].required;
  }).value();

  if (!_.isEmpty(unprocessed)) {
    debug('unprocessed required fields: ' + unprocessed.join(', '));
    debug('missing required fields for entry: ' + entry);
    return null;
  }

  return result;
};

/**
 * Converters.
 */
var converters = {
  onkun: function(results) {
    return results.reduce(function(acc, entry) {
      if (!entry.kanji) throw new Error('malformed entry');
      var onReadings = entry.onReadings;
      var kunReadings = entry.kunReadings;
      if (_.isEmpty(onReadings) && _.isEmpty(kunReadings)) return acc;
      acc[entry.kanji] = _.chain(onReadings).concat(kunReadings)
        .map(function(reading) {
          return hirakata.toHira(reading.replace(/\..+$/, '').replace(/\-/g, ''));
        })
        .compact().uniq().value();
      return acc;
    }, {});
  },

  onkunnanori: function(results) {
    return results.reduce(function(acc, entry) {
      if (!entry.kanji) throw new Error('malformed entry');
      var onReadings = entry.onReadings;
      var kunReadings = entry.kunReadings;
      var nanoriReadings = entry.nanoriReadings;
      if (_.isEmpty(onReadings) && _.isEmpty(kunReadings) && _.isEmpty(nanoriReadings)) {
        return acc;
      }
      acc[entry.kanji] = _.chain(onReadings).concat(kunReadings).concat(nanoriReadings)
        .map(function(reading) {
          return hirakata.toHira(reading.replace(/\..+$/, '').replace(/\-/g, ''));
        })
        .compact().uniq().value();
      return acc;
    }, {});
  }
};

/**
 * Formatters.
 */
var formatters = {
  js: function(results) {
    return '' +
      '// This file is automatically generated by kanjidic.js\n' +
      '\n' +
      'module.exports = ' + JSON.stringify(results, null, 2) + ';';
  }
};

// Entry point
var main = function main(argv) {
  fetch(repos.kanjiDic)
    .then(function(body) {
      return toUtf8(body, 'euc-jp');
    })
    .then(function(text) {
      // Splits into entries
      return text.split('\n');
    })
    .filter(function(entry) {
      // Skips comment lines
      return !entry.match('^#');
    })
    .then(_.compact)
    .tap(function(entries) {
      debug('# original entries = ' + entries.length);
    })
    .map(_.partial(parseEntry, fieldDefs))
    .then(_.compact)
    .tap(function(results) {
      debug('# results = ' + results.length);
    })
    .then(converters[argv.converter])
    .then(formatters[argv.format])
    .then(function(content) {
      return fs.writeFileAsync(argv.outfile, content);
    })
    .catch(function(err) {
      throw err;
    });
};

if (require.main === module) {
  if (argv._.length < 1)
    throw new Error('usage: kanjidic <filename> [--converter=<converter>] [--format=<format>]');

  main(_.defaults(argv, {
    outfile: argv._[0],
    converter: 'onkunnanori',
    format: 'js'
  }));
}

module.exports = {
  parseEntry: parseEntry,
  fieldDefs: fieldDefs
};
