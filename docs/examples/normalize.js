const file = require('fs-utils');
const plasma = require('../../');
const _ = require('lodash');


/**
 * plasma.normalize() always returns an array of _normalized_ objects.
 * Each object has a __normalized__ heuristic that can be used by other
 * functions downstream.
 */

// var config2 = [
//   'a', 'b',
//   {patterns: ['test/fixtures/pkg/*.json']},
//   'd',
//   {patterns: ['*.json'], cwd: 'test/fixtures/pkg', prefixBase: true},
//   {patterns: ['*.json'], cwd: 'test/fixtures/a', expand: false},
//   'test/fixtures/*.yml',
//   {patterns: ['test/fixtures/a/*.json'], namespace: 'f', expand: false},
//   'f'
// ];
// file.writeJSONSync('tmp/normalized2.json', plasma.normalize(config2));


// var config = [
//   ['a', 'b', 'c'],
//   ['test/fixtures/*.json', 'a', 'b', 'c'],
//   ['test/fixtures/*.json', {namespace: 'a', patterns: ['test/fixtures/pkg/*.json']}],
//   ['test/fixtures/*.json', {namespace: 'b', patterns: ['*.json'], cwd: 'test/fixtures/pkg', prefixBase: true}],
//   ['test/fixtures/*.json', {namespace: 'c', patterns: ['*.json'], cwd: 'test/fixtures/a', expand: false}],
//   ['test/fixtures/*.json', 'test/fixtures/*.yml', {namespace: 'd', patterns: ['test/fixtures/a/*.json']}],
//   ['test/fixtures/*.json', 'test/fixtures/*.yml', {patterns: ['test/fixtures/a/*.json'], namespace: 'e'}],
//   ['test/fixtures/*.json', 'test/fixtures/*.yml', 'foo/*.json', {patterns: ['test/fixtures/a/*.json'], namespace: 'f', expand: false}]
// ];


// file.writeJSONSync('tmp/normalized3.json', plasma.normalize(config));
file.writeJSONSync('tmp/normalized.json', plasma.normalize([
    '*.json',
    {patterns: '*.json'},
    {patterns: ['*.json', '**/*.yml'] },
    {namespace: 'a', patterns: ['*.json'], b: 'c'},
    '*.yml'
  ]
));
// file.writeJSONSync('tmp/normalized-array.json', plasma.normalizeArray(['test/fixtures/*.json', 'test/fixtures/*.yml', {patterns: ['test/fixtures/a/*.json'], namespace: 'f'}]));



// function normalizeConfig(arr) {
//   var obj = [];
//   arr.map(function(c) {
//     obj = obj.concat(plasma.normalize(c));
//   });
//   return obj;
// }

// file.writeJSONSync('tmp/normalized.json', normalizeConfig(config));
