'use strict';

var should = require('should');

var utils = require('../src/utils');


describe('utils', function() {
  describe('#merge', function() {
    it('should override destination properties', function() {
      var dest = { a: 1 };
      utils.merge(dest, { a: 3, b: 1 }).should.be.eql({ a: 3, b: 1});
      dest.should.be.eql({ a: 3, b: 1});
    });
  });
});
