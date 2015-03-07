'use strict';

var should = require('should');

var kanjidic = require('../tools/kanjidic');


describe('kanjidic', function() {
  describe('#parseEntry', function() {
    it('should capture positional fields', function() {
      kanjidic.parseEntry({
        0: { key: 'kanji' },
        1: { key: 'jis' }
      }, '漢 3441').should.be.eql({
        kanji: '漢',
        jis: '3441'
      });
    });

    it('should capture key fields', function() {
      kanjidic.parseEntry({
        U: { key: 'unicode', required: true }
      }, 'U6f22').should.be.eql({
        unicode: '6f22'
      });

      kanjidic.parseEntry({
        MN: { key: 'morohashiIndex', required: true },
        MP: { key: 'morohashiVolPage', required: true }
      }, 'MN18068P MP7.0189').should.be.eql({
        morohashiIndex: '18068P',
        morohashiVolPage: '7.0189'
      });
    });

    it('should capture many-key fields', function() {
      kanjidic.parseEntry({
        0: { key: 'kanji', required: true },
        Y: { key: 'pinyinReadings', many: true },
        W: { key: 'koreanReadings', many: true }
      }, '阿 Ya1 Ye1 Ya5 Ya2 Ya4 Wa Wog').should.be.eql({
        kanji: '阿',
        pinyinReadings: [ 'a1', 'e1', 'a5', 'a2', 'a4' ],
        koreanReadings: [ 'a', 'og' ]
      });
    });

    it('should return null if missing required fields' , function() {
      should(kanjidic.parseEntry({
        0: { key: 'kanji', required: true },
        1: { key: 'jis', required: true },
        U: { key: 'unicode', required: true }
      }, '漢 3441')).be.exactly(null);
    });

    it('should capture remaining arguments', function() {
      kanjidic.parseEntry({
        0: { key: 'kanji', required: true },
        1: { key: 'jis', required: true },
        U: { key: 'unicode', required: true },
        args: { required: true, fn: function(args) { return { args: args }; } }
      }, '漢 3441 U6f22 カン T1 はん {Sino-} {China}').should.be.eql({
        kanji: '漢',
        jis: '3441',
        unicode: '6f22',
        args: ['カン', 'T1', 'はん', '{Sino-}', '{China}']
      });

      kanjidic.parseEntry({
        0: { key: 'kanji', required: true },
        1: { key: 'jis', required: true },
        U: { key: 'unicode', required: true },
        args: { required: true, fn: function(args) { return { args: args }; } }
      }, '字 3B7A U5b57 ジ あざ あざな -な {character} {letter} {word} {section of village}').should.be.eql({
        kanji: '字',
        jis: '3B7A',
        unicode: '5b57',
        args: ['ジ', 'あざ', 'あざな', '-な', '{character}', '{letter}', '{word}', '{section of village}']
      });
    });

    it('should capture Japanese readings', function() {
      kanjidic.parseEntry(kanjidic.fieldDefs, '亜 3021 ア つ.ぐ T1 や つぎ つぐ')
        .should.be.eql({
          kanji: '亜',
          jis: '3021',
          onReadings: ['ア'],
          kunReadings: ['つ.ぐ'],
          nanoriReadings: ['や', 'つぎ', 'つぐ'],
          radicalNames: [],
          englishMeanings: []
        });
    });
  });
});
