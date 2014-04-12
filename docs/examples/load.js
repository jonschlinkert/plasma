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

var config2 = [
  {src: ['test/fixtures/pkg/*.json']},
  {src: ['*.json'], cwd: 'test/fixtures/pkg', prefixBase: true},
  {src: ['*.json'], cwd: 'test/fixtures/a', expand: false},
  'test/fixtures/*.yml',
  {src: ['test/fixtures/a/*.json'], name: 'f', expand: false}
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