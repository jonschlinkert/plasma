/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const plasma = require('../');


// Ensure that globule is getting passed options
describe('globule:', function () {
  describe('when options are passed:', function () {
    it('globule should use them, but the options should not be returned in the config object', function (done) {
      var config = 'a.json';
      var options = {cwd: 'test/fixtures/load/string', prefixBase: true};
      var actual = plasma.load(config, options).data;

      var expected = {a: 'This value is from a.json'};
      expect(actual).to.deep.eql(expected);
      done();
    });
  });

  describe('when a string of glob patterns is passed to plasma.load()', function () {
    it('should read the files and return an object', function (done) {
      var fixture = 'test/fixtures/*.{json,yml}';
      var actual = plasma.load(fixture).data;

      var expected = {aaa: "bbbb", ccc: "dddd", eee: "ffff"};
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  describe('when an array of glob patterns is passed to plasma.load()', function () {
    it('should read the files and return an object', function (done) {
      var fixture = ['test/fixtures/*.{json,yml}'];
      var actual = plasma.load(fixture).data;

      var expected = {aaa: 'bbbb', ccc: 'dddd', eee: 'ffff'};
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  describe('when an object is passed to plasma.load()', function () {
    it('globule should read the files, and plasma.load() should return an object', function (done) {
      var fixture = {prefixBase: true, cwd: 'test/fixtures', src: '*.{json,yml}'};
      var actual = plasma.load(fixture).data;

      var expected = {aaa: 'bbbb', ccc: 'dddd', eee: 'ffff'};
      expect(actual).to.deep.equal(expected);
      done();
    });
  });
});