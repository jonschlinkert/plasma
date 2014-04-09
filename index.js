/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

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
 * If an object is passed in directly, it will not be modified.
 * If a string is passed in, it will be converted to an object
 * with `expand` and `src` properties.
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


/**
 * Expand src properties in objects that have
 * 'expand:true' defined
 *
 * @param   {Array}  arr      Array of objects
 * @param   {Object} options  Options to pass to Globule
 * @return  {Array}  array of object with expanded src files
 *
 * @api public
 */

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


/**
 * [load description]
 * @param   {[type]}  arr      [description]
 * @param   {[type]}  options  [description]
 * @return  {[type]}           [description]
 */

plasma.load = function(arr, options) {
  arr = plasma.expand(plasma.normalize(arr, options), options);
  var data = {}, name = {}, len = arr.length;

  for (var i = 0; i < len; i++) {
    var obj = arr[i];

    if ('expand' in obj && 'src' in obj) {
      var srcLen = obj.src.length;
      var meta = {};
      for (var j = 0; j < srcLen; j++) {
        var src = obj.src[j];
        _.extend(meta, file.readDataSync(src));
      }

      if ('name' in obj) {
        name[obj.name] = meta;
        _.extend(data, name);
        delete obj.name;
      } else {
        _.extend(data, meta);
      }

      delete obj.expand;
      delete obj.src;
    }

    if ('name' in obj && 'src' in obj) {
      name[obj.name] = obj.src;
      _.extend(data, name);
      delete data.src;
    } else {
      _.extend(data, obj);
    }
  }

  return data;
};