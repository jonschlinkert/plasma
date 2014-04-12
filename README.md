# plasma [![NPM version](https://badge.fury.io/js/plasma.png)](http://badge.fury.io/js/plasma)

> Build a context object to pass to templates. Plasma can load data from a flexible range of configuration and file formats, including JSON/YAML data files defined with minimatch/glob patterns.

## Install
Install with [npm](npmjs.org):

```bash
npm i plasma --save
```


## Usage

```js
var plasma = require('plasma');
plasma.load('*.json');
```

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

['*.json', {src: '*.json'}, '*.yml',, src: ['*.json', '**/*.yml']},, name: 'a', src: ['*.json'], b: 'c'} ];

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

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on April 12, 2014._