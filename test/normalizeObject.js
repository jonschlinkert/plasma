/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const plasma = require('../');


describe('normalizeObject():', function () {

  describe('when an object is passed:', function () {
    describe('when the object doesn\'t have a patterns propety or a processConfig property:', function () {
      it('should return an array containing the original object', function (done) {
        var fixture = {foo: 'foo', bar: 'bar', baz: 'baz'};
        var actual = plasma.normalizeObject(fixture);

        var expected = [{__normalized__: true, foo: 'foo', bar: 'bar', baz: 'baz'}];
        expect(actual).to.deep.equal(expected);
        done();
      });
    });

    describe('when the object contains a mixture of patterns of non-patterns properties:', function () {
      it('should return an array with an object that has all non-patterns properties, and a patterns property with files expanded', function (done) {
        var fixture = {patterns: ['*.json'], foo: 'foo', bar: 'bar', baz: 'baz'};
        var actual = plasma.normalizeObject(fixture);

        var expected = [{__normalized__: true, foo: 'foo', bar: 'bar', baz: 'baz', patterns: ['bower.json', 'package.json']}];
        expect(actual).to.deep.equal(expected);
        done();
      });
    });

    describe('is passed an object:', function () {
      it('should return an array of objects, each with `__normalized__` and `patterns` properties', function (done) {
        var fixture = { namespace: 'fez', patterns: ['*.json', '*.json']};
        var actual = plasma.normalizeObject(fixture);

        var expected = [{__normalized__: true, __namespace__: true, namespace: 'fez', patterns: ['bower.json', 'package.json']}];
        expect(actual).to.deep.equal(expected);
        done();
      });
    });
  });


  describe('when patterns properties exist but globule returns null values:', function () {
    it('should return an array with an object that has all non-patterns properties, and the original patterns value', function (done) {
      var fixture = {patterns: ['foo/*.json'], foo: 'foo', bar: 'bar', baz: 'baz'};
      var actual = plasma.normalizeObject(fixture);

      var expected = [{__normalized__: true, patterns: ['foo/*.json'], nomatch: ['foo/*.json'], foo: 'foo', bar: 'bar', baz: 'baz'}];
      expect(actual).to.deep.equal(expected);
      done();
    });

    it('should return an array with the original object and the original patterns value assigned to `nomatch`', function (done) {
      var fixture = {patterns: ['foo/*.json']};
      var actual = plasma.normalizeObject(fixture);

      var expected = [{__normalized__: true, patterns: ['foo/*.json'], nomatch: ['foo/*.json']}];
      expect(actual).to.deep.equal(expected);
      done();
    });

    it('should return an array of normalized objects', function (done) {
      var fixture = { namespace: 'fez', patterns: ['*.json', 'foo/*.json']};
      var actual = plasma.normalizeObject(fixture);

      var expected = [{__normalized__: true, __namespace__: true, namespace: 'fez', patterns: ['bower.json', 'package.json']}];
      expect(actual).to.deep.equal(expected);
      done();
    });
  });
});
