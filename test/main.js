
const expect = require('chai').expect
const log = require('verbalize');
const file = require('fs-utils');
const _ = require('lodash');
const plasma = require('../');

var expectedData = function(filename) {
  return file.readDataSync('test/expected/' + filename);
};

describe('plasma.load(config)', function () {

  /*
   *
   * 1. String
   *
   * var data = 'foo/*.json';
   *
   * // Results
   * var result = {
   *   // ...
   * };
   *
   */

  it('should support data as a String...', function (done) {
    var config = {
      data: 'test/fixtures/load/string/a.json'
    };
    var expected = expectedData('load/string/a.json');
    var actual = plasma.load(config);
    console.log('actual', actual);
    console.log('expected', expected);
    expect(actual).to.eql(expected);
    done();
  });

  /*
   *
   * 2. Array of Strings
   *
   * var data = ['foo/*.json'];
   *
   * var results = {
   *   // ...
   * };
   *
   */


  /*
   * 3. Object, with `expand`, `name` and `src`
   *
   * var data = {
   *   expand: true,
   *   name: 'foo',
   *   src: ['*.json']
   * };
   *
   * // Results
   * var result = {
   *   foo: {
   *     // ...
   *   }
   * };
   *
   */


});

/***



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
}];

// Results
var result = {
  foo: 'foo',
  bar: 'bar',
  baz: 'foo',
  bang: 'boom'
};
```

### 6. Array, with string and objects

with `src` and `name` properties

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
  {expand: true, name: 'i18n.:dirname', src: ['i18n/**\/*.json']}
];
```
***/
