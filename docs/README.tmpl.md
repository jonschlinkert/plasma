# {%= name %} [![NPM version](https://badge.fury.io/js/{%= name %}.png)](http://badge.fury.io/js/{%= name %})

> {%= description %}

## Install
{%= include("install", {save: '--save'}) %}

## What does Plasma do?
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