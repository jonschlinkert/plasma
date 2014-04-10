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


describe('when plasma.process() is used on a config object', function () {
  it('should use the basename of each data file as the namespace for its config object', function (done) {
    var fixture = {hash: true, expand: true, name: ':basename', src: ['test/fixtures/*.{json,yml}']};
    var expected = {a: {aaa: 'bbbb'}, b: {ccc: 'dddd'}, c: {eee: 'ffff'} };
    expect(plasma.load(fixture)).to.deep.equal(expected);
    done();
  });
});