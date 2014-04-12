/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const file = require('fs-utils');
const plasma = require('../');

var expectedData = function(filename) {
  return file.readDataSync('test/expected/' + filename);
};


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


describe('when a complex mixture of strings, arrays and objects are passed', function () {
  xit('should normalize each format correctly and return an object', function (done) {
    var fixture = [
      'test/fixtures/pkg/*.json',
      {quux: '*.json'},
      'test/fixtures/*.yml',
      {src: ['test/fixtures/i18n/*.json', 'test/fixtures/load/**/*.json']},
      {name: 'package', src: ['test/fixtures/pkg/*.json'], one: 'two'},
      {name: 'overwritten', version: 'infinity'}
    ];

    var actual = plasma.process(fixture);
    var expected = expectedData('complex.json');
    expect(actual).to.eql(expected);
    done();
  });
});