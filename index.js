/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const path = require('path');
const file = require('fs-utils');
const log = require('verbalize');
const _ = require('lodash');

const plasma = module.exports = {};


function type(val) {
  return Object.prototype.toString.call(val).toLowerCase().replace(/\[object ([\S]+)\]/, '$1');
}


/**
 * Convert a string to an object with `expand` and `src` properties
 *
 * @param   {String}  str  The string to convert
 * @return  {Object}
 *
 * @api public
 */

plasma.normalizeString = function(str) {
  return {expand: true, src: [str]};
};


/**
 * Normalize an array of strings to an array of objects,
 * each with `expand` and `src` properties
 *
 * @param   {Array}  arr  Array of strings
 * @return  {Array}       Array of objects
 *
 * @api public
 */

plasma.normalizeArray = function (arr) {
  var data = [], len = arr.length;

  for (var i = 0; i < len; i++) {
    if (type(arr[i]) === 'string') {
      data = data.concat(plasma.normalizeString(arr[i]));
    } else if (type(arr[i]) === 'object') {
      data = data.concat(arr[i]);
    }
  }
  return data;
};


/**
 * Normalize config values to an array of objects.
 *
 * If an object is passed in directly, it will not be modified.
 *
 * If a string is passed in, it will be converted to an object
 * with `expand` and `src` properties.
 *
 * If an array is passed in, each string in the array will be
 * converted to an object with `expand` and `src` properties.
 *
 * @param   {String|Object|Array}  config
 * @return  {Array} array of normalized config objects
 *
 * @api public
 */

plasma.normalize = function(config) {
  var data = [];

  log.verbose.inform('normalizing');

  if (type(config) === 'string') {
    data = data.concat(plasma.normalizeString(config));
  } else if (type(config) === 'array') {
    data = data.concat(plasma.normalizeArray(config));
  } else if (type(config) === 'object') {
    data = data.concat(config);
  }

  return data;
};


plasma.expand = function(arr, options) {
  var data = [], len = arr.length;

  for (var i = 0; i < len; i++) {
    var obj = arr[i];
    if ('expand' in obj && 'src' in obj) {
      obj.src = file.expand(obj.src, options);
    }
    data = data.concat(obj);
  }
  return data;
};




plasma.load = function(arr, options) {
  arr = plasma.expand(plasma.normalize(arr));

  var data = {}, len = arr.length;
  for (var i = 0; i < len; i++) {
    var obj = arr[i];
    if ('expand' in obj && 'src' in obj) {
      obj.src = obj.src.map(file.readDataSync);
    }

    if ('name' in obj && 'src' in obj) {
      var name = {};
      name[obj.name] = _.flatten(obj.src);
      _.extend(data, name);
    } else {
      _.extend(data, obj);
    }
  }
  return data;
};


var expected = [
  'test/fixtures/*.{yml,json}',
  {a: 'b/*.json'},
  {one: 'two', three: 'four', five: 'six'},
  {expand: true, name: 'foo', src: ['*.json']},
  {name: 'fez', src: ['*.json']},
];


var data = plasma.load(expected);
console.log(JSON.stringify(data, null, 2));


var arr = [
  {
    "expand": true,
    "src": [
      "test/fixtures/a.yml",
      "test/fixtures/b.json"
    ]
  },
  {
    "a": "b/*.json"
  },
  {
    "one": "two",
    "three": "four",
    "five": "six"
  },
  {
    "expand": true,
    "name": "foo",
    "src": [
      "bower.json",
      "package.json"
    ]
  },
  {
    "name": "fez",
    "src": [
      "*.json"
    ]
  }
];

