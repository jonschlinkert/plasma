const file = require('fs-utils');
const plasma = require('../');
const _ = require('lodash');

var config = [
  ['a', 'b', 'c'],
  ['test/fixtures/*.json', 'a', 'b', 'c'],
  ['test/fixtures/*.json', {patterns: ['test/fixtures/pkg/*.json']}],
  ['test/fixtures/*.json', {patterns: ['*.json'], cwd: 'test/fixtures/pkg', prefixBase: true}],
  ['test/fixtures/*.json', {patterns: ['*.json'], cwd: 'test/fixtures/a', expand: false}],
  ['test/fixtures/*.json', 'test/fixtures/*.yml', {patterns: ['test/fixtures/a/*.json']}],
  ['test/fixtures/*.json', 'test/fixtures/*.yml', {patterns: ['test/fixtures/a/*.json'], namespace: 'f'}],
  ['test/fixtures/*.json', 'test/fixtures/*.yml', {patterns: ['test/fixtures/a/*.json'], namespace: 'f', expand: false}]
];

var config2 = [
  {patterns: ['test/fixtures/pkg/*.json']},
  {patterns: ['*.json'], cwd: 'test/fixtures/pkg', prefixBase: true},
  {patterns: ['*.json'], cwd: 'test/fixtures/a', expand: false},
  'test/fixtures/*.yml',
  {patterns: ['test/fixtures/a/*.json'], namespace: 'f', expand: false}
];

function mergeConfig(arr) {
  var obj = {};

  arr.map(function(c) {
    _.merge(obj, plasma.load(c));
  });

  return obj;
}
// file.writeJSONSync('tmp/merged-context.json', mergeConfig(config));
file.writeJSONSync('tmp/merged-context.json', plasma.load(config2));