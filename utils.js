'use strict';

/**
 * Lazily required module dependencies
 */

var utils = require('lazy-cache')(require);
var fn = require;

require = utils;
require('is-glob', 'isGlob');
require('matched', 'glob');
require('kind-of', 'typeOf');
require('mixin-deep', 'merge');
require('extend-shallow', 'extend');
require('relative');
require = fn;

/**
 * Utils
 */

utils.formatExt = function(ext) {
  return ext.charAt(0) === '.' ? ext.slice(1) : ext;
};

/**
 * Expose `utils` modules
 */

module.exports = utils;
