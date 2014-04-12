## load

`plasma.load()` is a wrapper around the other `plasma` methods for loading data from a variety of different config and file formats. The following steps are executed in sequence, with the goal of returning an object that has the properties and values you would expect (e.g. the _correct_ duplicates eliminated, etc):

1. Config formats are normalized using `plasma.normalize()`.
1. File paths and globbing patterns are then expanded using `plasma.expand()`
1. `plasma.load()` reads data from expanded file paths, merges it with raw config data and returns an object.

More detail is provided in the documentation for the following methods.

### Plasma conventions

Plasma's conventions are based on the following assumptions:

1. When a string is passed directly, _it is most likely a file path_
1. When an array is passed directly, _it is most likely an array of file paths_
1. When an object is passed, it may contain file paths, **but Plasma will not try to read them** _unless one of the following conditions is met_:

   * when a `src`


## normalizeString
If a string is passed to any of the "primary" `plasma` methods (e.g. `normalize()`, `load()`, `expand()`, and `process()`), it will be normalized to a Plasma object. So this:

```js
plasma.normalizeString('foo/*.json');
```

will be normalized to:

```js
{expand: true, src: ['foo/*.json']}
```
Even if it's not a glob pattern. This is okay, since value in the `src` property will be returned if it doesn't resolve to an actual filepath.


## normalizeArray
If an array is passed to any of the "primary" `plasma` methods (e.g. `normalize()`, `load()`, `expand()`, and `process()`), it will be normalized to an array of Plasma objects. So this:

```js
plasma.normalizeArray(['foo/*.json', 'bar/*.json']);
```

will be normalized to:

```js
[
  {expand: true, src: ['foo/*.json']},
  {expand: true, src: ['bar/*.json']}
];
```

## normalize
A catchall method for normalizing objects, strings, and arrays to an array of Plasma objects. Wraps `normalizeArray` and `normalizeString`, so arrays and strings are handled the same as those methods.

Also, if an object is passed:

```js
plasma.normalize({foo: 'foo', bar: 'bar', baz: 'baz'});
```

it will be normalized to:

```js
[
  {foo: 'foo', bar: 'bar', baz: 'baz'}
];
```

## expand

_(TODO)_

## process

_(TODO)_

## options

### processConfig

Example:

```js
processConfig: function(obj) {
  return {name: name, src: src}
}
```js


```js
obj = _.extend({__normalized__: true}, obj.processConfig(obj));
```