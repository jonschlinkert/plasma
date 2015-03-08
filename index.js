/*!
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var glob = require('globby');
var typeOf = require('kind-of');
var Options = require('option-cache');
var relative = require('relative');
var yaml = require('./lib/js-yaml');
var _ = require('lodash');

/**
 * Create an instance of `Plasma`, optionally passing
 * an object of `data` to initialize with.
 *
 * ```js
 * var Plasma = require('plasma');
 * var plasma = new Plasma();
 * plasma.load([value]);
 * ```
 *
 * @param {Object} `data`
 * @api public
 */

var Plasma = module.exports = function Plasma(data) {
  Options.call(this);
  this.data = data ||{};
  this._initPlasma();
};

util.inherits(Plasma, Options);

/**
 * Initialize plasma defaults.
 *
 * @api private
 */

Plasma.prototype._initPlasma = function() {
  this.enable('namespace');
};

/**
 * Load data from the given `value`.
 *
 * @param {String|Array|Object} `value` String or array of glob patterns or file paths, or an object or array of objects.
 * @param {Object} `options`
 * @return {Object}
 * @api private
 */

Plasma.prototype.load = function(val, options) {
  if (typeOf(options) === 'function') {
    return options.call(this, val);
  }
  var opts = _.extend({}, this.options, options);
  if (typeOf(val) === 'object') {
    return this.merge(val);
  }
  if (Array.isArray(val) || typeof val === 'string') {
    return this.mergeArray(val, opts);
  }
};

/**
 * Merge an array of objects onto the `cache` object. We
 * keep this method separate for performance reasons.
 *
 * @param  {String} `patterns` Glob patterns to pass to [globby]
 * @param  {Object} `opts` Options for globby, or pass a custom `parse` or `name`.
 * @return {Object}
 * @api private
 */

Plasma.prototype.merge = function(obj) {
  return _.merge(this.data, obj);
};

/**
 * Merge an array of objects onto the `cache` object. We
 * keep this method separate for performance reasons.
 *
 * @param  {String} `patterns` Glob patterns to pass to [globby]
 * @param  {Object} `opts` Options for globby, or pass a custom `parse` or `name`.
 * @return {Object}
 * @api private
 */

Plasma.prototype.mergeArray = function(arr, opts) {
  arr = arrayify(arr);
  var len = arr.length, i = 0;

  while (len--) {
    var val = arr[i++];
    if (typeOf(val) !== 'object') {
      val = this.glob(arr, opts);
      if (typeOf(val) !== 'object') {
        return val;
      }
    }
    _.merge(this.data, val);
  }

  return this.data;
};

/**
 * Merge an array of objects onto the `cache` object. We
 * keep this method separate for performance reasons.
 *
 * @param  {String} `patterns` Glob patterns to pass to [globby]
 * @param  {Object} `opts` Options for globby, or pass a custom `parse` or `name`.
 * @return {Object}
 * @api private
 */

Plasma.prototype.mergeFile = function(fp, opts) {
  fp = relative(path.resolve(opts.cwd, fp));
  var key = name(fp, opts);
  var obj = read(fp, opts);
  var res = {};

  // if the filename is `data`, or if `namespace` is
  // turned off, merge data onto the root
  if (key === 'data' || opts.namespace === false) {
    this.merge(obj);
  } else {
    res[key] = obj;
  }
  return res;
};

/**
 * Load an object from all files matching the given `patterns`
 * and `options`.
 *
 * @param  {String} `patterns` Glob patterns to pass to [globby]
 * @param  {Object} `opts` Options for globby, or pass a custom `parse` or `name`.
 * @return {Object}
 * @api private
 */

Plasma.prototype.glob = function(patterns, options) {
  var opts = _.extend({cwd: process.cwd()}, this.options, options);
  var files = glob.sync(patterns, opts);
  var self = this;

  // if this happens, it's probably an array of non-filepath
  // strings, or invalid path/glob patterns
  if (!files || !files.length) return patterns;

  var len = files.length, i = 0;
  while (len--) {
    _.merge(this.data, self.mergeFile(files[i++], opts));
  }
  return this.data;
};

/**
 * Default `namespace` function. Pass a function on `options.namespace`
 * to customize.
 *
 * @param {String} `fp`
 * @param {Object} `opts`
 * @return {String}
 * @api private
 */

function name(fp, options) {
  var opts = options || {};
  if (typeof opts.namespace === 'function') {
    return opts.namespace(fp, opts);
  }
  if (typeof opts.namespace === false) {
    return fp;
  }
  var ext = path.extname(fp);
  return path.basename(fp, ext);
}

/**
 * Default `read` function. Pass a function on `options.read`
 * to customize.
 *
 * @param {String} `fp`
 * @param {Object} `opts`
 * @return {String}
 * @api private
 */

function read(fp, opts) {
  if (opts && opts.read) {
    return opts.read(fp, opts);
  }
  return readData(fp, opts);
}

/**
 * Utility for reading data files.
 *
 * @param {String} `fp` Filepath to read.
 * @param {Object} `options` Options to pass to [js-yaml]
 * @api private
 */

function readData(fp, options) {
  var opts = _.extend({}, options);
  var ext = opts.lang || path.extname(fp);

  if (ext.charAt(0) !== '.') {
    ext = '.' + ext;
  }

  try {
    switch (ext) {
    case '.json':
      var str = fs.readFileSync(fp, 'utf8');
      return JSON.parse(str);
    case '.csv':
      // load jit to speed up init
      var csv = require('parse-csv');
      opts.csv = opts.csv || {};
      opts.csv.format = opts.csv.format || 'jsonDict';
      opts.csv.options = opts.csv.options || {
        headers: {included: true}
      };
      var str = fs.readFileSync(fp, 'utf8');
      return JSON.parse(csv.to(opts.csv.format, str, opts.csv.options));
    case '.yml':
    case '.yaml':
      return yaml.safeLoad(fs.readFileSync(fp, 'utf8'), opts);
    }
  } catch(err) {}
  return {};
}

function arrayify(val) {
  return !Array.isArray(val) ? [val] : val;
}
