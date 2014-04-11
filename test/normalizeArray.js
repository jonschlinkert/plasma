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
      var fixture = ['test/fixtures/*.json', 'test/fixtures/*.yml'];
      var actual = plasma.normalizeArray(fixture);

      var expected = [
        {__normalized__: true, src: ['test/fixtures/a.yml', 'test/fixtures/b.json', 'test/fixtures/c.json']}
      ];
      expect(actual).to.deep.equal(expected);
      done();
    });
  });
});