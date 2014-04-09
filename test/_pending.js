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
 * Pending tests
 */

describe('when plasma.process() is used on a config object', function () {
  xit('should return an object with the name from the `name` property', function (done) {
    var fixture = [
      {traverse: true, expand: true, name: '<%= a.b.c %>', src: ['test/fixtures/*.{json,yml}'], one: {two: 'three'}}
    ];

    var expected = {pkg: {ccc: 'dddd'}, one: 'two'};
    expect(plasma.load(fixture)).to.deep.equal(expected);
    done();
  });

  xit('should return an object with the name from the `name` property', function (done) {
    var fixture = [
      {traverse: true, expand: true, name: 'foo.bar.baz', src: ['test/fixtures/*.{json,yml}'], one: {two: 'three'}}
    ];

    var expected = {pkg: {ccc: 'dddd'}, one: 'two'};
    expect(plasma.load(fixture)).to.deep.equal(expected);
    done();
  });

  xit('should use the basename of each data file as the namespace for its config object', function (done) {
    var fixture = [{expand: true, name: 'i18n.:dirname', src: ['test/fixtures/i18n/*.json']}];
    var expected = file.readJSONSync('test/expected/i18n.json');
    expect(plasma.process(fixture)).to.deep.equal(expected);
    done();
  });
});