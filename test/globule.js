/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const file = require('read-data');
const plasma = require('../');

var expectedData = function (filename) {
  return file.readDataSync('test/expected/' + filename);
};

// Ensure that globule is getting passed options
describe('when options are passed:', function () {
  it('globule should use them, but the options should not be returned in the config object', function (done) {
    var config = 'a.json';
    var actual = plasma.load(config, {
      cwd: 'test/fixtures/load/string',
      prefixBase: true
    });
    var expected = {
      a: 'This value is from a.json',
      cwd: 'test/fixtures/load/string',
      prefixBase: true
    };
    expect(actual).to.eql(expected);
    done();
  });
});

describe('when a string of glob patterns is passed to plasma.load()', function () {
  it('should read the files and return an object', function (done) {
    var fixture = 'test/fixtures/*.{json,yml}';
    var expected = {
      aaa: "bbbb",
      ccc: "dddd",
      eee: "ffff"
    };
    expect(plasma.load(fixture)).to.deep.equal(expected);
    done();
  });
});

describe('when an array of glob patterns is passed to plasma.load()', function () {
  it('should read the files and return an object', function (done) {
    var fixture = ['test/fixtures/*.{json,yml}'];
    var expected = {
      aaa: 'bbbb',
      ccc: 'dddd',
      eee: 'ffff'
    };
    var actual = plasma.load(fixture);
    expect(actual).to.deep.equal(expected);
    done();
  });
});

describe('when an object is passed to plasma.load()', function () {
  it('globule should read the files, and plasma.load() should return an object', function (done) {
    var fixture = {
      expand: true,
      prefixBase: true,
      cwd: 'test/fixtures',
      src: '*.{json,yml}'
    };
    var expected = {
      prefixBase: true,
      cwd: 'test/fixtures',
      aaa: 'bbbb',
      ccc: 'dddd',
      eee: 'ffff'
    };
    var actual = plasma.load(fixture);

    expect(actual).to.deep.equal(expected);
    done();
  });
});