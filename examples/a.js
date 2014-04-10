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

function loadConfig(config) {
  var obj = {};

  config.map(function(arr) {
    _.merge(obj, plasma.load(arr));
  });

  return obj;
}
file.writeJSONSync('tmp/loadConfig-a.json', loadConfig(config));

function extendConfig(config) {
  var obj = {};

  config.map(function(arr) {
    _.extend(obj, plasma.load(arr));
  });

  return obj;
}
file.writeJSONSync('tmp/extendConfig-a.json', extendConfig(config));

function mergeConfig(config) {
  var obj = {};

  config.map(function(arr) {
    _.merge(obj, plasma.load(arr));
  });

  return obj;
}
file.writeJSONSync('tmp/mergeConfig-a.json', mergeConfig(config));
