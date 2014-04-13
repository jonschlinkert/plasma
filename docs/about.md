### problem

Let's say you need to load data for templates.

If you want to read JSON files, you might do something like this:

```js
var fs = require('fs');
var data = JSON.parse(fs.readFileSync('my-data-file.json', 'utf8'));
```
Or this:

```js
var data = require('./my-data-file.json')
```

What about YAML? Maybe you'd do something like this:

```js
var fs = require('fs');
var YAML = require('js-yaml');
var data = YAML.load(fs.readFileSync('my-data-file.yml', 'utf8'));
```

What if you want to use glob patterns to get all the data files in a directory?

```js
var glob = require('globule');
glob.find('*.{json,yml}').map(function(filepath) {
  // do something to read files
});
```

Not too bad, but now you need to do some logic to merge the data from the files as their loaded. And what if you want to also define data in the config, and have that merged with the data from the files you're loading? e.g

```js
var config = {
  a: {
    b: "foo"
  }
};
_.extend(config, data); // merge file data with config data
```

If you've ever done this before, you know that it gets much more complicated. This is where Plasma can help.

### solution

Or, you can make life easy, and just do:

```js
var {%= name %} = require('{%= name %}');
plasma.load('*.{json,yml}');
```

Need config data merged in? Do this:

```js
plasma.load('*.{json,yml}', {foo: 'bar', baz: 'quux'});
// or this
plasma.load(['*.{json,yml}', 'something.json'], {foo: 'bar', baz: 'quux'});
```

Want the data from certain files to be _namespaced_? (e.g. data from `foo.json` gets loaded to an object named `foo`), do this:

```js
plasma.load({name: 'foo', src: ['*.{json,yml}', 'something.json']});
```

Plasma does a lot more, [jump to the examples](#examples)
