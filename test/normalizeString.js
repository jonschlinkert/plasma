/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const plasma = require('../');


// plasma.normalizeString()
describe('when plasma.normalizeString() is used on a string', function () {
  it('should convert the string to an object with `expand` and `src` properties', function (done) {
    var fixture = 'foo/*.json';
    var expected = {__normalized__: true, expand: true, src: ['foo/*.json']};
    expect(plasma.normalizeString(fixture)).to.deep.equal(expected);
    done();
  });
});
