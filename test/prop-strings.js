/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const plasma = require('../');


/**
 * replace `:props` in `name`
 */

describe('plasma.load():', function () {
  describe('when prop strings are used in the `name` field', function () {
    describe('if :basename is used', function () {
      it('should use the basename of each data file as the namespace for its config object', function (done) {
        var fixture = {name: ':basename', src: ['test/fixtures/*.{json,yml}'], alpha: 'beta'};
        var actual = plasma.load(fixture).data;
        var expected = {a: {aaa: 'bbbb'}, b: {ccc: 'dddd'}, c: {eee: 'ffff'}, alpha: 'beta' };
        expect(actual).to.deep.equal(expected);
        done();
      });
    });
  });
});


describe('plasma.process():', function () {
  describe('when plasma.process() is passed an object with the `:basename` prop string defined', function () {
    it('should use the basename of each data file as the namespace for its config object', function (done) {
      var fixture = {name: ':basename', src: ['test/fixtures/b.json'] };
      var expected = {b: {ccc: 'dddd'}};
      var actual = plasma.process(fixture);

      expect(actual).to.deep.equal(expected);
      done();
    });

    it('should use the basename of each data file as the namespace for its config object', function (done) {
      var fixture = {name: ':basename', src: ['test/fixtures/i18n/*.json'] };
      var actual = plasma.process(fixture);

      expect(actual).to.have.deep.property('fi.select-language', 'Valitse kieli');
      done();
    });
  });
});



/**
 * plasma.normalize()
 */

describe('prop-strings / plasma.normalize()', function () {
  describe('when an array is passed containing an object with a prop string:', function () {
    it('should return an array of objects, each with `__normalized__` and `src` properties', function (done) {
      var fixture = [{ name: ':basename', src: ['test/fixtures/*.yml', 'test/fixtures/*.json']}];
      var actual = plasma.normalize(fixture);

      var expected = [
        {__normalized__: true, __namespace__: true, name: 'a', src: ['test/fixtures/a.yml']},
        {__normalized__: true, __namespace__: true, name: 'b', src: ['test/fixtures/b.json']},
        {__normalized__: true, __namespace__: true, name: 'c', src: ['test/fixtures/c.json']},
      ];
      expect(actual).to.deep.equal(expected);
      done();
    });
  });
});

/**
 * plasma.normalizeObject()
 */

describe('prop-strings / plasma.normalizeObject()', function () {
  describe('when normalizeObject():', function () {
    describe('is passed an object with prop strings:', function () {
      it('should return an array of objects, each with `__normalized__` and `src` properties', function (done) {
        var fixture = { name: 'fez', src: ['*.json', '*.json'] };
        var actual = plasma.normalizeObject(fixture);

        var expected = [{__normalized__: true, __namespace__: true, name: 'fez', src: ['bower.json', 'package.json']}];
        expect(actual).to.deep.equal(expected);
        done();
      });

      it('should return an array of objects, each with `__normalized__` and `src` properties', function (done) {
        var fixture = { expand: false, name: ':basename', src: ['test/fixtures/*.json', 'test/fixtures/*.yml'] };
        var actual = plasma.normalizeObject(fixture);

        var expected = [
          {__normalized__: true, __namespace__: true, name: 'b', src: ['test/fixtures/b.json']},
          {__normalized__: true, __namespace__: true, name: 'c', src: ['test/fixtures/c.json']},
          {__normalized__: true, __namespace__: true, name: 'a', src: ['test/fixtures/a.yml']},
        ];
        expect(actual).to.deep.equal(expected);
        done();
      });

      it('should return an array of objects, each with `__normalized__` and `src` properties', function (done) {
        var fixture = { name: ':basename', src: ['test/fixtures/*.json', 'test/fixtures/*.yml'] };
        var actual = plasma.normalizeObject(fixture);

        var expected = [
          {__normalized__: true, __namespace__: true, name: 'b', src: ['test/fixtures/b.json']},
          {__normalized__: true, __namespace__: true, name: 'c', src: ['test/fixtures/c.json']},
          {__normalized__: true, __namespace__: true, name: 'a', src: ['test/fixtures/a.yml']},
        ];
        expect(actual).to.deep.equal(expected);
        done();
      });

      it('should return an array of objects, each with `__normalized__` and `src` properties', function (done) {
        var fixture = { name: ':basename', src: 'test/fixtures/*.yml' };
        var actual = plasma.normalizeObject(fixture);

        var expected = [
          {__normalized__: true, __namespace__: true, name: 'a', src: ['test/fixtures/a.yml']}
        ];
        expect(actual).to.deep.equal(expected);
        done();
      });
    });
  });
});