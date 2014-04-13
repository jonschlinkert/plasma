## namespacing data

Plasma offers several ways to namespace data, depending on the use case.

* [filename](#file-name): when `src` and `name` are defined, Plasma will namespace data using the [basename](http://nodejs.org/api/path.html#path_path_basename_p_ext) of the file
* [dothash](#dothash): when `dothash: true` is defined, Plasma will recursively expand dothashes into objects. Readme more in the [dothash section](#dothash).
* [prop strings](#prop-strings): Plasma automatically resolves keys with `:prop` strings into their equivalent file path values.

### file name

When both `name` and `src` are defined on an object, Plasma will automatically _namespace_ `src` object in a property using the value from the `name` property. For example:

Given that `buttons.yml` has this data:

```yaml
- text:     Info
  modifier: btn-info

- text:     Success
  modifier: btn-success

- text:     Warning
  modifier: btn-warning
```

Defining `plasma.load({name: 'button', src: 'buttons.yml'})` will result in the following object:

```
{
  "button": [
    {
      "text": "Info",
      "modifier": "btn-info"
    },
    {
      "text": "Success",
      "modifier": "btn-success"
    },
    {
      "text": "Warning",
      "modifier": "btn-warning"
    }
  ]
}
```

Note that both `name` and `src` must be defined for objects to be namespaced automatically.

### dothash


### prop strings

Plasma automatically resolves keys with `:prop` strings into their equivalent filepath values. Currently, only `:basename` and `:dirname` are supported.

* `:basename`: using `:basename` on `foo.yml` will result in a `foo: {}` object containing the data from `foo.yml`.
* `:dirname`: uses the **last path segment only**. so using `:dirname` on `foo/bar/baz.yml` will result in a `bar: {}` object containing the data from `baz.yml`.


### Combining dothashes and prop strings

This can be useful when you need to load a number of different files from multiple directories, and you want both the folder structure and file names to play a role in namespacing your data. For example, you might use this to namespace i18n language data.

Assuming your directory structure looks like this:

```
/i18n
  /de.json
  /en.json
  /es.json
  /fi.json
  /he.json
  /hi.json
  /ja.json
  /ml.json
  /nl.json
  /ta.json
```

Defining `plasma.load({name: ':dirname.:basename', src: ['i18n/*.json']});`, would result in:

```js
i18n: {
  en: {'select-language': 'Welcome to our site.'},
  de: {'select-language': 'Wählen Sie eine Sprache'},
  es: {'select-language': 'Seleccione el idioma'},
  fi: {'select-language': 'Valitse kieli'},
  he: {'select-language': 'בחר את השפה'},
  hi: {'select-language': 'भाषा चुनें'},
  ja: {'select-language': '言語を選択する'},
  ml: {'select-language': 'ഭാഷ തിരഞ്ഞെടുക്കുക'},
  nl: {'select-language': 'Selecteer taal'},
  ta: {'select-language': 'மொழி தேர்வு'}
}
```