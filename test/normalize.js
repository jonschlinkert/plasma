/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const plasma = require('../');


describe('when plasma.normalize():', function () {

  // String
  describe('is passed a string:', function () {
    it('should return an array of objects, each with `__normalized__` and `src` properties', function (done) {
      var fixture = '*.json';
      var actual = plasma.normalize(fixture);

      var expected = [{__normalized__: true, src: ['bower.json', 'package.json']}];
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  // Object
  describe('is passed an object:', function () {
    it('should return an array containing the original object', function (done) {
      var fixture = {foo: 'foo', bar: 'bar', baz: 'baz'};
      var actual = plasma.normalize(fixture);

      var expected = [{__normalized__: true, foo: 'foo', bar: 'bar', baz: 'baz'}];
      expect(actual).to.deep.equal(expected);
      done();
    });

    it('should return an array containing the original object', function (done) {
      var fixture = {name: 'foo', src: ['*.json'], z: 'x'};
      var actual = plasma.normalize(fixture);

      var expected = [{__normalized__: true, __namespace__: true, name: 'foo', src: ['bower.json', 'package.json'], z: 'x'}];
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  // Array of strings
  describe('is passed an array of strings:', function () {
    it('foo should convert the array of strings to an array of objects, each with `__normalized__` and `src` properties', function (done) {
      var fixture = ['test/fixtures/*.yml', 'test/fixtures/*.json'];
      var actual = plasma.normalize(fixture);

      var expected = [{__normalized__: true, src: ['test/fixtures/a.yml', 'test/fixtures/b.json', 'test/fixtures/c.json']}];
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  // Mixed values
  describe('is passed an array containing mixed values (strings and objects):', function () {
    it('should return an array of objects, where each original object in the array is returned unmodified, and each string is converted to an object with `src` and `__normalized__` properties', function (done) {
      var fixture = ['*.json', {name: 'foo', src: ['test/fixtures/*.json']}];
      var actual = plasma.normalize(fixture);

      var expected = [
        {__normalized__: true, src: ['bower.json', 'package.json']},
        {__normalized__: true, __namespace__: true, name: 'foo', src: ['test/fixtures/b.json', 'test/fixtures/c.json']},
      ];
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  describe('is passed an array of objects:', function () {
    it('should return an array of objects, each with `__normalized__` and `src` properties', function (done) {
      var fixture = [{ name: 'fez', src: ['*.json']}];
      var actual = plasma.normalize(fixture);

      var expected = [{__normalized__: true, __namespace__: true, name: 'fez', src: ['bower.json', 'package.json']}];
      expect(actual).to.deep.equal(expected);
      done();
    });
  });


  // Array of objects
  describe('is passed an array of objects:', function () {
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
        {__normalized__: true, __namespace__: true, name: 'foo', src: ['test/fixtures/b.json', 'test/fixtures/c.json']}
      ];
      expect(actual).to.deep.equal(expected);
      done();
    });
  });
});
