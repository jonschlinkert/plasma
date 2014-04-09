* array of objects (like files array) where each object could have a `name`, `src`,
* pass an object explicitly
* glob patterns as a string
* glob patterns arrays of strings
* namespacing (filename as object name)
* if it's an array of objects


### 1. String

```js
var data = 'foo/*.json'; // {one: 'two'}

// normalizes to
var data = {expand: true, src: ['test/fixtures/**/*.json']};

// Resulting in
var result = {
  one: 'two'
};
```

### 2. Array of Strings

```js
var data = ['foo/a.json', 'foo/*.json'] // {one: 'two'}  {three: 'four'}

// normalizes to
var data = {expand: true, src: ['foo/a.json', 'foo/*.json']};

// Results
var result = {
  one: 'two',
  three: 'four'
};
```

### 3. Object, with `expand`, `name` and `src`

```js
var data = {
  expand: true,
  name: 'foo',
  src: ['*.json']
};

// Results
var result = {
  foo: {
    // ...
  }
};
```

### 4. Objects with random data

```js
var data = {
  foo: 'foo',
  bar: 'bar',
  baz: 'baz'
};

// Results
var result = {
  foo: 'foo',
  bar: 'bar',
  baz: 'baz'
};
```

```js
// Results
var data = {
  alert: {
    foo: 'foo',
    bar: 'bar',
    baz: 'baz'
  },
  navbar: {
    foo: 'foo',
    bar: 'bar',
    baz: 'baz'
  }
};

var result = {
  alert: {
    foo: 'foo',
    bar: 'bar',
    baz: 'baz'
  },
  navbar: {
    foo: 'foo',
    bar: 'bar',
    baz: 'baz'
  }
};
```

### 5. Array of objects with random data

Should be merged into an object.

```js
var data = [
  {
    foo: 'foo',
    bar: 'bar',
    baz: 'baz'
  },
  {
    bar: 'bar',
    baz: 'foo',
    bang: 'boom'
  }
];

// Results
var result = {
  foo: 'foo',
  bar: 'bar',
  baz: 'foo',
  bang: 'boom'
};
```

### 6. Array, with mixed values

e.g. string and objects with `src` and `name` properties

```js
var data = [
  'foo/*.json',
  {expand: true, name: 'foo', src: ['foo/*.json']},
  {expand: true, name: 'bar', src: ['bar/*.json']},
  {expand: true, name: 'baz', src: ['baz/*.json']},
];
```

### 7

```js
var data = [
  {quux: 'foo/*.json'},
  {expand: true, name: 'foo', src: ['foo/*.json']},
  {expand: true, name: 'bar', src: ['bar/*.json']},
  {expand: true, name: 'baz', src: ['baz/*.json']},
];

// Result
var result = {
  quux: 'foo/*.json',
  foo: {
    //...
  }
}
```

### 8

```js
var data = [
  {name: 'bar' src: 'bar.json'},
  {name: 'foo' src: '*.json'},
];

// Result
var result = {
  name: 'foo',
  src: '*.json'
}
```

### 9

```js
var data = [
  {expand: true, src: 'foo/*.json'}, // {one: 'two'}
  {expand: true, name: 'bar', src: ['bar/*.json']},
];

// Result
var result = {
  one: 'two',
  bar: {
    //...
  }
}
```

### 10

```js
var data = [
  {expand: true, name: ':basename' src: 'blah.json'}, // {one: 'two'}
  {expand: true, name: 'bar', src: ['foo.json']},
];

// Result
var result = {
  blah: {
    one: 'two'
  },
  bar: {
    //...
  }
}
```

### 11

```js
var data = [
  {expand: true, name: 'foo.bar.baz', src: ['foo/*.json']}
];
```

### 12

```js
var data = [
  {expand: true, name: 'i18n.:dirname', src: ['i18n/**/*.json']}
];
```