/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const file = require('fs-utils');
const plasma = require('../');


describe('when plasma.normalizeArray() is used on an array of strings', function () {
  describe('is passed an array of strings:', function () {
    it('foo should convert the array of strings to an array of objects, each with `__normalized__` and `src` properties', function (done) {
      var fixture = ['test/fixtures/*.yml', 'test/fixtures/*.json'];
      var actual = plasma.normalizeArray(fixture);

      var expected = [
        {__normalized__: true, src: ['test/fixtures/a.yml', 'test/fixtures/b.json', 'test/fixtures/c.json']}
      ];
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  describe('is passed an array of strings:', function () {
    it('foo should convert the array of strings to an array of objects, each with `__normalized__` and `src` properties', function (done) {
      var fixture = ['a', 'b', 'c'];
      var actual = plasma.normalizeArray(fixture);

      var expected = ['a', 'b', 'c'];
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  describe('is passed an array of strings:', function () {
    it('foo should convert the array of strings to an array of objects, each with `__normalized__` and `src` properties', function (done) {
      var fixture = ['a', 'b', '*.json'];
      var actual = plasma.normalizeArray(fixture);

      var expected = ['a', 'b', {__normalized__: true, src: ['bower.json', 'package.json']}];
      expect(actual).to.deep.equal(expected);
      done();
    });
  });
});