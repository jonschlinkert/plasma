/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const path = require('path');
const file = require('fs-utils');
const _ = require('lodash');
const expect = require('chai').expect;
const plasma = require('../');


describe('when plasma.normalizeObject():', function () {

  describe('is passed an object:', function () {
    it('should return an array containing the original object', function (done) {
      var fixture = {foo: 'foo', bar: 'bar', baz: 'baz'};
      var actual = plasma.normalizeObject(fixture);

      var expected = [{__normalized__: true, foo: 'foo', bar: 'bar', baz: 'baz'}];
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  describe('is passed an object:', function () {
    it('bar should return an array of objects, each with `__normalized__` and `src` properties', function (done) {
      var fixture = { name: 'fez', src: ['*.json', '*.json']};
      var actual = plasma.normalizeObject(fixture);

      var expected = [{__normalized__: true, name: 'fez', src: ['bower.json', 'package.json']}];
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  describe('is passed an object:', function () {
    it('baz should return an array of objects, each with `__normalized__` and `src` properties', function (done) {
      var fixture = {expand: false, name: ':basename', src: ['test/fixtures/*.json', 'test/fixtures/*.yml']};
      var actual = plasma.normalizeObject(fixture);

      var expected = [
        {__normalized__: true, name: 'b', src: ['test/fixtures/b.json']},
        {__normalized__: true, name: 'c', src: ['test/fixtures/c.json']},
        {__normalized__: true, name: 'a', src: ['test/fixtures/a.yml']},
      ];
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  describe('is passed an object:', function () {
    it('baz should return an array of objects, each with `__normalized__` and `src` properties', function (done) {
      var fixture = { name: ':basename', src: ['test/fixtures/*.json', 'test/fixtures/*.yml']};
      var actual = plasma.normalizeObject(fixture);

      var expected = [
        {__normalized__: true, name: 'b', src: ['test/fixtures/b.json']},
        {__normalized__: true, name: 'c', src: ['test/fixtures/c.json']},
        {__normalized__: true, name: 'a', src: ['test/fixtures/a.yml']},
      ];
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  describe('is passed an object:', function () {
    it('baz should return an array of objects, each with `__normalized__` and `src` properties', function (done) {
      var fixture = { name: ':basename', src: 'test/fixtures/*.yml'};
      var actual = plasma.normalizeObject(fixture);

      var expected = [
        {__normalized__: true, name: 'a', src: ['test/fixtures/a.yml']}
      ];
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  describe('is passed an object:', function () {
    it('baz should return an array of objects, each with `__normalized__` and `src` properties', function (done) {
      var fixture = {
        src: 'test/fixtures/*.{json,yml}',
        name: function(src) {
          var patterns = [];
          src.map(function(pattern) {
            patterns.push(pattern);
          });
          return {__normalized__: true, name: 'a', src: patterns}
        },
      };
      var actual = plasma.normalizeObject(fixture);

      var expected = [
        {__normalized__: true, name: 'a', src: ['test/fixtures/*.{json,yml}']}
      ];
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  describe('is passed an object:', function () {
    it('and `name` is a function', function (done) {
      var fixture = {
        src: 'test/fixtures/*.{json,yml}',
        name: function(src) {
          var patterns = [], data = {};
          src.map(function(pattern) {
            file.expand(pattern).map(function(filepath) {
              patterns = patterns.concat({
                __normalized__: true,
                name: file.name(filepath),
                src: [filepath]
              });
            })
          });
          return patterns
        },
      };
      var actual = plasma.normalizeObject(fixture);

      var expected = [
        {__normalized__: true, name: 'a', src: ['test/fixtures/a.yml']},
        {__normalized__: true, name: 'b', src: ['test/fixtures/b.json']},
        {__normalized__: true, name: 'c', src: ['test/fixtures/c.json']},
      ];
      expect(actual).to.deep.equal(expected);
      done();
    });
  });
});
