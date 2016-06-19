'use strict';

var should = require('should');

var r2h = require('../src/romaji2hira');

describe('romaji2hira', function() {
  describe('#convert', function() {
    it('should return あいうえお (vowels only)', function() {
      r2h.convert('AIUEO').should.be.exactly('あいうえお');
    });

    it('should return あいうえお (with lowercase input)', function() {
      r2h.convert('aiueo').should.be.exactly('あいうえお');
    });

    it('should return かきくけこ (non-vowels only)', function() {
      r2h.convert('KAKIKUKEKO').should.be.exactly('かきくけこ');
    });

    it('should return さいすえそ (mixed)', function() {
      r2h.convert('SAISUESO').should.be.exactly('さいすえそ');
    });

    it('should return おおおおお (no sokuon)', function() {
      r2h.convert('OOOOO').should.be.exactly('おおおおお');
    });

    it('should return たっとぶ (with sokuon)', function() {
      r2h.convert('TATTOBU').should.be.exactly('たっとぶ');
    });

    it('should return はんのう (no sokuon with double N\'s)', function() {
      r2h.convert('HANNOU').should.be.exactly('はんのう');
    });

    it('should return しつち (three-romaji letters)', function() {
      r2h.convert('SHITSUCHI').should.be.exactly('しつち');
    });

    it('should return null if conversion failed', function() {
      should(r2h.convert('AIUXEO')).be.exactly(null);
      should(r2h.convert('SI')).be.exactly(null);
      should(r2h.convert('TU')).be.exactly(null);
      should(r2h.convert('TI')).be.exactly(null);
    });
  });
});
