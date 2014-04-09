// const expand = require('../');
// const file = require('fs-utils');

// var foo = {
//   assemble: {

//     aaa: 'test/fixtures/**/*.json',
//     bbb: ['test/fixtures/a/*.json', 'test/fixtures/b/*.json'],
//     ccc: {
//       files: {
//         'tmp/foo/': ['test/fixtures/a/**/*.txt']
//       }
//     },
//     ddd: {
//       files: [
//         {
//           'tmp/bar/': ['test/fixtures/b/**']
//         },
//         {
//           'tmp/bar/': ['test/fixtures/c/**']
//         }
//       ]
//     },
//     eee: {
//       files: [
//         {
//           dest: 'tmp/bar/',
//           src: ['test/fixtures/b/**']
//         },
//         {
//           dest: 'tmp/bar/',
//           src: ['test/fixtures/c/**']
//         }
//       ]
//     },
//     fff: {
//       files: {
//         'tmp/bar/': ['test/fixtures/b/**'],
//         'tmp/baz/': ['test/fixtures/c/**/*.md']
//       }
//     },
//     ggg: {
//       options: {
//         cwd: 'test'
//       },
//       files: {
//         'tmp/bar/': ['fixtures/b/**'],
//         'tmp/baz/': ['fixtures/c/**']
//       }
//     }
//   }
// };
// file.writeJSONSync('result.json', expand(foo));

// var config = {
//   one: {
//     data: {
//       cwd: '.',
//       src: ['tmp/*.json'],
//     }
//   },
//   two: {
//     cwd: '.',
//     src: 'test/fixtures/data/*.json',
//   },
//   three: {
//     data: ['test/fixtures/data/collections/*.json']
//   },
//   four: {
//     data: [
//       {
//         "name": "plasma",
//         "version": "0.1.0",
//         "description": "Path extras and utilities to extend the Node.js path module.",
//         "repository": {
//           "type": "git",
//           "url": "https://github.com/assemble/normalize-data.git"
//         },
//         "bugs": {
//           "url": "https://github.com/assemble/normalize-data/issues"
//         },
//         "licenses": [{
//           "type": "MIT",
//           "url": "https://github.com/assemble/normalize-data/blob/master/LICENSE-MIT"
//         }],
//         "main": "index.js",
//         "scripts": {
//           "test": "mocha"
//         },
//         "engines": {
//           "node": ">= 0.8.0"
//         },
//         "devDependencies": {
//           "mocha": "~1.17.0",
//           "chai": "~1.8.1",
//           "benchmark": "~1.0.0"
//         },
//         "keywords": ["file system", "file", "fs", "node", "node.js", "path", "utils"],
//         "dependencies": {
//           "globule": "~0.2.0",
//           "fs-utils": "~0.3.4",
//           "lodash": "~2.4.1",
//           "chalk": "~0.4.0"
//         }
//       },
//       {
//         src: 'test/fixtures/*.json'
//       },
//     ]
//   },
//   five: {
//     data: ['test/fixtures/*.json', 'test/fixtures/data/*.json']
//   },
//   six: {
//     data: [
//       {
//         src: 'test/fixtures/*.json'
//       },
//       {
//         src: 'test/fixtures/data/*.json'
//       }
//     ]
//   }
// };
