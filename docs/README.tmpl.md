# {%= name %} [![NPM version](https://badge.fury.io/js/{%= name %}.png)](http://badge.fury.io/js/{%= name %})

> {%= description %}

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

{%= include("install", {save: '--save'}) %}

## What problem is Plasma solving?
{%= docs("about") %}

## Methods
{%= docs("methods") %}

## Examples
{%= docs("examples") %}

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
{%= contrib("jon") %}

## License
{%= copyright() %}
{%= license() %}

***

{%= include("footer") %}