/*!
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */
'use strict';

var expect = require('chai').expect;
var plasma = require('../');


describe('globbing:', function () {
  describe('when a string of glob patterns is passed to plasma.load()', function () {
    it('should read the files and return an object', function (done) {
      var fixture = 'test/fixtures/*.{json,yml}';
      var actual = plasma(fixture);

      var expected = {aaa: "bbbb", ccc: "dddd", eee: "ffff"};
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  describe('when an array of glob patterns is passed to plasma.load()', function () {
    it('should read the files and return an object', function (done) {
      var fixture = ['test/fixtures/*.{json,yml}'];
      var actual = plasma(fixture);

      var expected = {aaa: 'bbbb', ccc: 'dddd', eee: 'ffff'};
      expect(actual).to.deep.equal(expected);
      done();
    });
  });
});