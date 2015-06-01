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
var isGlob = require('is-glob');
var typeOf = require('kind-of');
var merge = require('mixin-deep');
var extend = require('extend-shallow');
var Options = require('option-cache');
var relative = require('relative');

/**
 * Create an instance of `Plasma`, optionally passing
 * an object of `data` to initialize with.
 *
 * ```js
 * var Plasma = require('plasma');
 * var plasma = new Plasma();
 *
 * // load some data
 * plasma.load(['*.json', 'data/*.yml']);
 * plasma.load({a: 'b', c: 'd'});
 * ```
 *
 * @param {Object} `data`
 * @api public
 */

var Plasma = module.exports = function Plasma(data) {
  Options.call(this);
  this.data = data ||{};
  this.initPlasma();
};

util.inherits(Plasma, Options);

/**
 * Initialize defaults
 */

Plasma.prototype.initPlasma = function() {
  this.loaders = {};
  this.enable('namespace');
  this.loader('read', function (fp) {
    return tryRead(fp);
  });
  this.loader('json', function (fp) {
    return JSON.parse(tryRead(fp));
  });
};

/**
 * Register a data loader for reading data. _(Note that as of
 * 0.9.0, plasma no longer reads YAML files by default)_.
 *
 * ```js
 * var fs = require('fs');
 * var yaml = require('js-yaml');
 *
 * plasma.loader('yml', function(fp) {
 *   var str = fs.readFileSync(fp, 'utf8');
 *   return yaml.safeLoad(str);
 * });
 *
 * plasma.load('foo.yml');
 * ```
 *
 * @param  {String} `ext` The file extension to match to the loader.
 * @param  {Function} `fn` The loader function.
 * @api public
 */

Plasma.prototype.loader = function(ext, fn) {
  if (ext.charAt(0) !== '.') ext = '.' + ext;
  if (typeof fn === 'undefined') {
    return this.loaders[ext];
  }
  this.loaders[ext] = fn;
  return this;
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
  var opts = extend({}, this.options, options);
  if (typeOf(val) === 'object') {
    return this.merge(val);
  }
  if (typeof val === 'string') {
    // if it's not a glob, don't use globby
    if (!isGlob(val)) {
      return this.mergeFile(val, options);
    }
    // if it is, arrayify and fall through
    val = [val];
  }
  if (Array.isArray(val)) {
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
  return merge(this.data, obj);
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

Plasma.prototype.mergeArray = function(val, opts) {
  var len = val.length, i = 0;
  while (len--) {
    var ele = val[i++];
    if (typeOf(ele) !== 'object') {
      ele = this.glob(val, opts);
      if (typeOf(ele) !== 'object') {
        return ele;
      }
    }
    merge(this.data, ele);
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

Plasma.prototype.mergeFile = function(fp, options) {
  var opts = extend({cwd: process.cwd()}, this.options, options);
  fp = relative(path.resolve(opts.cwd, fp));
  var key = name(fp, opts);
  var obj = read.call(this, fp, opts);
  var res = {};

  // if the filename is `data`, or if `namespace` is
  // turned off, merge data onto the root
  if (key === 'data' || opts.namespace === false) {
    res = this.merge(obj);
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
  var opts = extend({cwd: process.cwd()}, this.options, options);
  var files = glob.sync(patterns, opts);
  var self = this;

  // if this happens, it's probably an array of non-filepath
  // strings, or invalid path/glob patterns
  if (!files || !files.length) return patterns;

  var len = files.length, i = 0;
  while (len--) {
    merge(this.data, self.mergeFile(files[i++], opts));
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
  return readData.call(this, fp, opts);
}

/**
 * Utility for reading data files.
 *
 * @param {String} `fp` Filepath to read.
 * @param {Object} `options` Options to pass to [js-yaml]
 * @api private
 */

function readData(fp, options) {
  // shallow clone options
  var opts = extend({}, options);
  // get the loader for this file.
  var ext = opts.lang || path.extname(fp);
  if (ext && ext.charAt(0) !== '.') {
    ext = '.' + ext;
  }
  if (!this.loaders.hasOwnProperty(ext)) {
    return this.loader('read')(fp, opts)
  }
  return this.loader(ext)(fp, opts);
}

function tryRead(fp) {
  try {
    return fs.readFileSync(fp, 'utf8');
  } catch(err) {
    var ext = path.extname(ext);
    throw new Error('plasma could not read ' + fp + ' ' + err);
  }
}
