const file = require('fs-utils');
const plasma = require('../');


plasma.verbose = true;


// TODO: Mocha tests!!!
var config = {
  one: {
    files: {},
    options: {
      data: {
        cwd: '.',
        src: 'tmp/*.json',
      }
    }
  },
  two: {
    files: {},
    options: {
      cwd: '.',
      src: 'test/fixtures/data/*.json',
    }
  },
  three: {
    files: {},
    options: {
      data: ['test/fixtures/data/collections/*.json']
    }
  },
  four: {
    files: {},
    options: {
      data: [
        {"name": "plasma", "version": "0.1.0", "description": "Path extras and utilities to extend the Node.js path module.", "repository": {"type": "git", "url": "https://github.com/assemble/normalize-data.git"}, "bugs": {"url": "https://github.com/assemble/normalize-data/issues"}, "licenses": [{"type": "MIT", "url": "https://github.com/assemble/normalize-data/blob/master/LICENSE-MIT"} ], "main": "index.js", "scripts": {"test": "mocha"}, "engines": {"node": ">= 0.8.0"}, "devDependencies": {"mocha": "~1.17.0", "chai": "~1.8.1", "benchmark": "~1.0.0"}, "keywords": ["file system", "file", "fs", "node", "node.js", "path", "utils"], "dependencies": {"globule": "~0.2.0", "fs-utils": "~0.3.4", "lodash": "~2.4.1", "chalk": "~0.4.0"} },
        {src: 'test/fixtures/*.json'},
      ]
    }
  },
  five: {
    files: {},
    options: {
      data: ['test/fixtures/*.json', 'test/fixtures/data/*.json']
    }
  },
  six: {
    files: {},
    options: {
      data: [
        {src: 'test/fixtures/*.json'},
        {src: 'test/fixtures/data/*.json'}
      ]
    }
  }
};

file.writeJSONSync('test/actual/expand-data.json', plasma.load(config.six.options));
file.writeJSONSync('test/actual/expand-data-arr.json', plasma.coerce(config.six.options, {toArray: true}));
