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
//   {src: ['test/fixtures/pkg/*.json']},
//   'd',
//   {src: ['*.json'], cwd: 'test/fixtures/pkg', prefixBase: true},
//   {src: ['*.json'], cwd: 'test/fixtures/a', expand: false},
//   'test/fixtures/*.yml',
//   {src: ['test/fixtures/a/*.json'], name: 'f', expand: false},
//   'f'
// ];
// file.writeJSONSync('tmp/normalized2.json', plasma.normalize(config2));


// var config = [
//   ['a', 'b', 'c'],
//   ['test/fixtures/*.json', 'a', 'b', 'c'],
//   ['test/fixtures/*.json', {name: 'a', src: ['test/fixtures/pkg/*.json']}],
//   ['test/fixtures/*.json', {name: 'b', src: ['*.json'], cwd: 'test/fixtures/pkg', prefixBase: true}],
//   ['test/fixtures/*.json', {name: 'c', src: ['*.json'], cwd: 'test/fixtures/a', expand: false}],
//   ['test/fixtures/*.json', 'test/fixtures/*.yml', {name: 'd', src: ['test/fixtures/a/*.json']}],
//   ['test/fixtures/*.json', 'test/fixtures/*.yml', {src: ['test/fixtures/a/*.json'], name: 'e'}],
//   ['test/fixtures/*.json', 'test/fixtures/*.yml', 'foo/*.json', {src: ['test/fixtures/a/*.json'], name: 'f', expand: false}]
// ];


// file.writeJSONSync('tmp/normalized3.json', plasma.normalize(config));
file.writeJSONSync('tmp/normalized.json', plasma.normalize([
    '*.json',
    {src: '*.json'},
    {src: ['*.json', '**/*.yml'] },
    {name: 'a', src: ['*.json'], b: 'c'},
    '*.yml'
  ]
));
// file.writeJSONSync('tmp/normalized-array.json', plasma.normalizeArray(['test/fixtures/*.json', 'test/fixtures/*.yml', {src: ['test/fixtures/a/*.json'], name: 'f'}]));



// function normalizeConfig(arr) {
//   var obj = [];
//   arr.map(function(c) {
//     obj = obj.concat(plasma.normalize(c));
//   });
//   return obj;
// }

// file.writeJSONSync('tmp/normalized.json', normalizeConfig(config));
