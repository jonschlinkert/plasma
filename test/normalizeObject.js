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
    describe('when the object doesn\'t have a src propety or a processConfig property:', function () {
      it('should return an array containing the original object', function (done) {
        var fixture = {foo: 'foo', bar: 'bar', baz: 'baz'};
        var actual = plasma.normalizeObject(fixture);

        var expected = [{__normalized__: true, foo: 'foo', bar: 'bar', baz: 'baz'}];
        expect(actual).to.deep.equal(expected);
        done();
      });
    });

    describe('when the object contains a mixture of src of non-src properties:', function () {
      it('should return an array with an object that has all non-src properties, and a src property with files expanded', function (done) {
        var fixture = {src: ['*.json'], foo: 'foo', bar: 'bar', baz: 'baz'};
        var actual = plasma.normalizeObject(fixture);

        var expected = [{__normalized__: true, foo: 'foo', bar: 'bar', baz: 'baz', src: ['bower.json', 'package.json']}];
        expect(actual).to.deep.equal(expected);
        done();
      });
    });

    describe('is passed an object:', function () {
      it('should return an array of objects, each with `__normalized__` and `src` properties', function (done) {
        var fixture = { name: 'fez', src: ['*.json', '*.json']};
        var actual = plasma.normalizeObject(fixture);

        var expected = [{__normalized__: true, __namespace__: true, name: 'fez', src: ['bower.json', 'package.json']}];
        expect(actual).to.deep.equal(expected);
        done();
      });
    });
  });


  describe('when src properties exist but globule returns null values:', function () {
    it('should return an array with an object that has all non-src properties, and the original src value', function (done) {
      var fixture = {src: ['foo/*.json'], foo: 'foo', bar: 'bar', baz: 'baz'};
      var actual = plasma.normalizeObject(fixture);

      var expected = [{__normalized__: true, nomatch: ['foo/*.json'], foo: 'foo', bar: 'bar', baz: 'baz'}];
      expect(actual).to.deep.equal(expected);
      done();
    });

    it('should return an array with the original object and the original src value assigned to `nomatch`', function (done) {
      var fixture = {src: ['foo/*.json']};
      var actual = plasma.normalizeObject(fixture);

      var expected = [{__normalized__: true, nomatch: ['foo/*.json']}];
      expect(actual).to.deep.equal(expected);
      done();
    });

    it('should return an array of normalized objects', function (done) {
      var fixture = { name: 'fez', src: ['*.json', 'foo/*.json']};
      var actual = plasma.normalizeObject(fixture);

      var expected = [{__normalized__: true, __namespace__: true, name: 'fez', src: ['bower.json', 'package.json']}];
      expect(actual).to.deep.equal(expected);
      done();
    });
  });
});
