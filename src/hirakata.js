/**
 * Conversion between hiragana and katanaka.
 */

'use strict';


var hiraToKataDict = {
  'あ': 'ア', 'い': 'イ', 'う': 'ウ', 'え': 'エ', 'お': 'オ',
  'か': 'カ', 'き': 'キ', 'く': 'ク', 'け': 'ケ', 'こ': 'コ',
  'さ': 'サ', 'し': 'シ', 'す': 'ス', 'せ': 'セ', 'そ': 'ソ',
  'た': 'タ', 'ち': 'チ', 'つ': 'ツ', 'て': 'テ', 'と': 'ト',
  'な': 'ナ', 'に': 'ニ', 'ぬ': 'ヌ', 'ね': 'ネ', 'の': 'ノ',
  'は': 'ハ', 'ひ': 'ヒ', 'ふ': 'フ', 'へ': 'ヘ', 'ほ': 'ホ',
  'ま': 'マ', 'み': 'ミ', 'む': 'ム', 'め': 'メ', 'も': 'モ',
  'や': 'ヤ', 'ゆ': 'ユ', 'よ': 'ヨ',
  'ら': 'ラ', 'り': 'リ', 'る': 'ル', 'れ': 'レ', 'ろ': 'ロ',
  'わ': 'ワ', 'を': 'ヲ',
  'ん': 'ン',

  'が': 'ガ', 'ぎ': 'ギ', 'ぐ': 'グ', 'げ': 'ゲ', 'ご': 'ゴ',
  'ざ': 'ザ', 'じ': 'ジ', 'ず': 'ズ', 'ぜ': 'ゼ', 'ぞ': 'ゾ',
  'だ': 'ダ', 'ぢ': 'ヂ', 'づ': 'ヅ', 'で': 'デ', 'ど': 'ド',
  'ば': 'バ', 'び': 'ビ', 'ぶ': 'ブ', 'べ': 'ベ', 'ぼ': 'ボ',
  'ぱ': 'パ', 'ぴ': 'ピ', 'ぷ': 'プ', 'ぺ': 'ペ', 'ぽ': 'ポ',

  'ぁ': 'ァ', 'ぃ': 'ィ', 'ぅ': 'ゥ', 'ぇ': 'ェ', 'ぉ': 'ォ',
  'ゃ': 'ャ', 'ゅ': 'ュ', 'ょ': 'ョ',
  'ゎ': 'ヮ',
  'っ': 'ッ',
  'ー': 'ー'
};

var kataToHiraDict = Object.keys(hiraToKataDict).reduce(function(acc, hira) {
  var kata = hiraToKataDict[hira];
  if (!kata) throw new Error('unexpected: no value for key (' + hira + ')');
  if (acc[kata]) throw new Error('unexpected: already defined for ' + kata);
  acc[kata] = hira;
  return acc;
}, {});

var _mapStr = function _mapStr(str, mapper) {
  var len = str.length;
  var result = '';

  for (var i = 0; i < len; ++i) {
    result += mapper(str[i], i);
  }

  return result;
};

var _allStr = function _allStr(str, predicate) {
  var len = str.length;

  for (var i = 0; i < len; ++i) {
    if (!predicate(str[i])) return false;
  }

  return true;
};

/**
 * Converts a hiragana string into a katakana string.
 *
 * @param {String} hiraStr A hiragana string
 * @returns {String} A katakana string
 */
var toKata = function toKata(hiraStr) {
  return _mapStr(hiraStr, function(hira) {
    var kata = hiraToKataDict[hira];
    if (kata) return kata;
    else return hira;
  });
};

/**
 * Converts a katakana string into a hiragana string.
 *
 * @param {String} kataStr A katakana string
 * @returns {String} A hiragana string
 */
var toHira = function toHira(kataStr) {
  return _mapStr(kataStr, function(kata) {
    var hira = kataToHiraDict[kata];
    if (hira) return hira;
    else return kata;
  });
};

/**
 * Returns true if a string is katakana, otherwise false.
 *
 * @param {String} str String
 * @returns {Boolean} True if all the character in the string is katakana
 */
var isKata = function isKata(str) {
  return _allStr(str, function(ch) {
    return !!kataToHiraDict[ch];
  });
};

/**
 * Returns true if a string is hiragana, otherwise false.
 *
 * @param {String} str String
 * @returns {Boolean} True if all the character in the string is hiragana
 */
var isHira = function isHira(str) {
  return _allStr(str, function(ch) {
    return !!hiraToKataDict[ch];
  });
};

module.exports = {
  toKata: toKata,
  toHira: toHira,
  isKata: isKata,
  isHira: isHira
};
