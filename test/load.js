/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const file = require('fs-utils');
const plasma = require('../');

var expectedData = function(filename) {
  return file.readDataSync('test/expected/' + filename);
};


describe('plasma.load()', function () {

  describe('when a file path is passed as a string', function () {
    it('should detect the format, YAML or JSON, read in the file and return an object', function (done) {
      var fixture = 'test/fixtures/load/string/a.json';
      var expected = expectedData('load/string/a.json');
      var actual = plasma.load(fixture);
      expect(actual).to.eql(expected);
      done();
    });
  });

  describe('when a file path is passed as a string', function () {
    it('should detect the format, YAML or JSON, read in the file and return an object', function (done) {
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
    it('should return the original object', function (done) {
      var fixture = {foo: 'foo', bar: 'bar', baz: 'baz'};
      var expected = {foo: 'foo', bar: 'bar', baz: 'baz'};
      expect(plasma.load(fixture)).to.deep.equal(expected);
      done();
    });
  });

  describe('when an array of objects is passed to plasma.load()', function () {
    it('should return an object with unique properties', function (done) {
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

  describe('when both the `name` property and the `src` are used', function () {
    it('should return an object named after the `name` property', function (done) {
      var fixture = [
        {one: 'two'},
        {name: 'pkg', src: ['test/fixtures/a.yml']}
      ];

      var expected = {pkg: {aaa: 'bbbb'}, one: 'two'};
      expect(plasma.load(fixture)).to.deep.equal(expected);
      done();
    });

    it('should return an object with the name from the `name` property', function (done) {
      var fixture = [
        {name: 'pkg', src: ['test/fixtures/b.json'], one: 'two'}
      ];

      var expected = {pkg: {ccc: 'dddd'}, one: 'two'};
      expect(plasma.load(fixture)).to.deep.equal(expected);
      done();
    });

    it('should return an object with the name from the `name` property', function (done) {
      var fixture = [
        {expand: true, name: 'pkg', src: 'test/fixtures/b.json', one: 'two'}
      ];

      var expected = {pkg: {ccc: 'dddd'}, one: 'two'};
      expect(plasma.load(fixture)).to.deep.equal(expected);
      done();
    });
  });


  describe('when an array with mixed values is passed to plasma.load()', function () {
    it('should do stuff with each value', function (done) {
      var fixture = [
        'test/fixtures/pkg/*.json',
        {quux: '*.json'},
        {expand: true, name: 'package', src: ['test/fixtures/pkg/*.json'], one: 'two'}
      ];

      var expected = file.readJSONSync('test/expected/mixed-values.json');
      expect(plasma.load(fixture)).to.deep.equal(expected);
      done();
    });
  });

  describe('when a complex mixture of strings, arrays and objects are passed', function () {
    it('should normalize each format correctly and return an object', function (done) {
      var fixture = [
        'test/fixtures/pkg/*.json',
        {quux: '*.json'},
        'test/fixtures/*.yml',
        {expand: true, src: ['test/fixtures/i18n/*.json', 'test/fixtures/load/**/*.json']},
        {expand: true, name: 'package', src: ['test/fixtures/pkg/*.json'], one: 'two'},
        {name: 'overwritten', version: 'infinity'}
      ];

      var actual = plasma.load(fixture);
      var expected = expectedData('complex.json');
      expect(actual).to.eql(expected);
      done();
    });
  });

  // describe('when a complex mixture of strings, arrays and objects are passed', function () {
  //   it('should normalize each format correctly and return an object', function (done) {
  //     var fixture = [
  //       'test/fixtures/pkg/*.json',
  //       {quux: '*.json'},
  //       'test/fixtures/*.yml',
  //       {expand: true, src: ['test/fixtures/i18n/*.json', 'test/fixtures/load/**/*.json']},
  //       {expand: true, name: 'package', src: ['test/fixtures/pkg/*.json'], one: 'two'},
  //       {name: 'overwritten', version: 'infinity'}
  //     ];

  //     var actual = plasma.process(fixture);
  //     var expected = expectedData('complex.json');
  //     expect(actual).to.eql(expected);
  //     done();
  //   });
  // });
});


