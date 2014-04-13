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