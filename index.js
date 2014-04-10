/**
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const path = require('path');
const file = require('read-data');
const glob = require('globule');
const expander = require('expander');
const log = require('verbalize');
const _ = require('lodash');

const utils = require('./lib/utils');
const plasma = module.exports = {};

var type = utils.type;
var detectPattern = utils.detectPattern;
var namespaceFiles = utils.namespaceFiles;
var namespaceObject = utils.namespaceObject;

/**
 * Convert a string to an object with `expand` and `src` properties
 *
 * @param   {String}  str  The string to convert
 * @return  {Object}
 *
 * @api public
 */

plasma.normalizeString = function(str) {
  // return {__normalized__: true, expand: true, src: [str]};
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

plasma.normalize = function(config, options) {
  options = options || {};
  var data = [];

  log.verbose.inform('normalizing');

  if (type(config) === 'string') {
    data = data.concat(plasma.normalizeString(config, options));
  } else if (type(config) === 'array') {
    data = data.concat(plasma.normalizeArray(config, options));
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
  options = options || {};
  var data = [], len = arr.length, files = [];

  for (var i = 0; i < len; i++) {
    var obj = arr[i];
    if ('expand' in obj && 'src' in obj) {
      obj.src = glob.find(_.extend(obj, options));

      if ('name' in obj) {
        if (detectPattern(obj.name)) {
          files = namespaceFiles(obj.src, obj);
        }
      }
    }

    data = data.concat(obj);
  }
  return _.extend(data, files);
};


/**
 * [load description]
 * @param   {[type]}  arr      [description]
 * @param   {[type]}  options  [description]
 * @return  {[type]}           [description]
 */

plasma.load = function(config, options) {
  options = options || {};
  config = plasma.normalize(config, options);
  config = plasma.expand(config, options);

  var data = {}, name = {}, len = config.length;
  for (var i = 0; i < len; i++) {
    var obj = config[i];

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

    } else {
      _.extend(data, obj);
    }

    if ('name' in obj && 'src' in obj) {
      obj.src = utils.arrayify(obj.src);

      _.extend(data, namespaceObject(obj.src, obj.name));

      delete data.name;
      delete data.src;

    } else {
      _.extend(data, obj);
    }
  }

  // delete data.__normalized__;
  return data;
};



/**
 * Process config templates
 * @param   {[type]}  obj      [description]
 * @param   {[type]}  options  [description]
 * @return  {[type]}           [description]
 */

plasma.process = function(obj, options) {
  var result = {};

  obj = plasma.load(obj, options || {});
  Object.keys(obj).forEach(function(key) {
    result[key] = expander.process(obj, obj[key], options || {});
  });

  return result;
};