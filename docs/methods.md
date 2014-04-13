## plasma.normalize()

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


## plasma.load()

Returns an object with three properties, `{ orig: {}, data: {}, nomatch: [] }`:

* `orig`: a clone of the original data passed to `plasma.load()`
* `data`: the loaded config object to be passed to templates. e.g. `plasma.load('*.json').data`
* `nomatch`: an array of properties that could not be normalized to an object or matched to a filepath. this is useful for debugging
