/*!
 * plasma <https://github.com/jonschlinkert/plasma>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var utils = require('./utils');

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

function Plasma(options) {
  this.options = options || {};
  this.cache = this.options.cache || {};
  this.dataLoaders = [];
  this.initPlasma();
}

/**
 * Initialize defaults
 */

Plasma.prototype.initPlasma = function() {
  if (typeof this.options.namespace === 'undefined') {
    this.options.namespace = true;
  }
  this.dataLoader('json', function(fp) {
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
 * plasma.dataLoader('yml', function(fp) {
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

Plasma.prototype.dataLoader = function(name, fn) {
  this.dataLoaders.push({name: name, fn: fn});
  return this;
};


Plasma.prototype.matchLoader = function(fp) {
  var len = this.dataLoaders.length, i = -1;
  var loaders = this.dataLoaders;
  var ext = path.extname(fp);
  var fns = [];

  while (++i < len) {
    var loader = loaders[i];
    var name = loader.name;
    if (typeof name === 'string' && ext === utils.formatExt(name)) {
      fns.push(loader.fn);

    } else if (utils.typeOf(name) === 'regexp' && name.test(ext)) {
      fns.push(loader.fn);
    }
  }
  return fns;
};

/**
 * Load data from the given `value`.
 *
 * @param {String|Array|Object} `value` String or array of glob patterns or file paths, or an object or array of objects.
 * @param {Object} `options`
 * @return {Object}
 * @api private
 */

Plasma.prototype.load = function(key, val, options) {
  if (utils.typeOf(options) === 'function') {
    return options.call(this, val);
  }
  var opts = utils.extend({}, this.options, options);
  if (utils.typeOf(val) === 'object') {
    return this.merge(val);
  }
  if (typeof val === 'string') {
    // if it's not a glob, don't use globby
    if (!utils.isGlob(val)) {
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
  return utils.merge(this.cache, obj);
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
    if (utils.typeOf(ele) !== 'object') {
      ele = this.glob(val, opts);
      if (utils.typeOf(ele) !== 'object') {
        return ele;
      }
    }
    utils.merge(this.cache, ele);
  }
  return this.cache;
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
  var opts = utils.extend({cwd: process.cwd()}, this.options, options);
  fp = utils.relative(path.resolve(opts.cwd, fp));
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
  var opts = utils.extend({cwd: process.cwd()}, this.options, options);
  var files = utils.glob.sync(patterns, opts);
  var self = this;

  // if this happens, it's probably an array of non-filepath
  // strings, or invalid path/glob patterns
  if (!files || !files.length) return patterns;

  var len = files.length, i = 0;
  while (len--) {
    utils.merge(this.cache, self.mergeFile(files[i++], opts));
  }
  return this.cache;
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
  var opts = utils.extend({}, options);
  // get the loader for this file.
  var ext = opts.lang || path.extname(fp);
  if (ext && ext.charAt(0) !== '.') {
    ext = '.' + ext;
  }
  if (!this.dataLoaders.hasOwnProperty(ext)) {
    return this.dataLoader('read')(fp, opts);
  }
  return this.dataLoader(ext)(fp, opts);
}

function tryRead(fp) {
  try {
    return fs.readFileSync(fp, 'utf8');
  } catch(err) {
    var ext = path.extname(ext);
    throw new Error('plasma could not read ' + fp + ' ' + err);
  }
}

/**
 * Expose `Plasma`
 */

module.exports = Plasma;
