/**
 * All of these should work.
 */

// Strings
'a'; // results in a `nomatch`
'*.json'; // if files exist, their paths will be expanded and added to a `patterns` array

// Arrays
['a', 'b', 'c'];
['*.json', 'a', 'b', 'c'];
['*.json', {patterns: ['c/*.json']}];
['*.json', {patterns: ['*.json'], cwd: 'c'}];
['*.json', {patterns: ['*.json'], cwd: 'c', prefixBase: true }];
['*.json', {patterns: ['*.json'], cwd: 'c', prefixBase: true }];
['*.json', {patterns: ['*.json'], cwd: 'c', expand: false }];
['*.json', {patterns: ['c/*.json'], expand: false }];
['*.json', '*.yml', {patterns: ['c/*.json']}];
['*.json', '*.yml', {patterns: ['c/*.json'], namespace: 'f'}];
['*.json', '*.yml', {patterns: ['c/*.json'], namespace: 'f', expand: false }];

// Objects
{a: 'b', b: 'c', d: 'd'};

// Object with patterns
{patterns: 'c/*.json' };
{patterns: ['c/*.json'] };
{patterns: ['c/*.json', 'd/*.json'] };
{patterns: ['c/*.json'], b: 'c' };
{patterns: ['c/*.json'], b: 'c', {d: 'e'} };
{patterns: ['c/*.json'], b: 'c' };
{patterns: ['c/*.json'], b: 'c', expand: false };

// Named objects
{namespace: 'a', b: 'c' };
{namespace: 'a', b: 'c', {d: 'e'} };
{namespace: 'a', b: 'c', {d: 'e', namespace: 'f'} };
{namespace: 'a', b: 'c', {d: 'e', namespace: 'f', patterns: ['*.json']} };
{namespace: 'a', b: 'c', {d: 'e'}, f: ['g', 'h', 'i'] };
{namespace: 'a', patterns: 'c/*.json' };
{namespace: 'a', patterns: '*.json', cwd: 'c' };
{namespace: 'a', patterns: '*.json', cwd: 'c', prefixBase: true };
{namespace: 'a', patterns: ['c/*.json'] };
{namespace: 'a', patterns: ['c/*.json'], b: 'c' };
{namespace: 'a', patterns: ['c/*.json', 'd/*.json'], b: 'c' };
{namespace: 'a', patterns: ['c/*.json'] };
{namespace: 'a', patterns: ['c/*.json'], expand: false };

// Array of objects
[{a: 'b', b: 'c', d: 'd'}];
[{a: 'b', b: 'c'}, {d: 'd'}];
[{a: 'b', b: 'c'}, {patterns: '*.json'}];
[{a: 'b', b: 'c'}, {patterns: '*.json', namespace: 'f'}];
[{a: 'b', b: 'c'}, {patterns: '*.json', namespace: 'f', expand: false }];
[{a: 'b', b: 'c'}, {patterns: '*.json', namespace: 'f'}];

['*.json', {patterns: '*.json'}, '*.yml',, patterns: ['*.json', '**/*.yml']},, namespace: 'a', patterns: ['*.json'], b: 'c'} ];

// Prop strings
{namespace: ':basename', a: 'b' };
{namespace: ':basename' };
{namespace: ':basename', patterns: 'a/b/c/*.json' };
{namespace: ':dirname', patterns: 'a/b/c/*.json' };


// dot hashes
{namespace: 'a', c: 'd' };
{namespace: 'a', c: { d: 'e'} };
{namespace: 'a.b', c: 'd' };
{namespace: 'a.b', c: { d: 'e'} };
{namespace: 'a.b.c', c: { d: 'e'} };

{namespace: 'a', {c: ['d', 'e']} };
{namespace: 'a.b', {c: ['d', 'e']} };
{namespace: 'a.b.c', {c: ['d', 'e']} };

{namespace: 'a', patterns: 'a/b/c/*.json' };
{namespace: 'a.b', patterns: 'a/b/c/*.json' };
{namespace: 'a.b.c', patterns: 'a/b/c/*.json' };

{namespace: 'a', patterns: ['a/b/c/*.json'] };
{namespace: 'a.b', patterns: ['a/b/c/*.json'] };
{namespace: 'a.b.c', patterns: ['a/b/c/*.json'] };

{namespace: 'a', {'b': 'c'} };
{namespace: 'a', {'b.c': 'd'} };
{namespace: 'a', {'b.c.d': 'e'} };

// Prop strings with dot hashes
{namespace: ':dirname.:basename', patterns: ['i18n/*.json'] };
{namespace: ':basename' };
{namespace: ':basename', patterns: 'a/b/c/*.json' };
{namespace: ':dirname', patterns: 'a/b/c/*.json' };
