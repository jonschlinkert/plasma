# plasma [![NPM version](https://badge.fury.io/js/plasma.png)](http://badge.fury.io/js/plasma)

> Build a context object to pass to templates. Plasma can load data from a flexible range of configuration and file formats, including JSON/YAML data files defined with minimatch/glob patterns.

Plasma makes it easy to load data. Here are some examples:

```js
var config = [
  // load data to the root object
  ['components/*.json'],
  // load data to the `pkg` object
  {name: 'pkg', src: 'package.json'},
  // load data to the `site` object
  {name: 'site', src: '.assemblerc.yml'},
  // load data to an object named after the basename of each file
  // e.g. foo.json is loaded to `{foo: {// data}}`
  {name: ':basename', src: ['data/*.{json,yml}']},
  // Load data from src to `{a: {b: {c: {// data}}}`
  {dothash: true, name: 'a.b.c', src: ['*.json']}
];

// Load in config data.
var data = plasma.load(config);
```
## Install

Install with [npm](npmjs.org):

```bash
npm i plasma --save
```


## What problem is Plasma solving?
#### problem

Let's say you need to load data for templates.

If you want to read JSON files, you might do something like this:

```js
var fs = require('fs');
var data = JSON.parse(fs.readFileSync('my-data-file.json', 'utf8'));
```
Or this:

```js
var data = require('./my-data-file.json')
```

What about YAML? Maybe you'd do something like this:

```js
var fs = require('fs');
var YAML = require('js-yaml');
var data = YAML.load(fs.readFileSync('my-data-file.yml', 'utf8'));
```

What if you want to use glob patterns to get all the data files in a directory?

```js
var glob = require('globule');
glob.find('*.{json,yml}').map(function(filepath) {
  // do something to read files
});
```

Not too bad, but now you need to do some logic to merge the data from the files as their loaded. And what if you want to also define data in the config, and have that merged with the data from the files you're loading? e.g

```js
var config = {
  a: {
    b: "foo"
  }
};
_.extend(config, data); // merge file data with config data
```

If you've ever done this before, you know that it gets much more complicated. This is where Plasma can help.

#### solution

Or, you can make life easy, and just do:

```js
var plasma = require('plasma');
plasma.load('*.{json,yml}');
```

Need config data merged in? Do this:

```js
plasma.load('*.{json,yml}', {foo: 'bar', baz: 'quux'});
// or this
plasma.load(['*.{json,yml}', 'something.json'], {foo: 'bar', baz: 'quux'});
```

Want the data from certain files to be _namespaced_? (e.g. data from `foo.json` gets loaded to an object named `foo`), do this:

```js
plasma.load({name: 'foo', src: ['*.{json,yml}', 'something.json']});
```

Plasma does a lot more, [jump to the examples](#examples)


## Methods
### plasma.normalize()

Returns an array of objects with basic heuristics that can be referenced later by the `load()` function. Glob patterns are also expanded during normalization. For example, either of these:

```js
plasma.normalize('*.json')
// or
plasma.normalize(['*.json'])
```
will be normalized to:

```js
[{__normalized__: true, src: ['bower.json', 'package.json']}]
```
Of if an object is passed, like:

```js
{name: 'foo', src: ['*.json'], z: 'x'}
```
It will be normalized to:

```js
[{__normalized__: true, name: 'foo', src: ['bower.json', 'package.json'], z: 'x'}]
```

This is really a private method, but it's exposed to help with debugging and in case you need to modify how the data is normalized before it's loaded.


### plasma.load()

Returns an object with three properties, `{ orig: {}, data: {}, nomatch: [] }`:

* `orig`: a clone of the original data passed to `plasma.load()`
* `data`: the loaded config object to be passed to templates. e.g. `plasma.load('*.json').data`
* `nomatch`: an array of properties that could not be normalized to an object or matched to a filepath. this is useful for debugging


## Examples
You may pass a string, object or array to either `plasma.normalize()` or `plasma.load()` using any of the following conventions (see [the examples](./docs/examples.js)):

```js
// Strings
'a'; // pushed to `nomatch`
'*.json'; // if files exist, their paths will be expanded and added to a `src` array

// Arrays
['a', 'b', 'c']; // pushed to `nomatch`
['*.json', 'a', 'b', 'c']; // *.json is pushed to `src`, the rest is pushed to `nomatch`
['*.json', {src: ['c/*.json']}];
['*.json', {src: ['*.json'], cwd: 'c'}];
['*.json', {src: ['*.json'], cwd: 'c', prefixBase: true }];
['*.json', {src: ['*.json'], cwd: 'c', prefixBase: true }];
['*.json', {src: ['*.json'], cwd: 'c', expand: false }];
['*.json', {src: ['c/*.json'], expand: false }];
['*.json', '*.yml', {src: ['c/*.json']}];
['*.json', '*.yml', {src: ['c/*.json'], name: 'f'}];
['*.json', '*.yml', {src: ['c/*.json'], name: 'f', expand: false }];

// Objects
{a: 'b', b: 'c', d: 'd'};

// Object with src
{src: 'c/*.json' };
{src: ['c/*.json'] };
{src: ['c/*.json', 'd/*.json'] };
{src: ['c/*.json'], b: 'c' };
{src: ['c/*.json'], b: 'c', {d: 'e'} };
{src: ['c/*.json'], b: 'c' };
{src: ['c/*.json'], b: 'c', expand: false };

// Named objects
{name: 'a', b: 'c' };
{name: 'a', b: 'c', {d: 'e'} };
{name: 'a', b: 'c', {d: 'e', name: 'f'} };
{name: 'a', b: 'c', {d: 'e', name: 'f', src: ['*.json']} };
{name: 'a', b: 'c', {d: 'e'}, f: ['g', 'h', 'i'] };
{name: 'a', src: 'c/*.json' };
{name: 'a', src: '*.json', cwd: 'c' };
{name: 'a', src: '*.json', cwd: 'c', prefixBase: true };
{name: 'a', src: ['c/*.json'] };
{name: 'a', src: ['c/*.json'], b: 'c' };
{name: 'a', src: ['c/*.json', 'd/*.json'], b: 'c' };
{name: 'a', src: ['c/*.json'] };
{name: 'a', src: ['c/*.json'], expand: false };

// Array of objects
[{a: 'b', b: 'c', d: 'd'}];
[{a: 'b', b: 'c'}, {d: 'd'}];
[{a: 'b', b: 'c'}, {src: '*.json'}];
[{a: 'b', b: 'c'}, {src: '*.json', name: 'f'}];
[{a: 'b', b: 'c'}, {src: '*.json', name: 'f', expand: false }];
[{a: 'b', b: 'c'}, {src: '*.json', name: 'f'}];

['*.json', {src: '*.json'}, '*.yml', src: ['*.json', '**/*.yml']},, name: 'a', src: ['*.json'], b: 'c'} ];

// Prop strings
{name: ':basename', a: 'b' };
{name: ':basename' };
{name: ':basename', src: 'a/b/c/*.json' };
{name: ':dirname', src: 'a/b/c/*.json' };


// dot hashes
{name: 'a', c: 'd' };
{name: 'a', c: { d: 'e'} };
{name: 'a.b', c: 'd' };
{name: 'a.b', c: { d: 'e'} };
{name: 'a.b.c', c: { d: 'e'} };

{name: 'a', {c: ['d', 'e']} };
{name: 'a.b', {c: ['d', 'e']} };
{name: 'a.b.c', {c: ['d', 'e']} };

{name: 'a', src: 'a/b/c/*.json' };
{name: 'a.b', src: 'a/b/c/*.json' };
{name: 'a.b.c', src: 'a/b/c/*.json' };

{name: 'a', src: ['a/b/c/*.json'] };
{name: 'a.b', src: ['a/b/c/*.json'] };
{name: 'a.b.c', src: ['a/b/c/*.json'] };

{name: 'a', {'b': 'c'} };
{name: 'a', {'b.c': 'd'} };
{name: 'a', {'b.c.d': 'e'} };

// Prop strings with dot hashes
{name: ':dirname.:basename', src: ['i18n/*.json'] };
{name: ':basename' };
{name: ':basename', src: 'a/b/c/*.json' };
{name: ':dirname', src: 'a/b/c/*.json' };
```

### Invalid patterns
Neither of these can be normalized to a useful object:

```js
var foo = 'a';
var foo = ['a', 'b', 'c'];
```

These, and any other patterns that can't be normalized are pushed to a `nomatch` array.

## Tests
Run `mocha`

## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License
Copyright (c) 2014 undefined, contributors.  
Released under the MIT license

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on April 13, 2014._