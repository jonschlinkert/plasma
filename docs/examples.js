/**
 * All of these should work.
 */

// Strings

// try to read a file named 'a'. If no file is found, return
// the original string in the `nomatch` property
'a';
'*.json';

// Arrays
['a', 'b', 'c'];
['*.json', 'a', 'b', 'c'];
['*.json', {src: ['c/*.json']}];
['*.json', {src: ['*.json'], cwd: 'c'}];
['*.json', {src: ['*.json'], cwd: 'c', prefixBase: true}];
['*.json', {src: ['*.json'], cwd: 'c', prefixBase: true, expand: true}];
['*.json', {src: ['*.json'], cwd: 'c', expand: false}];
['*.json', {src: ['c/*.json'], expand: false}];
['*.json', '*.yml', {src: ['c/*.json']}];
['*.json', '*.yml', {src: ['c/*.json'], name: 'f'}];
['*.json', '*.yml', {src: ['c/*.json'], name: 'f', expand: false}];

// Objects
{a: 'b', b: 'c', d: 'd'};

// Object with src
{src: 'c/*.json' };
{src: ['c/*.json'] };
{src: ['c/*.json', 'd/*.json'] };
{src: ['c/*.json'], b: 'c' };
{src: ['c/*.json'], b: 'c', {d: 'e'} };
{src: ['c/*.json'], b: 'c', expand: true };
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
{name: 'a', src: ['c/*.json'], expand: true };
{name: 'a', src: ['c/*.json'], expand: false };

// Array of objects
[{a: 'b', b: 'c', d: 'd'}];
[{a: 'b', b: 'c'}, {d: 'd'}];
[{a: 'b', b: 'c'}, {src: '*.json'}];
[{a: 'b', b: 'c'}, {src: '*.json', name: 'f'}];
[{a: 'b', b: 'c'}, {src: '*.json', name: 'f', expand: false}];
[{a: 'b', b: 'c'}, {src: '*.json', name: 'f', expand: true}];

['*.json', {src: '*.json'}, '*.yml', {expand: true, src: ['*.json', '**/*.yml']}, {expand: true, name: 'a', src: ['*.json'], b: 'c'} ];

// Prop strings
{name: ':basename', a: 'b' };
{name: ':basename', expand: true };
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
{name: ':basename', expand: true };
{name: ':basename', src: 'a/b/c/*.json' };
{name: ':dirname', src: 'a/b/c/*.json' };
