/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const plasma = require('../');


describe('plasma.load()', function () {

  describe('when a string is passed:', function () {
    describe('and when the string is a file path', function () {
      it('should detect the format, YAML or JSON, read in the file and return an object', function (done) {
        var fixture = 'test/fixtures/load/string/a.json';
        var actual = plasma.load(fixture).data;

        expect(actual).to.have.deep.property('a', 'This value is from a.json');
        done();
      });

      it('should detect the format, YAML or JSON, read in the file and return an object', function (done) {
        var fixture = 'test/fixtures/b.json';
        var actual = plasma.load(fixture).data;

        var expected = {ccc: "dddd"};
        expect(actual).to.deep.equal(expected);
        done();
      });

      describe('and when the file is YAML', function () {
        it('should read the file and return an object', function (done) {
          var fixture = 'test/fixtures/a.yml';
          var actual = plasma.load(fixture).data;

          var expected = {aaa: "bbbb"};
          expect(actual).to.deep.equal(expected);
          done();
        });
      });
    });

    describe('and when the string is glob patterns', function () {
      it('should read the files and return an object', function (done) {
        var fixture = 'test/fixtures/*.{json,yml}';
        var actual = plasma.load(fixture).data;

        var expected = {aaa: "bbbb", ccc: "dddd", eee: "ffff"};
        expect(actual).to.deep.equal(expected);
        done();
      });
    });
  });

  describe('when an array is passed:', function () {

    describe('and the array has strings that look like file paths', function () {
      it('should read the files and return an object', function (done) {
        var fixture = ['test/fixtures/a.yml', 'test/fixtures/b.json'];
        var actual = plasma.load(fixture).data;

        var expected = {aaa: "bbbb", ccc: "dddd"};
        expect(actual).to.deep.equal(expected);
        done();
      });
    });


   describe('and the array has objects', function () {
      it('should return an object with unique properties', function (done) {
        var fixture = [
          {foo: 'foo', bar: 'bar', baz: 'baz'},
          {bar: 'bar', baz: 'foo', bang: 'boom'}
        ];
        var actual = plasma.load(fixture).data;

        var expected = {
          bang: 'boom',
          bar: 'bar',
          baz: 'foo',
          foo: 'foo'
        };
        expect(actual).to.deep.equal(expected);
        done();
      });
    });

    describe('and one of the objects has a src property, but others do not', function () {
      it('should return an object named after the `name` property', function (done) {
        var fixture = [
          {one: 'two'},
          {name: 'pkg', src: ['test/fixtures/a.yml']}
        ];

        var expected = {pkg: {aaa: 'bbbb'}, one: 'two'};
        expect(plasma.load(fixture).data).to.deep.equal(expected);
        done();
      });

      it('should return an object with the name from the `name` property', function (done) {
        var fixture = [
          {name: 'pkg', src: ['test/fixtures/b.json'], one: 'two'}
        ];

        var expected = {pkg: {ccc: 'dddd'}, one: 'two'};
        expect(plasma.load(fixture).data).to.deep.equal(expected);
        done();
      });

      it('should return an object with the name from the `name` property', function (done) {
        var fixture = [
          {name: 'pkg', src: 'test/fixtures/b.json', one: 'two'}
        ];

        var expected = {pkg: {ccc: 'dddd'}, one: 'two'};
        expect(plasma.load(fixture).data).to.deep.equal(expected);
        done();
      });
    });
  });

  describe('when an object is passed', function () {
    it('should return the original object', function (done) {
      var fixture = {foo: 'foo', bar: 'bar', baz: 'baz'};
      var actual = plasma.load(fixture).data;

      var expected = {foo: 'foo', bar: 'bar', baz: 'baz'};
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  describe('when an array with mixed values is passed to plasma.load()', function () {
    it('should do stuff with each value', function (done) {
      var fixture = [
        'test/fixtures/c.json',
        {quux: '*.json'},
        {name: 'pkg', src: ['test/fixtures/b.json'], one: 'two'}
      ];
      var actual = plasma.load(fixture).data;

      var expected = {eee: 'ffff', one: 'two', pkg: {ccc: 'dddd'}, quux: '*.json'};
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  describe('when a complex mixture of strings, arrays and objects are passed', function () {
    it('should normalize each format correctly and return an object', function (done) {
      var fixture = [
        'test/fixtures/pkg/*.json',
        {quux: '*.json'},
        'test/fixtures/*.yml',
        {src: ['test/fixtures/i18n/*.json', 'test/fixtures/load/**/*.json']},
        {name: 'package', src: ['test/fixtures/pkg/*.json'], one: 'two'},
        {name: 'overwritten', version: 'infinity'}
      ];

      var actual = plasma.load(fixture).data;
      expect(actual).to.have.deep.property('name', 'overwritten');
      expect(actual).to.have.deep.property('aaa', 'bbbb');
      expect(actual).to.have.deep.property('one', 'two');
      done();
    });
  });
});




describe('when plasma.load() is used on an array of objects:', function () {
  describe('when an object has a src property:', function () {
    it('should assume the src property defined file paths and try to expand them', function (done) {
      var fixture = {name: 'foo', src: ['test/fixtures/b.json']};
      var actual = plasma.load(fixture).data;

      var expected = {foo: {ccc: 'dddd'}};
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  describe('when an object has `expand:false`:', function () {
    it('should not try to expand filepaths', function (done) {
      var fixture = [{expand: false, name: 'foo', src: ['*.json']}];
      var actual = plasma.load(fixture).data;

      var expected = {foo: ['*.json']};
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  describe('when an object has `name` but not `src`:', function () {
    it('should do nothing an return the object as-is.', function (done) {
      var fixture = {name: 'foo', files: ['*.json']};
      var actual = plasma.load(fixture).data;

      var expected = {name: 'foo', files: ['*.json']};
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  describe('when an object is passed without a src property', function () {
    it('should be passed through as-is', function (done) {
      var fixture = [{foo: 'foo', bar: 'bar', baz: 'baz'}];
      var actual = plasma.load(fixture).data;

      var expected = {foo: 'foo', bar: 'bar', baz: 'baz'};
      expect(actual).to.deep.equal(expected);
      done();
    });
  });


  /**
   * Complete object
   */

  describe('complete object:', function () {
    describe('when the src property does not contain a valid file path', function () {
      it('should return the original object and filepath', function (done) {
        var fixture = {src: ['a']};
        var actual = plasma.load(fixture);

        var expected = {data: {}, nomatch: ['a'], orig: {src: ['a'] }, modules: {resolved: {}, unresolved: [] } };
        expect(actual).to.deep.equal(expected);
        done();
      });
    });

    describe('when the src property contain VALID glob patterns', function () {
      it('should expand the glob patterns to filepaths on the src property', function (done) {
        var fixture = {src: ['test/fixtures/b.json']};
        var actual = plasma.load(fixture);
        var expected = {orig: {src: ["test/fixtures/b.json"] }, nomatch: [], data: {ccc: "dddd"}, modules: {resolved: {}, unresolved: [] } };
        expect(actual).to.deep.equal(expected);
        done();
      });
    });
  });
});



