/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const log = require('verbalize');
const file = require('fs-utils');
const _ = require('lodash');
const plasma = require('../');


var expected = file.readJSONSync('test/expected/expected.json');

describe('plasma.load(config)', function () {
  it('should support.... ', function (done) {
    var fixture = {data: {cwd: '.', src: ['test/fixtures/a/*.json']}, src: 'test/fixtures/*.{yml,json}'};
    expect(plasma.load(fixture)).to.deep.equal(expected);
    done();
  });

  it('should support.... ', function (done) {
    var fixture = {src: ['test/fixtures/a/*.json']};
    var actual = plasma.load(fixture);
    // expect(actual).to.deep.equal(expected);
    done();
  });

  it('should support.... ', function (done) {
    var fixture = {data: ['test/fixtures/a/*.json']};
    var actual = plasma.normalize(fixture);
    // expect(actual).to.deep.equal(expected);
    done();
  });

  it('should support.... ', function (done) {
    var fixture = {data: {x: 'y'}, src: ['test/fixtures/*.{yml,json}']};
    var expected = {data: {x: 'y'}, a: {a: 'b'}, b: {b: 'c'}};
    expect(plasma.load(fixture)).to.deep.equal(expected);
    done();
  });

  it('should support.... ', function (done) {
    var fixture = {data: {x: 'y'}, a: {a: 'b'}, b: {b: 'c'}, src: ['test/fixtures/a/*.json']};
    var expected2 = _.extend({data: {x: 'y'}, a: {a: 'b'}, b: {b: 'c'}}, expected);
    expect(plasma.load(fixture)).to.deep.equal(expected2);
    done();
  });

  // describe('when "---json" is defined after the first custom front-matter delimiter', function () {
  //   it('should detect JSON as the language and correctly parse it as JSON.', function (done) {
  //     var fixture = file.readFileSync('./test/fixtures/autodetect-json-delims.md');
  //     var actual = verb.process(fixture, {
  //       matter: {
  //         autodetect: true,
  //         delims: [';;;', ';;;']
  //       }
  //     });
  //     actual.content).to.deep.equal('JSON Front Matter');
  //     done();
  //   });
  // });
  // it('should support', function () {
  //   var config = {data: {cwd: '.', src: ['test/fixtures/*.json']}};
  //   plasma.load(config).should.equal({});
  // });

  // it('should support', function () {
  //   var config = {data: {cwd: '.', src: ['test/fixtures/*.json']}};
  //   plasma.load(config).should.equal({});
  // });

  // it('should support', function () {
  //   var config = {data: {cwd: '.', src: ['test/fixtures/*.json']}};
  //   plasma.load(config).should.equal({});
  // });

  // it('should return', function () {
  //   var config = {data: {cwd: '.', src: ['test/fixtures/*.json']}};
  //   assert(null == plasma.load(config));
  // });

  // it('should plasma', function () {
  //   var config = {data: {cwd: '.', src: ['test/fixtures/*.json']}};
  //   plasma.load(config).should.equal({});
  // });

  // it('should plasma', function () {
  //   var config = {data: {cwd: '.', src: ['test/fixtures/*.json']}};
  //   plasma.load(config).should.equal({});
  // });
});