/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const plasma = require('../');


describe('when plasma.expand() is used on an array of objects:', function () {
  describe('when an object has a src property:', function () {
    it('should assume the src property defined file paths and try to expand them', function (done) {
      var fixture = [{name: 'foo', src: ['*.json']}];
      var expected = [
        {name: 'foo', src: ['bower.json', 'package.json']}
      ];
      expect(plasma.expand(fixture)).to.deep.equal(expected);
      done();
    });
  });

  describe('when an object has `expand:false`:', function () {
    it('should not try to expand filepaths', function (done) {
      var fixture = [{expand: false, name: 'foo', src: ['*.json']}];
      var expected = [
        {name: 'foo', src: ['*.json'], expand: false}
      ];
      expect(plasma.expand(fixture)).to.deep.equal(expected);
      done();
    });
  });

  describe('when an object has `name` but not `src`:', function () {
    it('should do nothing an return the object as-is.', function (done) {
      var fixture = [{name: 'foo', files: ['*.json']}];
      var expected = [
        {name: 'foo', files: ['*.json']}
      ];
      expect(plasma.expand(fixture)).to.deep.equal(expected);
      done();
    });
  });

  describe('when an object is passed without a src property', function () {
    it('should be passed through as-is', function (done) {
      var fixture = [{foo: 'foo', bar: 'bar', baz: 'baz'}];
      var expected = [{foo: 'foo', bar: 'bar', baz: 'baz'}];
      expect(plasma.expand(fixture)).to.deep.equal(expected);
      done();
    });
  });
});


describe('when a __normalized__ object is passed', function () {
  describe('when the src property does not contain a valid file path', function () {
    it('should return the original object and filepath', function (done) {
      var fixture = [{__normalized__: true, src: ['a']}];
      var expected = [{__normalized__: true, src: ['a']}];
      expect(plasma.expand(fixture)).to.deep.equal(expected);
      done();
    });
  });

  describe('when the src property contain VALID glob patterns', function () {
    it('should expand the glob patterns to filepaths on the src property', function (done) {
      var fixture = [{__normalized__: true, src: ['*.json']}];
      var expected = [{__normalized__: true, src: ['bower.json', 'package.json']}];
      expect(plasma.expand(fixture)).to.deep.equal(expected);
      done();
    });
  });
});

