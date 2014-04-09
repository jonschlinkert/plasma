var data = 'foo/*.json';
var data = ['foo/*.json'];
var data = {
  expand: true,
  name: 'foo',
  src: ['*.json']
};

var result = {
  foo: {

  }
};

var data = {
  foo: 'foo',
  bar: 'bar',
  baz: 'baz'
};

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

var result = {
  foo: 'foo',
  bar: 'bar',
  baz: 'foo',
  bang: 'boom'
};

var data = [
  'foo/*.json',
  {expand: true, name: 'foo', src: ['foo/*.json']},
  {expand: true, name: 'bar', src: ['bar/*.json']},
  {expand: true, name: 'baz', src: ['baz/*.json']},
];

var data = [
  {quux: 'foo/*.json'},
  {expand: true, name: 'foo', src: ['foo/*.json']},
  {expand: true, name: 'bar', src: ['bar/*.json']},
  {expand: true, name: 'baz', src: ['baz/*.json']},
];

var result = {
  quux: 'foo/*.json',
  foo: {

  }
}

var data = [
  {name: 'bar', src: 'bar.json'},
  {name: 'foo', src: '*.json'},
];

var result = {
  name: 'foo',
  src: '*.json'
}

var data = [
  {expand: true, src: 'foo/*.json'},
  {expand: true, name: 'bar', src: ['bar/*.json']},
];

var result = {
  one: 'two',
  bar: {

  }
}

var data = [
  {expand: true, name: ':basename', src: 'blah.json'},
  {expand: true, name: 'bar', src: ['foo.json']},
];

var result = {
  blah: {
    one: 'two'
  },
  bar: {

  }
}

var data = [
  {expand: true, name: 'foo.bar.baz', src: ['foo/*.json']}
];

var data = [
  {expand: true, name: 'i18n.:dirname', src: ['i18n/**/*.json']}
];