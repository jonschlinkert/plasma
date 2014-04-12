/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const plasma = require('../');


describe('normalizeString()', function () {
  describe('when a string is passed', function () {
    it('ashould return an object with `__normalized__` and `src` properties', function (done) {
      var fixture = '*.json';
      var expected = [{__normalized__: true, src: ['bower.json', 'package.json']}];
      expect(plasma.normalizeString(fixture)).to.deep.equal(expected);
      done();
    });
  });


  describe('when a string is passed, and globule cannot find a match', function () {
    it('bshould return an object with `__normalized__` and the original string as a value to `nomatch`', function (done) {
      var fixture = 'a';
      var expected = [{__normalized__: true, nomatch: ['a']}];
      expect(plasma.normalizeString(fixture)).to.deep.equal(expected);
      done();
    });
  });
});
