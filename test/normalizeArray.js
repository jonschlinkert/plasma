/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const plasma = require('../');


describe('normalizeArray()', function () {
  describe('when an array of valid glob patterns are passed:', function () {
    it('should return an array of objects with `__normalized__` and a `src` property with the expanded file paths', function (done) {
      var fixture = ['test/fixtures/*.yml', 'test/fixtures/*.json'];
      var actual = plasma.normalizeArray(fixture);

      var expected = [
        {__normalized__: true, src: ['test/fixtures/a.yml', 'test/fixtures/b.json', 'test/fixtures/c.json']}
      ];
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  describe('when an array of strings is passed, and they are not glob patterns or file paths:', function () {
    it('should return an array of objects with `__normalized__` the original strings', function (done) {
      var fixture = ['a', 'b', 'c'];
      var actual = plasma.normalizeArray(fixture);

      var expected = [{__normalized__: true, nomatch: ['a', 'b', 'c']}];
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  describe('is passed an array of strings:', function () {
    it('should return an array of objects with `__normalized__` and `src` properties', function (done) {
      var fixture = ['a', 'b', '*.json'];
      var actual = plasma.normalizeArray(fixture);

      var expected = [
        {__normalized__: true, nomatch: ['a', 'b']},
        {__normalized__: true, src: ['bower.json', 'package.json']}
      ];
      expect(actual).to.deep.equal(expected);
      done();
    });
  });



  // Array of objects
  describe('is passed an array of objects:', function () {
    it('bar should return an array of objects with `__normalized__` and `src` properties', function (done) {
      var fixture = [{ name: 'fez', src: ['*.json']}];
      var actual = plasma.normalize(fixture);

      var expected = [{__normalized__: true, name: 'fez', src: ['bower.json', 'package.json']}];
      expect(actual).to.deep.equal(expected);
      done();
    });

    it('bar should return an array of objects with `__normalized__` and `src` properties', function (done) {
      var fixture = [{src: ['*.json']}];
      var actual = plasma.normalize(fixture);

      var expected = [{__normalized__: true, src: ['bower.json', 'package.json']}];
      expect(actual).to.deep.equal(expected);
      done();
    });

    it('should return the array of objects unmodified', function (done) {
      var fixture = [
        {foo: 'foo', bar: 'bar', baz: 'baz'},
        {bar: 'bar', baz: 'foo', bang: 'boom'}
      ];
      var actual = plasma.normalize(fixture);

      var expected = [
        {__normalized__: true, foo: 'foo', bar: 'bar', baz: 'baz'},
        {__normalized__: true, bar: 'bar', baz: 'foo', bang: 'boom'}
      ];
      expect(actual).to.deep.equal(expected);
      done();
    });

    it('should return the array of unmodified objects', function (done) {
      var fixture = [{quux: 'a/*.json'}, {name: 'foo', src: ['test/fixtures/*.json']}];
      var actual = plasma.normalize(fixture);

      var expected = [
        {__normalized__: true, quux: 'a/*.json'},
        {__normalized__: true, name: 'foo', src: ['test/fixtures/b.json', 'test/fixtures/c.json']}
      ];
      expect(actual).to.deep.equal(expected);
      done();
    });
  });
});