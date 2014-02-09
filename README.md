# plasma [![NPM version](https://badge.fury.io/js/plasma.png)](http://badge.fury.io/js/plasma)

> Normalize config formats, expand globbing/minimatch patterns and read-in JSON/YAML data files.

```bash
npm i plasma --save
```

## Usage

```js
var plasma = require('plasma');

plasma.find({src: ['*.json']});
```

## API

### .find( options )

If an object with a `src` property is passed in, plasma will attempt to expand any glob/minimatch patterns into an array of resolved filepaths.

### .normalize( config )

Normalize config formats for source files, so that any of the following will work:

* `{src: ''}`
* `{data:  {src: ''}}`
* `{data: [{src: ''}, {src: ''}]}`

Returns an object with two properties:

* `raw`: array of objects that do not have src properties will be pushed into the `raw` property so that globule doesn't try to search for filepaths when they don't exist.
* `data`: array of objects with `src` properties, each of which is an array of filepaths or **un-expanded** glob patterns.

### .expand( options )

Process patterns in the `src` properties of objects passed from `plasma.normalize()`. Uses `plasma.find()` to expand each `src` property into an array of resolved filepaths.

### .load( config, options )

Actually read-in data from `src` files.

### .coerce( config, options )

Manipulate the final output into either an array of objects, or an object of objects.

## Tests

Until mocha tests are implemented, run `node test/test`.

## Acknowlegement

[node-configfiles](https://github.com/tkellen/node-configfiles) by [Tyler Kellen](https://github.com/tkellen) influenced some of the code in this lib, especially the approach for normalizing config formats. Thanks, Tyler!

## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License
Copyright (c) 2014 [Jon Schlinkert](http://twitter.com/jonschlinkert), contributors.
Released under the [MIT license](./LICENSE-MIT)