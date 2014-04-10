/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const file = require('fs-utils');
const plasma = require('../');


describe('when plasma.normalizeArray() is used on an array of strings', function () {
  it('should convert the array of strings to an array of objects, each with `__normalized__` and `src` properties', function (done) {
    var fixture = ['foo/*.json', 'bar/*.json'];
    var expected = [
      {__normalized__: true, src: ['foo/*.json']},
      {__normalized__: true, src: ['bar/*.json']}
    ];
    expect(plasma.normalizeArray(fixture)).to.deep.equal(expected);
    done();
  });
});


var config = [
  ['a', 'b', 'c'],
  ['test/fixtures/*.json', 'a', 'b', 'c'],
  ['test/fixtures/*.json', {src: ['test/fixtures/pkg/*.json']}],
  ['test/fixtures/*.json', {src: ['*.json'], cwd: 'test/fixtures/pkg', prefixBase: true}],
  ['test/fixtures/*.json', {src: ['*.json'], cwd: 'test/fixtures/a', expand: false}],
  ['test/fixtures/*.json', 'test/fixtures/*.yml', {src: ['test/fixtures/a/*.json']}],
  ['test/fixtures/*.json', 'test/fixtures/*.yml', {src: ['test/fixtures/a/*.json'], name: 'f'}],
  ['test/fixtures/*.json', 'test/fixtures/*.yml', {src: ['test/fixtures/a/*.json'], name: 'f', expand: false}],
  ['test/**/*.{json,yml}']
];

var config2 = ['test/fixtures/*.json', {src: ['*.json']}];
var opts = {cwd: 'test/fixtures/pkg', prefixBase: true};


// console.log(plasma.load(['test/fixtures/*.json', 'test/fixtures/*.yml', {src: ['test/fixtures/a/*.json'], name: 'f', expand: false}]));

// var arr = config.map(function(config) {
//   return plasma.normalize(config);
// });

// var exp = arr.map(function(config) {
//   return plasma.expand(config);
// });


// file.writeJSONSync('tmp/arr.json', arr);

var obj = {};
var load = config.map(function(config) {
  console.log(plasma.load(config));
  require('lodash').merge(obj, plasma.load(config));
  return obj;
});
file.writeJSONSync('tmp/load.json', load);
