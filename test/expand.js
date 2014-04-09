/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const plasma = require('../');


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

