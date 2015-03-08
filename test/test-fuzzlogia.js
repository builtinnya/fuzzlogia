'use strict';

var should = require('should');

var fl = require('../src/fuzzlogia');


describe('fuzzlogia', function() {
  describe('#search', function() {
    it('should consider threshold', function() {
      fl.search('fzzuy', [ 'fuzzy', 'matching' ]).should.be.eql([ 'fuzzy' ]);

      fl.search('あいうえお', [ 'さしすせそ', 'はまやらわ' ])
        .should.be.eql([]);

      fl.search('あいうえお', [ 'さしすせそ', 'あいうえお' ])
        .should.be.eql([ 'あいうえお' ]);

      fl.search('あいうえお', [ 'あいうえか', 'あいうかき' ], null, { threshold: 1 })
        .should.be.eql([ 'あいうえか' ]);

      fl.search('あいうえお', [ 'あいうえか', 'あいうかき' ], null, { threshold: 2 })
        .should.be.eql([ 'あいうえか', 'あいうかき' ]);
    });

    it('should return in the rank order', function() {
      fl.search('あい', [ 'あうえいお', 'あいうえお', 'あい' ])
        .should.be.eql([ 'あい', 'あいうえお', 'あうえいお' ]);
    });

    it('should use extractor', function() {
      fl.search('あ', [ { name: 'あ' } ], 'name')
        .should.be.eql([ { name: 'あ' } ]);

      fl.search('あい', [ { a: 'あ', b: 'い' } ], function(o) { return o.a + o.b; })
        .should.be.eql([ { a: 'あ', b: 'い' } ]);
    });

    it('should return an empty array if query is empty', function() {
      fl.search('', [ 'あいうえお' ]).should.be.eql([]);
    });

    it('should consider Japanese kanji on/kun readings', function() {
      fl.search('あい', [ '愛' ]).should.be.eql([ '愛' ]);
      fl.search('アイ', [ '愛' ]).should.be.eql([ '愛' ]);
      fl.search('さえない', [ '冴えない' ]).should.be.eql([ '冴えない' ]);
      fl.search('さいこうさいばんしょ', [ '最高裁判所' ]).should.be.eql([ '最高裁判所' ]);
      fl.search('かんじ', [ '漢字は難しい' ]).should.be.eql([ '漢字は難しい' ]);
      fl.search('ぎんが', [ '電気羊', '銀河ヒッチハイクガイド' ])
        .should.be.eql([ '銀河ヒッチハイクガイド' ]);
    });

    it('should consider Japanese nanori readings', function() {
      fl.search('ゆうき', [ '結城' ]).should.be.eql([ '結城' ]);
      fl.search('さき', [ '咲' ]).should.be.eql([ '咲' ]);
    });
  });
});
