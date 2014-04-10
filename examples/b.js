/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const file = require('fs-utils');
const plasma = require('../');
const _ = require('lodash');

var config = [
  ['a', 'b', 'c'],
  ['test/fixtures/*.json', 'a', 'b', 'c'],
  ['test/fixtures/*.json', {src: ['test/fixtures/pkg/*.json']}],
  ['test/fixtures/*.json', {src: ['*.json'], cwd: 'test/fixtures/pkg', prefixBase: true}],
  ['test/fixtures/*.json', {src: ['*.json'], cwd: 'test/fixtures/a', expand: false}],
  ['test/fixtures/*.json', 'test/fixtures/*.yml', {src: ['test/fixtures/a/*.json']}],
  ['test/fixtures/*.json', 'test/fixtures/*.yml', {src: ['test/fixtures/a/*.json'], name: 'f'}],
  ['test/fixtures/*.json', 'test/fixtures/*.yml', {src: ['test/fixtures/a/*.json'], name: 'f', expand: false}]
];

function loadConfig(arr) {
  var data = _.cloneDeep(arr);
  var obj = {};

  data.map(function(config) {
    _.merge(obj, plasma.load(config));
  });

  return obj;
}
file.writeJSONSync('tmp/loadConfig-b.json', loadConfig(config));

function extendConfig(arr) {
  var data = _.cloneDeep(arr);
  var obj = {};

  data.map(function(config) {
    _.extend(obj, plasma.load(config));
  });

  return obj;
}
file.writeJSONSync('tmp/extendConfig-b.json', extendConfig(config));

function mergeConfig(arr) {
  var data = _.cloneDeep(arr);
  var obj = {};

  data.map(function(config) {
    _.merge(obj, plasma.load(config));
  });

  return obj;
}
file.writeJSONSync('tmp/mergeConfig-b.json', mergeConfig(config));