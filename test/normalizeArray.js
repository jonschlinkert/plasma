/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const plasma = require('../');


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