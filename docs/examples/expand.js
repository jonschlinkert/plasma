var plasma = require('../');
var config = [
  {
    hash: true,
    expand: true,
    namespace: ':basename',
    patterns: [
      'test/fixtures/a.yml',
      'test/fixtures/b.json',
      'test/fixtures/c.json'
    ]
  }
];

console.log(plasma.expand(config));