/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const plasma = require('../');


/**
 * plasma.normalize()
 */

describe('plasma.normalize()', function () {

  // String
  describe('when plasma.normalize() is used on a string', function () {
    it('should return an array of objects, each with `expand` and `src` properties', function (done) {
      var fixture = 'foo/*.json';
      var expected = [
        {expand: true, src: ['foo/*.json']}
      ];
      expect(plasma.normalize(fixture)).to.deep.equal(expected);
      done();
    });
  });

  // Object
  describe('when plasma.normalize() is used on an object', function () {
    it('should return an array containing the original object', function (done) {
      var fixture = {foo: 'foo', bar: 'bar', baz: 'baz'};
      var expected = [
        {foo: 'foo', bar: 'bar', baz: 'baz'}
      ];
      expect(plasma.normalize(fixture)).to.deep.equal(expected);
      done();
    });

    it('should return an array containing the original object', function (done) {
      var fixture = {expand: true, name: 'foo', src: ['*.json']};
      var expected = [
        {expand: true, name: 'foo', src: ['*.json']}
      ];

      expect(plasma.normalize(fixture)).to.deep.equal(expected);
      done();
    });
  });

  // Array of strings
  describe('when plasma.normalize() is used on an array of strings', function () {
    it('should return an array of objects, each with `expand` and `src` properties', function (done) {
      var fixture = ['foo/*.json', 'bar/*.json'];
      var expected = [
        {expand: true, src: ['foo/*.json']},
        {expand: true, src: ['bar/*.json']}
      ];
      expect(plasma.normalize(fixture)).to.deep.equal(expected);
      done();
    });
  });

  // Array of objects
  describe('when plasma.normalize() is used on an array of objects', function () {
    it('should return the array of objects unmodified', function (done) {
      var fixture = [
        {foo: 'foo', bar: 'bar', baz: 'baz'},
        {bar: 'bar', baz: 'foo', bang: 'boom'}
      ];

      var expected = [
        {foo: 'foo', bar: 'bar', baz: 'baz'},
        {bar: 'bar', baz: 'foo', bang: 'boom'}
      ];
      expect(plasma.normalize(fixture)).to.deep.equal(expected);
      done();
    });

    it('should return the array of objects unmodified', function (done) {
      var fixture = [
        {quux: 'foo/*.json'},
        {expand: true, name: 'foo', src: ['foo/*.json']},
      ];

      var expected = [
        {quux: 'foo/*.json'},
        {expand: true, name: 'foo', src: ['foo/*.json']},
      ];
      expect(plasma.normalize(fixture)).to.deep.equal(expected);
      done();
    });
  });

  // Mixed values
  describe('when plasma.normalize() is used on an array containing mixed values (strings and objects)', function () {
    it('should return an array of objects, where each original object in the array is returned unmodified, and each string is converted to an object with `src` and `expand` properties', function (done) {
      var fixture = [
        'foo/*.json',
        {expand: true, name: 'foo', src: ['foo/*.json']}
      ];
      var expected = [
        {expand: true, src: ['foo/*.json']},
        {expand: true, name: 'foo', src: ['foo/*.json']}
      ];
      expect(plasma.normalize(fixture)).to.deep.equal(expected);
      done();
    });
  });
});
