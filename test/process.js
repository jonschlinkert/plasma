/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const file = require('fs-utils');
const plasma = require('../');


describe('when plasma.process() is used on a config object', function () {
  it('should resolve template strings to a configuration value', function (done) {
    var fixture = [{name: 'foo', src: ['test/fixtures/pkg/*.json']}, {bar: '<%= foo %>'}];
    var expected = file.readJSONSync('test/expected/pkg-foo-bar.json');

    expect(plasma.process(fixture)).to.deep.equal(expected);
    done();
  });

  it('should resolve template strings to a configuration value', function (done) {
    var fixture = [{a: 'b'}, {c: '<%= a %>'}];
    var expected = {a: 'b', c: 'b'};

    expect(plasma.process(fixture)).to.deep.equal(expected);
    done();
  });

  it('should resolve template strings to a configuration value', function (done) {
    var fixture = [{a: {b: 'c', d: 'e'}}, {f: '<%= a.b %>'}];
    var expected = {a: {b: 'c', d: 'e'},  f: 'c'};

    expect(plasma.process(fixture)).to.deep.equal(expected);
    done();
  });
});
