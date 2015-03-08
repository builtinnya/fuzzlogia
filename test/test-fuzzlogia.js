'use strict';

var should = require('should');

var fl = require('../src/fuzzlogia');


describe('fuzzlogia', function() {
  describe('#search', function() {
    it('should consider threshold', function() {
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
  });
});
