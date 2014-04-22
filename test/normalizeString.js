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
    it('should return an object with `__normalized__` and `src` properties', function (done) {
      var fixture = '*.json';
      var actual = plasma.normalizeString(fixture);

      var expected = [{__normalized__: true, src: ['bower.json', 'package.json']}];
      expect(actual).to.deep.equal(expected);
      done();
    });
  });


  describe('when a string is passed, and globule cannot find a match', function () {
    it('should return an object with `__normalized__`, and return the original string in the `nomatch` array', function (done) {
      var fixture = 'a';
      var actual = plasma.normalizeString(fixture);

      var expected = {__normalized__: true, resolved: {}, unresolved: ['a'], nomatch: ['a']};
      expect(actual).to.deep.equal(expected);
      done();
    });
  });
});
