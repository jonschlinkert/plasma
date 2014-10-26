'use strict';

var path = require('path');
var replace = require('frep');
var _ = require('lodash');
var toString = Object.prototype.toString;


/**
 * Utils
 */

exports.type = function(val) {
  return toString.call(val).toLowerCase()
    .replace(/\[object ([\S]+)\]/, '$1');
};

exports.lastDir = function(fp) {
  var segs = path.dirname(fp).split(/[\\\/]+/g);
  return segs[segs.length - 1];
};

exports.arrayify = function(arr) {
  return !Array.isArray(arr) ? [arr] : arr;
};

var normalized = {__normalized__: true};
exports.isNormalized = function(arr) {
  return arr.map(function(obj) {
    return _.extend(normalized, obj);
  });
};

exports.pathObject = function(fp) {
  return {
    extname: path.extname(fp),
    basename: path.basename(fp, path.extname(fp)),
    dirname: exports.lastDir(fp)
  };
};

exports.typeInArray = function(value) {
  return value.map(function(item) {
    return exports.type(item);
  });
};

exports.detectPattern = function(str) {
  var re = /:([\S]+)/;
  if (re.test(str)) {
    return str.match(re)[1];
  }
};

exports.renameProp = function(str, fp) {
  var replacements = {
    ':basename': path.basename(fp, path.extname(fp)),
    ':dirname': exports.lastDir(fp)
  };
  return replace.strWithObj(str, replacements);
};

/**
 * Array/object utils
 */

exports.extend = function (obj) {
  var args = Array.prototype.slice.call(arguments, 1);
  for (var i = 0, orig; orig = args[i]; i++) {
    if (!orig) {
      continue;
    }
    for (var prop in orig) {
      obj[prop] = orig[prop];
    }
  }
  return obj;
};

/**
 * ## .flatten(arr)
 *
 * Flatten array recursively.
 * See http://jsperf.com/flattenarray.
 *
 * @method  flatten
 * @param   {Array}  `arr`
 * @return  {Array}
 */

exports.flatten = function(arr) {
  do {
    arr = [].concat.apply([], arr);
  } while(arr.some(Array.isArray));
  return arr;
};

exports.flattenObject = function(obj) {
  var flattened = {};
  var len = obj.length;
  for (var i = 0; i < len; i++) {
    for (var entry in obj[i]) {
      flattened[entry] = obj[i][entry];
    }
  }
  return flattened;
};

exports.formatAsArray = function(obj) {
  var arr = [];
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      arr = arr.concat(obj[i]);
    }
  }
  return arr;
};