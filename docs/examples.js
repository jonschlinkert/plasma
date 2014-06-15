/**
 * All of these should work.
 */

// Strings
'a'; // results in a `nomatch`
'*.json'; // if files exist, their paths will be expanded and added to a `src` array

// Arrays
['a', 'b', 'c'];
['*.json', 'a', 'b', 'c'];
['*.json', {src: ['c/*.json']}];
['*.json', {src: ['*.json'], cwd: 'c'}];
['*.json', {src: ['*.json'], cwd: 'c', prefixBase: true }];
['*.json', {src: ['*.json'], cwd: 'c', prefixBase: true }];
['*.json', {src: ['*.json'], cwd: 'c', expand: false }];
['*.json', {src: ['c/*.json'], expand: false }];
['*.json', '*.yml', {src: ['c/*.json']}];
['*.json', '*.yml', {src: ['c/*.json'], namespace: 'f'}];
['*.json', '*.yml', {src: ['c/*.json'], namespace: 'f', expand: false }];

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
{namespace: 'a', b: 'c' };
{namespace: 'a', b: 'c', {d: 'e'} };
{namespace: 'a', b: 'c', {d: 'e', namespace: 'f'} };
{namespace: 'a', b: 'c', {d: 'e', namespace: 'f', src: ['*.json']} };
{namespace: 'a', b: 'c', {d: 'e'}, f: ['g', 'h', 'i'] };
{namespace: 'a', src: 'c/*.json' };
{namespace: 'a', src: '*.json', cwd: 'c' };
{namespace: 'a', src: '*.json', cwd: 'c', prefixBase: true };
{namespace: 'a', src: ['c/*.json'] };
{namespace: 'a', src: ['c/*.json'], b: 'c' };
{namespace: 'a', src: ['c/*.json', 'd/*.json'], b: 'c' };
{namespace: 'a', src: ['c/*.json'] };
{namespace: 'a', src: ['c/*.json'], expand: false };

// Array of objects
[{a: 'b', b: 'c', d: 'd'}];
[{a: 'b', b: 'c'}, {d: 'd'}];
[{a: 'b', b: 'c'}, {src: '*.json'}];
[{a: 'b', b: 'c'}, {src: '*.json', namespace: 'f'}];
[{a: 'b', b: 'c'}, {src: '*.json', namespace: 'f', expand: false }];
[{a: 'b', b: 'c'}, {src: '*.json', namespace: 'f'}];

['*.json', {src: '*.json'}, '*.yml',, src: ['*.json', '**/*.yml']},, namespace: 'a', src: ['*.json'], b: 'c'} ];

// Prop strings
{namespace: ':basename', a: 'b' };
{namespace: ':basename' };
{namespace: ':basename', src: 'a/b/c/*.json' };
{namespace: ':dirname', src: 'a/b/c/*.json' };


// dot hashes
{namespace: 'a', c: 'd' };
{namespace: 'a', c: { d: 'e'} };
{namespace: 'a.b', c: 'd' };
{namespace: 'a.b', c: { d: 'e'} };
{namespace: 'a.b.c', c: { d: 'e'} };

{namespace: 'a', {c: ['d', 'e']} };
{namespace: 'a.b', {c: ['d', 'e']} };
{namespace: 'a.b.c', {c: ['d', 'e']} };

{namespace: 'a', src: 'a/b/c/*.json' };
{namespace: 'a.b', src: 'a/b/c/*.json' };
{namespace: 'a.b.c', src: 'a/b/c/*.json' };

{namespace: 'a', src: ['a/b/c/*.json'] };
{namespace: 'a.b', src: ['a/b/c/*.json'] };
{namespace: 'a.b.c', src: ['a/b/c/*.json'] };

{namespace: 'a', {'b': 'c'} };
{namespace: 'a', {'b.c': 'd'} };
{namespace: 'a', {'b.c.d': 'e'} };

// Prop strings with dot hashes
{namespace: ':dirname.:basename', src: ['i18n/*.json'] };
{namespace: ':basename' };
{namespace: ':basename', src: 'a/b/c/*.json' };
{namespace: ':dirname', src: 'a/b/c/*.json' };
