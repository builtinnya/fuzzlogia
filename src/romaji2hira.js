/**
 * Converts romaji into hiragana.
 *
 * This is obviously not a comprehensive module for romaji-to-hiragana
 * conversion, but enough for dealing with Unihan Japanese kanji reading
 * database.
 */

'use strict';


var romajiToHiraDict = {
  'a':  'あ', 'i':   'い', 'u':   'う', 'e':  'え', 'o':  'お',
  'ka': 'か', 'ki':  'き', 'ku':  'く', 'ke': 'け', 'ko': 'こ',
  'sa': 'さ', 'shi': 'し', 'su':  'す', 'se': 'せ', 'so': 'そ',
  'ta': 'た', 'chi': 'ち', 'tsu': 'つ', 'te': 'て', 'to': 'と',
  'na': 'な', 'ni':  'に', 'nu':  'ぬ', 'ne': 'ね', 'no': 'の',
  'ha': 'は', 'hi':  'ひ', 'fu':  'ふ', 'he': 'へ', 'ho': 'ほ',
  'ma': 'ま', 'mi':  'み', 'mu':  'む', 'me': 'め', 'mo': 'も',
  'ya': 'や', 'yu':  'ゆ', 'yo':  'よ',
  'ra': 'ら', 'ri':  'り', 'ru':  'る', 're': 'れ', 'ro': 'ろ',
  'wa': 'わ', 'wo':  'を',
  'n':  'ん',

  'kya': 'きゃ', 'kyu': 'きゅ', 'kyo': 'きょ',
  'sha': 'しゃ', 'shu': 'しゅ', 'sho': 'しょ',
  'cha': 'ちゃ', 'chu': 'ちゅ', 'cho': 'ちょ',
  'nya': 'にゃ', 'nyu': 'にゅ', 'nyo': 'にょ',
  'hya': 'ひゃ', 'hyu': 'ひゅ', 'hyo': 'ひょ',
  'mya': 'みゃ', 'myu': 'みゅ', 'myo': 'みょ',
  'rya': 'りゃ', 'ryu': 'りゅ', 'ryo': 'りょ',

  'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
  'za': 'ざ', 'ji': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
  'da': 'だ', 'di': 'ぢ', 'du': 'づ', 'de': 'で', 'do': 'ど',
  'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
  'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'ぽ',

  'gya': 'ぎゃ', 'gyu': 'ぎゅ', 'gyo': 'ぎょ',
  'ja':  'じゃ', 'ju':  'じゅ', 'jo':  'じょ',
  'bya': 'びゃ', 'byu': 'びゅ', 'byo': 'びょ',
  'pya': 'ぴゃ', 'pyu': 'ぴゅ', 'pyo': ''
};

/**
 * Converts a romaji string into a hiragana string.
 *
 * @param {String} romajiStr A romaji string
 * @returns {String|null} A hiragana string or null if failed
 */
var convert = function convert(romajiStr) {
  romajiStr = romajiStr.toLowerCase();

  var len = romajiStr.length;
  var currentIndex = 0;
  var result = '';

  while (currentIndex < len) {
    var sokuon = (function(firstTwoChars) {
      return firstTwoChars.match(/^([^aiueon])\1$/i);
    })(romajiStr.slice(currentIndex, currentIndex + 2));

    if (sokuon) {
      currentIndex += 1;
      result += 'っ';
    }

    var success = [ 3, 2, 1 ].some(function(unitLen) {
      var part = romajiStr.slice(currentIndex, currentIndex + unitLen);
      var hira = romajiToHiraDict[part];
      if (hira !== undefined) {
        result += hira;
        currentIndex += unitLen;
        return true;
      }
      return false;
    });

    if (!success) return null;
  }

  return result;
};


module.exports = {
  convert: convert
};
