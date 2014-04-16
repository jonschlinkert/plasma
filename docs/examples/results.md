Converts this:

```js
var config = [
  '*.json',
  {src: '*.json'},
  {src: ['*.json', '**/*.yml'] },
  {name: 'a', src: ['*.json'], b: 'c'},
  '*.yml'
];
```

Into a predictable structure, like this:


```js
[
  {"__normalized__": true, "nomatch": ["*.yml"] },
  {"__normalized__": true, "src": ["bower.json", "package.json"] },
  {"__normalized__": true, "src": ["bower.json", "package.json"] },
  {"__normalized__": true, "src": [
      "bower.json",
      "package.json",
      "test/fixtures/a.yml",
      "test/fixtures/a/noyfm.yml",
      "test/fixtures/a/person.yml",
      "test/fixtures/b/contact.yml",
      "test/fixtures/b/data.yml",
      "test/fixtures/b/example.yml",
      "test/fixtures/c/contact.yml",
      "test/fixtures/c/data.yml",
      "test/fixtures/c/example.yml"
    ]
  },
  {"__normalized__": true, "__namespace__": true, "name": "a", "src": ["bower.json", "package.json"], "b": "c" }
]
```
allowing for:

* filepaths to be expanded and the data from each file to be loaded,
* raw objects to be passed in, and
* the results to be merged together and an object returned