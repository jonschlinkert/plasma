/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const log = require('verbalize');
const file = require('fs-utils');
const _ = require('lodash');
const plasma = require('../');

log.mode.verbose = false;

/**
 * plasma.normalizeString()
 */

describe('when plasma.normalizeString() is used on a string', function () {
  it('should convert the string to an object with `expand` and `src` properties', function (done) {
    var fixture = 'foo/*.json';
    var expected = {expand: true, src: ['foo/*.json']};
    expect(plasma.normalizeString(fixture)).to.deep.equal(expected);
    done();
  });
});


/**
 * plasma.normalizeArray()
 */

describe('when plasma.normalizeArray() is used on an array of strings', function () {
  it('should convert the array of strings to an array of objects, each with `expand` and `src` properties', function (done) {
    var fixture = ['foo/*.json', 'bar/*.json'];
    var expected = [
      {expand: true, src: ['foo/*.json']},
      {expand: true, src: ['bar/*.json']}
    ];
    expect(plasma.normalizeArray(fixture)).to.deep.equal(expected);
    done();
  });
});


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

/**
 * plasma.expand()
 */

describe('when plasma.expand() is used on an array of objects:', function () {
  describe('when an object has `expand: true` and a src property:', function () {
    it('should assume the src property defined file paths and try to expand them', function (done) {
      var fixture = [{expand: true, name: 'foo', src: ['*.json']}];
      var expected = [
        {expand: true, name: 'foo', src: ['bower.json', 'package.json']}
      ];
      expect(plasma.expand(fixture)).to.deep.equal(expected);
      done();
    });
  });

  describe('when an object has does NOT have `expand: true` but DOES have a src property:', function () {
    it('should assume the src property is NOT file paths and should NOT try to expand them', function (done) {
      var fixture = [{name: 'foo', src: ['*.json']}];
      var expected = [
        {name: 'foo', src: ['*.json']}
      ];
      expect(plasma.expand(fixture)).to.deep.equal(expected);
      done();
    });
  });

  describe('when an object has `expand: true` but DOES NOT have a src property:', function () {
    it('should do nothing an return the object as-is.', function (done) {
      var fixture = [{expand: true, name: 'foo', files: ['*.json']}];
      var expected = [
        {expand: true, name: 'foo', files: ['*.json']}
      ];
      expect(plasma.expand(fixture)).to.deep.equal(expected);
      done();
    });
  });

  describe('objects that do not have an expand property or a src property', function () {
    it('should be passed through as-is', function (done) {
      var fixture = [{foo: 'foo', bar: 'bar', baz: 'baz'}];
      var expected = [{foo: 'foo', bar: 'bar', baz: 'baz'}];
      expect(plasma.expand(fixture)).to.deep.equal(expected);
      done();
    });
  });
});



/**
 * plasma.load()
 */

describe('plasma.load()', function () {
  describe('when a path to a JSON file is passed to plasma.load() as a string', function () {
    it('should read the file and return an object', function (done) {
      var fixture = 'test/fixtures/b.json';
      var expected = {ccc: "dddd"};
      expect(plasma.load(fixture)).to.deep.equal(expected);
      done();
    });
  });

  describe('when a path to a YAML file is passed to plasma.load() as a string', function () {
    it('should read the file and return an object', function (done) {
      var fixture = 'test/fixtures/a.yml';
      var expected = {aaa: "bbbb"};
      expect(plasma.load(fixture)).to.deep.equal(expected);
      done();
    });
  });

  describe('when glob patterns are passed to plasma.load() as a string', function () {
    it('should read the files and return an object', function (done) {
      var fixture = 'test/fixtures/*.{json,yml}';
      var expected = {aaa: "bbbb", ccc: "dddd", eee: "ffff"};
      expect(plasma.load(fixture)).to.deep.equal(expected);
      done();
    });
  });

  describe('when an array of file paths are passed to plasma.load()', function () {
    it('should read the files and return an object', function (done) {
      var fixture = ['test/fixtures/a.yml', 'test/fixtures/b.json'];
      var expected = {aaa: "bbbb", ccc: "dddd"};
      expect(plasma.load(fixture)).to.deep.equal(expected);
      done();
    });
  });

  describe('when an object is passed to plasma.load()', function () {
    it('should return the object', function (done) {
      var fixture = {foo: 'foo', bar: 'bar', baz: 'baz'};
      var expected = {foo: 'foo', bar: 'bar', baz: 'baz'};
      expect(plasma.load(fixture)).to.deep.equal(expected);
      done();
    });
  });

  describe('when an object is passed to plasma.load()', function () {
    it('should return the object', function (done) {
      var fixture = [
        {foo: 'foo', bar: 'bar', baz: 'baz'},
        {bar: 'bar', baz: 'foo', bang: 'boom'}
      ];
      var expected = {
        bang: 'boom',
        bar: 'bar',
        baz: 'foo',
        foo: 'foo'
      };
      expect(plasma.load(fixture)).to.deep.equal(expected);
      done();
    });
  });
});
