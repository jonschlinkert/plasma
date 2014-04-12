/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const plasma = require('../');


describe('when plasma.process() is used on a config object', function () {
  it('should resolve template strings to a configuration value', function (done) {
    var fixture = [{name: 'foo', src: ['test/fixtures/pkg/*.json']}, {bar: '<%= foo %>'}];
    var actual = plasma.process(fixture);

    expect(actual).to.have.deep.property('foo.name', 'plasma');
    expect(actual).to.have.deep.property('bar.name', 'plasma');
    done();
  });

  it('should resolve template strings to a configuration value', function (done) {
    var fixture = [{a: 'b'}, {c: '<%= a %>'}];
    var expected = {a: 'b', c: 'b'};
    var actual = plasma.process(fixture);

    expect(actual).to.deep.equal(expected);
    done();
  });

  it('should resolve template strings to a configuration value', function (done) {
    var fixture = [{a: {b: 'c', d: 'e'}}, {f: '<%= a.b %>'}];
    var actual = plasma.process(fixture);
    var expected = {a: {b: 'c', d: 'e'},  f: 'c'};

    expect(actual).to.deep.equal(expected);
    done();
  });
});

describe('when a complex mixture of strings, arrays and objects are passed', function () {
  it('should normalize each format correctly and return an object', function (done) {
    var fixture = [
      'test/fixtures/pkg/*.json',
      {quux: '*.json'},
      'test/fixtures/*.yml',
      {dothash: true, name: ':dirname.:basename', src: ['test/fixtures/i18n_process/*.json', 'test/fixtures/load/**/*.json']},
      {name: 'pkg', src: ['test/fixtures/pkg/*.json'], one: 'two'},
      {name: 'overwritten', version: 'infinity'}
    ];
    var actual = plasma.process(fixture);

    expect(actual).to.have.deep.property('name', 'overwritten');
    expect(actual).to.have.deep.property('i18n_process.en.es.select-language', 'Seleccione el idioma');
    expect(actual).to.have.deep.property('aaa', 'bbbb');
    expect(actual).to.have.deep.property('one', 'two');
    done();
  });
});
