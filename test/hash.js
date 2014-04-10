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

describe('when plasma.process() is used on a config object', function () {
  xit('should return an object with the name from the `name` property', function (done) {
    var fixture = [{
      hash: true,
      name: 'foo.bar.baz',
      src: ['test/fixtures/*.{json,yml}'],
      one: {
        two: 'three'
      }
    }];
    var actual = plasma.load(fixture);
    var expected = {foo: {bar: {baz: {aaa: 'bbbb', ccc: 'dddd', eee: 'ffff'} } }, one: {two: 'three'}};
    expect(actual).to.deep.equal(expected);
    done();
  });
});

describe('when plasma.process() is used on a config object', function () {
  xit('should return an object with the name from the `name` property', function (done) {
    var fixture = {hash: true, name: 'foo.bar', src: ['test/fixtures/*.{json,yml}'], one: {two: 'three'}};
    var expected = {foo: {bar: {aaa: 'bbbb', ccc: 'dddd', eee: 'ffff'} }, one: {two: 'three'} };
    var actual = plasma.load(fixture);
    expect(actual).to.deep.equal(expected);
    done();
  });
});