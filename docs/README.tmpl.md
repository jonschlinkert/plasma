# {%= name %} [![NPM version](https://badge.fury.io/js/{%= name %}.png)](http://badge.fury.io/js/{%= name %})

> {%= description %}

## Install
{%= include("install", {save: '--save'}) %}

## Usage

```js
var {%= name %} = require('{%= name %}');
plasma.load('*.json');
```

## API
{%= docs("api") %}

## Tests

Run `mocha`

## Author
{%= contrib("jon") %}

## License
{%= copyright() %}
{%= license() %}

***

{%= include("footer") %}