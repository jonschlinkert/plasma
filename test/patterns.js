/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const file = require('fs-utils');
const plasma = require('../');


/**
 * replace `:props` in `name`
 */

describe('plasma.process():', function () {
  describe('when plasma.process() is used on a config object', function () {
    it('should use the basename of each data file as the namespace for its config object', function (done) {
      var fixture = {name: ':basename', src: ['test/fixtures/*.{json,yml}']};
      var expected = {a: {aaa: 'bbbb'}, b: {ccc: 'dddd'}, c: {eee: 'ffff'} };
      expect(plasma.load(fixture)).to.deep.equal(expected);
      done();
    });
  });

  it('should use the basename of each data file as the namespace for its config object', function (done) {
    var fixture = [{name: ':basename', src: ['test/fixtures/bower-pkg/*.json']}];
    var expected = file.readJSONSync('test/expected/bower-pkg.json');
    var actual = plasma.process(fixture);

    expect(actual).to.deep.equal(expected);
    done();
  });

  it('should use the basename of each data file as the namespace for its config object', function (done) {
    var fixture = [{name: ':basename', src: ['test/fixtures/i18n/*.json'] }];
    var expected = file.readJSONSync('test/expected/i18n.json');
    var actual = plasma.process(fixture);

    expect(actual).to.deep.equal(expected);
    done();
  });
});