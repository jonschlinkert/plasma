/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const plasma = require('../');


/**
 * Expand {'foo.bar': 'baz'} to {foo: {bar: 'baz'}}
 *
 * Requires > v0.2.0 of expand-hash
 */

describe('when "dot hash" strings are used', function () {
  it('should return an object with the name from the `name` property', function (done) {
    var fixture = [{dothash: true, name: 'foo.bar.baz', src: ['test/fixtures/*.{json,yml}'], one: {two: 'three'} }];
    var actual = plasma.load(fixture).data;

    var expected = {foo: {bar: {baz: {aaa: 'bbbb', ccc: 'dddd', eee: 'ffff'} } }, one: {two: 'three'}};
    expect(actual).to.deep.equal(expected);
    done();
  });

  describe('when mixed data is passed in:', function () {
    it('should return an object', function (done) {
      var fixture = {dothash: true, a: 'b', c: 'd', name: 'e.f.g', src: 'test/fixtures/b.json'};
      var actual = plasma.load(fixture).data;

      var expected = {a: 'b', c: 'd', e: {f: {g: {ccc: 'dddd'} } } };
      expect(actual).to.deep.equal(expected);
      done();
    });
  });

  it('should return an object with the name from the `name` property', function (done) {
    var fixture = {dothash: true, name: 'foo.bar', src: ['test/fixtures/*.{json,yml}'], one: {two: 'three'}};
    var actual = plasma.load(fixture).data;

    var expected = {foo: {bar: {aaa: 'bbbb', ccc: 'dddd', eee: 'ffff'} }, one: {two: 'three'} };
    expect(actual).to.deep.equal(expected);
    done();
  });
});