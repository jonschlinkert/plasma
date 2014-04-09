var data = 'foo/*.json';
var data = ['foo/*.json'];

var data = {
  expand: true,
  name: 'foo',
  src: ['*.json']
};

var result = {
  foo: {

  }
};

var data = {
  foo: 'foo',
  bar: 'bar',
  baz: 'baz'
};

var result = {
  foo: 'foo',
  bar: 'bar',
  baz: 'baz'
};

var data = {
  alert: {
    foo: 'foo',
    bar: 'bar',
    baz: 'baz'
  },
  navbar: {
    foo: 'foo',
    bar: 'bar',
    baz: 'baz'
  }
};

var result = {
  alert: {
    foo: 'foo',
    bar: 'bar',
    baz: 'baz'
  },
  navbar: {
    foo: 'foo',
    bar: 'bar',
    baz: 'baz'
  }
};

var data = [
  {
    foo: 'foo',
    bar: 'bar',
    baz: 'baz'
  },
  {
    bar: 'bar',
    baz: 'foo',
    bang: 'boom'
  }
];

var result = {
  foo: 'foo',
  bar: 'bar',
  baz: 'foo',
  bang: 'boom'
};

var data = [
  'foo/*.json',
  {expand: true, name: 'foo', src: ['foo/*.json']},
  {expand: true, name: 'bar', src: ['bar/*.json']},
  {expand: true, name: 'baz', src: ['baz/*.json']},
];

var data = [
  {quux: 'foo/*.json'},
  {expand: true, name: 'foo', src: ['foo/*.json']},
  {expand: true, name: 'bar', src: ['bar/*.json']},
  {expand: true, name: 'baz', src: ['baz/*.json']},
];

var result = {
  quux: 'foo/*.json',
  foo: {

  }
};

var data = [
  {name: 'bar', src: 'bar.json'},
  {name: 'foo', src: '*.json'},
];

var result = {
  name: 'foo',
  src: '*.json'
};

var data = [
  {expand: true, src: 'foo/*.json'},
  {expand: true, name: 'bar', src: ['bar/*.json']},
];

var result = {
  one: 'two',
  bar: {

  }
};

var data = [
  {expand: true, name: ':basename', src: 'blah.json'},
  {expand: true, name: 'bar', src: ['foo.json']},
];

var result = {
  blah: {
    one: 'two'
  },
  bar: {

  }
};

var data = [
  {expand: true, name: 'foo.bar.baz', src: ['foo/*.json']}
];

var data = [
  {expand: true, name: 'i18n.:dirname', src: ['i18n/**/*.json']}
];




var foo = {
  assemble: {

    aaa: 'test/fixtures/**/*.json',
    bbb: ['test/fixtures/a/*.json', 'test/fixtures/b/*.json'],
    ccc: {
      files: {
        'tmp/foo/': ['test/fixtures/a/**/*.txt']
      }
    },
    ddd: {
      files: [
        {
          'tmp/bar/': ['test/fixtures/b/**']
        },
        {
          'tmp/bar/': ['test/fixtures/c/**']
        }
      ]
    },
    eee: {
      files: [
        {
          dest: 'tmp/bar/',
          src: ['test/fixtures/b/**']
        },
        {
          dest: 'tmp/bar/',
          src: ['test/fixtures/c/**']
        }
      ]
    },
    fff: {
      files: {
        'tmp/bar/': ['test/fixtures/b/**'],
        'tmp/baz/': ['test/fixtures/c/**/*.md']
      }
    },
    ggg: {
      options: {
        cwd: 'test'
      },
      files: {
        'tmp/bar/': ['fixtures/b/**'],
        'tmp/baz/': ['fixtures/c/**']
      }
    }
  }
};


var config = {
  one: {
    data: {
      cwd: '.',
      src: ['tmp/*.json'],
    }
  },
  two: {
    cwd: '.',
    src: 'test/fixtures/data/*.json',
  },
  three: {
    data: ['test/fixtures/data/collections/*.json']
  },
  four: {
    data: [
      {
        "name": "plasma",
        "version": "0.1.0",
        "description": "Path extras and utilities to extend the Node.js path module.",
        "repository": {
          "type": "git",
          "url": "https://github.com/assemble/normalize-data.git"
        },
        "bugs": {
          "url": "https://github.com/assemble/normalize-data/issues"
        },
        "licenses": [{
          "type": "MIT",
          "url": "https://github.com/assemble/normalize-data/blob/master/LICENSE-MIT"
        }],
        "main": "index.js",
        "scripts": {
          "test": "mocha"
        },
        "engines": {
          "node": ">= 0.8.0"
        },
        "devDependencies": {
          "mocha": "~1.17.0",
          "chai": "~1.8.1",
          "benchmark": "~1.0.0"
        },
        "keywords": ["file system", "file", "fs", "node", "node.js", "path", "utils"],
        "dependencies": {
          "globule": "~0.2.0",
          "fs-utils": "~0.3.4",
          "lodash": "~2.4.1",
          "chalk": "~0.4.0"
        }
      },
      {
        src: 'test/fixtures/*.json'
      },
    ]
  },
  five: {
    data: ['test/fixtures/*.json', 'test/fixtures/data/*.json']
  },
  six: {
    data: [
      {
        src: 'test/fixtures/*.json'
      },
      {
        src: 'test/fixtures/data/*.json'
      }
    ]
  }
};
